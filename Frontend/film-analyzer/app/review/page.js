'use client';
import React, { useState, useEffect } from 'react';
import FaceTest from '../../components/FaceTest'; 
import Script from 'next/script';
import ReactPlayer from 'react-player';


////////////////states////////////////////////
export default function Review() {
  const videoName = 'Movies Name';
  const questions = ['What is your opinion of the trailer?', 'How did you feel throughout', 'Would you watch this in theaters?'];

  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [submittedAnswers, setSubmittedAnswers] = useState(Array(questions.length).fill(''));
  const [isRecording, setIsRecording] = useState(false); // Control recording state
  const [emotions, setEmotions] = useState([]); // Store captured emotions
  const [videoUrls, setVideoUrls] = useState([]);

////////////////////////////////////////
const handleEmotionsCaptured = (capturedEmotions) => {
    setEmotions((prevEmotions) => [...prevEmotions, capturedEmotions]);
    console.log('Captured emotions:', capturedEmotions);
  };

const startRecording = () => {
    setIsRecording(true); // Start FaceTest recording
  };

const stopRecording = () => {
    setIsRecording(false); // Stop FaceTest recording
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

    stopRecording();

    console.log(`Answer to question ${index + 1}: ${answers[index]}`);
    console.log('Captured emotions during review:', emotions);

    const updatedAnswers = [...answers];
    updatedAnswers[index] = '';
    setAnswers(updatedAnswers);
  };

const handleUpload = async () => {
      
    
    const response = await fetch('http://127.0.0.1:8000/api/videoURL', {
        method: 'GET',
    });

    if (response.ok) {
        const data = await response.json();
        // console.log(data.url);
        const fullUrl = data.url;
        setVideoUrls([fullUrl]);
    } else {
        console.error("Failed to fetch video URL");
    }

  };

// this makes sure that the function that allows for the video content to be displayed is used right when the page loads
useEffect(() => {
    handleUpload();
    }, []);

  ///////////////functions/////////////////////////
  return (
    <div className="review-container" style={{ padding: '20px' }}>
      <Script src="/face-api.min.js" strategy="beforeInteractive" /> {/* Load face-api */}

      {/* Video Name */}
      <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#007bff' }}>{videoName}</h2>

      <div className="flex flex-col items-center justify-center w-full">
          {videoUrls.length > 0 && videoUrls.map((url, index) => (
            <div key={index} className="flex flex-col items-center justify-center mb-4">
              <div className="w-full max-w-2xl">
                <ReactPlayer url={url} controls={true} width="100%" height="100%" />
              </div>
            </div>
          ))}
      </div>


      {/* Questions and Textboxes for Answers */}
      {questions.map((question, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <label htmlFor={`question-${index}`} style={{ display: 'block', marginBottom: '10px' }}>
            {question}
          </label>

          <input
            type="text"
            id={`question-${index}`}
            value={answers[index]} // Bind answer to the input field
            onChange={(e) => handleAnswerChange(index, e.target.value)} // Handle input change
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginBottom: '10px',
            }}
            placeholder={`Answer for question ${index + 1}`}
          />

          <button
            onClick={() => handleSubmitAnswer(index)} // Handle submit for this question
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}>
            Submit Answer
          </button>
        </div>
      ))}

      {/* Start/Stop Buttons for Emotion Capture */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={startRecording}
          disabled={isRecording} // Disable button if already recording
          style={{
            padding: '10px 20px',
            backgroundColor: isRecording ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px',
          }}>
          {isRecording ? 'Recording Emotions...' : 'Start Recording Emotions'}
        </button>

        <button
          onClick={stopRecording}
          disabled={!isRecording} // Disable button if not recording
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
          Stop Recording
        </button>
      </div>

      {/* Hidden FaceTest component to capture emotions */}
      <FaceTest isRecording={isRecording} onEmotionsCaptured={handleEmotionsCaptured} />

      {/* Display Captured Emotions */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <h3>Captured Emotions:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {emotions.map((emotion, index) => (
            <span key={index} style={{
              padding: '8px 12px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #ccc',
              borderRadius: '20px',
              margin: '5px',
              fontWeight: 'bold',
              color: '#333',
              boxShadow: '0px 0px 5px rgba(0,0,0,0.1)'
            }}>
              {emotion}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
