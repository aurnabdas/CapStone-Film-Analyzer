from django.db import models

# Create your models here.
from django.db import models

# User Model with explicit UserID
class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255)
    role = models.CharField(max_length=255)

    def __str__(self):
        return self.username

# Survey Model with explicit SurveyID
class Survey(models.Model):
    survey_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    film_name = models.CharField(max_length=255)
    video_url = models.CharField(max_length=255)
    thumbnail_url = models.CharField(max_length=255, blank=True, null=True)  # New field for thumbnail URL

    def __str__(self):
        return self.film_name
    
class SurveyResponseCount(models.Model):
    survey_id = models.OneToOneField(
        'Survey', on_delete=models.CASCADE, primary_key=True, db_column='survey_id'
    )
    response_count = models.IntegerField(default=0)

# Questions Model with explicit QuestionID
class Question(models.Model):
    question_id = models.AutoField(primary_key=True)
    question_text = models.CharField(max_length=255)

    def __str__(self):
        return self.question_text

# Survey Questions Model (Relation between Survey and Question)
class SurveyQuestion(models.Model):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

# Standard Questions Model with explicit UserID and SurveyID
class StandardQuestionAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    mood_based_on_video = models.CharField(max_length=5000)
    mood_based_on_text = models.CharField(max_length=255)
    watch_likelihood = models.IntegerField()

# Custom Questions Model with explicit UserID, SurveyID, and QuestionIDS
class CustomQuestionAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.CharField(max_length=255)

# To Do Model with explicit UserID and SurveyID
class ToDo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
