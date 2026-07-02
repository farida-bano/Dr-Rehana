from flask import Flask, render_template, request, jsonify
import json
import csv
from datetime import datetime
from pathlib import Path
import os

app = Flask(__name__)

# Get the directory of the app file
APP_DIR = os.path.dirname(os.path.abspath(__file__))

# Load questions
with open(os.path.join(APP_DIR, 'questions.json'), 'r') as f:
    questions = json.load(f)

# Results file
RESULTS_FILE = os.path.join(APP_DIR, 'results.csv')

# Initialize CSV if doesn't exist
if not Path(RESULTS_FILE).exists():
    with open(RESULTS_FILE, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['Name', 'Email', 'Score', 'Total', 'Percentage', 'Grade', 'Timestamp'])

@app.route('/')
def index():
    return render_template('quiz.html', total_questions=len(questions))

@app.route('/api/questions')
def get_questions():
    # Return questions without answers (for security)
    safe_questions = []
    for q in questions:
        safe_q = {
            'id': q['id'],
            'question': q['question'],
            'options': q['options']
        }
        safe_questions.append(safe_q)
    return jsonify(safe_questions)

def get_grade(percentage):
    """Convert percentage to letter grade"""
    if percentage >= 90:
        return 'A'
    elif percentage >= 80:
        return 'B'
    elif percentage >= 70:
        return 'C'
    elif percentage >= 60:
        return 'D'
    else:
        return 'F'

@app.route('/api/submit', methods=['POST'])
def submit_quiz():
    try:
        data = request.json
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400

        name = data.get('name', 'Anonymous').strip()
        email = data.get('email', 'unknown@example.com').strip()
        answers = data.get('answers', {})

        # Validate inputs
        if not name or len(name) > 100:
            return jsonify({'success': False, 'error': 'Invalid name'}), 400
        if not email or len(email) > 100:
            return jsonify({'success': False, 'error': 'Invalid email'}), 400

        # Calculate score
        score = 0
        for q in questions:
            q_id = str(q['id'])
            if q_id in answers:
                if answers[q_id] == q['correct']:
                    score += 1

        total = len(questions)
        percentage = (score / total) * 100
        grade = get_grade(percentage)

        # Save to CSV
        with open(RESULTS_FILE, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([name, email, score, total, f"{percentage:.1f}%", grade, datetime.now().strftime('%Y-%m-%d %H:%M:%S')])

        return jsonify({
            'success': True,
            'score': score,
            'total': total,
            'percentage': f"{percentage:.1f}%",
            'grade': grade
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/results')
def view_results():
    results = []
    if Path(RESULTS_FILE).exists():
        with open(RESULTS_FILE, 'r') as f:
            reader = csv.DictReader(f)
            results = list(reader)
    return render_template('results.html', results=results)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
