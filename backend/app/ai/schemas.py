from typing import Literal
from pydantic import BaseModel, Field

class AITaskExtractionRequest(BaseModel):
    text: str = Field(min_length=1, max_length=5000)

class AITaskSuggestion(BaseModel):
    title: str = Field(description="A short, actionable task title")
    description: str | None = Field(
        description="Additional task details, or null if unavailable"
    )
    priority: Literal["low", "medium", "high"]


class AITaskExtractionResponse(BaseModel):
    tasks: list[AITaskSuggestion]