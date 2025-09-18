import React, { useState } from "react";
import axios from "axios";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const App = () => {
  const [inputs, setInputs] = useState([
    110.5, 115.2, 112.3, 118.0, 120.5, 125.3,
    123.1, 128.6, 130.7, 129.4, 131.0, 132.5,
  ]);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState([]);

  const handleChange = (value, index) => {
    const updated = [...inputs];
    updated[index] = value;
    setInputs(updated);
    setTouched((prev) => [...new Set([...prev, index])]);
  };

  const handleSubmit = async () => {
    const numericInputs = inputs.map(Number);

    if (numericInputs.some(isNaN)) {
      setError("❗ Please enter valid numbers for all 12 months.");
      setPrediction(null);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:5000/predict", {
        recent_production: numericInputs,
      });

      setPrediction(res.data.next_month_prediction.toFixed(2));
      setError("");
    } catch (err) {
      console.error(err);
      setError("🚫 Failed to fetch prediction. Please try again.");
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4 py-10">
      <div className="w-full max-w-4xl bg-white/30 backdrop-blur-md shadow-xl rounded-2xl p-10 border border-white/60">
        <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-4 tracking-tight">
          🍦 Frozen Dessert Production Predictor
        </h1>
        <p className="text-gray-700 text-center mb-8 text-sm md:text-base">
          Input your monthly production figures (in millions of gallons) to forecast the next month.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mb-6">
          {inputs.map((value, idx) => {
            const isInvalid = touched.includes(idx) && isNaN(Number(value));
            return (
              <div key={idx} className="relative">
                <input
                  id={`month-${idx}`}
                  type="number"
                  inputMode="decimal"
                  value={value}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  className={`peer w-full px-3 pt-5 pb-2 text-sm rounded-lg border transition duration-200 outline-none focus:ring-2 ${
                    isInvalid
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-300 focus:ring-blue-400"
                  }`}
                  placeholder=" "
                  aria-label={`Production for ${monthNames[idx]}`}
                />
                <label
                  htmlFor={`month-${idx}`}
                  className="absolute left-3 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
                >
                  {monthNames[idx]}
                </label>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`inline-flex items-center gap-2 px-6 py-2 text-white font-semibold rounded-lg transition duration-200 shadow-sm ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 000 16v4l3.5-3.5L12 20v-4a8 8 0 01-8-8z"
                  ></path>
                </svg>
                Predicting...
              </>
            ) : (
              <>
                🔮 Predict Next Month
              </>
            )}
          </button>
        </div>

        {prediction && (
          <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-lg text-center text-lg font-semibold">
            📈 Next Month’s Forecast: <span className="text-green-800">{prediction}M gallons</span>
          </div>
        )}
      </div>
    </main>
  );
};

export default App;
