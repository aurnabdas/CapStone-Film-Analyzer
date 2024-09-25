'use client'

import React, { useState } from 'react';

export default function Review() {
  
  const videoName = 'Movies Name'; 
  const questions = ['What is your opinion of the trailer?', 'How did you feel throughout', 'Would you watch this in theaters?'];

  // State to store answers
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [submittedAnswers, setSubmittedAnswers] = useState(Array(questions.length).fill(''));



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

    
    console.log(`Answer to question ${index + 1}: ${answers[index]}`);

   
    const updatedAnswers = [...answers];
    updatedAnswers[index] = ''; 
    setAnswers(updatedAnswers);
  };

  return (
    <div className="review-container" style={{ padding: '20px' }}>


      {/* Video Placeholder */}
      <div className="video-player" style={{ backgroundColor: '#ddd', width: '600px', height: '350px', marginBottom: '20px' }}>
        <p style={{ textAlign: 'center', lineHeight: '350px', color: '#555' }}>Video Placeholder</p>
      </div>


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
    </div>
  );
}
