from fastapi import FastAPI

app = FastAPI()

@app.get('/api/search')
def search_via_api():
    pass