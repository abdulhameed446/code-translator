from flask import Flask, request, jsonify
from flask_cors import CORS
from ibm_watsonx_ai.foundation_models import Model
import re

app = Flask(__name__)
CORS(app)

def get_credentials():
    return {
        "url": "https://us-south.ml.cloud.ibm.com",
        "apikey": "UxfTEtxongzcajN1Sl4Vla5Y8Poa31RBIYMDCEDojK7O"
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
    Translate the following code snippet into {target_language} with the utmost precision. Ensure that the translated code retains the original functionality and adheres to {target_language}'s idiomatic programming practices. All comments from the original code should be accurately preserved in their respective places, reflecting their original meaning and context. The output should be a clean code snippet without any extraneous delimiters, backticks, or code block indicators.

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
