import json
import pvporcupine
from pvrecorder import PvRecorder

def readConfig():
    with open('config.json', 'r') as f:
        config = json.load(f)

config    = readConfig()
porcupine = pvporcupine.create(
    access_key   = config["picovoice"]["APIKey"],
    keyword_paths= config["picovoice"]["KeywordPaths"]
)

recorder = PvRecorder(device_index=-1,
                      frame_length=porcupine.frame_length
                     )
try:
    recorder.start()
    while True:
        keyword_index = porcupine.process(recorder.read())
        if keyword_index >= 0:
            print("Detected" + config["picovoice"]["KeywordNames"][keyword_index]
            recorder.stop()
