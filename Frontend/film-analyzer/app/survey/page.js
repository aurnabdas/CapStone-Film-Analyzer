"use client"
import React, { useState, useMemo } from 'react';
import ReactPlayer from 'react-player';
import "../globals.css";

export default function Review() {
    //-------------------states----------------------------
    const [userID, setUserId] = useState("2");
    const [files, setFiles] = useState([]);
    const [questionlist, setQuestionslist] = useState([]);
    const [question, setQuestion] = useState("");
    const [movie, setMovie] = useState("");
    const [videoUrls, setVideoUrls] = useState([]);
    const [url, setUrl] = useState("");
    //-----------------------------------------------------

    //-------------------functions----------------------------

    const handleFile = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        
    };

    const handleQuestions = (e) => {
        e.preventDefault();
        if (question.trim() === "") {
            alert("Please enter a valid question.");
            return;
        }

        setQuestionslist([...questionlist, question]);
        setQuestion("");
    };

    // const handleFilmName = (e) => {
    //     e.preventDefault();
    //     if (movie.trim() === "") {
    //         alert("Please enter a valid movie name.");
    //         return;
    //     }
    //     console.log("Movie Name:", movie);
    //     setMovie(""); // Reset the input after submission
    // };

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
            // Upload the video to the server
            const response = await fetch('http://127.0.0.1:8000/upload-survey-video/', {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                const data = await response.json();
                // Construct the full URL properly
                const fullUrl = `http://127.0.0.1:8000${data.video_url}`;
                setVideoUrls([fullUrl]);
                console.log("Upload successful:", data.video_url);
                // Now that the video is uploaded, use the full URL for the next request
                const surveyData = {
                    user_Id: userID,  // Make sure userID is properly set
                    film_name: movie,
                    videoUrls: fullUrl // Use fullUrl directly
                };
    
                // Send survey data to the backend
                try {
                    const response1 = await fetch('http://127.0.0.1:8000/api/survey', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json', // Ensure JSON is correctly sent
                        },
                        body: JSON.stringify(surveyData),
                    });
    
                    if (response1.ok) {
                        console.log("Survey data saved successfully");
                    } else {
                        console.error("Failed to save survey data");
                    }
                } catch (error) {
                    console.error("Error sending survey data:", error);
                }
            } else {
                console.error("Upload failed");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    
        console.log("Movie Name:", movie);
        setMovie(""); // Reset the input after submission
    };
    
    
    

    // For displaying video previews before uploading
    const videoPreviews = useMemo(() => {
        return files.map((file) => URL.createObjectURL(file));
    }, [files]);

    //-------------------------------------------------------------

    return (
        <main className="min-h-screen bg-gray-100 py-6'">
            {/* Handles the Videos and Film Name */}
            <div className='flex flex-col items-center '>
                {/* this is the Display Video font */}
                <h1 className="text-4xl font-bold mb-6 text-red-600">Displaying Video</h1>

            {/* displays the video */}
            <div className="flex flex-col items-center justify-center w-full">
    {videoUrls.length > 0 && videoUrls.map((url, index) => (
        <div key={index} className="flex flex-col items-center justify-center mb-4">
            <div className="w-full max-w-2xl">
                <ReactPlayer url={url} controls={true} width="100%" height="100%" />
            </div>
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
                        <div className='flex'>
                            <input
                                type="text"
                                value={movie}
                                onChange={(e) => setMovie(e.target.value)}
                                className="mt-2 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter movie title"
                            />
                        
                        </div>
                    </label>
                </form>

                <button
                    className="mb-6 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    onClick={handleUpload}>
                    Submit
                </button>

                {/* Preview selected videos */}
                {/* {videoPreviews.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold mb-4">Video Preview:</h2>
                        {videoPreviews.map((url, index) => (
                            <video key={index} controls width="300" src={url} className="mb-4" />
                        ))}
                    </div>
                )} */}
            </div>

            {/* Handles the Questions */}
            <div className='flex flex-col items-center '>
                <form onSubmit={handleQuestions} className="w-full max-w-lg mb-6">
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

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">List of Questions</h2>

                <ul className="w-full max-w-lg bg-white p-4 rounded-lg shadow-md">
                    {questionlist.map((question, index) => (
                        <li
                            key={index}
                            className="p-2 mb-2 bg-gray-100 text-gray-800 font-medium rounded-lg border border-gray-200">
                            {question}
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
