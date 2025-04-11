from dotenv import load_dotenv
from google import genai
import json
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def parse_input(txt):
    prompt = f"""
        You are a business decision parser.

        Your job is to interpret small business questions about hypothetical changes they want to make, and return a structured JSON object that can be used in a simulation engine.

        Your response must always be in valid JSON format.

        ---

        If the input is understandable and actionable, return an object like:

        {{
        "valid": true,
        "action_type": "price_change",
        "scope": "top_3_products",
        "magnitude": "+20%"
        }}

        If the input is vague, unclear, unsupported, or non-actionable (e.g. philosophical, open-ended, or off-topic), return:

        {{
        "valid": false,
        "reason": "Unrecognized or unsupported business action"
        }}

        ---

        Supported action types:
        - price_change
        - ad_budget_change
        - channel_shift
        - product_addition
        - product_removal
        - operating_hours_change
        - staff_change
        - bundle_creation
        - subscription_change
        - refund_policy_change
        - inventory_increase
        - location_change

        Supported scope examples:
        - top_3_products
        - all_products
        - channel:Facebook
        - channel:Email
        - day:Monday
        - day:Weekends
        - product:Coffee_Mug
        - location:NYC
        - staff:PartTime
        - subscription:Basic_Plan

        Supported magnitude formats:
        - "+15%", "-10%"
        - "+$500", "-$200"
        - "+2", "-1"
        - "new_bundle"
        - "new_product"

        ---

        Now interpret the following user input:

        "{txt}"

        Respond only with the resulting JSON object.
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

    return json.load(parsed_response)
