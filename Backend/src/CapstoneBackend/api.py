from ninja import NinjaAPI
from django.http import JsonResponse
import json
import os
from email.message import EmailMessage
import ssl
import smtplib
import django
from api.models import *

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "CapstoneBackend.settings")
django.setup()


api = NinjaAPI()

@api.get("/hello")
def hello(request):
    print(request)
    return {"message": "Hello Word"}

@api.post("/users/reviewer")
def users(request):
    body = request.body.decode('utf-8')
    email = json.loads(body)
    User.objects.create(username= body, role = "reviewer")
    print(body)
    return {"message": "Success"}

@api.post("/users/studio/{email}")
def users(request, email: str):
    query = {"username": email, "role": "reviewer"}
    User.objects.create(username= email, role = "studio")
    print(email)
    return {"message": "Success"}

#Post request to create survey. UserId Must exist in User Table and SurveyId Must be unique
@api.post("/survey")
def create_survey_entry(request):
    body = json.loads(request.body.decode('utf-8'))
    
    user_id = body.get("user_Id")
    survey_id = body.get("survey_Id")
    film_name = body.get("film_name")
    video_url = body.get("videoUrls")

    # Assuming `user_id` is the correct field in User model
    try:
        user = User.objects.get(user_id=user_id)  # Retrieve the User instance using `user_id`
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    Survey.objects.create(survey_id=survey_id, film_name=film_name, video_url=video_url, user_id=user_id)

    # Print to verify (remove in production)
    print(f"User ID: {user_id}, Film Name: {film_name}, Video URL: {video_url}")
    return JsonResponse({"message": "Survey Entry Created", "data": body})

#Delete request to delete survey from table using survey id 
@api.delete("/survey/{survey_id}")
def delete_survey_entry(request, survey_id: int):
    try:
        survey = Survey.objects.get(survey_id=survey_id)  # Retrieve the Survey instance
        survey.delete()  # Delete the survey from the database
        return {"message": f"Survey with ID {survey_id} deleted successfully"}
    except Survey.DoesNotExist:
        return JsonResponse({"error": "Survey not found"}, status=404)


#Post request for custom-questions-answers
@api.post("/custom-question-answers")
def create_custom_question_answer(request):
    body = json.loads(request.body.decode('utf-8'))

    user_id = body.get("user_id")
    survey_id = body.get("survey_id")
    question_id = body.get("question_id")
    answer = body.get("answer")

    # Retrieve User, Survey, and Question instances
    try:
        user = User.objects.get(user_id=user_id)
        survey = Survey.objects.get(survey_id=survey_id)
        question = Question.objects.get(question_id=question_id)  # Corrected to use question_id
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    except Survey.DoesNotExist:
        return JsonResponse({"error": "Survey not found"}, status=404)
    except Question.DoesNotExist:
        return JsonResponse({"error": "Question not found"}, status=404)

    # Create CustomQuestionAnswer entry
    custom_answer = CustomQuestionAnswer.objects.create(
        user=user,
        survey=survey,
        question=question,
        answer=answer
    )

    return JsonResponse({
        "message": "Custom Question Answer created successfully",
        "data": {
            "user_id": user_id,
            "survey_id": survey_id,
            "question_id": question_id,
            "answer": answer
        }
    }, status=201)

# GET Method to retrieve all CustomQuestionAnswer entries
@api.get("/custom-question-answers")
def get_all_custom_question_answers(request):
    custom_answers = CustomQuestionAnswer.objects.all().values(
        "user__user_id", "survey__survey_id", "question__question_id", "answer"
    )
    return JsonResponse({"custom_answers": list(custom_answers)})

# GET Method to retrieve CustomQuestionAnswer entries based on filters ()
@api.get("/custom-question-answers/filter") 
def get_filtered_custom_question_answers(request, user_id: int = None, survey_id: int = None, question_id: int = None):
    filters = {}
    
    if user_id is not None:
        filters["user__user_id"] = user_id
    if survey_id is not None:
        filters["survey__survey_id"] = survey_id
    if question_id is not None:
        filters["question__question_id"] = question_id

    custom_answers = CustomQuestionAnswer.objects.filter(**filters).values(
        "user__user_id", "survey__survey_id", "question__question_id", "answer"
    )
    
    if custom_answers:
        return JsonResponse({"custom_answers": list(custom_answers)})
    else:
        return JsonResponse({"message": "No custom question answers found for the given filters"}, status=404)
#ex http://127.0.0.1:8000/api/custom-question-answers/filter?user_id=1&survey_id=101

