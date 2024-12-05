# myapis/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_movie_info, name='get_movie_info'),
    path('questions/', views.get_questions, name='get_questions'),  
    path('trending-movies/', views.get_trending_movies, name='get-trending-movies'),
    path('search-movie/', views.search_movie, name='search-movie'),
    path('search-omdb-movie/', views.search_omdb_movie, name='search-omdb-movie'),
]

