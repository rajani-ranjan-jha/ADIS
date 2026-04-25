from fastapi import FastAPI

app = FastAPI()

@app.get('/api/automate')
def automation():
    # TODO take the output from intent classifier and implement the right automation. combine all the separate functions working together
    pass