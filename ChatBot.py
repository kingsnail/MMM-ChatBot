import json
import pvporcupine
from pvrecorder import PvRecorder

def readConfig():
    with open('config.json', 'r') as f:
        c = json.load(f)
    return c

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
            print("Detected " + config["picovoice"]["KeywordNames"][keyword_index])
            recorder.stop()
except KeyboardInterrupt:
    recorder.stop()
except Exception as e: 
    print("Something went wrong: ")
    print(e)
finally:
    porcupine.delete()
    recorder.delete()
