"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import "../globals.css";
import NavBar from "../../components/NavBar";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import Gif from "../../components/Gif"

export default function Review() {
  //-------------------states----------------------------
  const [userID, setUserId] = useState("");
  const [files, setFiles] = useState([]);
  const [filename, setFilename] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(""); // Add this state
  const [questionlist, setQuestionslist] = useState([]);
  const [questions, setQuestionsug] = useState([]);
  const [question, setQuestion] = useState("");
  const [movie, setMovie] = useState("");
  const [videoUrls, setVideoUrls] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const questionsRef = useRef(null);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  //-----------------------------------------------------

  //-------------------functions----------------------------


  const handleFile = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setFilename(selectedFiles[0]?.name || ""); // Set filename of the first file selected
  };

  const handleThumbnailFile = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file); // Set the thumbnail file in state
    
  };
  

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (question.trim() === "") {
      alert("Please enter a valid question.");
      return;
    }
    const response = await fetch ("http://127.0.0.1:8000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({question,userID,movie}),
      });
  
      if (response.ok) {
        console.log("Correct Role");
      } else {
        const data = await response.json();
        console.error("Failed to add question:", data.message);
      }

    setQuestionslist([...questionlist, question]);
    setQuestion("");
  };

  
  const fetchQuestions = async () => {
    const response = await fetch("http://127.0.0.1:8000/myapis/questions/", {
      method: "GET",
    });
    if (response.ok) {
      const data = await response.json();
      setQuestionsug(data.questions); // Assuming the API response has `questions` as an array

    } else {
      console.error("Failed to fetch questions");
    }
  };

  
  useEffect(() => {
    fetchQuestions();
    if (user?.emailAddresses?.[0]?.emailAddress) {
        setUserId(user.emailAddresses[0].emailAddress)
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return <Gif
        gifSource="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGFpdjNidm02ZXhiZTRiZDZ6a25yeGQxcjJqaHNpbTJzc2RtanloMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BPJmthQ3YRwD6QqcVD/giphy.webp"
        backgroundColor="rgb(153 27 27)"
      />;
  }


  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select a video to upload.");
      return;
    }

    if (!thumbnailFile) {
      alert("Please select a thumbnail to upload.");
      return;
    }
  
  
    try {
      const rolecheck = await fetch("http://127.0.0.1:8000/api/rolecheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({userID}),
      });
  
      if (rolecheck.ok) {
        console.log("Correct Role");
      } else {
        const data = await rolecheck.json();
        console.error("Failed role check:", data.message);
        if (data.message === "Incorrect Role") {
          alert("Not Allowed to Create Survey");
          router.push('/');
          return; 
        }
      }
  
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("video", file);
      });
      formData.append("thumbnail", thumbnailFile); // Add thumbnail file
  
      
      const response = await fetch("http://127.0.0.1:8000/upload-survey-video/", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        const fullUrl = `http://127.0.0.1:8000${data.video_url}`;
        const fullThumbnailUrl = `http://127.0.0.1:8000${data.thumbnail_url}`; // Assuming backend returns this
        setVideoUrls([fullUrl]);
        setThumbnailFile([fullThumbnailUrl]);
        setThumbnailUrl(data.thumbnail_url);
        console.log("Upload successful:", data.video_url);
  
       
        const surveyData = {
          user_Id: userID,
          film_name: movie,
          videoUrls: fullUrl,
          thumbnailUrls: fullThumbnailUrl
          
        };
  
        
        const response1 = await fetch("http://127.0.0.1:8000/api/survey", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(surveyData),
        });
  
        if (response1.ok) {
          console.log("Survey data saved successfully");
          setIsSubmitted(true);
        } else {
          const data = await response1.json();
          console.error("Failed to save survey data:", data.message);
        }
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  
    console.log(movie)
  };
  

  const handleAddSuggestedQuestion = async (suggestion) => {
    if (!suggestion || !suggestion.trim()) {
      console.error("Attempted to add an empty question.");
      return; 
    }

    if (!questionlist.includes(suggestion)) {
        console.log("Adding question:", suggestion);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/questions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ question: suggestion, userID, movie }),
            });

            if (response.ok) {
                console.log("Question added successfully.");
                setQuestionslist([...questionlist, suggestion]);
            } else {
                const data = await response.json();
                console.error("Failed to add question:", data.message);
            }
        } catch (error) {
            console.error("Error adding question:", error);
        }
    }
};


  const scrollToQuestions = () => {
    if (questionsRef.current) {
      questionsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const finishSurvey = async () =>{
    try{
        const response = await fetch("http://127.0.0.1:8000/api/todos", {
            method: "POST",
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({movie})
        });

        if(response.ok){
            alert(`Congrats You Made a Survey for ${movie}`)
            router.push('/');
        } 
        else{
            const data = await response.json();
            console.error("Failed to make a TODO entry:", data.message);
        }

    }

    catch(error){
        console.error("Error ending survey:", error);

    }
  }

  const handleDeleteQuestion = async (question, index) => {
    try {

      const response = await fetch(`http://127.0.0.1:8000/api/questions/${encodeURIComponent(question)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        console.log("Question deleted successfully");
        
        // this was the original code that was set in the onclick brackets
        const updatedList = questionlist.filter((_, i) => i !== index);
        setQuestionslist(updatedList);
      } else {
        const data = await response.json();
        console.error("Failed to delete question:", data.message);
        alert(data.message || "Failed to delete the question.");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("An error occurred while deleting the question. Please try again.");
    }
  };

  
  //-------------------------------------------------------------

  return (
    <main
      className="min-h-screen bg-parchment text-gray-800 p-6 pt-20"
      style={{ backgroundColor: "#f5f5dc", fontFamily: "Georgia, serif" }}
    >
      <NavBar />

      <div className="flex flex-col items-center mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-4xl font-bold mb-6 text-red-800 border-b-2">
          {isSubmitted ? `${movie}` : "Studio Survey Page"}
        </h1>

        {/* Thumbnail Display */}
        <div className="flex flex-col items-center justify-center w-full mb-6">
        {isSubmitted && thumbnailFile && (
      <img
        src={(thumbnailFile)} // Create a URL for the selected file
        alt="Uploaded Thumbnail"
        className="w-full max-w-xs h-auto object-cover mb-4"
      />
    )}
</div>
        {/* Video Player */}
        <div className="flex flex-col items-center justify-center w-full mb-6">
          {videoUrls.length > 0 &&
            videoUrls.map((url, index) => (
              <div key={index} className="w-full max-w-2xl">
                <ReactPlayer
                  url={url}
                  controls
                  width="100%"
                  height="100%"
                  onReady={scrollToQuestions}
                />
              </div>
            ))}
        </div>

        {/* File Upload Form */}
        <div className="mt-10 mb-10 text-center">
          <h2 className="text-2xl font-semibold mb-2 border-b-2 border-gray-300">
            {isSubmitted
              ? "Want to reupload another trailer?"
              : "Upload trailer here"}
          </h2>
          <p className="text-xs text-gray-500">
            File should be of format .mp4, .avi, .mov or .mkv
          </p>
        </div>
        
        <form
          action="#"
          className="relative w-4/5 max-w-xs mb-10 bg-white p-4 rounded-lg shadow-lg"
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFile}
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            <p className="text-sm text-gray-500 mb-2">
              Drag & Drop or Select Files
            </p>

            <svg
              className="w-6 h-6 text-indigo-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          </label>
        </form>



        <div className="mt-10 mb-10 text-center">
          <h2 className="text-2xl font-semibold mb-2 border-b-2 border-gray-300">
            {isSubmitted
              ? "Want to reupload another thumbnail?"
              : "Upload thumbnail here"}
          </h2>
          <p className="text-xs text-gray-500">
            File should be of format .pdf or .jpg
          </p>
        </div>

      {/*Thumbnail upload*/}
        <form
          action="#"
          className="relative w-4/5 max-w-xs mb-10 bg-white p-4 rounded-lg shadow-lg"
        >
          <input
            type="file"
            id="trailer-file-upload"
            className="hidden"
            onChange={handleThumbnailFile}
          />
          <label
            htmlFor="trailer-file-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            <p className="text-sm text-gray-500 mb-2">
              Drag & Drop or Select Files
            </p>
            
            <svg
              className="w-6 h-6 text-indigo-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          </label>
        </form>

        {/* Display selected filename */}
        {filename && (
          <div className="text-center">
            <p className="text-sm text-gray-800 mt-2">
              Selected file: <span className="font-semibold">{filename}</span>
            </p>
            <p className="text-sm text-green-600 mt-1">
              Ready to upload! Click submit to upload.
            </p>
          </div>
        )}

        {/* Display selected filename */}
        {thumbnailFile && (
          <div className="text-center">
            <p className="text-sm text-gray-800 mt-2">
              Selected file: <span className="font-semibold">{thumbnailFile.name}</span>
            </p>
            <p className="text-sm text-green-600 mt-1">
              Thumbnail uploaded!
            </p>
          </div>
        )}

        {/* Movie Title Input */}
        <form className="w-full max-w-lg mb-4">
          <label className="block text-lg mb-2 text-gray-800">
            Movie Title:
            <input
              type="text"
              value={movie}
              onChange={(e) => setMovie(e.target.value)}
              className="w-full max-w-lg p-2 border-2 border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-600"
              placeholder="Enter movie title"
            />
          </label>
        </form>

        {/* Submit Button */}
        <button
          onClick={handleUpload}
          className="mb-6 px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition"
        >
          Submit
        </button>

        {/* Conditionally render the questions section */}
        {isSubmitted && (
          <div
            ref={questionsRef}
            className="flex flex-col items-center mt-10 animate-fadeIn"
          >
            {/* Questions Input */}
            <form onSubmit={handleAddQuestion} className="w-full max-w-lg mb-6">
              <label className="block text-lg mb-2 text-gray-800">
                Questions:
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full max-w-lg p-2 border-2 border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-600"
                  placeholder="Enter your question"
                />
              </label>
              <button
                type="submit"
                className="w-full max-w-lg px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition"
              >
                Add Question
              </button>
            </form>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Question Suggestions:
            </h3>

            <button
              onClick={fetchQuestions}
              className="mb-4 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
            >
              Generate New Questions
            </button>

            <ul className="w-full max-w-lg bg-gray-100 bg-opacity-60 p-4 rounded-lg shadow-md">
              {questions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleAddSuggestedQuestion(suggestion)}
                  className="p-2 mb-2 bg-yellow-200 text-gray-900 font-medium rounded-lg cursor-pointer transition transform group hover:scale-105 hover:shadow-lg"
                >
                  {suggestion}
                  <span className="block mt-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to add!
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
              List of Questions
            </h3>
            <div className="w-full max-w-lg bg-white bg-opacity-80 p-4 rounded-lg shadow-md border-2 border-gray-300">
              <ul className="w-full list-none space-y-2">
                {questionlist.map((question, index) => (
                  <li
                    key={index}
                    onClick={() => handleDeleteQuestion(question, index)}
                    className="p-2 bg-yellow-200 text-gray-900 font-medium rounded-lg border border-gray-300 cursor-pointer transition transform hover:scale-105 hover:shadow-lg group"
                  >
                    {question}
                    <span className="block mt-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to remove!
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
      </div>
      {isSubmitted && (
       <div className="flex justify-center pt-6">
            <button
                onClick={finishSurvey}
                className="mb-4 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
            >
            Finish Making Survey
            </button>
        </div>
        )}

    </main>
  );
}
