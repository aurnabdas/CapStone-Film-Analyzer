# myapis/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_movie_info, name='get_movie_info'),
    path('questions/', views.get_questions, name='get_questions'),  
    path('trending-movies/', views.get_trending_movies, name='get-trending-movies'),
]

