from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import pickle
import numpy as np
from pydantic import BaseModel
from typing import List
from googletrans import Translator
import os
import asyncio
import urllib.request
# Initialize FastAPI app
app = FastAPI()

# print("DEBUG: Listing backend folder inside container...")
# for root, dirs, files in os.walk("/app/backend"):
#     print("Directory:", root)
#     print("Files:", files)

# Allow CORS for communication with the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


# ---------------------------------------
# SAFE UNIVERSAL PATH HANDLING
# ---------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "linux.h5")
LABEL_PATH = os.path.join(BASE_DIR, "krishnav.pkl")

# ---------------------------------------
# LOAD MODEL + LABEL ENCODER
# ---------------------------------------
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    with open(LABEL_PATH, "rb") as f:
        label_encoder = pickle.load(f)
    print("Model and label encoder loaded successfully.")
except Exception as e:
    print("❌ ERROR loading model or encoder:", e)
    model = None
    label_encoder = None

KRIDIKSHIT_MODEL_PATH = os.path.join(BASE_DIR, "kridikshit2.h5")
try:
    kridikshit_model = tf.keras.models.load_model(KRIDIKSHIT_MODEL_PATH)
    kridikshit_labels = ['i','quit']
    print("Action model loaded successfully.")
except Exception as e:
    print("❌ ERROR loading action model:", e)
    kridikshit_model = None
# # Load the trained model and label encoder
# try:
#     # model = tf.keras.models.load_model('backend/linux.h5')
#     # with open('backend/krishnav.pkl', 'rb') as f:
#     #     label_encoder = pickle.load(f)
#     # print("Model and label encoder loaded successfully.")



#     BASE_DIR = os.path.dirname(os.path.abspath(__file__))

#     model_path = os.path.join(BASE_DIR, "linux.h5")
#     pkl_path   = os.path.join(BASE_DIR, "krishnav.pkl")

#     model = tf.keras.models.load_model(model_path)

#     with open(pkl_path, "rb") as f:
#         label_encoder = pickle.load(f)


# except Exception as e:
#     print(f"Error loading model or label encoder: {e}")
#     model = None
#     label_encoder = None

def normalize_and_reshape_for_cnn(landmarks):
    # Process landmarks to match the CNN model's expected input format.
    landmarks_np = np.array(landmarks).reshape(42, 2)

    # Center the landmarks around the first landmark (wrist).
    base = landmarks_np[0]
    centered = landmarks_np - base

    # Normalize to make the gesture scale-invariant.
    max_value = np.max(np.linalg.norm(centered, axis=1))
    if max_value > 0:
        normalized = centered / max_value
    else:
        normalized = centered # Avoid division by zero

    # Reshape for CNN input: (42, 2, 1).
    return normalized.reshape(42, 2, 1)

# Define the structure of the incoming data
class HandLandmarks(BaseModel):
    landmarks: List[List[List[float]]]

@app.get("/")
def read_root():
    return {"message": "Welcome to the ISHARA Sign Language Translation API"}

@app.post("/predict")
async def predict(data: HandLandmarks):
    if not model or not label_encoder:
        return {"error": "Model or label encoder not loaded."}

    try:
        # The landmarks are sent as a nested list, extract the main list.
        landmarks_array = np.array(data.landmarks)[0]
        
        # Process the landmarks to match the training script's input format.
        processed_data = normalize_and_reshape_for_cnn(landmarks_array)
        
        # Add a batch dimension to create a shape of (1, 42, 2, 1).
        processed_data_batch = np.expand_dims(processed_data, axis=0)

        # Make a prediction and get the highest confidence score
        prediction = model.predict(processed_data_batch)
        confidence = np.max(prediction)
        
        # Only return a prediction if the model is reasonably confident
        if confidence > 0.9:
            predicted_class_index = np.argmax(prediction)
            predicted_class_label = label_encoder.inverse_transform([predicted_class_index])[0]
            return {"prediction": predicted_class_label}
        else:
            return {"prediction": ""}
            
    except Exception as e:
        return {"error": str(e)}

