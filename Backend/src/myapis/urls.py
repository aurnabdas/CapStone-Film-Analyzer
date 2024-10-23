# myapis/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_movie_info, name='get_movie_info'),
]

