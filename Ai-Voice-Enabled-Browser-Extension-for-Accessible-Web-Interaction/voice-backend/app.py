from flask import Flask, jsonify
from flask_cors import CORS
import speech_recognition as sr

app = Flask(__name__)
CORS(app)

recognizer = sr.Recognizer()

@app.route("/start")
def start():
    return jsonify({"status": "ready"})

@app.route("/stop")
def stop():
    return jsonify({"status": "stopped"})

@app.route("/get")
def get_command():
    try:
        with sr.Microphone() as source:
            print("🎤 Listening...")
            recognizer.adjust_for_ambient_noise(source, duration=0.3)
            audio = recognizer.listen(source, timeout=5, phrase_time_limit=5)

        text = recognizer.recognize_google(audio).lower()
        print("🗣️ You said:", text)

        return jsonify({"command": text})

    except Exception:
        return jsonify({"command": ""})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
