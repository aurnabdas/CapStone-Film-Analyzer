"""
Django settings for CapstoneBackend project.


Generated by 'django-admin startproject' using Django 5.1.1.


For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/


For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

import os
from dotenv import load_dotenv
from pathlib import Path


# Set the base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env.local
load_dotenv()


postgre_pwd = os.getenv("POSTGRE_PWD")
postgre_user = os.getenv("POSTGRE_USER")
postgre_host = os.getenv("POSTGRE_HOST")
postgre_port = os.getenv("POSTGRE_PORT")
postgre_name = os.getenv("POSTGRE_NAME")



# print(postgre_port)



# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-4pphcu0n67$wwotz&u(taa%e2dcv__=pq)7^7&4+0iz%oaum*^'


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True


ALLOWED_HOSTS = []




# Application definition


INSTALLED_APPS = [
   'django.contrib.admin',
   'django.contrib.auth',
   'django.contrib.contenttypes',
   'django.contrib.sessions',
   'django.contrib.messages',
   'django.contrib.staticfiles',
   #third party
   "corsheaders",
   'rest_framework', 
   "api"
]


MIDDLEWARE = [
   'django.middleware.security.SecurityMiddleware',
   'django.contrib.sessions.middleware.SessionMiddleware',
   "corsheaders.middleware.CorsMiddleware",
   'django.middleware.common.CommonMiddleware',
   'django.middleware.csrf.CsrfViewMiddleware',
   'django.contrib.auth.middleware.AuthenticationMiddleware',
   'django.contrib.messages.middleware.MessageMiddleware',
   'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'CapstoneBackend.urls'


CORS_ALLOWED_ORIGINS = [
   "http://localhost:3000",
   "http://127.0.0.1:3000",
]




TEMPLATES = [
   {
       'BACKEND': 'django.template.backends.django.DjangoTemplates',
       'DIRS': [],
       'APP_DIRS': True,
       'OPTIONS': {
           'context_processors': [
               'django.template.context_processors.debug',
               'django.template.context_processors.request',
               'django.contrib.auth.context_processors.auth',
               'django.contrib.messages.context_processors.messages',
           ],
       },
   },
]


WSGI_APPLICATION = 'CapstoneBackend.wsgi.application'




# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases


DATABASES = {
   'default': {
       'ENGINE': 'django.db.backends.postgresql',
       'NAME': postgre_name,
       'USER': postgre_user,
       'PASSWORD': postgre_pwd,
       'HOST': postgre_host,
       'PORT': postgre_port,    }
}




# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators


AUTH_PASSWORD_VALIDATORS = [
   {
       'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
   },
   {
       'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
   },
   {
       'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
   },
   {
       'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
   },
]




# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/


LANGUAGE_CODE = 'en-us'


TIME_ZONE = 'UTC'


USE_I18N = True


USE_TZ = True




# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/


STATIC_URL = 'static/'


# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# Use the environment variable in your settings
API_KEY = os.getenv("API_KEY")

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'CapstoneBackend', 'uploads')

# TMDB API key 

TMDB_API_KEY = os.getenv("TMDB_API")


