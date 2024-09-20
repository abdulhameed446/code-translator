from flask import Flask, request, jsonify
from flask_cors import CORS
from ibm_watsonx_ai.foundation_models import Model
import re

app = Flask(__name__)
CORS(app)

def get_credentials():
    return {
        "url": "https://us-south.ml.cloud.ibm.com",
        "apikey": "l4Vla5Y8Poa31RBIYMDCEDojK7O"
    }

model_id = "ibm/granite-34b-code-instruct"
parameters = {
    "decoding_method": "greedy",
    "max_new_tokens": 200,
    "stop_sequences": ["<end of translation>"],
    "repetition_penalty": 1.0
}

project_id = "e0a41fd7-bbea-43e7-a2bd-9ae9966966bd"

model = Model(
    model_id=model_id,
    params=parameters,
    credentials=get_credentials(),
    project_id=project_id
)

def extract_comments(code):
    """ Extract comments from the code. """
    return re.findall(r'(/\*.*?\*/|//.*?$)', code, re.DOTALL | re.MULTILINE)

def remove_comments(code):
    """ Remove comments from the code. """
    return re.sub(r'/\*.*?\*/|//.*?$','', code, flags=re.DOTALL | re.MULTILINE)

def reinsert_comments(code, comments):
    """ Reinsert comments into the code. This is a placeholder implementation. """
    return code  # Implement a more sophisticated method based on the specific use case.

@app.route('/api/translate', methods=['POST'])
def translate():
    data = request.get_json()
    target_language = data.get('targetLanguage')
    source_code = data.get('sourceCode')

    if not all([target_language, source_code]):
        return jsonify({'error': 'Missing required data'}), 400

    comments = extract_comments(source_code)
    code_without_comments = remove_comments(source_code)

    prompt_input = f"""
    You are an advanced code translator AI specialized in converting programming code from one language to another while maintaining the functionality, structure, and logic of the original code. You are proficient in Python, Java, C++, JavaScript, and other programming languages.

    You are tasked with translating the following code into {target_language}.
    Ensure that the translated code maintains the original code's functionality and logic.
    Do NOT include any explanations or comments—unless they are present in the original code.
    Adapt the syntax and language-specific features to suit the target language's best practices.
    If there are libraries or functions in source language that do not exist in {target_language}, suggest equivalent libraries or write custom functions.  
    Comment the translated code to highlight any areas where significant changes were made due to language differences.
    Optimize the translated code for both performance and readability.

    Input:
    {code_without_comments}

    Output:
    """


    try:
        generated_translation = model.generate_text(prompt=prompt_input)
        formatted_output = generated_translation.strip()

        # Optional: Remove any unwanted backticks or delimiters from the output
        formatted_output = formatted_output.replace('```', '').strip()

        # Reinsert comments into the translated code (customize this function as needed)
        final_output = reinsert_comments(formatted_output, comments)

        return jsonify({'targetCode': final_output})
    except Exception as e:
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
