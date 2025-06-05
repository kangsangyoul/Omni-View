# Omni-View

This project is separated into two parts:

- **backend/** – FastAPI server
- **frontend/** – React application

## Running the backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Running the frontend
```bash
cd frontend
npm install
npm start
```

The frontend is available at `http://localhost:3000` and the API server at `http://localhost:8000`.
