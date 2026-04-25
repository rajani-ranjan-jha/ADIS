from fastapi import APIRouter, Response
from voice.piperTTS import speak as piper_speak
from pydantic import BaseModel

router = APIRouter()

class SpeakRequest(BaseModel):
    text: str

@router.get('/api/voice/listen')
def listen_voice():
    from voice.fasterWhisper import record_audio, transcribe
    try:
        audio = record_audio(duration=20)
        result = transcribe(audio)
        # print("result: ",result)
        return {"text": result}
    except Exception as e:
        return {"error": str(e)}

@router.post('/api/voice/speak')
def speak(request: SpeakRequest):
    try:
        print("request: ",request)
        audio_data = piper_speak(request.text, play=True)
        return {"status": "success"}
    except Exception as e:
        print("error in speak: ",e)
        return {"error": e}

