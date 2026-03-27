import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, RefreshCcw, CheckCircle, Volume2, Activity } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useHandTracker, speak, primeSpeechSynthesis } from '../hooks/useHandTracker';
import { useActionTracker } from '../hooks/useActionTracker';

const Translator = () => {
  const [mode, setMode] = useState<'letters' | 'actions'>('letters');
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [speechPrimed, setSpeechPrimed] = useState(false);

  // Both hooks will initialize in background, but we only use one
  const handTracker = useHandTracker();
  const actionTracker = useActionTracker();

  // Stop camera on mode change
  useEffect(() => {
    if (isCameraOn) {
        handTracker.stopVideo();
        actionTracker.stopVideo();
        setIsCameraOn(false);
    }
  }, [mode]);

  const activeTracker = mode === 'letters' ? handTracker : actionTracker;
  const isModelLoading = mode === 'letters' ? !handTracker.handLandmarker : !actionTracker.holisticModelLoaded;
  const isError = activeTracker.detectionStatus.startsWith('Error');

  const handleStartCamera = async () => {
    if (!speechPrimed) {
      primeSpeechSynthesis();
      setSpeechPrimed(true);
    }
    const success = await activeTracker.startVideo();
    if (success) {
      setIsCameraOn(true);
    }
  };

  const handleStopCamera = () => {
    activeTracker.stopVideo();
    setIsCameraOn(false);
  };

  const handleReset = () => {
    activeTracker.resetTranslation();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-500 pb-2">
            Sign Language to Text
          </h1>
          <p className="text-lg text-gray-400 mt-2">
            Real-time translation of hand gestures into written language.
          </p>
        </header>

        <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4 bg-gray-800/80 px-6 py-3 rounded-full border border-gray-700">
                <span className={`text-sm font-medium ${mode === 'letters' ? 'text-cyan-400' : 'text-gray-400'}`}>Letters (Spelling)</span>
                <Switch 
                    checked={mode === 'actions'} 
                    onCheckedChange={(checked) => setMode(checked ? 'actions' : 'letters')} 
                />
                <span className={`text-sm font-medium ${mode === 'actions' ? 'text-purple-400' : 'text-gray-400'}`}>Actions (Sequences)</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Camera Feed and Controls */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden flex items-center justify-center">
                {/* Dynamically mount video and canvas element based on mode so ref binds properly to correct hook */}
                {mode === 'letters' ? (
                     <video ref={handTracker.videoRef as any} className="absolute top-0 left-0 w-full h-full object-cover" autoPlay playsInline muted style={{ transform: "scaleX(-1)" }} />
                ) : (
                     <video ref={actionTracker.videoRef as any} className="absolute top-0 left-0 w-full h-full object-cover" autoPlay playsInline muted style={{ transform: "scaleX(-1)" }} />
                )}
                
                {mode === 'letters' ? (
                     <canvas ref={handTracker.canvasRef as any} className="absolute top-0 left-0 w-full h-full" /> 
                ) : (
                     <canvas ref={actionTracker.canvasRef as any} className="absolute top-0 left-0 w-full h-full" /> 
                )}
                
                {!isCameraOn && (
                  <div className="z-10 text-center">
                    <Camera className="mx-auto h-16 w-16 text-gray-500" />
                    <p className="mt-2 text-gray-400">Camera is off</p>
                  </div>
                )}
                {isError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
                        <p className="text-red-400 text-lg">{activeTracker.detectionStatus}</p>
                    </div>
                )}
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                {isCameraOn ? (
                  <Button onClick={handleStopCamera} variant="destructive" className="flex-1">
                    Stop Camera
                  </Button>
                ) : (
                  <Button onClick={handleStartCamera} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isModelLoading || isError}>
                    <Camera className="mr-2 h-4 w-4" /> {isModelLoading ? 'Initializing Model...' : 'Start Camera'}
                  </Button>
                )}
                <Button onClick={handleReset} variant="outline" className="flex-1 border-gray-600 hover:bg-gray-700">
                  <RefreshCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right Panel: Translation Output */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 flex flex-col">
            <CardContent className="p-4 sm:p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-cyan-400">Translation ({mode === 'letters' ? 'Letters' : 'Actions'})</h2>
                <div className={`flex items-center space-x-2 ${isError ? 'text-red-400' : 'text-gray-400'}`}>
                  <div className={`h-3 w-3 rounded-full ${isCameraOn && !isError ? 'bg-green-500 animate-pulse' : isError ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                  <span className="text-sm font-medium">{activeTracker.detectionStatus}</span>
                </div>
              </div>

              <div className="flex-grow flex flex-col bg-gray-900/50 rounded-lg p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                     {mode === 'actions' ? 'Current Action' : 'Detected Sentence'}
                  </h3>
                  <p className="text-2xl text-gray-200 min-h-[6rem]">
                    {activeTracker.buildingSentence}
                    {mode === 'letters' && (
                        <>
                            <span className="text-purple-400 font-bold animate-pulse"> {handTracker.currentSpelledWord}</span>
                            {handTracker.currentSpelledWord && <span className="text-gray-500 animate-pulse">|</span>}
                        </>
                    )}
                    {mode === 'actions' && (
                        <>
                           {actionTracker.currentAction !== '...' && <span className="text-purple-400 font-bold ml-2">[{actionTracker.currentAction}]</span>}
                        </>
                    )}
                  </p>
                </div>
                
                {mode === 'letters' && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Suggestions</h3>
                      <p className="mt-1 text-lg text-cyan-300 min-h-[2rem]">
                          {(handTracker.suggestions || []).join('  |  ')}
                      </p>
                    </div>
                )}
              </div>
              
              {mode === 'letters' && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-300">Final Translation</h3>
                      <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => speak(handTracker.finalTranslation)} 
                          disabled={!handTracker.finalTranslation}
                          aria-label="Speak final translation"
                          className="text-gray-400 hover:text-white disabled:opacity-50"
                      >
                          <Volume2 className="h-5 w-5"/>
                      </Button>
                    </div>
                    <pre className="mt-1 text-lg text-gray-200 bg-gray-900/50 p-4 rounded-lg whitespace-pre-wrap h-48 overflow-y-auto">
                      {handTracker.finalTranslation || "..."}
                    </pre>
                  </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* How to Use Section */}
        <section className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-500">How to Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-gray-800/50 p-6 rounded-lg">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500/20 text-blue-400 mx-auto mb-4">
                        <Camera size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">1. Start Camera</h3>
                    <p className="text-gray-400">Select Letters or Actions mode, turn on your camera and place yourself in frame.</p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-lg">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-500/20 text-purple-400 mx-auto mb-4">
                        <Activity size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">2. Make Signs</h3>
                    <p className="text-gray-400">Perform ISL signs. <strong>Letters Mode</strong> expects alphabet spelling. <strong>Actions Mode</strong> requires consecutive motions.</p>
                </div>
                <div className="bg-gray-800/50 p-6 rounded-lg">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-500/20 text-green-400 mx-auto mb-4">
                        <CheckCircle size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">3. See Translation</h3>
                    <p className="text-gray-400">Watch as signs are translated in real-time. Audio will play upon successfully recognizing words.</p>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};

export default Translator; 