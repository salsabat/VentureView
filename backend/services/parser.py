from dotenv import load_dotenv
from google import genai
import json
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def parse_input(txt):
    prompt = f"""
        You are a forecasting intent parser for a business analytics tool.

        Your job is to extract structured forecast instructions from a user's question. Always respond with JSON in the following format:

        {{
        "valid": true,
        "product": <string or null>,
        "target": "revenue",
        "horizon": <number of days into the future>
        }}

        If the request cannot be parsed or is unrelated to forecasting, return:

        {{
        "valid": false,
        "reason": "..."
        }}

        Default to 30 days if the user does not specify a time horizon.
        Default to null for "product" if the user does not specify a product.

        Here are some examples:

        ---

        User input: "Forecast sales for Coffee Mug"
        Output:
        {{
        "valid": true,
        "product": "Coffee Mug",
        "target": "revenue",
        "horizon": 30
        }}

        User input: "What will revenue look like for the next 60 days?"
        Output:
        {{
        "valid": true,
        "product": null,
        "target": "revenue",
        "horizon": 60
        }}

        User input: "Should I hire more staff?"
        Output:
        {{
        "valid": false,
        "reason": "Question is not about forecasting"
        }}

        ---

        Now interpret the following user input:

        "{txt}"

        Respond only with the JSON.
        """

    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=prompt
    ).text

    try:
        parsed_response = response[(
            response.find('{')):(response.find('}')) + 1]
    except Exception as e:
        return {
            "valid": False,
            "reason": f"Parser error: {str(e)}"
        }

    return json.loads(parsed_response)


def explain_forecast(product, forecast, horizon):
    prompt = f"""
        You are a business analyst.

        A user has uploaded sales data for the product "{product}" and requested a {horizon}-day forecast.

        You were given this forecast:

        {forecast}

        Please provide a clear and concise business-style summary of the forecast. Mention:
            - Whether sales are expected to increase or decrease
            - Any peaks or drops
            - The general trend

        Return only the explanation text, no bullet points or headings.
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=prompt
    ).text
    return response.text.strip()
