import json
import pvporcupine
from pvrecorder import PvRecorder
from elevenlabslib import *

def readConfig():
    with open('config.json', 'r') as f:
        c = json.load(f)
    return c

config    = readConfig()

voicename = config["elevenlabs"]["VoiceName"]
print("VoiceName = ", voicename)
user_11labs = ElevenLabsUser(config["elevenlabs"]["APIKey"])
voice       = user_11labs.get_voices_by_name(voicename)[0]  # This is a list because multiple voices can have the same name

porcupine = pvporcupine.create(
    access_key   = config["picovoice"]["APIKey"],
    keyword_paths= config["picovoice"]["KeywordPaths"]
)

recorder = PvRecorder(device_index=-1,
                      frame_length=porcupine.frame_length
                     )
try:
    while True:
        recorder.start()
        awaitingWakeWord = True
        while awaitingWakeWord:
            keyword_index = porcupine.process(recorder.read())
            if keyword_index >= 0:
                r = "Hello there, I just detected my wake word, " + config["picovoice"]["KeywordNames"][keyword_index]
                recorder.stop()
                awaitingWakeWord = False
                print(r)
                voice.generate_and_play_audio(r, playInBackground=False)

except KeyboardInterrupt:
    recorder.stop()
except Exception as e: 
    print("Something went wrong: ")
    print(e)
finally:
    porcupine.delete()
    recorder.delete()
