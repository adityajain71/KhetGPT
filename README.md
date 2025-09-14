# KhetGPT - Agricultural Monitoring Platform

KhetGPT is a comprehensive agricultural monitoring platform designed to help farmers monitor crop health, detect diseases, and optimize farm operations.

## Project Structure

The project consists of two main components:

1. **Frontend (khedgpt-frontend)**: React/TypeScript application with crop disease detection and monitoring features
2. **Backend (khetgpt-backend)**: FastAPI Python backend with machine learning models for crop disease prediction

## Features

- Crop disease detection with image analysis
- User authentication and account management
- Dark/Light mode support
- Mobile responsive design

## Tech Stack

### Frontend
- React.js with TypeScript
- React Bootstrap for UI components
- Axios for API communication
- Context API for state management

### Backend
- FastAPI (Python)
- SQLAlchemy for database operations
- TensorFlow for machine learning models
- JWT authentication

## Running the Application

### Backend

`ash
cd khetgpt-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
`

The backend server will start on http://localhost:8000

### Frontend

`ash
cd khedgpt-frontend
npm install
npm start
`

The frontend development server will start on http://localhost:3000

## Demo Credentials

For testing purposes, you can use the following credentials:

- Email: demo@khetgpt.com
- Password: password
