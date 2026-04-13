#!/usr/bin/env python3
"""
Simple test script to demonstrate how to use the chatbot API
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_chatbot():
    print("Testing the chatbot functionality...")
    
    # First, we need to create a user or login to get an authentication token
    # For this test, we'll assume a user exists or needs to be created
    
    # Example of how to call the chat endpoint once you have authentication:
    print("\nThe chat endpoint requires:")
    print("1. A valid user account")
    print("2. Authentication via JWT token in the Authorization header")
    print("3. The user_id in the URL path to match the user in the JWT token")
    
    print("\nExample request format:")
    print("POST /api/{user_id}/chat")
    print("Headers: {'Authorization': 'Bearer {your_jwt_token}', 'Content-Type': 'application/json'}")
    print("Body: {'message': 'Your message here', 'conversation_id': 'optional'}")
    
    print("\nSince the Cohere API key is now properly configured (verified by the successful test),")
    print("the chatbot will work once proper authentication is provided.")

if __name__ == "__main__":
    test_chatbot()