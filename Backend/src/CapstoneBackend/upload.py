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
        film_name = request.data.get('film_name')
        user_id = request.data.get('user_id')

        # Get the uploaded video file
        uploaded_file = request.FILES['video']
        file_name = uploaded_file.name

        # Define the save path for the video file
        save_dir = settings.MEDIA_ROOT
        save_path = os.path.join(save_dir, file_name)

        # Ensure the 'uploads' directory exists
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)

        # Save the file to the server
        with open(save_path, 'wb+') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        # Construct the URL to access the video
        video_url = f"{settings.MEDIA_URL}{file_name}"
        print(video_url)

        # Return the video URL to the frontend
        return Response({
            "message": "Video uploaded and survey updated successfully!",
            "video_url": video_url,  # Use the URL, not the file path
        }, status=200)
