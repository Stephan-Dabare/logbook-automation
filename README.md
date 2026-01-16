# Log Book Automation

## Overview
Log Book Automation is an AI-powered platform designed to streamline the process of academic log book management for students and supervisors. It leverages large language models (LLMs) to generate summaries, professional comments, and automate reporting, making log book creation and review efficient and user-friendly.

## Features
- **Student Portal**: Upload log book entries, generate AI-powered summaries, and submit reports for supervisor review.
- **Supervisor Portal**: Review student submissions, add comments, and finalize reports with professional feedback.
- **AI Summaries**: Uses Ollama LLM to generate activity numbers and supervisor comments based on student tasks.
- **Excel Export**: Generates downloadable Excel log books with formatted entries and supervisor signatures.
- **Modern Frontend**: React-based interface for seamless user experience.

## Technologies Used
- **Backend**: Python, FastAPI, SQLAlchemy, OpenPyXL
- **Frontend**: React, Vite
- **AI Integration**: Ollama LLM (configurable model)
- **Database**: SQLite

## Installation
### Prerequisites
- Python 3.11+
- Node.js & npm
- Ollama LLM running locally (default: gemma3:4b)

### Backend Setup
1. Install Python dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
2. Ensure `logbook.db` and `my_record_book.xlsx` are present in the project root.
3. Place your supervisor signature image as `signature.png` in the root directory.
4. Start the backend server:
   ```powershell
   python main.py
   ```

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```powershell
   cd frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the frontend:
   ```powershell
   npm run dev
   ```

### Ollama LLM Setup
- Ensure Ollama is running locally and accessible at `http://localhost:11434`.
- The default model is `gemma3:4b`. You can change this in `scripts/app.py` and related backend files.

## Usage
### Student Workflow
1. Log in as a student.
2. Upload your log book Excel file and specify the date range.
3. Review AI-generated summaries and submit for supervisor review.
4. Download the preview or finalized log book as an Excel file.

### Supervisor Workflow
1. Log in as a supervisor.
2. View pending student submissions.
3. Add comments, approve, and finalize reports.
4. Download the finalized log book with signature and comments.

## File Structure
- `main.py`: FastAPI backend server
- `log_generator.py`: Excel file generation and AI integration
- `database.py`, `models.py`: Database models and access
- `scripts/app.py`: Utility scripts for Excel and AI
- `frontend/`: React frontend
- `my_record_book.xlsx`: Excel template
- `signature.png`: Supervisor signature image

## Configuration
- Update model and host in `scripts/app.py` if using a different Ollama model or endpoint.
- Ensure all required files are present in the root directory.

## Running the App
- Use `start_app.bat` for quick startup (if configured).
- Alternatively, start backend and frontend separately as described above.

## Contributing
Pull requests and suggestions are welcome. Please open an issue for major changes.

## License
MIT License

## Contact
For questions or support, contact the project maintainer.

