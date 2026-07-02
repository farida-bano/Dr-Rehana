from flask import Flask, render_template, request, jsonify
import json
import csv
from datetime import datetime
from pathlib import Path

app = Flask(__name__)

# Load questions
with open('questions.json', 'r') as f:
    questions = json.load(f)

# Results file
RESULTS_FILE = 'results.csv'

# Initialize CSV if doesn't exist
if not Path(RESULTS_FILE).exists():
    with open(RESULTS_FILE, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['Name', 'Email', 'Score', 'Total', 'Percentage', 'Timestamp'])

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

@app.route('/api/submit', methods=['POST'])
def submit_quiz():
    data = request.json
    name = data.get('name', 'Anonymous')
    email = data.get('email', 'unknown@example.com')
    answers = data.get('answers', {})

    # Calculate score
    score = 0
    for q in questions:
        q_id = str(q['id'])
        if q_id in answers:
            if answers[q_id] == q['correct']:
                score += 1

    total = len(questions)
    percentage = (score / total) * 100

    # Save to CSV
    with open(RESULTS_FILE, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([name, email, score, total, f"{percentage:.1f}%", datetime.now().strftime('%Y-%m-%d %H:%M:%S')])

    return jsonify({
        'success': True,
        'score': score,
        'total': total,
        'percentage': f"{percentage:.1f}%"
    })

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
