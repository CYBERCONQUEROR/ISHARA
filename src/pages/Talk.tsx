import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mic, 
  MicOff,
  RefreshCcw,
  Hand,
  Languages,
  AlertCircle
} from 'lucide-react';
import { 
  getBrowserInfo, 
  createSpeechRecognition, 
  getSpeechSupportInfo,
  getErrorMessage 
} from '@/lib/speech-utils';






const supportedLanguages = [
  { value: 'en-US', label: 'English', translateCode: 'en' },
  { value: 'hi-IN', label: 'Hindi', translateCode: 'hi' },
  { value: 'as-IN', label: 'Assamese', translateCode: 'as' },
  { value: 'bn-IN', label: 'Bengali', translateCode: 'bn' },
  { value: 'mr-IN', label: 'Marathi', translateCode: 'mr' },
  { value: 'bho-IN', label: 'Bhojpuri', translateCode: 'bho' },
  { value: 'pa-IN', label: 'Punjabi', translateCode: 'pa' },
];



const Talk = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedSpeech, setRecognizedSpeech] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [displayedWords, setDisplayedWords] = useState<string[][]>([]);
  const [spokenLanguage, setSpokenLanguage] = useState('en-US');
  const [prompt, setPrompt] = useState('Click to start speaking');
  const [isSupported, setIsSupported] = useState(true);
  const [browserInfo, setBrowserInfo] = useState(getBrowserInfo());
  const [supportInfo, setSupportInfo] = useState(getSpeechSupportInfo());
  
  // Check actual speech recognition support on component mount
  useEffect(() => {
    const checkSupport = () => {
      console.log('=== Speech Recognition Support Check ===');
      console.log('Current isSupported state:', isSupported);
      
      // Check each API individually
      const webkitSR = (window as any).webkitSpeechRecognition;
      const standardSR = (window as any).SpeechRecognition;
      const mozSR = (window as any).mozSpeechRecognition;
      const msSR = (window as any).msSpeechRecognition;
      
      console.log('webkitSpeechRecognition value:', webkitSR);
      console.log('SpeechRecognition value:', standardSR);
      console.log('mozSpeechRecognition value:', mozSR);
      console.log('msSpeechRecognition value:', msSR);
      
      const SpeechRecognition = webkitSR || standardSR || mozSR || msSR;
      
      const actuallySupported = SpeechRecognition !== undefined && SpeechRecognition !== null;
      console.log('Final speech recognition support check:', actuallySupported);
      console.log('SpeechRecognition constructor:', SpeechRecognition);
      
      console.log('Setting isSupported to:', actuallySupported);
      setIsSupported(actuallySupported);
      
      if (!actuallySupported) {
        setPrompt(`Speech recognition not supported in ${browserInfo.name} on ${browserInfo.os}. Please use Chrome, Firefox, or Edge.`);
      } else {
        console.log('Speech recognition is supported!');
        setPrompt('Click to start speaking');
      }
    };
    
    // Add a small delay to ensure window object is fully loaded
    setTimeout(checkSupport, 100);
  }, [browserInfo.name, browserInfo.os]);

  const recognitionRef = useRef<any>(null);
  const shouldBeListeningRef = useRef(false);
  const lastTranscriptRef = useRef('');
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startRecognition = () => {
    if (!recognitionRef.current || !shouldBeListeningRef.current) return;
    
    try {
      recognitionRef.current.start();
      setPrompt('Speak now...');
    } catch (error) {
      console.error('Error starting recognition:', error);
      setPrompt('Error starting recognition. Please try again.');
    }
  };

  const stopRecognition = () => {
    shouldBeListeningRef.current = false;
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setPrompt('Click to start speaking');
  };

  useEffect(() => {
    console.log('Talk component: Initializing speech recognition...');
    console.log('Browser info:', browserInfo);
    console.log('Support info:', supportInfo);
    
    try {
      // Try direct approach first
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      let recognition;
      
      if (SpeechRecognition) {
        console.log('Direct SpeechRecognition found:', SpeechRecognition);
        recognition = new SpeechRecognition();
        console.log('Direct recognition created:', recognition);
        
        // Configure recognition
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = spokenLanguage;
        recognition.maxAlternatives = 1;
        
        console.log('Speech recognition configured successfully');
      } else {
        console.log('No direct SpeechRecognition found, trying utility function');
        recognition = createSpeechRecognition({
          continuous: false,
          interimResults: false,
          lang: spokenLanguage,
          maxAlternatives: 1
        });
        
        console.log('Speech recognition created successfully via utility:', recognition);
      }

    recognition.onstart = () => {
      setIsListening(true);
      setPrompt('Listening... Speak now');
      console.log('Speech recognition started');
    };

    recognition.onend = () => {
      setIsListening(false);
      
      if (shouldBeListeningRef.current) {
        // If we should still be listening, restart after a short delay
        restartTimeoutRef.current = setTimeout(() => {
          if (shouldBeListeningRef.current) {
            startRecognition();
          }
        }, 100);
      } else {
        setPrompt('Click to start speaking');
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error(`Speech recognition error: ${event.error}`);
      const errorMessage = getErrorMessage(event.error, browserInfo);
      setPrompt(errorMessage);
      
      // Stop recognition for certain errors
      if (['not-allowed', 'audio-capture', 'service-not-allowed'].includes(event.error)) {
        stopRecognition();
      }
    };

    recognition.onresult = async (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join(' ');

      if (transcript.trim() === '' || transcript.trim() === lastTranscriptRef.current.trim()) {
        return;
      }
      
      console.log(`Recognized: "${transcript}"`);
      lastTranscriptRef.current = transcript;
      setRecognizedSpeech(transcript);
      setTranslatedText('');
      setPrompt('Processing...');
      
      let textToProcess = transcript;
      const currentLanguage = supportedLanguages.find(lang => lang.value === spokenLanguage);

      if (currentLanguage && currentLanguage.translateCode !== 'en' && transcript) {
        try {
          const res = await fetch('http://localhost:8001/translate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: transcript,
              src_lang: currentLanguage.translateCode,
              dest_lang: 'en'
            }),
          });
          
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          
          const data = await res.json();
          
          if (data && data.translated_text) {
            textToProcess = data.translated_text;
            setTranslatedText(textToProcess);
          } else {
            throw new Error(data.error || 'Unknown translation error');
          }
        } catch (error: any) {
          console.error("Translation error:", error);
          const errorMessage = error.message || 'Translation service unavailable';
          setPrompt(`Translation failed: ${errorMessage}. Using original text.`);
          textToProcess = transcript;
        }
      }

      const words = textToProcess.toUpperCase().replace(/['".,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(' ').filter(Boolean);
      const newDisplayedWords = words.map(word => word.split(''));
      setDisplayedWords(newDisplayedWords);
      
      setPrompt('Ready for next input...');
    };

    recognitionRef.current = recognition;

    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognition) {
        recognition.stop();
      }
    };
  } catch (error) {
    console.error('Error creating speech recognition:', error);
    setIsSupported(false);
    setPrompt(`Speech recognition not supported in ${browserInfo.name} on ${browserInfo.os}. Please use Chrome, Firefox, or Edge.`);
  }
  }, [spokenLanguage, browserInfo.name, browserInfo.os]);

  const handleToggleListening = () => {
    if (!recognitionRef.current || !isSupported) return;
    
    if (isListening || shouldBeListeningRef.current) {
      stopRecognition();
    } else {
      // Clear previous state before starting
      lastTranscriptRef.current = '';
      setRecognizedSpeech('');
      setTranslatedText('');
      setDisplayedWords([]);
      shouldBeListeningRef.current = true;
      startRecognition();
    }
  };

  const handleReset = () => {
    lastTranscriptRef.current = '';
    setRecognizedSpeech('');
    setTranslatedText('');
    setDisplayedWords([]);
    if (isListening || shouldBeListeningRef.current) {
      stopRecognition();
    }
  };

  const getDisplayText = () => {
    const currentLanguage = supportedLanguages.find(lang => lang.value === spokenLanguage);
    if (currentLanguage && currentLanguage.translateCode !== 'en') {
      if (recognizedSpeech && translatedText) {
        return `${recognizedSpeech}\n(Translated: ${translatedText})`;
      }
    }
    return recognizedSpeech;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400">Talk with Deaf</h1>
          <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">
            Speak naturally and see your words converted into ISL signs. Perfect for communicating with deaf friends and family.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Panel: Speech Input */}
          <Card className="shadow-lg h-full border-gray-700 bg-gray-800/50 backdrop-blur-sm flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <CardTitle className="flex items-center text-white"><Mic className="mr-2"/> Speech Input</CardTitle>
              <div className="flex items-center space-x-2">
                <Languages className="h-5 w-5 text-gray-500"/>
                <Select defaultValue={spokenLanguage} onValueChange={setSpokenLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Language"/>
                  </SelectTrigger>
                  <SelectContent>
                    {supportedLanguages.map(lang => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow flex flex-col">
              {!isSupported && (
                <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <div>
                    <p className="text-red-400 font-medium">Speech Recognition Not Available</p>
                    <p className="text-red-300 text-sm">
                      Detected: {browserInfo.name} {browserInfo.version} on {browserInfo.os}
                    </p>
                    <p className="text-red-300 text-sm mt-1">
                      Speech recognition may not be enabled. Please check:
                    </p>
                    <ul className="text-red-300 text-sm mt-1 ml-4 list-disc">
                      <li>Microphone permissions are granted</li>
                      <li>Browser supports Web Speech API</li>
                      <li>Try refreshing the page</li>
                    </ul>
                  </div>
                </div>
              )}
              <div className="flex-grow flex flex-col items-center justify-center p-6 bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-700">
                <Mic className={`h-16 w-16 mb-4 ${isListening ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`}/>
                <p className="text-gray-400 mb-4 text-center">{prompt}</p>
                <Button 
                  onClick={handleToggleListening} 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!isSupported}
                >
                  {isListening ? <MicOff className="mr-2 h-4 w-4"/> : <Mic className="mr-2 h-4 w-4"/>}
                  {isListening ? 'Stop Listening' : 'Start Listening'}
                </Button>
                
                {/* Debug info */}
                <div className="mt-2 text-xs text-gray-500">
                  <p>isSupported: {isSupported ? 'true' : 'false'}</p>
                  <p>isListening: {isListening ? 'true' : 'false'}</p>
                </div>
                

                {!isSupported && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Speech Recognition: {supportInfo.speechRecognition ? '✓' : '✗'} | 
                    Speech Synthesis: {supportInfo.speechSynthesis ? '✓' : '✗'}
                  </p>
                )}
              </div>
              <div className="mt-4 flex-shrink-0">
                <label className="text-sm font-medium text-gray-400">Recognized Speech</label>
                <Textarea 
                  readOnly 
                  value={getDisplayText()}
                  placeholder="Your speech will appear here..."
                  className="mt-1 bg-gray-900/70 text-white w-full resize-none border border-gray-700"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Right Panel: ISL Display */}
          <Card className="shadow-lg h-full border-gray-700 bg-gray-800/50 backdrop-blur-sm flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <CardTitle className="flex items-center text-white">ISL Sign Display</CardTitle>
              <Button variant="ghost" size="icon" onClick={handleReset}><RefreshCcw className="h-5 w-5"/></Button>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center p-4 flex-col">
              <div className="w-full h-full flex flex-nowrap items-center justify-start gap-4 p-4 bg-gray-900/50 rounded-lg overflow-x-auto overflow-y-hidden">
                {displayedWords.length > 0 ? (
                  displayedWords.map((word, wordIndex) => (
                    <div key={wordIndex} className="flex-shrink-0 flex items-center justify-center p-2 m-2 border-2 border-green-400 rounded-lg bg-gray-900">
                      {word.map((letter, letterIndex) => (
                        <img
                          key={letterIndex}
                          src={`/Today/${letter}.jpg`}
                          alt={letter}
                          className="w-20 h-20 object-contain mx-1 rounded-md"
                          onError={(e) => {
                            // Fallback for missing images
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="w-full flex flex-col items-center justify-center h-full">
                    <Hand className="h-20 w-20 text-yellow-500 mb-4" />
                    <p className="text-gray-400">ISL signs will appear here</p>
                  </div>
                )}
              </div>
              <Button onClick={handleReset} className="mt-6 w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-2 px-4 rounded-lg">
                <RefreshCcw className="mr-2 h-5 w-5" /> Reset
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Talk;