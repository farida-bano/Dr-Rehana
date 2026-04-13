from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import tasks, auth

app = FastAPI(title="Todo API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, configure specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(tasks.router, prefix="/api", tags=["tasks"])
app.include_router(auth.router, prefix="/api", tags=["auth"])

@app.get("/")
def read_root():
    return {"message": "Todo API is running!"}