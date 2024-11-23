"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../../../components/NavBar";

export default function SurveyDetail({ params }) {
  const { id } = params; // Extract dynamic `id` from the URL
  const [surveyData, setSurveyData] = useState(null);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (id) fetchSurveyData();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!surveyData) {
    return <div>Loading...</div>;
  }

  const { survey, questions, answers } = surveyData;

  return (
    <main
      className="min-h-screen bg-parchment text-gray-800 p-6 pt-20"
      style={{ backgroundColor: "#f5f5dc", fontFamily: "Georgia, serif" }}
    >
      <NavBar />
      <h1 className="text-red-800">
        {survey.film_name} (ID: {survey.survey_id})
      </h1>
      <video controls src={survey.video_url} className="my-4"></video>
      <h2 className="text-blue-800">Questions</h2>
      <ul>
        {questions.map((q, index) => (
          <li key={index}>{q.question__question_text}</li>
        ))}
      </ul>
      <h2 className="text-blue-800">Answers</h2>
      <ul>
        {answers.map((a, index) => (
          <li key={index}>
            <strong>{a.question__question_text}:</strong> {a.answer}
          </li>
        ))}
      </ul>
    </main>
  );
}
