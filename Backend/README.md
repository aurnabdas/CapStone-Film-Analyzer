# Step 1: creating a vitual enviorment (FOR MAC:)
    python3 -m venv venv

# Step 2: to activate(assuming you are the root of the backend folder)
    cd venv
    cd bin
    source activate
    
    or 

    source venv/bin/activate


# Step 3: Install all the correct packages that are needed
## side note if you are adding a package make sure to add it into the requirements.txt file and then run the command below again
    pip3 install -r requirements.txt


# Step4: In order to run the server, at the root of the backend folder run the following
    rav run server

# When you are done messing with the backend: deactivate venv(in the shell)
    deactivate 







# ***Side Information*** 


- alot of the setup process and specifically being able to make a call from the frontend to the backend was from the help of this video: [Django and NextJs Setup](https://www.youtube.com/watch?v=iFEVef5XdMI&t=1047s) There are some interesting things he does show in regards to how to use Django model, but we used just his setup process for the backend, as well as CORS configuration 

- when creating the django project, a src was made and cd into. the following command was ran
    django-admin startproject CapstoneBackend .

- rav package was added, including a rav.yaml which contains scripts to run the server

- in order for Next.js  to properly make a call to Django we have to use django cors header, otherwise we getr an error because django just simply doesnt allow anyone to access the data unless its within the django file
- [Django Cors Documentation](https://pypi.org/project/django-cors-headers/)
- when handling uploading the videos on to this server, which comes from the frontend. i followed some articles, to understand 


https://dev.to/jakewitcher/using-env-files-for-environment-variables-in-python-applications-55a1
 - I used this to figure out the .env variables