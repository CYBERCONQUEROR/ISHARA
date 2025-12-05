// src/utils/preprocessing.ts
import * as tf from "@tensorflow/tfjs";

export function preprocessLandmarks(landmarks: number[][]): tf.Tensor {
  const base = landmarks[0];
  let centered = landmarks.map(([x, y]) => [x - base[0], y - base[1]]);
  const distances = centered.map(([x, y]) => Math.sqrt(x * x + y * y));
  const maxVal = Math.max(...distances) || 1;
  centered = centered.map(([x, y]) => [x / maxVal, y / maxVal]);
  return tf.tensor(centered).reshape([1, 42, 2, 1]);
}
