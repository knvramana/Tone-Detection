from subprocess import run, PIPE

from flask import Flask, render_template, request

from logger import logging

import pyaudio
import wave
import pyttsx3

import librosa
import numpy as np


chunk = 1024  # Record in chunks of 1024 samples
sample_format = pyaudio.paInt16  # 16 bits per sample
channels = 2
fs = 44100  # Record at 44100 samples per second
seconds = 8
frames = []  

p = pyaudio.PyAudio() 

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/static', methods=['GET'])
def audio():
    with open('outputwavfromblob.wav', 'wb') as f:
        f.write(request.data)
    audio_data = 'outputwavfromblob.wav'	
    x , sr = librosa.load(audio_data)
    librosa.load(audio_data, sr=44100)
    result= np.percentile(x,95)
    print(" ")
    print("Tone value is=",result )
    print(" ")
    engine = pyttsx3.init() 
  
# testing 
    if result < 0.01 :
            print ("This voice tone = Whisper")
            engine.say("You spoke in Whisper")
            engine.runAndWait() 
    elif result >0.01 and result< 0.05:
            print ("This voice tone = Soft")
            engine.say("You spoke in Soft Tone")
            engine.runAndWait() 
    elif result > 0.05:
            print ("This voice tone = Loud")
            engine.say("You spoke in Loud Tone")
            engine.runAndWait()			 
    proc = run(['ffprobe', '-of', 'default=noprint_wrappers=1', 'outputwavfromblob.wav'], text=True, stderr=PIPE)


if __name__ == "__main__":
    app.logger = logging.getLogger('audio-gui')
    app.run(debug=True)