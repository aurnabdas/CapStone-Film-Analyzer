from ninja import NinjaAPI
import json
import os
from email.message import EmailMessage
import ssl
import smtplib


api = NinjaAPI()

@api.get("/hello")
def hello(request):
    print(request)
    return {"message": "Hello Word"}

@api.post("/users")
def users(request):
    body = request.body.decode('utf-8')
    email = json.loads(body)
    print(body)
    return {"message": "Success"}

@api.post("/survey")
def create_survey_entry(request):
        # Parse the JSON body from the request
        body = json.loads(request.body.decode('utf-8'))
        
        # Extract the data from the parsed JSON
        user_id = body.get("user_Id")
        film_name = body.get("film_name")
        video_url = body.get("videoUrls")

        # Print to verify (remove in production)
        print(f"User ID: {user_id}, Film Name: {film_name}, Video URL: {video_url}")

        return {"message": "Survey Entry Created", "data": body}

    

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