from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import joblib
import numpy as np
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

model = load_model('../model-training/models/frozen_dessert_rnn_model.keras')
scaler = joblib.load('../model-training/models/frozen_dessert_rnn_scaler.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    recent_values = data.get("recent_production", [])

    if len(recent_values) != 12:
        return jsonify({"error": "Input must contain exactly 12 values"}), 400

    input_array = np.array(recent_values).reshape(-1, 1)
    scaled_input = scaler.transform(input_array)
    model_input = scaled_input.reshape(1, 12, 1)

    prediction_scaled = model.predict(model_input)
    prediction = scaler.inverse_transform(prediction_scaled)

    return jsonify({
        "next_month_prediction": float(prediction[0][0])
    })

if __name__ == '__main__':
    app.run(debug=True)
