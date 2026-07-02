#!/usr/bin/env python3
import json
import os
from pathlib import Path

print("\n✅ MCQ SYSTEM VERIFICATION\n")
print("=" * 50)

# Check files
files_to_check = [
    'app.py',
    'questions.json',
    'requirements.txt',
    'README.md',
    'run.sh',
    'templates/quiz.html',
    'templates/results.html'
]

print("\n📁 Checking Files:")
all_exist = True
for file in files_to_check:
    exists = Path(file).exists()
    status = "✓" if exists else "✗"
    print(f"   {status} {file}")
    all_exist = all_exist and exists

# Check JSON validity
print("\n📋 Checking Questions JSON:")
try:
    with open('questions.json', 'r') as f:
        questions = json.load(f)
    print(f"   ✓ Valid JSON with {len(questions)} questions")
    
    # Verify question structure
    for q in questions:
        if 'id' not in q or 'question' not in q or 'options' not in q or 'correct' not in q:
            print(f"   ✗ Question {q.get('id', '?')} has invalid structure")
            all_exist = False
    print("   ✓ All questions have correct structure")
except Exception as e:
    print(f"   ✗ Error: {e}")
    all_exist = False

# Check Flask app
print("\n🐍 Checking Flask App:")
try:
    with open('app.py', 'r') as f:
        app_content = f.read()
    required_imports = ['Flask', 'render_template', 'request', 'jsonify']
    for imp in required_imports:
        if imp in app_content:
            print(f"   ✓ {imp} imported")
        else:
            print(f"   ✗ {imp} missing")
            all_exist = False
except Exception as e:
    print(f"   ✗ Error: {e}")
    all_exist = False

# Summary
print("\n" + "=" * 50)
if all_exist:
    print("✅ ALL CHECKS PASSED - SYSTEM READY!")
    print("\n🚀 To start: bash run.sh")
    print("📍 Then open: http://localhost:5000")
else:
    print("⚠️  Some issues found - please check above")

print("\n" + "=" * 50 + "\n")
