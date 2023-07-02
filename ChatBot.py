import traceback
import json
import pvporcupine
from pvrecorder import PvRecorder
from elevenlabs import generate, play, set_api_key

def readConfig():
    with open('config.json', 'r') as f:
        c = json.load(f)
    return c

config    = readConfig()

set_api_key(config["elevenlabs"]["APIKey"])
voicename = config["elevenlabs"]["VoiceName"]
audio = generate(
  text = "Hi! My name is Bella, nice to meet you!",
  voice = voicename,
  model = "eleven_monolingual_v1"
)

play(audio)

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
                audio = generate(
                    text = r,
                    voice = voicename,
                    model = "eleven_monolingual_v1"
                )
                play(audio)

except KeyboardInterrupt:
    recorder.stop()
except Exception as e: 
    print("Something went wrong: ")
    print(e)
    traceback.print_exc()
finally:
    porcupine.delete()
    recorder.delete()
