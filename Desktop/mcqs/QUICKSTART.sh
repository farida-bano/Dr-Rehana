#!/bin/bash

# Quick Start Guide for MCQ Quiz System

cat << "EOF"

╔════════════════════════════════════════════════════════════════╗
║   🤖 AI Agent Factory - MCQ Quiz System                       ║
║   20 Questions | 20 Students | Simple & Fast                  ║
╚════════════════════════════════════════════════════════════════╝

📋 SYSTEM READY!

✅ Files Created:
   - app.py (Flask backend)
   - questions.json (20 MCQs)
   - templates/quiz.html (Student interface)
   - templates/results.html (Results dashboard)
   - requirements.txt (Dependencies)
   - README.md (Full documentation)

═══════════════════════════════════════════════════════════════

🚀 HOW TO RUN:

Option 1 - Using run.sh (Recommended):
   bash run.sh

Option 2 - Manual:
   python3 app.py

═══════════════════════════════════════════════════════════════

📱 ACCESS POINTS:

👨‍🎓 Students Take Quiz:
   http://localhost:5000

📊 View Results Dashboard:
   http://localhost:5000/results

📋 API Endpoints:
   GET  /api/questions     → Get all questions
   POST /api/submit        → Submit answers

═══════════════════════════════════════════════════════════════

📊 FEATURES:

✓ 20 Multiple Choice Questions (from AI Agent Factory book)
✓ Student info collection (Name & Email)
✓ Real-time progress tracking
✓ Auto-scoring system
✓ Results dashboard with statistics
✓ Print results functionality
✓ CSV export (results.csv)
✓ Average score calculation
✓ Highest score tracking

═══════════════════════════════════════════════════════════════

📝 STUDENT WORKFLOW:

1. Open http://localhost:5000
2. Enter Name & Email
3. Click "Start Quiz"
4. Answer 20 questions (can navigate back/forward)
5. Submit quiz
6. See immediate score & percentage
7. Results saved to results.csv

═══════════════════════════════════════════════════════════════

👨‍🏫 TEACHER VIEW:

1. Go to http://localhost:5000/results
2. See all student submissions
3. View statistics (Total Students, Average Score, Highest Score)
4. See individual scores & percentages
5. Print or export results

═══════════════════════════════════════════════════════════════

📂 FILE STRUCTURE:

mcqs/
├── app.py                    # Flask application
├── questions.json            # 20 MCQs (JSON format)
├── requirements.txt          # Python dependencies
├── run.sh                    # Easy run script
├── README.md                 # Full documentation
├── QUICKSTART.sh             # This file
├── results.csv              # Student results (auto-created)
└── templates/
    ├── quiz.html            # Quiz interface
    └── results.html         # Results page

═══════════════════════════════════════════════════════════════

⚙️ CUSTOMIZATION:

Change Questions:
   Edit questions.json (keep format same)

Change Number of Questions:
   - Modify questions.json
   - Update quiz.html if needed
   - Update app.py scoring logic

Change Styling:
   - Edit templates/quiz.html (CSS section)
   - Edit templates/results.html (CSS section)

═══════════════════════════════════════════════════════════════

🔍 MONITORING:

Check results anytime:
   cat results.csv

View in Excel/Sheets:
   Open results.csv in your spreadsheet app

Backup results:
   cp results.csv results_backup_$(date +%Y%m%d).csv

═══════════════════════════════════════════════════════════════

✨ Ready? Start here:

   bash run.sh

Then open: http://localhost:5000

═══════════════════════════════════════════════════════════════

Questions? Check README.md

EOF
