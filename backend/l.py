import pickle

with open("backend/krishnav.pkl", "rb") as f:
    label_encoder = pickle.load(f)

print(label_encoder.classes_)
