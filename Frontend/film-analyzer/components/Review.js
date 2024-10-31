'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import FaceTest from './FaceTest'; // Adjust path if needed
import Script from 'next/script';
import ReactPlayer from 'react-player';
import NavBar from './NavBar';

const Review = () => {
  const { user } = useUser();
  const router = useRouter();
  const videoName = "Movie's Name";

  const [isRecording, setIsRecording] = useState(false);
  const [emotions, setEmotions] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [submittedAnswers, setSubmittedAnswers] = useState(Array(questions.length).fill(''));

  // Redirect Studio role users to the homepage
  useEffect(() => {
    if (user && user.publicMetadata.role === 'Studio') {
      router.push("/");
    }
  }, [user, router]);

  // Fetch video URL on page load
  useEffect(() => {
    const handleUpload = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/videoURL', {
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        setVideoUrls([data.url]);
      } else {
        console.error("Failed to fetch video URL");
      }
    };
    handleUpload();
  }, []);

  // Fetch questions on page load
  useEffect(() => {
    const handleQuestions = async () => {
      const response = await fetch('http://127.0.0.1:8000/myapis/questions/', {
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions); // Assuming the API response has `questions` as an array
      } else {
        console.error("Failed to fetch questions");
      }
    };
    handleQuestions();
  }, []);

  // Update answers and submittedAnswers when questions are set
  useEffect(() => {
    if (questions.length > 0) {
      setAnswers(Array(questions.length).fill(''));
      setSubmittedAnswers(Array(questions.length).fill(''));
    }
  }, [questions]);

  // Handle emotion capture and storage
  const handleEmotionsCaptured = (capturedEmotions) => {
    setEmotions((prevEmotions) => [...prevEmotions, capturedEmotions]);
    console.log('Captured emotions:', capturedEmotions);
  };

  // Recording functions
  const startRecording = () => setIsRecording(true);
  const stopRecording = () => setIsRecording(false);

  // Submit answer function
  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmitAnswer = (index) => {
    const updatedSubmittedAnswers = [...submittedAnswers];
    updatedSubmittedAnswers[index] = answers[index];
    setSubmittedAnswers(updatedSubmittedAnswers);
    stopRecording();
    console.log(`Answer to question ${index + 1}: ${answers[index]}`);
    console.log('Captured emotions during review:', emotions);
    const updatedAnswers = [...answers];
    updatedAnswers[index] = '';
    setAnswers(updatedAnswers);
  };

  return (
    <div
      className="relative bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/images/reviewBackground.jpg')",
        backgroundAttachment: "fixed",
        backgroundPosition: "center top",
        height: "100vh",
      }}
    >
      <NavBar/>
      {/* Video Section */}
      <section className="flex items-center justify-center h-screen" style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
        <div className="container mx-auto text-center">
          <Script src="/face-api.min.js" strategy="beforeInteractive" />
          <h2 className="text-[60px] font-bold text-[#D5A036] mb-4">{videoName}</h2>

          {/* Video Display */}
          <div className="w-full max-w-3xl mx-auto mb-8">
            {videoUrls.length > 0 && videoUrls.map((url, index) => (
              <ReactPlayer key={index} url={url} controls width="100%" height="100%" />
            ))}
          </div>
        </div>
      </section>

      {/* Questions Section */}
      <section className="py-24 bg-black bg-opacity-70">
      <div className="container mx-auto text-center">
        {questions.map((question, index) => (
          <div key={index} className="mb-8 p-6 bg-gray-900 bg-opacity-80 rounded-lg shadow-lg max-w-3xl mx-auto">
            <label htmlFor={`question-${index}`} className="block text-lg mb-4">
              {question}
            </label>
            <input
              type="text"
              id={`question-${index}`}
              value={answers[index]}
              onChange={(e) => {
                const newAnswers = [...answers];
                newAnswers[index] = e.target.value;
                setAnswers(newAnswers);
              }}
              placeholder={`Answer for question ${index + 1}`}
              className="w-full p-4 mb-4 rounded-md text-black"
            />
            <button
              onClick={() => {
                const newSubmittedAnswers = [...submittedAnswers];
                newSubmittedAnswers[index] = answers[index];
                setSubmittedAnswers(newSubmittedAnswers);
                console.log(`Submitted answer for question ${index + 1}:`, answers[index]);
              }}
              className="px-8 py-3 rounded-md bg-[#D5A036] text-white hover:bg-yellow-600 transition"
            >
              Submit Answer
            </button>
          </div>
          ))}

          {/* Emotion Capture Buttons */}
          <div className="flex justify-center mt-10 gap-4">
            <button
              onClick={startRecording}
              disabled={isRecording}
              className={`px-8 py-3 rounded-md text-white transition ${isRecording ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isRecording ? 'Recording Emotions...' : 'Start Recording Emotions'}
            </button>
            <button
              onClick={stopRecording}
              disabled={!isRecording}
              className="px-8 py-3 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
            >
              Stop Recording
            </button>
          </div>

          {/* Captured Emotions */}
          <div className="mt-12 text-center">
            <h3 className="text-[36px] font-semibold text-[#D5A036]">Captured Emotions:</h3>
            <div className="flex flex-wrap justify-center mt-4 gap-2">
              {emotions.map((emotion, index) => (
                <span key={index} className="px-4 py-2 rounded-full bg-gray-800 text-white shadow-lg">
                  {emotion}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FaceTest Component */}
      <FaceTest isRecording={isRecording} onEmotionsCaptured={handleEmotionsCaptured} />
    </div>
  );
};

export default Review;