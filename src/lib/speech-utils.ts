// Cross-platform speech recognition and synthesis utilities
// This file provides better compatibility across different operating systems and browsers

export interface BrowserInfo {
  name: string;
  version: string;
  os: string;
  isSupported: boolean;
}

export interface SpeechRecognitionConfig {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  maxAlternatives?: number;
}

// Browser detection for better error messages and compatibility
export const getBrowserInfo = (): BrowserInfo => {
  const userAgent = navigator.userAgent;
  let name = 'Unknown';
  let version = 'unknown';
  let os = 'Unknown';
  let isSupported = false;

  // Detect browser
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    name = 'Chrome';
    version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'unknown';
    isSupported = true;
  } else if (userAgent.includes('Firefox')) {
    name = 'Firefox';
    version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'unknown';
    isSupported = true;
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    name = 'Safari';
    version = userAgent.match(/Version\/(\d+)/)?.[1] || 'unknown';
    isSupported = true;
  } else if (userAgent.includes('Edg')) {
    name = 'Edge';
    version = userAgent.match(/Edg\/(\d+)/)?.[1] || 'unknown';
    isSupported = true;
  }
  


  // Detect operating system
  if (userAgent.includes('Windows')) {
    os = 'Windows';
  } else if (userAgent.includes('Mac')) {
    os = 'macOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
  } else if (userAgent.includes('iOS')) {
    os = 'iOS';
  }

  return { name, version, os, isSupported };
};

// Cross-platform speech recognition setup
export const getSpeechRecognition = () => {
  // Check for standard SpeechRecognition first
  if ('SpeechRecognition' in window) {
    return (window as any).SpeechRecognition;
  }
  
  // Check for webkitSpeechRecognition (Chrome/Safari)
  if ('webkitSpeechRecognition' in window) {
    return (window as any).webkitSpeechRecognition;
  }
  
  // Check for mozSpeechRecognition (Firefox)
  if ('mozSpeechRecognition' in window) {
    return (window as any).mozSpeechRecognition;
  }
  
  // Check for msSpeechRecognition (Edge)
  if ('msSpeechRecognition' in window) {
    return (window as any).msSpeechRecognition;
  }
  
  return null;
};

// Create a speech recognition instance with proper configuration
export const createSpeechRecognition = (config: SpeechRecognitionConfig = {}) => {
  const SpeechRecognition = getSpeechRecognition();
  
  if (!SpeechRecognition) {
    throw new Error('Speech recognition not supported in this browser');
  }

  const recognition = new SpeechRecognition();
  
  // Apply configuration with defaults
  recognition.continuous = config.continuous ?? false;
  recognition.interimResults = config.interimResults ?? false;
  recognition.lang = config.lang ?? 'en-US';
  recognition.maxAlternatives = config.maxAlternatives ?? 1;
  
  // Additional settings for better cross-platform compatibility
  if (recognition.grammars) {
    recognition.grammars = null; // Disable grammars for better compatibility
  }

  return recognition;
};

// Cross-platform speech synthesis setup
export const getSpeechSynthesis = () => {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis;
  }
  return null;
};

// Get available voices for better cross-platform compatibility
export const getAvailableVoices = () => {
  const synthesis = getSpeechSynthesis();
  if (!synthesis) return [];
  
  try {
    return synthesis.getVoices();
  } catch (error) {
    console.warn('Error getting voices:', error);
    return [];
  }
};

// Find the best available voice for the given language
export const findBestVoice = (lang: string = 'en-US') => {
  const voices = getAvailableVoices();
  if (voices.length === 0) return null;
  
  // Try to find an exact match first
  let voice = voices.find(v => v.lang === lang);
  
  // If no exact match, try to find a voice with the same language family
  if (!voice) {
    const langPrefix = lang.split('-')[0];
    voice = voices.find(v => v.lang.startsWith(langPrefix));
  }
  
  // If still no match, use the first available voice
  if (!voice) {
    voice = voices[0];
  }
  
  return voice;
};

// Enhanced speech synthesis with better error handling
export const speak = (text: string, options: {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
} = {}) => {
  const synthesis = getSpeechSynthesis();
  
  if (!synthesis || !text) {
    if (!text) console.log("Speak function called with no text.");
    else console.warn("Speech synthesis not supported in this browser.");
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language and find best voice
    utterance.lang = options.lang || 'en-US';
    const voice = options.voice || findBestVoice(utterance.lang);
    if (voice) {
      utterance.voice = voice;
    }
    
    // Configure for better cross-platform compatibility
    utterance.rate = options.rate ?? 0.9;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;
    
    utterance.onerror = (event) => {
      console.error('SpeechSynthesisUtterance.onerror', event);
    };

    utterance.onstart = () => {
      console.log('Speech synthesis started');
    };

    utterance.onend = () => {
      console.log('Speech synthesis ended');
    };

    // Cancel anything currently speaking to avoid a queue
    synthesis.cancel();
    
    // A small delay can sometimes help, especially after a cancel() and on Windows
    setTimeout(() => {
      try {
        synthesis.speak(utterance);
      } catch (error) {
        console.error('Error speaking text:', error);
      }
    }, 100);

  } catch (error) {
    console.error('Error creating speech utterance:', error);
  }
};

// Prime speech synthesis for better initialization
export const primeSpeechSynthesis = () => {
  const synthesis = getSpeechSynthesis();
  if (!synthesis) {
    console.warn("Speech synthesis not supported in this browser.");
    return;
  }
  
  // Get voices upfront & on user interaction to unlock speech
  // This is especially important on Windows and some mobile browsers
  try {
    synthesis.getVoices();
    
    // Some browsers need a small delay to properly initialize
    setTimeout(() => {
      synthesis.getVoices();
    }, 100);
  } catch (error) {
    console.warn('Error priming speech synthesis:', error);
  }
};

// Check if speech recognition is supported
export const isSpeechRecognitionSupported = () => {
  return getSpeechRecognition() !== null;
};

// Check if speech synthesis is supported
export const isSpeechSynthesisSupported = () => {
  return getSpeechSynthesis() !== null;
};

// Get detailed support information
export const getSpeechSupportInfo = () => {
  const browserInfo = getBrowserInfo();
  const recognitionSupported = isSpeechRecognitionSupported();
  const synthesisSupported = isSpeechSynthesisSupported();
  
  return {
    browser: browserInfo,
    speechRecognition: recognitionSupported,
    speechSynthesis: synthesisSupported,
    fullySupported: recognitionSupported && synthesisSupported
  };
};


// Error messages for different scenarios
export const getErrorMessage = (error: string, browserInfo: BrowserInfo) => {
  switch (error) {
    case 'not-allowed':
      return 'Microphone access denied. Please allow microphone access in your browser settings.';
    case 'audio-capture':
      return 'No microphone found. Please check your microphone and browser permissions.';
    case 'service-not-allowed':
      return 'Speech recognition service not allowed. Please check your browser settings.';
    case 'network':
      return 'Network error. Please check your connection.';
    case 'no-speech':
      return 'No speech detected. Please try speaking again.';
    case 'aborted':
      return 'Speech recognition was aborted. Please try again.';
    case 'audio-capture-device':
      return 'Audio capture device error. Please check your microphone.';
    case 'audio-capture-service':
      return 'Audio capture service error. Please try refreshing the page.';
    case 'bad-grammar':
      return 'Grammar error in speech recognition.';
    case 'language-not-supported':
      return 'Language not supported for speech recognition.';
    default:
      return `Speech recognition error: ${error}. Please try again.`;
  }
}; 