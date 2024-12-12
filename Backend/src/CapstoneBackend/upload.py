import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse

# Video and Thumbnail Upload View
class VideoUploadForSurveyView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        # Handle video file
        uploaded_video = request.FILES.get('video')
        video_file_name = uploaded_video.name if uploaded_video else None

        # Handle thumbnail file
        uploaded_thumbnail = request.FILES.get('thumbnail')
        thumbnail_file_name = uploaded_thumbnail.name if uploaded_thumbnail else None

        # Define save directory
        save_dir = settings.MEDIA_ROOT

        # Ensure the directory exists
        if not os.path.exists(save_dir):
            os.makedirs(save_dir)

        # Save video file
        if uploaded_video:
            video_save_path = os.path.join(save_dir, video_file_name)
            with open(video_save_path, 'wb+') as destination:
                for chunk in uploaded_video.chunks():
                    destination.write(chunk)
            video_url = f"{settings.MEDIA_URL}{video_file_name}"
        else:
            video_url = None  # If no video is uploaded

        # Save thumbnail file
        if uploaded_thumbnail:
            thumbnail_save_path = os.path.join(save_dir, thumbnail_file_name)
            with open(thumbnail_save_path, 'wb+') as destination:
                for chunk in uploaded_thumbnail.chunks():
                    destination.write(chunk)
            thumbnail_url = f"{settings.MEDIA_URL}{thumbnail_file_name}"
        else:
            thumbnail_url = None  # If no thumbnail is uploaded

        # Log the URLs for debugging
        print(f"Video URL: {video_url}, Thumbnail URL: {thumbnail_url}")

        # Return response with URLs
        return Response({
            "message": "Files uploaded successfully!",
            "video_url": video_url,
            "thumbnail_url": thumbnail_url,
        }, status=200)
