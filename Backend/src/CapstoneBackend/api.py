from ninja import NinjaAPI
import json


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