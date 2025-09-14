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
    # Add production domains when deployed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)