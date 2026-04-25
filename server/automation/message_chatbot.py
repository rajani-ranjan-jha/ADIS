import requests
import os
import json
# from dotenv import load_dotenv
from config.config import GROQ_API_KEY, GEMINI_API_KEY


# load_dotenv()

SYSTEM_PROMPT = """You are a very intelligent and adaptive assistant. Be concise and to the point. Your task is to identify the tone of the user and respond in that way. Suppose user is just asking a general questions. You have to be very casual. If he is asking questions about some critical thinking. You have to be very serious. Suppose he is asking about some serious topic. You have to be very professional. Suppose he is asking about some jokes or memes. You have to be very funny."""

def groqAPI(prompt: str) -> dict:
    
    try:
        # GROQ_API_KEY = os.getenv("GROQ_API_KEY")
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json",
        }
        data = {
            "model": "llama-3.1-8b-instant",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 100,
            "temperature": 0.7,
        }
        response = requests.post(url, headers=headers, data=json.dumps(data))
        data = response.json()
        return data['choices'][0]['message']['content']
    except Exception as e:
        return str(e)


def geminiAPI(prompt: str) -> dict:
    try:
        # GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
        if not GEMINI_API_KEY:
            return "GEMINI_API_KEY is not set"
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=" + GEMINI_API_KEY
        # prompt = SYSTEM_PROMPT + "\n Question: " + prompt
        data = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        }
        response = requests.post(url, headers={"Content-Type": "application/json"}, data=json.dumps(data))
        data = response.json()
        print(data)
        return data['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        return str(e)


def handle_message_chatbot(message: str) -> str:
    return geminiAPI(message)

# if __name__ == "__main__":
#     print(groqAPI("what is programming. explain in short terms?"))
#     # print(geminiAPI("Can AI overtake humans in the future? what would you say based on the current inventment and development?"))
#     # print('all are working fine!  ')