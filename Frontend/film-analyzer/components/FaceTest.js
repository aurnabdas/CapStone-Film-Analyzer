"use client";

import { useEffect, useState } from "react";

export default function FaceTest({ onEmotionsCaptured, isRecording }) {
  const [prevEmotion, setPrevEmotion] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false); // Ensure models are fully loaded

  useEffect(() => {
    let video = null;
    let canvas = null;
    let intervalId = null;

    // this took a while for me to understand and write so therefore i will be heavily commented
    // first thing is we are dynamically loading in a script called face-api.min.js, which is used to make out facetag component work
    // the script is being loading async, which is why there is a await tag whenever this function is called on 
    // making the facetag work async makes sense, but the issue was i didnt know the file that the component uses was not being loaded in at the same time as other resources
    // now a Promise is used because the script is being laoded async, and you need to know if the script is ready before actually using it 
    // if everything goes accourding to plan the onload handeler will trigger, which will first console log everything is good and second resolve the promise so that the function can offically be used by loadModels, which then load models does it own thing.
    const loadFaceApiScript = () =>{
      return new Promise ((resolve, reject) =>{
        const script = document.createElement("script");
        script.src = "/face-api.min.js";
        script.async = true;
        script.onload = () =>{
          console.log('face api script is loaded')
          resolve();
        }
        script.onerror = () => reject("Failed to load face-api.min.js");
    document.body.appendChild(script);
      });
    }

    const loadModels = async () => {
      await loadFaceApiScript(); // this function sole purpose is to dynamically load the files that is needed to actually use the face api script. this is done during runtime
      if (window.faceapi) {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models"),
          faceapi.nets.ageGenderNet.loadFromUri("/models"),
        ]);
        setModelsLoaded(true); // Indicate models are loaded
      }
    };

    const initializeVideo = async () => {
      video = document.createElement("video");
      video.setAttribute("style", "display: none;");
      document.body.appendChild(video);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        video.addEventListener("loadeddata", () => {
          console.log("Video is ready to play.");
          video.play(); // Start video playback
          if (isRecording) startDetection(); // Start detection if recording
        });
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    const getDominantEmotion = (emotions) => {
      let maxEmotion = "";
      let maxScore = 0;

      for (const emotion in emotions) {
        if (emotions[emotion] > maxScore) {
          maxEmotion = emotion;
          maxScore = emotions[emotion];
        }
      }
      return maxEmotion;
    };

    const startDetection = () => {
      if (!modelsLoaded) return; // Wait for models to load

      canvas = faceapi.createCanvasFromMedia(video);
      const videoContainer = document.getElementById("video-container");
      videoContainer.append(canvas);

      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);

      intervalId = setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        if (resizedDetections.length > 0) {
          const emotions = resizedDetections[0].expressions;
          const dominantEmotion = getDominantEmotion(emotions);

          if (dominantEmotion !== "neutral" && dominantEmotion !== prevEmotion) {
            setPrevEmotion(dominantEmotion);
            onEmotionsCaptured(dominantEmotion); // Send emotion to parent
          }
        }
      }, 100);
    };

    const stopDetection = () => {
      clearInterval(intervalId);
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (canvas) {
        canvas.remove();
      }
      if (video) {
        video.remove();
      }
    };

    // Load models on mount
    loadModels();

    // Start video and detection when recording starts
    if (isRecording && modelsLoaded) {
      initializeVideo();
    }

    // Cleanup on unmount or when recording stops
    return () => {
      stopDetection();
    };
  }, [isRecording, modelsLoaded]);

  return <div id="video-container" style={{ display: "none" }}></div>;
}
