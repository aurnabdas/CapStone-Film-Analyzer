'use client';
import React, { useState } from 'react';
import FaceTest from '../../components/FaceTest'; 
import Script from 'next/script';

export default function Review() {
  const videoName = 'Movies Name';
  const questions = ['What is your opinion of the trailer?', 'How did you feel throughout', 'Would you watch this in theaters?'];

  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [submittedAnswers, setSubmittedAnswers] = useState(Array(questions.length).fill(''));
  const [isRecording, setIsRecording] = useState(false); // Control recording state
  const [emotions, setEmotions] = useState([]); // Store captured emotions

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

  // Handle input change for each question
  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  // Handle answer submission
  const handleSubmitAnswer = (index) => {
    const updatedSubmittedAnswers = [...submittedAnswers];
    updatedSubmittedAnswers[index] = answers[index];
    setSubmittedAnswers(updatedSubmittedAnswers);

    stopRecording(); // Stop recording emotions when user submits an answer

    console.log(`Answer to question ${index + 1}: ${answers[index]}`);
    console.log('Captured emotions during review:', emotions);

    const updatedAnswers = [...answers];
    updatedAnswers[index] = '';
    setAnswers(updatedAnswers);
  };

  return (
    <div className="review-container" style={{ padding: '20px' }}>
      <Script src="/face-api.min.js" strategy="beforeInteractive" /> {/* Load face-api */}

      {/* Video Name */}
      <h2 style={{ marginBottom: '20px' }}>{videoName}</h2>

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

      {/* Hidden FaceTest component to capture emotions */}
      <FaceTest isRecording={isRecording} onEmotionsCaptured={handleEmotionsCaptured} />
    </div>
  );
}
