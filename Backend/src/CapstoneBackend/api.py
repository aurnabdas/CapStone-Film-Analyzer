from ninja import NinjaAPI
import json


api = NinjaAPI()

@api.get("/hello")
def hello(request):
    print(request)
    return {"message": "Hello Word"}

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

    

