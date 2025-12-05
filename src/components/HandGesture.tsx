// import React, { useEffect, useRef, useState } from "react";
// import * as tf from "@tensorflow/tfjs";
// import "@tensorflow/tfjs-backend-webgl";
// import { Hands } from "@mediapipe/hands";
// import { Camera } from "@mediapipe/camera_utils";
// import { preprocessLandmarks } from "../utils/preprocessing";
// import { LABELS } from "../utils/labels";

// const HandGesture = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   const [model, setModel] = useState<tf.LayersModel | null>(null);
//   const [prediction, setPrediction] = useState("");
//   const [isLoading, setIsLoading] = useState(true);

//   // Load TensorFlow.js model with WebGL backend
//   useEffect(() => {
//     const loadTFModel = async () => {
//       try {
//         await tf.setBackend("webgl");
//         await tf.ready();
//         const m = await tf.loadLayersModel("/web_model/model.json");
//         console.log("Model loaded successfully");
//         setModel(m);
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error loading model:", error);
//         setIsLoading(false);
//       }
//     };
//     loadTFModel();
//   }, []);

//   // Initialize MediaPipe Hands and Camera
//   useEffect(() => {
//     if (!videoRef.current || !model) return;

//     const hands = new Hands({
//       locateFile: (file) =>
//         `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//     });

//     hands.setOptions({
//       selfieMode: true,
//       maxNumHands: 1,
//       minDetectionConfidence: 0.5,
//       minTrackingConfidence: 0.5,
//     });

//     hands.onResults((results) => {
//       if (!canvasRef.current || !videoRef.current) return;

//       const ctx = canvasRef.current.getContext("2d");
//       if (!ctx) return;

//       canvasRef.current.width = videoRef.current.videoWidth;
//       canvasRef.current.height = videoRef.current.videoHeight;

//       ctx.clearRect(
//         0,
//         0,
//         canvasRef.current.width,
//         canvasRef.current.height
//       );

//       if (results.multiHandLandmarks?.length && model) {
//         const hand = results.multiHandLandmarks[0];

//         // Extract 21 MediaPipe keypoints and convert to 42 points (duplicate each)
//         let fullPairs: number[][] = [];
//         hand.forEach((p) => {
//           fullPairs.push([p.x, p.y]);
//           fullPairs.push([p.x, p.y]); // 21 → 42 points
//         });

//         if (fullPairs.length === 42) {
//           try {
//             // Preprocess landmarks exactly like Python model
//             const input = preprocessLandmarks(fullPairs);
            
//             // Run prediction
//             const output = model.predict(input) as tf.Tensor;
//             const data = Array.from(output.dataSync());
            
//             // Clean up tensors
//             input.dispose();
//             output.dispose();

//             // Get prediction with confidence threshold
//             const maxConfidence = Math.max(...data);
//             if (maxConfidence > 0.9) {
//               const index = data.indexOf(maxConfidence);
//               setPrediction(LABELS[index]);
//             } else {
//               setPrediction("");
//             }
//           } catch (error) {
//             console.error("Prediction error:", error);
//           }
//         }
//       } else {
//         setPrediction("");
//       }
//     });

//     const camera = new Camera(videoRef.current, {
//       onFrame: async () => {
//         await hands.send({ image: videoRef.current! });
//       },
//       width: 640,
//       height: 480,
//     });

//     camera.start();

//     // Cleanup function
//     return () => {
//       camera.stop();
//       hands.close();
//     };
//   }, [model]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <p>Loading model...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-full max-w-4xl mx-auto">
//       <div className="relative">
//         <video 
//           ref={videoRef} 
//           className="w-full h-auto rounded-lg"
//           style={{ transform: "scaleX(-1)" }}
//           playsInline
//         />
//         <canvas 
//           ref={canvasRef} 
//           className="absolute top-0 left-0 w-full h-full"
//           style={{ transform: "scaleX(-1)" }}
//         />
//       </div>
//       <div className="mt-4 text-center">
//         <h2 className="text-3xl font-bold text-primary">
//           {prediction || "Show a sign..."}
//         </h2>
//       </div>
//     </div>
//   );
// };

// export default HandGesture;
