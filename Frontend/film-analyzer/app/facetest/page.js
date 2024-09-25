"use client"; // Mark this component as client-side
import '../../styles/facetest.css';  
import { useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script'; // Import Script component to load face-api.min.js

export default function FaceTest() {
  useEffect(() => {
    const video = document.getElementById('video');

    const loadModelsAndStartVideo = async () => {
      if (window.faceapi) {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models'),
          faceapi.nets.ageGenderNet.loadFromUri('/models'),
        ]);

        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            video.srcObject = stream;
          })
          .catch(err => console.error('Error accessing webcam:', err));
      }
    };

    loadModelsAndStartVideo();

    video.addEventListener('play', () => {
      const canvas = faceapi.createCanvasFromMedia(video);
      const videoContainer = document.getElementById('video-container');
      videoContainer.append(canvas); // Attach the canvas directly to the video container

      const displaySize = { width: video.videoWidth, height: video.videoHeight }; // Correct dimensions
      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender();
        
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        resizedDetections.forEach(detection => {
          const box = detection.detection?.box; // Ensure box exists

          if (box) {
            // Calculate the center of the detection box (middle of the face)
            const centerX = box.x + box.width / 2;
            const centerY = box.y + box.height / 2;
            
            // Draw the age and gender info on the center of the face
            new faceapi.draw.DrawTextField(
              [`${Math.round(detection.age)} years`, `${detection.gender} (${Math.round(detection.genderProbability * 100)}%)`],
              { x: centerX, y: centerY }
            ).draw(canvas);
          }
        });
      }, 100);
    });
  }, []);

  return (
    <div className="app-container">
      <Head>
        <title>FaceSpecs Test - Real-Time Facial Recognition</title>
      </Head>

      <Script src="/face-api.min.js" strategy="beforeInteractive" /> {/* Load face-api.min.js */}

      <header id="app-header">
        <h1>FaceSpecs Test</h1>
        <p>Testing Real-Time Face Attribute Recognition</p>
      </header>
      <main>
        <div id="video-container" style={{ position: "relative" }}>
          <video id="video" width="720" height="560" autoPlay muted></video>
        </div>
      </main>
    </div>
  );
}
