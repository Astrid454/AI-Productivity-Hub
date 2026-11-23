from app.ai.task_extractor import extract_tasks

text = (
    "Tomorrow I need to finish my React project "
    "and email my professor."
)

result = extract_tasks(text)

for task in result.tasks:
    print("Title: ", task.title)
    print("Description: ", task.description)
    print("Priority: ", task.priority)
    print("---")