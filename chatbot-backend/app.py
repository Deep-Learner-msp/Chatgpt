import os
import openai
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

openai.api_key = "" ##enter api key

def get_chatbot_response(user_query):
    prompt = [
        {"role": "system", "content": "you are a helpful assistant"},
        {"role": "user", "content": user_query}
    ]

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=prompt,
        n=4,
        max_tokens=1024,
        temperature=0.6
    )

    response = completion['choices'][0]['message']['content']
    return response

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_query = data.get('user_query')
    if not user_query:
        return jsonify({"error": "Invalid request"}), 400

    response = get_chatbot_response(user_query)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

