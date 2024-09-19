## Overview

Welcome to the **Code Translation Tool**! In a landscape where translating code between programming languages is both frequent and complex, our tool stands out by automating the translation process while preserving code comments. This reduces errors, enhances productivity, and saves substantial time and cost for development teams.

### Key Features

- **Automated Translation**: Seamlessly translates code while preserving comments.
- **Contextual Accuracy**: Maintains the functionality and idiomatic practices of the target language.
- **Error Detection**: Integrated with IBM Watsonx for error detection and debugging.
- **Significant Time Savings**: Reduces translation and debugging time from 50 hours to 7 hours.
- **Cost Efficiency**: Saves approximately $2,150 per translation.

## Project Structure

```
├── backend
    ├── app.py

└── frontend
    ├── app.js
    ├── index.html
    └── styles.css
```

### Backend

The backend is built using Flask and includes:

- **`app.py`**: Main application file with routes for translation.

### Frontend

The frontend is developed with React and includes:

- **`app.js`**: Main React application file.
- **`index.html`**: HTML template.
- **`styles.css`**: Styling for the frontend.

## Getting Started

### Prerequisites

- Python 3.6 or higher
- Node.js
- IBM Watsonx API credentials (apikey, project id, model name)

### Installation

1. **Backend**

   Navigate to the `backend` directory and install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

2. **Frontend**

   Navigate to the `frontend` directory and install the required Node.js packages:
   ```bash
   npm install
   ```

### Configuration

1. **API Credentials**

   Update `app.py` with your IBM Watsonx credentials in the `get_credentials` function.

2. **Model Parameters**

   Configure the model parameters such as `model_id`, `decoding_method`, etc., in `app.py`.

### Running the Application

1. **Start Backend Server**

   From the `backend` directory, run:
   ```bash
   python app.py
   ```

2. **Start Frontend Server**

   From the `frontend` directory, run:
   ```bash
   npm start
   ```

## Usage

1. Open the application in your web browser.
2. Enter the source code into the source code textarea.
3. Select the target programming language from the dropdown menu.
4. Click "Translate" to receive the translated code with preserved comments.
5. Copy the translated code using the provided button.

## Example API Request

```json
POST /api/translate
{
  "sourceLanguage": "JavaScript",
  "targetLanguage": "Python",
  "sourceCode": "/* Sample JavaScript code */\nconsole.log('Hello World');"
}
```

## Notes

- Ensure that IBM Watsonx credentials and model parameters are correctly configured.
- The `reinsert_comments` function in `app.py` is a placeholder and should be customized based on specific use cases.


## Contact

For any issues or questions, please contact us at abdulhmeed446@gmail.com

---

