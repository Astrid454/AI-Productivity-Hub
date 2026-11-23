from app.ai.openai_client import get_openai_client
from app.ai.schemas import AITaskExtractionResponse

def extract_tasks(text: str) -> AITaskExtractionResponse:
    client = get_openai_client()

    response = client.responses.parse(
        model="gpt-4.1-mini",
        instructions=(
            "You are a task extraction assistant. "
            "Extract only actionable tasks explicitly supported by the user's text. "
            "Give each task a short, clear title and a useful description "
            "when details are available; otherwise use null. "
            "Suggest a priority: low, medium, or high. "
            "Do not invent tasks, deadlines, or missing details. "
            "If there are no actionable tasks, return an empty list."
        ),
        input=text,
        text_format=AITaskExtractionResponse
    )

    if response.output_parsed is None:
        raise ValueError("The AI did not return a valid task extraction.")

    return response.output_parsed