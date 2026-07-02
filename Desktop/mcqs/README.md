# 🤖 AI Agent Factory - MCQ Quiz System

Ek simple MCQ quiz system jo 20 students ke liye tayyar hay.

## Setup Instructions

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Run the Server
```bash
python app.py
```

Server localhost:5000 par start ho jayega.

### Step 3: Access the Quiz

**Students ke liye:**
- Browser mein jao: `http://localhost:5000`
- Apna naam aur email dalo
- Quiz solve karo
- Results submit karo

**Results dekhnay ke liye:**
- `http://localhost:5000/results` par jao
- Sab students ke scores dekho
- Print bhi kar sakte ho

## Files Structure

```
mcqs/
├── app.py                 # Flask backend
├── questions.json         # 20 MCQs (JSON format)
├── requirements.txt       # Python dependencies
├── results.csv           # Students ke results (auto-generated)
└── templates/
    ├── quiz.html         # Student quiz interface
    └── results.html      # Results dashboard
```

## Features

✅ 20 Multiple Choice Questions  
✅ Student name aur email collection  
✅ Real-time progress tracking  
✅ Automatic scoring  
✅ Results dashboard  
✅ Print results  
✅ CSV export (results.csv)  

## Database (CSV)

Results automatically `results.csv` file mein save hoti hain:
- Student Name
- Email
- Score
- Total (20)
- Percentage
- Timestamp

## Tips

- MCQs ko change mat karna - sirf `questions.json` mein options hain
- Har student ke liye browser tab alag kholo
- Results har submission ke baad update hoti hain
- Offline mode mein bhi kaam karta hai (local only)

## Troubleshooting

**Port 5000 busy hay?**
```bash
python app.py --port 5001
```

**Templates not found error?**
- `templates` folder zaroor hona chahiye
- Dono HTML files templates/ mein hona chahiye

## Total Questions: 20

Chapters cover:
- FTE aur AI-Native Companies
- Five-Layer Cake of AI
- Critical Elements
- Mode 1 vs Mode 2
- Ecosystem Architecture
- 10-80-10 Rule
- System of Records
- Reader Types
- Cloud-Native Technologies

---

**Tayyar hai! Start karo:** `python app.py`
