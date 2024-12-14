from ninja import NinjaAPI
from django.http import JsonResponse
import json
import os
from email.message import EmailMessage
from rest_framework.decorators import api_view
import ssl
import smtplib
import django
from rest_framework import status

from api.models import *

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "CapstoneBackend.settings")
django.setup()


api = NinjaAPI()

@api.get("/hello")
def hello(request):
    print(request)
    return {"message": "Hello Word"}



@api.post("/check")
def check(request):
    body = request.body.decode('utf-8')
    user_email = json.loads(body)
    user = User.objects.get(username=user_email)
    movies = []
    # print(user.user_id)
    # print(user.role)
    survey_id = ToDo.objects.filter(user=user.user_id).values_list('survey',flat=True).distinct()
    for i in list(survey_id):
        survey = Survey.objects.get(survey_id=i)
        movies.append(survey.film_name)   
    return {"message": movies}

@api.post("/getcustomquestions")
def q(request):
    body = request.body.decode('utf-8')
    name = json.loads(body)
    questions = []
    survey = Survey.objects.get(film_name=name)
    survey_id = survey.survey_id
    question_ids = SurveyQuestion.objects.filter(survey=survey_id).values_list('question',flat=True).distinct()
    for i in list(question_ids):
        question = Question.objects.get(question_id=i)
        questions.append(question.question_text)
    print(questions)
    return {"message": questions}





@api.post("/videoURL")
def videoURL(request):
    body = request.body.decode('utf-8')
    name = json.loads(body)
    
    survey = Survey.objects.get(film_name=name)
    url = survey.video_url
    
    return {"message": "VideoURL provided", "url": url }

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

#____________________________________________________________
@api.post("/users/reviewer")
def users(request):
    body = request.body.decode('utf-8')
    email = json.loads(body)
    User.objects.create(username= email, role = "reviewer")
    print(email)
    return {"message": "Success"}

@api.post("/users/studio/{email}")
def users(request, email: str):
    query = {"username": email, "role": "reviewer"}
    User.objects.create(username= email, role = "studio")
    print(email)
    return {"message": "Success"}

@api.post("/rolecheck")
def rolecheck(request):
    
    body = json.loads(request.body.decode('utf-8'))
    print(body)
    user_id = body.get("userID")
    print(user_id)
    try:
        user = User.objects.get(username=user_id)  # Retrieve the User instance using `user_id`
        print(user.role)
        if user.role == "reviewer":
            return JsonResponse({"message": "Incorrect Role"}, status=400)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    
    return {"message": "Correct Role"}

@api.post("/navbar/rolecheck")
def rolecheck(request):
    
    body = json.loads(request.body.decode('utf-8'))
    print(body)
    user_id = body.get("userID")
    print(user_id)
    try:
        user = User.objects.get(username=user_id)  # Retrieve the User instance using `user_id`
        print(user.role)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    
    return {"message": user.role}



#Post request to create survey. UserId Must exist in User Table and SurveyId Must be unique
# Post request to create survey. UserId Must exist in User Table and SurveyId Must be unique
@api.post("/survey")
def create_survey_entry(request):
    body = json.loads(request.body.decode('utf-8'))
    
    # Fetching the username from the request body
    username = body.get("user_Id")  # Assuming user_Id actually refers to the username
    film_name = body.get("film_name")
    video_url = body.get("videoUrls")
    thumbnail_url = body.get("thumbnailUrls")

    # Retrieve User instance using the provided username
    try:
        user = User.objects.get(username=username)  # Retrieve the User instance using the `username`
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    # Create a new Survey entry
    new_survey = Survey.objects.create(
        film_name=film_name,
        video_url=video_url,
        thumbnail_url=thumbnail_url,
        user=user
    )

    # Create an associated SurveyResponseCount entry with an initial response count of 0
    SurveyResponseCount.objects.create(
        survey_id=new_survey,  # Referencing the created Survey instance
        response_count=0
    )

    # Print to verify (for debugging purposes, remove this in production)
    print(f"User ID: {user.user_id}, Film Name: {film_name}, Video URL: {video_url}, Thumbnail URL: {thumbnail_url}")

    return JsonResponse({"message": "Survey Entry Created", "data": body}, status=201)
