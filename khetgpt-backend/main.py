from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.api import api_router

app = FastAPI(
    title="KhetGPT API",
    description="Backend API for KhetGPT agricultural monitoring platform",
    version="0.1.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",  # React development server
    "http://localhost:3002",  # Alternative port if needed
    "http://localhost:5000",  # Production build served locally
    "*"  # Allow all origins for Railway deployment (restrict in production)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for Railway deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to KhetGPT API. Visit /docs for API documentation."}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)