@api.delete("/custom-question-answers/{user_id}/{survey_id}/{question_id}")
def delete_custom_question_answer(request, user_id: int, survey_id: int, question_id: int):
    try:
        # Retrieve and delete the specific CustomQuestionAnswer entry
        custom_answer = CustomQuestionAnswer.objects.get(
            user__user_id=user_id, survey__survey_id=survey_id, question__question_id=question_id
        )
        custom_answer.delete()
        return JsonResponse({"message": "Custom Question Answer deleted successfully"})
    except CustomQuestionAnswer.DoesNotExist:
        return JsonResponse({"error": "Custom Question Answer not found"}, status=404)







# POST Method to create a new Question
@api.post("/questions")
def create_question(request):
    body = json.loads(request.body.decode('utf-8'))
    question_text = body.get("question_text")

    if not question_text:
        return JsonResponse({"error": "question_text is required"}, status=400)

    question = Question.objects.create(question_text=question_text)
    
    return JsonResponse({
        "message": "Question created successfully",
        "data": {
            "question_id": question.question_id,
            "question_text": question.question_text
        }
    }, status=201)

# DELETE Method to delete a specific Question
@api.delete("/questions/{question_id}")
def delete_question(request, question_id: int):
    try:
        question = Question.objects.get(question_id=question_id)
        question.delete()
        return JsonResponse({"message": f"Question with ID {question_id} deleted successfully"})
    except Question.DoesNotExist:
        return JsonResponse({"error": "Question not found"}, status=404)

# GET Method to retrieve all Questions or a specific Question by question_id
@api.get("/questions")
def get_questions(request):
    questions = Question.objects.all().values("question_id", "question_text")
    return JsonResponse({"questions": list(questions)})

@api.get("/questions/{question_id}")
def get_question(request, question_id: int):
    try:
        question = Question.objects.get(question_id=question_id)
        return JsonResponse({
            "question_id": question.question_id,
            "question_text": question.question_text
        })
    except Question.DoesNotExist:
        return JsonResponse({"error": "Question not found"}, status=404)
    




