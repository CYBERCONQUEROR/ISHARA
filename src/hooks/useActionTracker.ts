import { useState, useEffect, useRef } from 'react';
import { Holistic, Results, FACEMESH_TESSELATION, POSE_CONNECTIONS, HAND_CONNECTIONS } from '@mediapipe/holistic';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import axios from 'axios';
import { speak as speakUtil, primeSpeechSynthesis as primeSpeechSynthesisUtil } from '@/lib/speech-utils';

const API = import.meta.env.VITE_API_URL;

export const primeSpeechSynthesis = () => {
    primeSpeechSynthesisUtil();
};

export const speak = (text: string) => {
    speakUtil(text);
};

export const useActionTracker = () => {
  const [holistic, setHolistic] = useState<Holistic | null>(null);
  const [currentAction, setCurrentAction] = useState('...');
  const [detectionStatus, setDetectionStatus] = useState('Initializing...');
  const [buildingSentence, setBuildingSentence] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<Camera | null>(null);
  
  const sequenceRef = useRef<number[][]>([]);
  const lastPredictionSent = useRef(0);
  const lastDetectedAction = useRef<string | null>(null);
  const consecutiveNoHandFrames = useRef(0);
  
  const extractKeypoints = (results: Results): number[] => {
    let pose: number[] = new Array(33 * 4).fill(0);
    if (results.poseLandmarks) {
        pose = results.poseLandmarks.flatMap(res => [res.x, res.y, res.z, res.visibility || 0]);
    }

    
    let lh: number[] = new Array(21 * 3).fill(0);
    if (results.leftHandLandmarks) {
        lh = results.leftHandLandmarks.flatMap(res => [res.x, res.y, res.z]);
    }
    
    let rh: number[] = new Array(21 * 3).fill(0);
    if (results.rightHandLandmarks) {
        rh = results.rightHandLandmarks.flatMap(res => [res.x, res.y, res.z]);
    }
    
    // Returns 258 features total: Pose (132) + Left Hand (63) + Right Hand (63)
    return [...pose, ...lh, ...rh];
  };

  const onResults = (results: Results) => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d')!;
    
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    // All landmark drawings (face, body, hands) have been disabled as requested
    canvasCtx.restore();

    // Extract keypoints and maintain sequence buffer
    const keypoints = extractKeypoints(results);
    const hasPose = results.poseLandmarks && results.poseLandmarks.length > 0;
    const hasHands = (results.leftHandLandmarks && results.leftHandLandmarks.length > 0) || 
                     (results.rightHandLandmarks && results.rightHandLandmarks.length > 0);
    
    if (hasPose) {
        if (!hasHands) {
            consecutiveNoHandFrames.current += 1;
            setDetectionStatus('Waiting for hands...');
            setCurrentAction('...');
            
            // Clear sequence buffer if hands are gone for too long (prevents garbage predictions right when hands are raised)
            if (consecutiveNoHandFrames.current > 15) {
                sequenceRef.current = [];
                // ONLY reset memory if hands are gone for a long time
                lastDetectedAction.current = null; 
            }
        } else {
            consecutiveNoHandFrames.current = 0;
            setDetectionStatus('Detecting Actions...');
        }
        
        sequenceRef.current.push(keypoints);
        if (sequenceRef.current.length > 30) {
            sequenceRef.current.shift();
        }
        
        const now = Date.now();
        if (hasHands && sequenceRef.current.length === 30 && (now - lastPredictionSent.current > 100)) {
            sendSequenceToBackend([...sequenceRef.current]);
            lastPredictionSent.current = now;
        }
    } else {
        setDetectionStatus('No person detected...');
        sequenceRef.current = [];
        consecutiveNoHandFrames.current = 0;
        setCurrentAction('...');
        lastDetectedAction.current = null;
    }
  };

  useEffect(() => {
    let active = true;
    const initializeHolistic = async () => {
      try {
        setDetectionStatus('Loading Action Model...');
        const holisticInstance = new Holistic({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
          }
        });
        
        holisticInstance.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: true,
          refineFaceLandmarks: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
        
        holisticInstance.onResults(onResults);
        
        // Initialize implicitly handles fetching the graph, so we just set state
        if (active) {
          setHolistic(holisticInstance);
          setDetectionStatus('Ready for camera.');
        }
      } catch (e) {
        console.error("Failed to initialize holistic:", e);
        if (active) setDetectionStatus('Error: Model failed to load.');
      }
    };
    
    initializeHolistic();
    return () => {
        active = false;
        if (holistic) holistic.close();
    };
  }, []);

  const startVideo = async () => {
    if (!holistic || !videoRef.current) return false;
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        setDetectionStatus('Starting camera...');
        
        const videoElement = videoRef.current;
        let lastFrameTime = 0;
        const camera = new Camera(videoElement, {
            onFrame: async () => {
                const now = performance.now();
                if (now - lastFrameTime < 33) return; // Throttle to ~30 FPS to match training speed
                lastFrameTime = now;
                
                if (videoElement.readyState === 4 && videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
                  if (canvasRef.current && canvasRef.current.width !== videoElement.videoWidth) {
                      canvasRef.current.width = videoElement.videoWidth;
                      canvasRef.current.height = videoElement.videoHeight;
                  }
                  await holistic.send({ image: videoElement });
                }
            },
            width: 640,
            height: 480
        });
        await camera.start();
        cameraRef.current = camera;
        setDetectionStatus('Detecting...');
        return true;
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setDetectionStatus('Camera access denied.');
        return false;
      }
    }
    return false;
  };

  const stopVideo = () => {
    if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setDetectionStatus('Camera is off.');
  };
  
  const resetTranslation = () => {
    setCurrentAction('...');
    setBuildingSentence('');
    lastDetectedAction.current = null;
    sequenceRef.current = [];
    window.speechSynthesis.cancel();
  };

  useEffect(() => {
    return () => {
      stopVideo();
    };
  }, []);

  const silenceCount = useRef(0);

  const sendSequenceToBackend = async (sequence: number[][]) => {
    try {
        const response = await axios.post(`${API}/predict_action`, { sequence });
        const newPrediction = response.data?.prediction ?? "";
        
        if (newPrediction) {
            // Log for debugging (can be removed later)
            console.log(`[ACTION] Detected: ${newPrediction} (Conf: ${response.data?.confidence?.toFixed(2)})`);

            // 1. ALWAYS clear the buffer when we get a strong prediction. 
            // This prevents "sliding window" duplicates where the same 'i' motion hits twice.
            sequenceRef.current = [];

            // 2. Only record/speak it if it's DIFFERENT or we've had silence.
            if (newPrediction !== lastDetectedAction.current || silenceCount.current > 5) {
                lastDetectedAction.current = newPrediction;
                setCurrentAction(newPrediction);
                speak(newPrediction);
                setBuildingSentence(prev => (prev ? prev + ' ' + newPrediction : newPrediction).trim());
                silenceCount.current = 0;
            }
        } else {
            // No prediction from backend (silence)
            silenceCount.current += 1;
            setCurrentAction('...');
            
            // Require 2 seconds of total silence before allowed to repeat the SAME word
            if (silenceCount.current > 20) { 
                lastDetectedAction.current = null;
            }
        }
    } catch (error) {
        console.error("Error sending sequence to backend:", error);
    }
  };

  return {
    videoRef,
    canvasRef,
    currentAction,
    buildingSentence,
    detectionStatus,
    startVideo,
    stopVideo,
    resetTranslation,
    holisticModelLoaded: !!holistic
  };
};