# PATCH request to update survey response count. SurveyID must exist in Survey Table.
@api_view(["PATCH"])
def update_survey_response_count(request, survey_id):
    try:
        # Retrieve Survey instance using survey_id
        survey = Survey.objects.get(survey_id=survey_id)  # Retrieve the Survey instance using the `survey_id`
        
        # Retrieve or create SurveyResponseCount for the Survey
        response_count_entry, created = SurveyResponseCount.objects.get_or_create(
            survey_id=survey
        )

        # Update response count by incrementing it
        response_count_entry.response_count += 1
        response_count_entry.save()

        # Print to verify (for debugging purposes, remove this in production)
        print(f"Survey ID: {survey.survey_id}, Updated Response Count: {response_count_entry.response_count}")

        return JsonResponse(
            {"message": "Survey response count updated successfully", "new_count": response_count_entry.response_count},
            status=status.HTTP_200_OK,
        )

    except Survey.DoesNotExist:
        return JsonResponse({"error": "Survey not found"}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#Delete request to delete survey from table using survey id 
@api.delete("/survey/{survey_id}")
def delete_survey_entry(request, survey_id: int):
    try:
        survey = Survey.objects.get(survey_id=survey_id)  # Retrieve the Survey instance
        survey.delete()  # Delete the survey from the database
        return {"message": f"Survey with ID {survey_id} deleted successfully"}
    except Survey.DoesNotExist:
        return JsonResponse({"error": "Survey not found"}, status=404)



@api.get("/surveys/{survey_id}")
def get_survey_by_id(request, survey_id: int):
    try:
        survey = Survey.objects.get(survey_id=survey_id)
        questions = SurveyQuestion.objects.filter(survey=survey).values("question__question_text")
        answers = CustomQuestionAnswer.objects.filter(survey=survey).values(
            "question__question_text", "answer"
        )
        return JsonResponse({
            "survey": {
                "survey_id": survey.survey_id,
                "film_name": survey.film_name,
                "video_url": survey.video_url,
            },
            "questions": list(questions),
            "answers": list(answers),
        })
    except Survey.DoesNotExist:
        return JsonResponse({"error": "Survey not found"}, status=404)

    
@api.get("/user-surveys")
def get_user_surveys(request):
    username = request.headers.get("username")  # Assuming the username is passed via headers
    print("Received username:", username)  # Add this for debugging
    
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    surveys = Survey.objects.filter(user=user).values("survey_id", "film_name", "video_url", "thumbnail_url")
    
    result = []
    for survey in surveys:
        questions = SurveyQuestion.objects.filter(survey__survey_id=survey["survey_id"]).values("question__question_text")
        answers = CustomQuestionAnswer.objects.filter(survey__survey_id=survey["survey_id"]).values("answer", "question__question_text")
        result.append({
            "survey": survey,
            "questions": list(questions),
            "answers": list(answers)
        })

    return JsonResponse({"user_surveys": result}, status=200)



#Post request for custom-questions-answers
@api.post("/custom-question-answers")
def create_custom_question_answer(request):
    body = json.loads(request.body.decode('utf-8'))
    print(body)

    userName = body.get("userName")
    question = body.get("question")
    answer = body.get("answer")


    user = User.objects.get(username=userName) 
    question = Question.objects.get(question_text=question) 
    survey_question = SurveyQuestion.objects.get(question=question)  
    survey = survey_question.survey  

    # for developer to quicky check what is being put into the database
    print(user.user_id)
    print(question.question_id)
    print(survey.survey_id)
    print(answer)

    # Checks if the answer is blank
    if not answer.strip():
        return JsonResponse({
            "message": "Answer cannot be blank."
        }, status=400)
    #--------------------------------------------------------------
    # Checks if an answer already exists for this user, survey, and question
    existing_answer = CustomQuestionAnswer.objects.filter(
        user=user,
        survey=survey,
        question=question
    ).first()
    
    if existing_answer:
        return JsonResponse({
            "message": "You have already answered this question."
        }, status=400)
    #--------------------------------------------------------------
    CustomQuestionAnswer.objects.create(
        user=user,
        survey=survey,
        question=question,
        answer=answer
    )

    return JsonResponse({
        "message": "Custom Question Answer created successfully"}, status=201)

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
    print(body)
    question_text = body.get("question")
    user_ID = body.get("userID")
    movie = body.get("movie")
    

    question = Question.objects.create(question_text=question_text)
    user = User.objects.get(username=user_ID)
    
    survey = Survey.objects.get(film_name=movie, user = user)
    
    # print(survey.survey_id)
    survey_question = SurveyQuestion.objects.create(survey=survey,question=question)
    # todo_entry = ToDo.objects.create(user=user, survey=survey)
    
    return JsonResponse({
        "message": "Question created successfully",}, status=201)

# DELETE Method to delete a specific Question
@api.delete("/questions/{question_text}")
def delete_question(request, question_text: str):
    try:
        question = Question.objects.get(question_text=question_text)
        question.delete()
        return JsonResponse({"message": f"Question with ID {question_text} deleted successfully"})
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
    



# @api_view(["POST"])
# def create_standard_question_answer(request):
#     try:
#         body = json.loads(request.body.decode('utf-8'))
#         username = body.get("userName")
#         moviename = body.get("movieName")
#         mood_based_on_video = body.get("emotions")
#         mood_based_on_text = body.get("firstQuestionAnswer")

#         # Converting to integer and handling invalid input
#         try:
#             watch_likelihood = int(body.get("secondQuestionAnswer"))
#         except (ValueError, TypeError):
#             return JsonResponse({"error": "Invalid value for watch_likelihood"}, status=status.HTTP_400_BAD_REQUEST)

#         # Retrieve User and Survey instances
#         try:
#             user = User.objects.get(username=username)
#         except User.DoesNotExist:
#             return JsonResponse({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

#         try:
#             survey = Survey.objects.get(film_name=moviename)
#         except Survey.DoesNotExist:
#             return JsonResponse({"error": "Survey not found"}, status=status.HTTP_404_NOT_FOUND)

#         # Debugging to ensure correct values
#         print(f"Received Body: {body}")
#         print(f"Mood Based on Video: {mood_based_on_video}")
#         print(f"Mood Based on Text: {mood_based_on_text}")
#         print(f"Watch Likelihood: {watch_likelihood}")

#         # Create StandardQuestionAnswer entry
#         StandardQuestionAnswer.objects.create(
#             user=user,
#             survey=survey,
#             mood_based_on_video=mood_based_on_video,
#             mood_based_on_text=mood_based_on_text,
#             watch_likelihood=watch_likelihood
#         )

#         return JsonResponse({
#             "message": "Standard Question Answer created successfully"
#         }, status=status.HTTP_201_CREATED)

#     except Exception as e:
#         print(f"Unexpected error: {e}")
#         return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# POST Method to create a new StandardQuestionAnswer
@api.post("/standard-question-answers")
def create_standard_question_answer(request):
    body = json.loads(request.body.decode('utf-8'))
    username = body.get("userName")
    moviename = body.get("movieName")
    mood_based_on_video = body.get("emotions")
    mood_based_on_text = body.get("firstQuestionAnswer")
    watch_likelihood = int(body.get("secondQuestionAnswer")) #turn this into a int
    # Retrieve User and Survey instances
    try:
        user = User.objects.get(username=username)
        survey = Survey.objects.get(film_name=moviename)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    except Survey.DoesNotExist:
        return JsonResponse({"error": "Survey not found"}, status=404)
    
    print(mood_based_on_video)
    print(mood_based_on_text)
    print(watch_likelihood)
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
    # print(body)
    movie = body.get("movie")

    # Retrieve User and Survey instances
    try:
        reviwers = User.objects.filter(role="reviewer").distinct()
        survey = Survey.objects.get(film_name=movie)
        for reviewer in reviwers:
            ToDo.objects.create(user=reviewer,survey=survey)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    except Survey.DoesNotExist:
        return JsonResponse({"error": "Survey not found"}, status=404)


    return JsonResponse({
        "message": "ToDo created successfully",
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
@api.delete("/todos/{username}/{moviename}")
def delete_todo(request, username: str, moviename: str):
    try:
       
        # Retrieve and delete the ToDo entry
        todo = ToDo.objects.get(
            user__username=username, survey__film_name=moviename
        )
        todo.delete()
        return JsonResponse({"message": "ToDo entry deleted successfully"})
    except ToDo.DoesNotExist:
        return JsonResponse({"error": "ToDo entry not found"}, status=404)



