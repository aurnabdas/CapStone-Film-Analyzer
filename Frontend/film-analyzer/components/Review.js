'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import FaceTest from './FaceTest'; // Adjust path if needed
import Script from 'next/script';
import ReactPlayer from 'react-player';
import NavBar from './NavBar';
import QuestionBox from './QuestionsBox'
import Swal from 'sweetalert2'



const Review = ({movieName, userName}) => {
  const { user } = useUser();
  const router = useRouter();
  

  const [isRecording, setIsRecording] = useState(false);
  const [showVideo, setShowVideo] = useState(false); // New state to control video visibility
  const [playing, setPlaying] = useState(false); // New state to control video playback
  const [emotions, setEmotions] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [submittedAnswers, setSubmittedAnswers] = useState(Array(questions.length).fill(''));
  const playerRef = useRef(null);
  const [submittedQuestions, setSubmittedQuestions] = useState([]); 
  const [firstQuestionAnswer, setFirstQuestionAnswer] = useState("");
  const [secondQuestionAnswer, setSecondQuestionAnswer] = useState("");
  const [showQuestions, setShowQuestions] = useState(false); 
  const [showButtons, setShowButtons] = useState(true);
  const [firstQuestionAnswered, setFirstQuestionAnswered] = useState(false);
  const [secondQuestionAnswered, setSecondQuestionAnswered] = useState(false);
  const [showFinalButton, setShowFinalButton] = useState(false);
  const [lastPlayedTime, setLastPlayedTime] = useState(0);
  const [maxProgress, setMaxProgress] = useState(0);


  

  useEffect(() => {
    if (user && user.publicMetadata.role === 'Studio') {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    const handleUpload = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/videoURL', { 
        method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieName)
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

  useEffect(() => {
    const handleQuestions = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/getcustomquestions', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieName)
  });
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.message || []);
      } else {
        console.error("Failed to fetch questions");
      }
    };
    handleQuestions();
  }, [movieName]);

  useEffect(() => {
    if (questions.length > 0) {
      setAnswers(Array(questions.length).fill(''));
      setSubmittedAnswers(Array(questions.length).fill(''));
    }
  }, [questions]);

  const handleEmotionsCaptured = (capturedEmotions) => {
    if (!playerRef.current) {
      console.error("Player reference is not available.");
      return;
    }
  
    // Get the current playback time in seconds
    const currentTime = playerRef.current.getCurrentTime();
  
    // Convert seconds to MM:SS format
    const formattedTime = new Date(currentTime * 1000).toISOString().substr(14, 5);
  
    // Update emotions state with emotion and timestamp
    setEmotions((prevEmotions) => [
      ...prevEmotions,
      { emotion: capturedEmotions, timestamp: formattedTime },
    ]);
  
    // Log captured emotion with timestamp
    console.log('Captured emotion:', { emotion: capturedEmotions, timestamp: formattedTime });
  };
  
  
  const startRecordingAndPlayVideo = () => {
    setIsRecording(true);
    setShowVideo(true); // Show the video player when starting
    setPlaying(true); // Start playing the video
    setShowQuestions(false); // this is meriely to not show the questions when the video is playing once its stops playing you can see the questions
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

  useEffect(() => {
    
    setSubmittedQuestions(new Array(questions.length).fill(false));
  }, [questions]);


  const handleSubmitAnswer = async (index) => {
    const answer = answers[index];
    const question = questions[index];
  
    // Checks for empty answers from the user
    if (!answer.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Answer was left blank... Try Again",
      });
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/custom-question-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, answer, userName })
      });
  
      const updatedSubmittedQuestions = [...submittedQuestions];
      if (response.ok) {
        console.log(`Successfully submitted answer for question: ${question}`);
  
        const updatedSubmittedAnswers = [...submittedAnswers];
        updatedSubmittedQuestions[index] = true;
        updatedSubmittedAnswers[index] = answer;
        setSubmittedQuestions(updatedSubmittedQuestions);
        setSubmittedAnswers(updatedSubmittedAnswers);
  
        // Clear the answer input
        const updatedAnswers = [...answers];
        updatedAnswers[index] = '';
        setAnswers(updatedAnswers);
        stopRecordingAndPauseVideo();
  
      } else {
        const data = await response.json();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "You have already answered this question.",
          showConfirmButton: false,
          timer: 1750
        });
        
        if (data.message === "You have already answered this question.") {
          updatedSubmittedQuestions[index] = true; 
          setSubmittedQuestions(updatedSubmittedQuestions);
        }
      }
  
      // Check if all questions are answered in both cases (new answer or already answered)
      checkAllQuestionsAnswered(updatedSubmittedQuestions);
  
    } catch (error) {
      console.error("Error submitting answer:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred while submitting the answer. Please try again.",
        showConfirmButton: false,
        timer: 1750
      });
      
    }
  };
  
  const checkAllQuestionsAnswered = (updatedSubmittedQuestions) => {
    if (updatedSubmittedQuestions.every(answered => answered)) {
      setShowFinalButton(true);
    }
  };
  

  const handleFirstQuestionSubmit = async () => {
    if (!firstQuestionAnswer.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Answer was left blank... Try Again",
        showConfirmButton: false,
        timer: 1750
      });
      return;
    }
    Swal.fire({
      position: "center",
      icon: "success",
      title: "First answer saved successfully.",
      showConfirmButton: false,
      timer: 1750
    });
    
    setFirstQuestionAnswered(true);
  
      
  };

  const handleSecondQuestionSubmit = () => {
    if (isNaN(secondQuestionAnswer) || secondQuestionAnswer < 1 || secondQuestionAnswer > 10) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a rating between 1 and 10.",
        showConfirmButton: false,
        timer: 1750
      });
      return;
    }
  
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Second answer saved successfully.",
      showConfirmButton: false,
      timer: 1750
    });
    
    setSecondQuestionAnswered(true);
    
  };

  const dynamicQuestion = (emotions) => {
    if (emotions.length === 0) {
      return "Elaborate on what you felt during this video.";
    }
  
    // Count occurrences of each emotion
    const emotionCount = emotions.reduce((acc, { emotion }) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {});
  
    // Find the most frequent emotion(s)
    const maxCount = Math.max(...Object.values(emotionCount));
    const mostFrequentEmotions = Object.keys(emotionCount).filter(
      (emotion) => emotionCount[emotion] === maxCount
    );
  
    // If there’s a tie, pick the latest emotion from the tied emotions
    const latestEmotion = emotions.reverse().find(({ emotion }) =>
      mostFrequentEmotions.includes(emotion)
    );
  
    // Generate the question
    return `To elaborate on why you felt "${latestEmotion.emotion}" during ${latestEmotion.timestamp}.`;
  };
  
  

  // i had trouble redirecting used this https://stackoverflow.com/questions/58173809/next-js-redirect-from-to-another-page
  // the idea here is this is what submits the intial general quesstions, then we delete the survey from this users page, and redirect them to their todo list
  const handleFinalSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/standard-question-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({firstQuestionAnswer,secondQuestionAnswer,emotions,userName,movieName}),
      });
  
      if (response.ok) {
        const deleteResponse = await fetch(`http://127.0.0.1:8000/api/todos/${userName}/${movieName}`, {
          method: 'DELETE',
        });
  
        if (deleteResponse.ok) {
          router.push('/todo'); 
        } else {
          const data = await deleteResponse.json();
          Swal.fire({
            icon: "error",
            title: "error",
            text: "Failed to delete data.",
            showConfirmButton: false,
            timer: 1750
          });
          
        }
      } else {
        const data = await response.json();
        Swal.fire({
          icon: "error",
          title: "error",
          text: "Failed to delete data.",
          showConfirmButton: false,
          timer: 1750
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      Swal.fire({
        icon: "error",
        title: "error",
        text: "An error occurred while submitting the data. Please try again.",
        showConfirmButton: false,
        timer: 1750
      });
    }

    
  };
  
  const handleSeek = (seekTime) => {
    // Prevent seeking both forward and backward
    if (seekTime !== lastPlayedTime) {
      if (playerRef.current) {
        playerRef.current.seekTo(lastPlayedTime, "seconds");
      }
    }
  };
  
  
  const handleProgress = (state) => {
    // Update the last played position as the video progresses
    setLastPlayedTime(state.playedSeconds);
  };

  
  
 

  return (
    <div className="relative bg-cover bg-center text-white" style={{ backgroundImage: "url('/images/reviewBackground.jpg')", backgroundAttachment: "fixed", backgroundPosition: "center top", height: "100vh" }}>
      <NavBar />
      <FaceTest isRecording={isRecording} onEmotionsCaptured={handleEmotionsCaptured} />
      <section className="flex items-center justify-center h-screen" style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
        <div className="container mx-auto text-center">
          <Script src="/face-api.min.js" strategy="beforeInteractive" />
          <h2 className="text-[60px] font-bold text-[#D5A036] mb-4">{movieName}</h2>
          {showVideo && (
            <div className="w-full max-w-3xl mx-auto mb-8">
              {videoUrls.length > 0 && videoUrls.map((url, index) => (
                <ReactPlayer
                key={index}
                url={url}
                ref={playerRef} // Pass the reference to ReactPlayer
                controls = {false}
                width="100%"
                height="100%"
                playing={playing}
                onProgress={handleProgress} // Track video progress
                onSeek={handleSeek} // Handle seeking events
                onEnded={() => {
                  console.log("Video has ended.");
                  setShowQuestions(true);
                  setShowButtons(false);
                  setIsRecording(false);
                  console.log(emotions); // Log emotions when video ends
                }}
              />           
              ))}
            </div>
          )}
          {showButtons && ( 
          <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={startRecordingAndPlayVideo}
            disabled={isRecording}
            className={`px-8 py-3 rounded-md text-white transition ${isRecording ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isRecording ? 'Recording Emotions...' : 'Play Video & Start Recording'}
          </button>
          </div>
          )}
  
          {showQuestions && !(firstQuestionAnswered && secondQuestionAnswered) && (
            <div className="flex justify-center mt-8 space-x-8">
              <QuestionBox
                question={dynamicQuestion(emotions)} 
                answer={firstQuestionAnswer}
                setAnswer={setFirstQuestionAnswer}
                placeholder="Your answer here"
                onSubmit={handleFirstQuestionSubmit}
              />
              <QuestionBox
                question="Would you watch this film in the future? Rate on a scale of 1-10"
                answer={secondQuestionAnswer}
                setAnswer={(value) => setSecondQuestionAnswer(Math.max(1, Math.min(10, Number(value))))}
                placeholder="Rate 1-10"
                onSubmit={handleSecondQuestionSubmit}
                type="number"
              />
            </div>
          )}

        {showFinalButton && (
      
        <div className="flex justify-center mt-8 space-x-8">
          <button 
            onClick={handleFinalSubmit}
            className="px-8 py-3 rounded-md bg-red-600 text-white hover:bg-red-700 transition ml-4"> 
            End Survey 
          </button> 
        </div>
      
    )}

        </div>
      </section>
  
      {showQuestions && (firstQuestionAnswered && secondQuestionAnswered) && (
        <section className="py-24 bg-black bg-opacity-70">
          <div className="container mx-auto text-center">
            {questions.map((question, index) => (
              !submittedQuestions[index] && (
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
              )
            ))}
          </div>
        </section>
      )}

    
      
      
    </div>
  );  
    
};

export default Review;