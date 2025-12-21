# File Conversion Platform

A professional file conversion website built with React and Spring Boot.

## Prerequisites

- Java 17+
- Maven 3.6+
- Node.js 18+

## Project Structure

- `backend/`: Spring Boot application (Java)
- `frontend/`: React application (Vite)

## Setup & Run

### Backend

1. Navigate to the `backend` directory.
2. Run the application using Maven:
   ```bash
   mvn spring-boot:run
   ```
   The server will start on `http://localhost:8080`.

### Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Features

- **Image to PDF**: Convert JPG/PNG images to PDF format.
- **Drag & Drop**: Easy file upload interface.
- **Secure**: Files are processed in memory and not permanently stored.

## Troubleshooting

### "mvn is not recognized"
If you see this error, you need to install Maven and add it to your system PATH.
1. Download Maven from https://maven.apache.org/download.cgi
2. Extract it to a folder (e.g., `C:\Program Files\Maven`).
3. Add the `bin` folder to your Environment Variables -> Path. 
