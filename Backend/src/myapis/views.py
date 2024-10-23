from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import os
import google.generativeai as genai

# Create your views here.

@api_view(['GET', 'POST'])
def get_movie_info(request):
    # Call the get_info_on_movies function to get the movie information
    movie_info = get_info_on_movies()
    
    # Return the movie info as a response
    if movie_info:
        return Response({"movies": movie_info}, status=status.HTTP_200_OK)
    
    return Response({"error": "No recommendations available at the moment."}, status=status.HTTP_400_BAD_REQUEST)

def get_info_on_movies():
    genai.configure(api_key=os.environ["API_KEY"])

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(f"Give me a list of action movies and a brief summary for each.")
    
    if response:
        # Assuming the API returns a formatted response that can be parsed
        movies = response.text.strip().split("\n")  # Split by new lines
        movie_list = []

        for movie in movies:
            # Assuming the response format is "Movie title: Movie description"
            if ": " in movie:
                title, description = movie.split(": ", 1)
                movie_list.append({"title": title.strip(), "description": description.strip()})

        return movie_list if movie_list else "No recommendations available."
    
    return "No recommendations available."