# POST Method to create a new StandardQuestionAnswer
@api.post("/standard-question-answers")
def create_standard_question_answer(request):
    body = json.loads(request.body.decode('utf-8'))

    user_id = body.get("user_id")
    survey_id = body.get("survey_id")
    mood_based_on_video = body.get("mood_based_on_video")
    mood_based_on_text = body.get("mood_based_on_text")
    watch_likelihood = body.get("watch_likelihood")

    # Retrieve User and Survey instances
    try:
        user = User.objects.get(user_id=user_id)
        survey = Survey.objects.get(survey_id=survey_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    except Survey.DoesNotExist:
        return JsonResponse({"error": "Survey not found"}, status=404)

    # Create StandardQuestionAnswer entry
    standard_answer = StandardQuestionAnswer.objects.create(
        user=user,
        survey=survey,
        mood_based_on_video=mood_based_on_video,
        mood_based_on_text=mood_based_on_text,
        watch_likelihood=watch_likelihood
    )

    return JsonResponse({
        "message": "Standard Question Answer created successfully",
        "data": {
            "user_id": user_id,
            "survey_id": survey_id,
            "mood_based_on_video": mood_based_on_video,
            "mood_based_on_text": mood_based_on_text,
            "watch_likelihood": watch_likelihood
        }
    }, status=201)


# GET Method to retrieve StandardQuestionAnswer entries based on filters
@api.get("/standard-question-answers/filter")
def get_filtered_standard_question_answers(request, user_id: int = None, survey_id: int = None):
    filters = {}
    
    if user_id is not None:
        filters["user__user_id"] = user_id
    if survey_id is not None:
        filters["survey__survey_id"] = survey_id

    standard_answers = StandardQuestionAnswer.objects.filter(**filters).values(
        "user__user_id", "survey__survey_id", "mood_based_on_video", "mood_based_on_text", "watch_likelihood"
    )
    
    if standard_answers:
        return JsonResponse({"standard_answers": list(standard_answers)})
    else:
        return JsonResponse({"message": "No standard question answers found for the given filters"}, status=404)


# DELETE Method to delete a specific StandardQuestionAnswer
@api.delete("/standard-question-answers/{user_id}/{survey_id}")
def delete_standard_question_answer(request, user_id: int, survey_id: int):
    try:
        # Retrieve and delete the StandardQuestionAnswer entry
        standard_answer = StandardQuestionAnswer.objects.get(
            user__user_id=user_id, survey__survey_id=survey_id
        )
        standard_answer.delete()
        return JsonResponse({"message": "Standard Question Answer deleted successfully"})
    except StandardQuestionAnswer.DoesNotExist:
        return JsonResponse({"error": "Standard Question Answer not found"}, status=404)




# POST Method to create a new SurveyQuestion
@api.post("/survey-questions")
def create_survey_question(request):
    body = json.loads(request.body.decode('utf-8'))

    survey_id = body.get("survey_id")
    question_id = body.get("question_id")

    # Retrieve Survey and Question instances
    try:
        survey = Survey.objects.get(survey_id=survey_id)
        question = Question.objects.get(question_id=question_id)
    except Survey.DoesNotExist:
        return JsonResponse({"error": "Survey not found"}, status=404)
    except Question.DoesNotExist:
        return JsonResponse({"error": "Question not found"}, status=404)

    # Create SurveyQuestion entry
    survey_question = SurveyQuestion.objects.create(
        survey=survey,
        question=question
    )

    return JsonResponse({
        "message": "Survey Question created successfully",
        "data": {
            "survey_id": survey_id,
            "question_id": question_id
        }
    }, status=201)


# GET Method to retrieve SurveyQuestion entries based on filters
@api.get("/survey-questions/filter")
def get_filtered_survey_questions(request, survey_id: int = None, question_id: int = None):
    filters = {}
    
    if survey_id is not None:
        filters["survey__survey_id"] = survey_id
    if question_id is not None:
        filters["question__question_id"] = question_id

    survey_questions = SurveyQuestion.objects.filter(**filters).values(
        "survey__survey_id", "question__question_id"
    )
    
    if survey_questions:
        return JsonResponse({"survey_questions": list(survey_questions)})
    else:
        return JsonResponse({"message": "No survey questions found for the given filters"}, status=404)


# DELETE Method to delete a specific SurveyQuestion
@api.delete("/survey-questions/{survey_id}/{question_id}")
def delete_survey_question(request, survey_id: int, question_id: int):
    try:
        # Retrieve and delete the SurveyQuestion entry
        survey_question = SurveyQuestion.objects.get(
            survey__survey_id=survey_id, question__question_id=question_id
        )
        survey_question.delete()
        return JsonResponse({"message": "Survey Question deleted successfully"})
    except SurveyQuestion.DoesNotExist:
        return JsonResponse({"error": "Survey Question not found"}, status=404)
    

from django.http import JsonResponse

# POST Method to create a new ToDo
@api.post("/todos")
def create_todo(request):
    body = json.loads(request.body.decode('utf-8'))

    user_id = body.get("user_id")
    survey_id = body.get("survey_id")

    # Retrieve User and Survey instances
    try:
        user = User.objects.get(user_id=user_id)
        survey = Survey.objects.get(survey_id=survey_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    except Survey.DoesNotExist:
        return JsonResponse({"error": "Survey not found"}, status=404)

    # Create ToDo entry
    todo = ToDo.objects.create(
        user=user,
        survey=survey
    )

    return JsonResponse({
        "message": "ToDo created successfully",
        "data": {
            "user_id": user_id,
            "survey_id": survey_id
        }
    }, status=201)


# GET Method to retrieve ToDo entries based on filters
@api.get("/todos/filter")
def get_filtered_todos(request, user_id: int = None, survey_id: int = None):
    filters = {}
    
    if user_id is not None:
        filters["user__user_id"] = user_id
    if survey_id is not None:
        filters["survey__survey_id"] = survey_id

    todos = ToDo.objects.filter(**filters).values(
        "user__user_id", "survey__survey_id"
    )
    
    if todos:
        return JsonResponse({"todos": list(todos)})
    else:
        return JsonResponse({"message": "No ToDo entries found for the given filters"}, status=404)


# DELETE Method to delete a specific ToDo
@api.delete("/todos/{user_id}/{survey_id}")
def delete_todo(request, user_id: int, survey_id: int):
    try:
        # Retrieve and delete the ToDo entry
        todo = ToDo.objects.get(
            user__user_id=user_id, survey__survey_id=survey_id
        )
        todo.delete()
        return JsonResponse({"message": "ToDo entry deleted successfully"})
    except ToDo.DoesNotExist:
        return JsonResponse({"error": "ToDo entry not found"}, status=404)



@api.get("/videoURL")
def hello(request):
    demourl = "http://127.0.0.1:8000/media/Star Wars Episode IV_ A New Hope - Trailer.mp4"
    return {"message": "VideoURL provided", "url": demourl }

# https://www.youtube.com/watch?v=g_j6ILT-X0k&t=460s the reference for most of the code that sends the email
@api.post("/email")
def users(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    user_email = data.get("email")
    comments = data.get("message")
    email_password =  os.getenv("EMAIL_PASSWORD")
    sender_email = "filmanalyzerteam@gmail.com"
    subject =  "creating a studio account"
    message = f"{user_email} says {comments}:"

    em = EmailMessage()
    em['From'] = sender_email
    em['To'] = sender_email
    em["Subject"] = subject
    em.set_content(message)

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp:
        smtp.login(sender_email, email_password)
        smtp.sendmail(sender_email, sender_email, em.as_string())

    return {"message": "Success"}