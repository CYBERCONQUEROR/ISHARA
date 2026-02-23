/**
 * Google AI Tools Integrated in ISHARA:
 * 
 * 1. MediaPipe - Google's AI-powered framework for real-time hand tracking and gesture recognition
 *    - @mediapipe/tasks-vision: Hand landmark detection using AI models
 *    - @mediapipe/hands: AI-powered hand tracking models
 *    - @mediapipe/camera_utils: Camera utilities for AI processing
 *    - @mediapipe/drawing_utils: Drawing utilities for AI visualization
 *    - AI models hosted on Google Cloud Storage (storage.googleapis.com)
 * 
 * 2. TensorFlow.js - Google's AI/ML framework for client-side machine learning inference
 *    - @tensorflow/tfjs: Core TensorFlow.js AI library
 *    - @tensorflow/tfjs-node: Node.js backend support for AI inference
 *    - Used for real-time sign language recognition using trained AI models
 * 
 * 3. Google Translate API (googletrans) - Google's AI-powered translation service
 *    - Backend integration using Google's neural machine translation AI
 *    - Multilingual translation support (Hindi, Bengali, Marathi, Assamese, Punjabi, Bhojpuri, etc.)
 *    - Powered by Google's advanced AI translation models
 */

import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  server: { 
    host: '0.0.0.0',
    port: 3000,
    watch: {
      ignored: ['**/env/**']
    },
    allowedHosts: ['.onrender.com', 'isharaaa-1p82.onrender.com'] // 👈 add this
  },
  build: {
    chunkSizeWarningLimit: 1600, // increase limit (default 500kb)
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
