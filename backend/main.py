from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import pickle
import numpy as np
from pydantic import BaseModel
from typing import List
from googletrans import Translator
import os
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

ACTION_MODEL_PATH = os.path.join(BASE_DIR, "action.h5")
try:
    action_model = tf.keras.models.load_model(ACTION_MODEL_PATH)
    action_labels = ["i", "know", "hindi"]
    print("Action model loaded successfully.")
except Exception as e:
    print("❌ ERROR loading action model:", e)
    action_model = None
    action_labels = None
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
    if not action_model:
        return {"error": "Action model not loaded."}

    try:
        sequence_array = np.array(data.sequence)
        
        if sequence_array.shape != (30, 1662):
            return {"error": f"Invalid input shape. Expected (30, 1662), got {sequence_array.shape}."}
        
        # Add a batch dimension to create a shape of (1, 30, 1662)
        sequence_batch = np.expand_dims(sequence_array, axis=0)

        # Make a prediction
        prediction = action_model.predict(sequence_batch)[0]
        confidence = np.max(prediction)
        
        # Only return a prediction if the model is confident
        if confidence > 0.8:
            predicted_class_index = np.argmax(prediction)
            predicted_class_label = action_labels[predicted_class_index]
            return {"prediction": predicted_class_label, "confidence": float(confidence)}
        else:
            return {"prediction": "", "confidence": float(confidence)}
            
    except Exception as e:
        return {"error": str(e)}
