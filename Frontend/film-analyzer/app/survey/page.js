"use client"
import React, { useMemo } from 'react';
import ReactPlayer from 'react-player';
import "../globals.css";
import { useSelector, useDispatch } from 'react-redux';
import { setFiles, setQuestion, setMovie, setQuestionslist } from '../store/reducer';



export default function Survey() {
    const dispatch = useDispatch();

    const files = useSelector((state) => state.files);
    const question = useSelector((state) => state.question)
    const questionlist = useSelector((state) => state.questionlist)
    const movie = useSelector((state) => state.movie)

    // console.log(useContext(StateContext)); //added to see if the states were of the correct type 


    const handleFile = (e) => {
        const selectedFiles = e.target.files;
        dispatch(setFiles(Array.from(selectedFiles))); // Set it as an array
        // this code right here gave me a hard time. first i forgot you are using a copy of the value you provided hence ..files, 
        //notice how within setFiles([]) there is are array brackets, because you are set the array within the params. that is why when you ...files, it basically uncompresses each elements in a sense
        //next its import to remember that selectedFiles itself is a array, so you need to spread out each elements using ...selectedFiles as wekk
        dispatch(setFiles([...files , ...selectedFiles])) 
        console.log(files);
    };

    const handleQuestions = (e) => {
        e.preventDefault();
        if(question === ""){
            alert("Reenter")

            //you have to return otherwise the empty string will still be set
            return
        }

        //the same idea here just like when we used setFiles, the difference is yes questionsList is a array, but questions itself is not infact its a element. so you can just add that in normally
        dispatch(setQuestionslist([...(questionlist), question]));
        dispatch(setQuestion(""));
        
    };
////////////////////DRAG AND DROP FUNCTIONS///////////////////////////////////////////
    // const checkIfVideo = (file) => file.type.startsWith("video");

    // const handleDrop = (e) => {
    //     e.preventDefault();
    //     const droppedFiles = e.dataTransfer.files;
    //     setFiles(Array.from(droppedFiles));  // Set dropped files in state as an array
    // };

    // const handleDragOver = (e) => {
    //     e.preventDefault();
    // };

    // console.log("question:", question); 
    // console.log("questionlist:", questionlist); 
    // console.log("movie:", movie); 
    // console.log("Files:", files); 
//////////////////////////////////////////////

    const videoUrls = useMemo(() =>{
        if (!files) return [];

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

        dispatch(setMovie(movie));
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
                        onChange={(e) => dispatch(setMovie(e.target.value))}
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
                        onChange={(e) => dispatch(setQuestion(e.target.value))}
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
