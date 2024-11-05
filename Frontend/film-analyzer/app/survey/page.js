"use client"
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import "../globals.css";
import NavBar from '../../components/NavBar';
import { PlusIcon } from '@heroicons/react/24/solid';
export default function Review() {
    //-------------------states----------------------------
    const [userID, setUserId] = useState("2");
    const [files, setFiles] = useState([]);
    const [questionlist, setQuestionslist] = useState([]);
    const [questions, setQuestionsug] = useState([]);
    const [question, setQuestion] = useState("");
    const [movie, setMovie] = useState("");
    const [videoUrls, setVideoUrls] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
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
                    setIsSubmitted(true);
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
    
    const handleAddSuggestedQuestion = (suggestion) => {
        if(!questionlist.includes(suggestion)) {
            setQuestionslist([...questionlist, suggestion]);
        }
    };
    //-------------------------------------------------------------

    return (
        <main
            className="min-h-screen bg-parchment text-gray-800 p-6"
            style={{ backgroundColor: "#f5f5dc", fontFamily: "Georgia, serif" }} // Apply background and font
        >
            <NavBar />

            <div className="flex flex-col items-center mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold mb-6 text-red-800">
                    {isSubmitted ? "Want to reupload another file?" : "Upload your files"}
                </h1>

                {/* Video Player */}
                <div className="flex flex-col items-center justify-center w-full mb-6">
                    {videoUrls.length > 0 && videoUrls.map((url, index) => (
                        <div key={index} className="w-full max-w-2xl">
                            <ReactPlayer url={url} controls width="100%" height="100%" />
                        </div>
                    ))}
                </div>

                {/* File Upload Form */}
                <div className="mt-10 mb-10 text-center">
                    <h2 className="text-2xl font-semibold mb-2">Upload your files</h2>
                    <p className="text-xs text-gray-500">File should be of format .mp4, .avi, .mov or .mkv</p>
                </div>
                <form action="#" className="relative w-4/5 max-w-xs mb-10 bg-white p-4 rounded-lg shadow-lg">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFile}
                    />
                    <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
                        <p className="text-sm text-gray-500 mb-2">Drag & Drop or Select Files</p>
                        <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                        </svg>
                    </label>
                </form>

                {/* Movie Title Input */}
                <form className="w-full max-w-lg mb-4">
                    <label className="block text-lg mb-2 text-gray-800">
                        Movie Title:
                        <input
                            type="text"
                            value={movie}
                            onChange={(e) => setMovie(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-600"
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
                    <div className="flex flex-col items-center mt-10 animate-fadeIn">
                        {/* Questions Input */}
                        <form onSubmit={handleAddQuestion} className="w-full max-w-lg mb-6">
                            <label className="block text-lg mb-2 text-gray-800">
                                Questions:
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-600"
                                    placeholder="Enter your question"
                                />
                            </label>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition"
                            >
                                Add Question
                            </button>
                        </form>

                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Question Suggestions:</h3>

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

                        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">List of Questions</h3>
                        <ul className="list-none pl-0">
                            {questionlist.map((q, index) => (
                                <li key={index} className="mb-1 text-gray-900">
                                    {q}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </main>
    );
}