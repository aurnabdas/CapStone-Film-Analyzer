import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

#https://www.geeksforgeeks.org/create-a-directory-in-python/
#https://gearheart.io/blog/how-to-upload-files-with-django/
class VideoUploadForSurveyView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        
        # this gets the name and the video itself from the request
        uploaded_file = request.FILES['video']
        file_name = uploaded_file.name

        # in setting.py we have paths set up that will be combined with our file name and this is where we will upload the video content
        save_dir = settings.MEDIA_ROOT
        save_path = os.path.join(save_dir, file_name)

        # this creates the directory if not made
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)

        # Saves the video to the server
        with open(save_path, 'wb+') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        # Now we construct the URL that we want to send to the frontend, so it can properly acquire the video to display in the backend
        video_url = f"{settings.MEDIA_URL}{file_name}"
        print(video_url)

        
        return Response({
            "message": "Video uploaded and survey updated successfully!",
            "video_url": video_url,  
        }, status=200)
