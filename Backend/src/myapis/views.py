from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings 
import requests
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

@api_view(['GET', 'POST'])
def get_questions(request):
    # Call the get_info_on_movies function to get the movie information
    questions = generate_questions()
    
    # Return the questions as a response
    if questions:
        return Response({"questions": questions}, status=status.HTTP_200_OK)
    
    return Response({"error": "No questions available at the moment."}, status=status.HTTP_400_BAD_REQUEST)

def generate_questions():
        genai.configure(api_key=os.environ["API_KEY"])

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(
        "Create 3 engaging questions to gather user opinions and emotional reactions to a trailer. Do not label the questions with numbers, split the questions with spaces "
        "Questions should cover their overall impression, emotional experience, and interest in watching it in theaters. "
        "Questions should capture a mix of personal reactions, interest level, and emotional impact."
        "Do not include what the question is about, just include the questions"
)

        if response and response.text:
            # Split response into individual questions and filter out any empty strings
            questions = [q.strip() for q in response.text.strip().split("\n") if q.strip()]
            print(questions)
            return questions



# TMDB function that gets weekly trending movies 
@api_view(['GET'])
def get_trending_movies(request):
    api_key = settings.TMDB_API_KEY
    url = f"https://api.themoviedb.org/3/trending/movie/week?api_key={api_key}"
    response = requests.get(url)
    
    if response.status_code == 200:
        movies = response.json().get('results', [])
        return Response({'movies': movies}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Failed to fetch trending movies'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def search_movie(request):
    """
    Searches for movies based on a query provided in the request.
    """
    # Get the 'query' parameter from the request
    movie_name = request.GET.get('query', '').strip()
    
    if not movie_name:
        return Response(
            {'error': 'No movie name provided. Please include a "query" parameter.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get the API key from settings
    api_key = settings.TMDB_API_KEY
    url = f"https://api.themoviedb.org/3/search/movie"
    headers = {
        "Authorization": f"Bearer {settings.BEARER_TOKEN}",
        "accept": "application/json"
    }
    params = {
        "query": movie_name,
        "language": "en-US",
        "include_adult": False,
        "page": 1
    }

    # Make the request to TMDB
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Raise an error for non-2xx HTTP responses
        movies = response.json().get('results', [])

        # If no movies are found
        if not movies:
            return Response(
                {'message': f'No movies found for "{movie_name}".'},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({'movies': movies}, status=status.HTTP_200_OK)

    except requests.RequestException as e:
        # Handle HTTP request errors
        return Response(
            {'error': f'Failed to fetch movie information. {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



@api_view(['GET'])
def search_omdb_movie(request):
    """
    Searches for movies using the OMDB API.
    """
    movie_name = request.GET.get('query', '').strip()
    
    if not movie_name:
        return Response(
            {'error': 'No movie name provided. Please include a "query" parameter.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    api_key = os.getenv("OMDB_API_KEY")
    url = f"http://www.omdbapi.com/?apikey={api_key}&t={movie_name}"

    try:
        response = requests.get(url)
        response.raise_for_status()
        movie_data = response.json()

        if movie_data.get("Response") == "False":
            return Response(
                {'message': f'No movies found for "{movie_name}".'},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({'movie': movie_data}, status=status.HTTP_200_OK)

    except requests.RequestException as e:
        return Response(
            {'error': f'Failed to fetch movie information. {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    

@api_view(['GET'])
def search_omdb_movie_with_backdrop(request):
    """
    Searches for a movie using OMDB and fetches its backdrop image from TMDB.
    """
    movie_name = request.GET.get('query', '').strip()
    if not movie_name:
        return Response({'error': 'No movie name provided.'}, status=status.HTTP_400_BAD_REQUEST)

    # API keys from environment variables
    omdb_api_key = settings.OMDB_API_KEY
    tmdb_api_key = settings.TMDB_API_KEY

    try:
        # OMDB API call for movie details
        omdb_url = f"http://www.omdbapi.com/?t={movie_name}&apikey={omdb_api_key}"
        omdb_response = requests.get(omdb_url)
        omdb_response.raise_for_status()
        omdb_data = omdb_response.json()

        # TMDB API call for the backdrop image
        tmdb_url = f"https://api.themoviedb.org/3/search/movie?api_key={tmdb_api_key}&query={movie_name}"
        tmdb_response = requests.get(tmdb_url)
        tmdb_response.raise_for_status()
        tmdb_data = tmdb_response.json()

        # Extract backdrop image from TMDB
        backdrop_path = None
        if tmdb_data.get('results'):
            backdrop_path = tmdb_data['results'][0].get('backdrop_path')

        # Construct full backdrop URL
        backdrop_url = f"https://image.tmdb.org/t/p/original{backdrop_path}" if backdrop_path else None

        # Combine OMDB and TMDB data
        movie_data = {
            "Title": omdb_data.get("Title"),
            "Year": omdb_data.get("Year"),
            "Rated": omdb_data.get("Rated"),
            "Released": omdb_data.get("Released"),
            "Runtime": omdb_data.get("Runtime"),
            "Genre": omdb_data.get("Genre"),
            "Director": omdb_data.get("Director"),
            "Writer": omdb_data.get("Writer"),
            "Actors": omdb_data.get("Actors"),
            "Plot": omdb_data.get("Plot"),
            "Language": omdb_data.get("Language"),
            "Country": omdb_data.get("Country"),
            "Awards": omdb_data.get("Awards"),
            "Poster": omdb_data.get("Poster"),
            "Ratings": omdb_data.get("Ratings"),
            "Metascore": omdb_data.get("Metascore"),
            "imdbRating": omdb_data.get("imdbRating"),
            "imdbVotes": omdb_data.get("imdbVotes"),
            "imdbID": omdb_data.get("imdbID"),
            "BoxOffice": omdb_data.get("BoxOffice"),
            "Backdrop": backdrop_url,  # TMDB backdrop image
        }

        return Response({"movie": movie_data}, status=status.HTTP_200_OK)

    except requests.RequestException as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)