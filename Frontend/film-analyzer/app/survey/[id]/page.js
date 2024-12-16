"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import NavBar from "../../../components/NavBar";
import Gif from "../../../components/Gif";

export default function SurveyDetail({ params }) {
  const { id } = params;
  const [surveyData, setSurveyData] = useState(null);
  const [error, setError] = useState(null);
  const [isTimerDone, setIsTimerDone] = useState(false);
  const [forceLoading, setForceLoading] = useState(true);
  const [isQuestionsVisible, setIsQuestionsVisible] = useState(false);
  const [isAnswersVisible, setIsAnswersVisible] = useState(false);
  const [isInsightsVisible, setIsInsightsVisible] = useState(false);
  const { user, isLoaded } = useUser();

  const fetchSurveyData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/surveys/${id}`, {
        method: "GET",
      });
      if (response.status === 200) {
        const data = await response.json();
        setSurveyData(data);
      } else {
        setError("Survey not found");
      }
    } catch (err) {
      setError("Error fetching survey data");
      console.error(err);
    }
  };


const downloadResults = () => {
  if (!surveyData) return;

  const answers = surveyData.answers || [];

  // Add CSV headers
  let csvContent = "data:text/csv;charset=utf-8,Question,Answer\n";

  // Map through answers and append rows
  answers.forEach((a) => {
    const questionText = a.question__question_text.replace(/"/g, '""'); // Escape quotes
    const answerText = a.answer.replace(/"/g, '""');
    csvContent += `"${questionText}","${answerText}"\n`;
  });

  // Trigger download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.href = encodedUri;
  link.download = `survey_${id}_questions_answers.csv`;
  link.click();
};

const downloadEmotions = () => {
  if (!surveyData) return;

  const insights = surveyData.standard_answers || [];

  // Add CSV headers
  let csvContent = "data:text/csv;charset=utf-8,Emotion,Timestamp,Mood Based on Text,Watch Likelihood\n";

  // Map through insights and append rows
  insights.forEach((insight) => {
    const moodVideo = insight.mood_based_on_video || [];
    const moodText = insight.mood_based_on_text || "N/A";
    const watchLikelihood = insight.watch_likelihood || "N/A";

    // Add rows for each emotion
    if (moodVideo.length > 0) {
      moodVideo.forEach((emotion) => {
        const emotionText = emotion.emotion || "N/A";
        const timestamp = emotion.timestamp || "N/A";
        csvContent += `"${emotionText}","${timestamp}","${moodText}","${watchLikelihood}"\n`;
      });
    } else {
      // If no emotions, add a single row with mood text and watch likelihood
      csvContent += `"N/A","N/A","${moodText}","${watchLikelihood}"\n`;
    }
  });

  // Trigger download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.href = encodedUri;
  link.download = `survey_${id}_emotions.csv`;
  link.click();
};


  useEffect(() => {
    if (id) fetchSurveyData();
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimerDone(true);
      setForceLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!surveyData || forceLoading || !isTimerDone || !isLoaded) {
    return (
      <Gif gifSource="/gifs/KlapperIcon.gif" backgroundColor="rgb(153 27 27)" />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Error: {error}</p>
      </div>
    );
  }

  const { survey, questions, answers, standard_answers } = surveyData;

  return (
    <main className="min-h-screen bg-gray-900 text-white pb-10">
      <NavBar />
      {/* Header Section */}
      <header
        className="relative w-full flex items-center justify-center pt-16"
        style={{
          height: "150px",
          backgroundImage: `url(${survey.thumbnail_url || "/default-bg.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 text-center px-6 flex flex-col items-center justify-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-gold mb-2">
            {survey.film_name}
          </h1>
        </div>
      </header>

      {/* Video Section */}
      <section className="flex justify-center mt-10 px-6">
        <div
          className="relative w-full max-w-4xl bg-black rounded-lg shadow-lg overflow-hidden"
          style={{
            aspectRatio: "16/9",
            maxHeight: "500px",
          }}
        >
          <video
            controls
            src={survey.video_url}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
      </section>

   {/* Download Buttons */}
<section className="mt-10 px-6 max-w-5xl mx-auto">
  <div className="flex justify-center space-x-4">
    <button
      className="px-6 py-2 bg-gold text-black font-bold rounded-lg shadow-md hover:bg-yellow-400 transition-all"
      onClick={downloadResults}
    >
      Download Questions & Answers
    </button>
    <button
      className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-all"
      onClick={downloadEmotions}
    >
      Download Emotions
    </button>
  </div>
</section>


      {/* Questions Section (Dropdown) */}
      <section className="mt-10 px-6 max-w-5xl mx-auto">
        <div
          className="flex items-center justify-between cursor-pointer bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700"
          onClick={() => setIsQuestionsVisible(!isQuestionsVisible)}
        >
          <h2 className="text-3xl font-bold text-gold">Questions</h2>
          <span className="text-gold font-bold text-lg">
            {isQuestionsVisible ? "-" : "+"}
          </span>
        </div>
        {isQuestionsVisible && (
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((q, index) => (
              <li
                key={index}
                className="p-4 bg-[#7E1328] text-white rounded-lg shadow-md border border-gold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_5px_rgba(255,215,0,0.8)]"
              >
                <p className="text-md">{q.question__question_text}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Answers Section (Dropdown) */}
      <section className="mt-10 px-6 max-w-5xl mx-auto">
        <div
          className="flex items-center justify-between cursor-pointer bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700"
          onClick={() => setIsAnswersVisible(!isAnswersVisible)}
        >
          <h2 className="text-3xl font-bold text-gold">Answers</h2>
          <span className="text-gold font-bold text-lg">
            {isAnswersVisible ? "-" : "+"}
          </span>
        </div>
        {isAnswersVisible && (
          <div className="mt-4">
            <table className="w-full border-collapse border border-gray-700 bg-gray-800 rounded-lg">
              <thead>
                <tr>
                  <th className="border border-gray-700 px-4 py-2 text-gold">
                    Question
                  </th>
                  <th className="border border-gray-700 px-4 py-2 text-gold">
                    Answer
                  </th>
                </tr>
              </thead>
              <tbody>
                {answers.map((a, index) => (
                  <tr key={index}>
                    <td className="border border-gray-700 px-4 py-2 text-gray-300">
                      {a.question__question_text}
                    </td>
                    <td className="border border-gray-700 px-4 py-2 text-gray-300">
                      {a.answer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Survey Insights Section (Dropdown) */}
      <section className="mt-10 px-6 max-w-5xl mx-auto">
        <div
          className="flex items-center justify-between cursor-pointer bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700"
          onClick={() => setIsInsightsVisible(!isInsightsVisible)}
        >
          <h2 className="text-3xl font-bold text-gold">Survey Insights</h2>
          <span className="text-gold font-bold text-lg">
            {isInsightsVisible ? "-" : "+"}
          </span>
        </div>
        {isInsightsVisible && (
          <ul className="mt-6 space-y-6">
            {standard_answers.map((answer, index) => (
              <li
                key={index}
                className="p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700"
              >
                <h3 className="text-lg font-semibold text-gold mb-3">
                  Insight {index + 1}
                </h3>
                <div className="mb-4">
                  <p className="text-gray-300 font-bold">
                    Mood Based on Video:
                  </p>
                  <ul className="mt-2 space-y-1 pl-4 list-disc">
                    {answer.mood_based_on_video.map((emotion, i) => (
                      <li key={i} className="text-gray-300">
                        <span className="font-bold">Emotion:</span>{" "}
                        {emotion.emotion},{" "}
                        <span className="font-bold">Timestamp:</span>{" "}
                        {emotion.timestamp}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <p className="text-gray-300 font-bold">Mood Based on Text:</p>
                  <p className="text-gray-300 mt-1">
                    {answer.mood_based_on_text}
                  </p>
                </div>
                <div>
                  <p className="text-gray-300 font-bold">Watch Likelihood:</p>
                  <p className="text-gray-300 mt-1">
                    {answer.watch_likelihood}/10
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
