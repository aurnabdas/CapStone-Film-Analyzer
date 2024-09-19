"use client"
import React, { useMemo, useState } from 'react';
import ReactPlayer from 'react-player';
import "../globals.css";

export default function Review() {
    const [files, setFiles] = useState([]);
    const [questionlist, setQuestionslist] = useState([]);
    const [question, setQuestion] = useState("");
    const [movie, setMovie] = useState("");

    const handleFile = (e) => {
        const selectedFiles = e.target.files;
        setFiles(Array.from(selectedFiles));  // Set it as an array
        console.log(files);
    };

    const handleQuestions = (e) => {
        e.preventDefault();
        if(question === ""){
            alert("Reenter")

            //you have to return otherwise the empty string will still be set
            return
        }

        setQuestionslist([...questionlist, question]);
        setQuestion("");
    };

    const checkIfVideo = (file) => file.type.startsWith("video");

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = e.dataTransfer.files;
        setFiles(Array.from(droppedFiles));  // Set dropped files in state as an array
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const videoUrls = useMemo(() =>{
       return files.map(file => URL.createObjectURL(file));


    }, [files])

    const handleFilmName = (e) => {
        e.preventDefault()
        if(movie === ""){
            alert("Reenter")

            //you have to return otherwise the empty string will still be set
            return
        }
        console.log(movie)

        setMovie("")
    }

    return (
        // this puts everything in the middle
        <main className="min-h-screen bg-gray-100 py-6'">

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

            {/* Drag and Drop area (Optional, uncomment if needed) */}
            {/* <div onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="w-full max-w-lg h-40 border-4 border-dashed border-gray-300 flex items-center justify-center mb-6 bg-white">
                <p className="text-gray-500">Drag Files Here</p>
            </div> */}

            <input
                type="file"
                onChange={handleFile}
                multiple
                className="mb-6 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* max-w-lg limits the size of the form to whatever is specified */}
            <form onSubmit={handleFilmName} className="w-full  max-w-lg">
                <label className="block text-gray-700 text-lg mb-2">
                    Movie Title:


                    <div className='flex'> 
                    <input
                        type="text"
                        value={movie}
                        onChange={(e) => setMovie(e.target.value)}
                        className="mt-2 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your question"
                    />

                <button
                    type="submit"
                    className=" p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                    Enter
                </button>

                </div>
                </label>
                
            </form>
        </div>


        
        <div className='flex flex-col items-center '> 

            {/* this is the form button with the Add Question button */}
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

            {/* the outer box of the text box */}
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
