from src.create_app.create_app import create_app
import uvicorn

app = create_app()

if __name__ == "__main__":
    uvicorn.run("src.app:app", host="127.0.0.1", port=8000, reload=True)