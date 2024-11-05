'use client';
import React, { useState, useEffect, useRef } from 'react';
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
  const [showVideo, setShowVideo] = useState(false); // New state to control video visibility
  const [playing, setPlaying] = useState(false); // New state to control video playback
  const [emotions, setEmotions] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [submittedAnswers, setSubmittedAnswers] = useState(Array(questions.length).fill(''));
  const playerRef = useRef(null);

  useEffect(() => {
    if (user && user.publicMetadata.role === 'Studio') {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    const handleUpload = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/videoURL', { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        setVideoUrls([data.url]);
      } else {
        console.error("Failed to fetch video URL");
      }
    };
    handleUpload();
  }, []);

  useEffect(() => {
    const handleQuestions = async () => {
      const response = await fetch('http://127.0.0.1:8000/myapis/questions/', { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
      } else {
        console.error("Failed to fetch questions");
      }
    };
    handleQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      setAnswers(Array(questions.length).fill(''));
      setSubmittedAnswers(Array(questions.length).fill(''));
    }
  }, [questions]);

  const handleEmotionsCaptured = (capturedEmotions) => {
    setEmotions((prevEmotions) => [...prevEmotions, capturedEmotions]);
    console.log('Captured emotions:', capturedEmotions);
  };

  const startRecordingAndPlayVideo = () => {
    setIsRecording(true);
    setShowVideo(true); // Show the video player when starting
    setPlaying(true); // Start playing the video
  };

  const stopRecordingAndPauseVideo = () => {
    setIsRecording(false);
    setPlaying(false); // Pause the video
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmitAnswer = (index) => {
    const updatedSubmittedAnswers = [...submittedAnswers];
    updatedSubmittedAnswers[index] = answers[index];
    setSubmittedAnswers(updatedSubmittedAnswers);
    stopRecordingAndPauseVideo();
    console.log(`Answer to question ${index + 1}: ${answers[index]}`);
    console.log('Captured emotions during review:', emotions);
    const updatedAnswers = [...answers];
    updatedAnswers[index] = '';
    setAnswers(updatedAnswers);
  };

  return (
    <div className="relative bg-cover bg-center text-white" style={{ backgroundImage: "url('/images/reviewBackground.jpg')", backgroundAttachment: "fixed", backgroundPosition: "center top", height: "100vh" }}>
      <NavBar/>
      <section className="flex items-center justify-center h-screen" style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
        <div className="container mx-auto text-center">
          <Script src="/face-api.min.js" strategy="beforeInteractive" />
          <h2 className="text-[60px] font-bold text-[#D5A036] mb-4">{videoName}</h2>
          
          {/* Video Display */}
          {showVideo && (
            <div className="w-full max-w-3xl mx-auto mb-8">
              {videoUrls.length > 0 && videoUrls.map((url, index) => (
                <ReactPlayer
                  key={index}
                  url={url}
                  ref={playerRef}
                  controls
                  width="100%"
                  height="100%"
                  playing={playing} // Control playback with `playing` state
                />
              ))}
            </div>
          )}

          <button
            onClick={startRecordingAndPlayVideo}
            disabled={isRecording}
            className={`px-8 py-3 rounded-md text-white transition ${isRecording ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isRecording ? 'Recording Emotions...' : 'Play Video & Start Recording'}
          </button>
          <button
            onClick={stopRecordingAndPauseVideo}
            disabled={!isRecording}
            className="px-8 py-3 rounded-md bg-red-600 text-white hover:bg-red-700 transition ml-4"
          >
            Stop Recording & Pause Video
          </button>
        </div>
      </section>

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
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder={`Answer for question ${index + 1}`}
                className="w-full p-4 mb-4 rounded-md text-black"
              />
              <button
                onClick={() => handleSubmitAnswer(index)}
                className="px-8 py-3 rounded-md bg-[#D5A036] text-white hover:bg-yellow-600 transition"
              >
                Submit Answer
              </button>
            </div>
          ))}
        </div>
      </section>

      <FaceTest isRecording={isRecording} onEmotionsCaptured={handleEmotionsCaptured} />
    </div>
  );
};

export default Review;