class TranslationRequest(BaseModel):
    text: str
    src_lang: str
    dest_lang: str

@app.post("/translate")
async def translate_text(request: TranslationRequest):
    try:
        translator = Translator()
        translated = translator.translate(request.text, src=request.src_lang, dest=request.dest_lang)
        print(f"[TRANSLATE] {request.text} ({request.src_lang} -> {request.dest_lang}) => {translated.text}")
        return {"translated_text": translated.text}
    except Exception as e:
        print(f"[TRANSLATE ERROR] {e}")
        return {"error": str(e)}

class ActionRequest(BaseModel):
    sequence: List[List[float]]

@app.post("/predict_action")
async def predict_action(data: ActionRequest):
    if not kridikshit_model:
        return {"error": "Action model not loaded."}

    try:
        sequence_array = np.array(data.sequence)
        
        # print(f"[DEBUG] sequence_array.shape: {sequence_array.shape}")
        
        if sequence_array.shape != (30, 258):
            print(f"❌ [ACTION PREDICT ERROR] Invalid input shape. Expected (30, 258), got {sequence_array.shape}.")
            return {"error": f"Invalid input shape. Expected (30, 258), got {sequence_array.shape}."}
        
        # Add a batch dimension to create a shape of (1, 30, 258)
        # Convert to float32 for faster processing during call
        sequence_batch = tf.convert_to_tensor(sequence_array, dtype=tf.float32)
        sequence_batch = tf.expand_dims(sequence_batch, axis=0)

        # Make a prediction - using direct __call__ is faster than .predict for single samples
        prediction_tensor = kridikshit_model(sequence_batch, training=False)
        kri_pred = prediction_tensor.numpy()[0]
        kri_conf = np.max(kri_pred)
        kri_label = kridikshit_labels[np.argmax(kri_pred)]
        
        # Adjusted threshold to 0.70 for a better balance
        if kri_conf > 0.70:
            print(f"[ACTION PREDICT] Success: '{kri_label}' | Conf: {kri_conf:.2f}")
            return {"prediction": kri_label, "confidence": float(kri_conf)}
        else:
            if kri_conf > 0.3: # Only log if there's at least some signal
                print(f"[ACTION PREDICT] Low Confidence: '{kri_label}' | Conf: {kri_conf:.2f} (Threshold 0.70)")
            return {"prediction": "", "confidence": float(kri_conf)}
            
    except Exception as e:
        print(f"❌ [ACTION PREDICT FATAL ERROR]: {str(e)}")
        return {"error": str(e)}

async def keep_alive_loop():
    # Render provides RENDER_EXTERNAL_URL automatically in most cases
    # We fall back to RENDER_URL or the hardcoded default
    url = os.environ.get("RENDER_EXTERNAL_URL") or os.environ.get("RENDER_URL", "https://kridikshit.onrender.com/")
    
    # If we are running locally and no URL is set, we might want to skip this
    if not url.startswith("http"):
        print(f"[Keep-Alive] Skip: URL '{url}' is invalid.")
        return

    print(f"[Keep-Alive] Target set to: {url}")
    
    while True:
        # Ping every 10 minutes (Render free tier sleeps after 15m of inactivity)
        await asyncio.sleep(10 * 60)
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (ISHARA-Keep-Alive)'})
            # We use to_thread so the synchronous urlopen doesn't block the async event loop
            await asyncio.to_thread(urllib.request.urlopen, req)
            print(f"[Keep-Alive] Ping successful: {url}")
        except Exception as e:
            print(f"[Keep-Alive] Ping failed: {e}")

@app.on_event("startup")
async def startup_event():
    # Only run the keep-alive ping if we are in Render or KEEP_ALIVE is true
    # We also check if we're running locally to avoid unnecessary external pings during dev
    is_render = "RENDER" in os.environ
    should_keep_alive = os.environ.get("KEEP_ALIVE", "true").lower() == "true"
    
    if should_keep_alive:
        asyncio.create_task(keep_alive_loop())
        print("[Keep-Alive] Background task initialized.")
