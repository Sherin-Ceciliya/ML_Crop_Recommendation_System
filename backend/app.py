from flask import Flask, request, jsonify
import numpy as np
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend to communicate with backend

# Load trained model and scaler
model = joblib.load("crop_recommendation_model.pkl")
scaler = joblib.load("scaler.pkl")

# Crop Dictionary
crop_dict = {
    1: "Rice", 2: "Maize", 3: "Jute", 4: "Cotton", 5: "Coconut",
    6: "Papaya", 7: "Orange", 8: "Apple", 9: "Muskmelon", 10: "Watermelon",
    11: "Grapes", 12: "Mango", 13: "Banana", 14: "Pomegranate",
    15: "Lentil", 16: "Blackgram", 17: "Mungbean", 18: "Mothbeans",
    19: "Pigeonpeas", 20: "Kidneybeans", 21: "Chickpea", 22: "Coffee"
}

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get input data from frontend
        data = request.json
        features = np.array([[data["N"], data["P"], data["K"], data["temperature"], 
                              data["humidity"], data["ph"], data["rainfall"]]])
        
        # Scale the input data
        transformed_features = scaler.transform(features)
        
        # Predict crop recommendation
        prediction = model.predict(transformed_features)
        predicted_crop = crop_dict.get(prediction[0], "Unknown")

        return jsonify({"recommended_crop": predicted_crop})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

