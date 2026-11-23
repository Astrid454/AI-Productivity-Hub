from fastapi import APIRouter, HTTPException, Depends
from app.database.models import User
from app.security.dependencies import get_current_user


from app.ai.schemas import (
    AITaskExtractionRequest,
    AITaskExtractionResponse,
)

from app.ai.task_extractor import extract_tasks

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/extract-tasks", response_model=AITaskExtractionResponse)
def extract_tasks_endpoint(
        request: AITaskExtractionRequest,
        current_user: User = Depends(get_current_user),
) -> AITaskExtractionResponse:

    try:
        return extract_tasks(request.text)
    except Exception:
        raise HTTPException(status_code=502, detail="AI task extraction failed")