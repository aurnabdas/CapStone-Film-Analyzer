"use client"
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import "../globals.css";

export default function Review() {
    //-------------------states----------------------------
    const [userID, setUserId] = useState("2");
    const [files, setFiles] = useState([]);
    const [questionlist, setQuestionslist] = useState([]);
    const [questions, setQuestionsug] = useState([]);
    const [question, setQuestion] = useState("");
    const [movie, setMovie] = useState("");
    const [videoUrls, setVideoUrls] = useState([]);
    
    //-----------------------------------------------------

    //-------------------functions----------------------------

    const handleFile = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    const handleAddQuestion = (e) => {
        e.preventDefault();
        if (question.trim() === "") {
            alert("Please enter a valid question.");
            return;
        }

        setQuestionslist([...questionlist, question]);
        setQuestion("");
    };

    // Fetch questions from the backend
    const fetchQuestions = async () => {
        const response = await fetch('http://127.0.0.1:8000/myapis/questions/', {
            method: 'GET',
        });
        if (response.ok) {
            const data = await response.json();
            setQuestionsug(data.questions); // Assuming the API response has `questions` as an array
        } else {
            console.error("Failed to fetch questions");
        }
    };

    // Initial fetch of questions on page load
    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleUpload = async () => {
        if (files.length === 0) {
            alert("Please select a video to upload.");
            return;
        }
    
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('video', file);
        });
    
        try {
            const response = await fetch('http://127.0.0.1:8000/upload-survey-video/', {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                const data = await response.json();
                const fullUrl = `http://127.0.0.1:8000${data.video_url}`;
                setVideoUrls([fullUrl]);
                console.log("Upload successful:", data.video_url);

                const surveyData = {
                    user_Id: userID,
                    film_name: movie,
                    videoUrls: fullUrl
                };
    
                const response1 = await fetch('http://127.0.0.1:8000/api/survey', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(surveyData),
                });
    
                if (response1.ok) {
                    console.log("Survey data saved successfully");
                } else {
                    console.error("Failed to save survey data");
                }
            } else {
                console.error("Upload failed");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    
        setMovie("");
    };
    
    //-------------------------------------------------------------

    return (
        <main className="min-h-screen bg-gray-100 py-6'">
            <div className='flex flex-col items-center '>
                <h1 className="text-4xl font-bold mb-6 text-red-600">Displaying Video</h1>

                {/* displays the video */}
                <div className="flex flex-col items-center justify-center w-full">
                    {videoUrls.length > 0 && videoUrls.map((url, index) => (
                        <div key={index} className="w-full max-w-2xl">
                            <ReactPlayer url={url} controls={true} width="100%" height="100%" />
                        </div>
                    ))}
                </div>

                <input
                    type="file"
                    onChange={handleFile}
                    multiple
                    className="mb-6 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Handles the Film Name */}
                <form className="w-full max-w-lg">
                    <label className="block text-gray-700 text-lg mb-2">
                        Movie Title:
                        <input
                            type="text"
                            value={movie}
                            onChange={(e) => setMovie(e.target.value)}
                            className="mt-2 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter movie title"
                        />
                    </label>
                </form>

                <button
                    className="mb-6 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    onClick={handleUpload}>
                    Submit
                </button>
            </div>

            {/* Handles the Questions */}
            <div className='flex flex-col items-center '>
                <form onSubmit={handleAddQuestion} className="w-full max-w-lg mb-6">
                    <label className="block text-gray-700 text-lg mb-2">
                        Questions:
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="mt-2 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your question"
                        />
                    </label>
                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                        Add Question
                    </button>
                </form>

                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Question Suggestions:</h3>
                
                <button
                    onClick={fetchQuestions}
                    className="mb-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                    Generate New Questions
                </button>
                
                <ul className="w-full max-w-lg bg-white p-4 rounded-lg shadow-md">
                    {questions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="p-2 mb-2 bg-gray-100 text-gray-800 font-medium rounded-lg border border-gray-200">
                            {suggestion}
                        </li>
                    ))}
                </ul>

                <h3 className="text-lg font-semibold mb-2">List of Questions</h3>
                <ul className="list-disc pl-5">
                    {questionlist.map((q, index) => (
                        <li key={index} className="mb-1">
                            {index + 1}. {q}
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
