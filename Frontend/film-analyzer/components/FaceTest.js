"use client"; 

import { useEffect } from 'react';

export default function FaceTest({ onEmotionsCaptured, isRecording }) {
  useEffect(() => {
    let video = null;
    let canvas = null;
    let intervalId = null;

    const loadModelsAndStartVideo = async () => {
      video = document.createElement('video');
      video.setAttribute('style', 'display: none;'); // Hide the video feed
      document.body.appendChild(video);

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

            // Wait until enough data is available to play the video
            video.addEventListener('loadeddata', () => {
              console.log('Video is ready to play');
              video.play(); // Start the video stream
              startDetection(); // Start face detection once the video is playing
            });
          })
          .catch(err => console.error('Error accessing webcam:', err));
      }
    };

    const getDominantEmotion = (emotions) => {
      let maxEmotion = '';
      let maxScore = 0;

      for (let emotion in emotions) {
        if (emotions[emotion] > maxScore) {
          maxEmotion = emotion;
          maxScore = emotions[emotion];
        }
      }

      return maxEmotion;
    };

    const startDetection = () => {
      canvas = faceapi.createCanvasFromMedia(video);
      const videoContainer = document.getElementById('video-container');
      videoContainer.append(canvas);

      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);

      intervalId = setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        if (resizedDetections.length > 0) {
          const emotions = resizedDetections[0].expressions;
          const dominantEmotion = getDominantEmotion(emotions); // Get dominant emotion
          console.log('Dominant emotion:', dominantEmotion);
          onEmotionsCaptured(dominantEmotion); // Pass dominant emotion to parent component
        }
      }, 100);
    };

    const stopDetection = () => {
      clearInterval(intervalId);
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
      if (canvas) {
        canvas.remove();
      }
      if (video) {
        video.remove();
      }
    };

    if (isRecording) {
      loadModelsAndStartVideo();
    } else if (!isRecording && video) {
      stopDetection();
    }

    // Cleanup on component unmount
    return () => {
      stopDetection();
    };
  }, [isRecording]);

  return <div id="video-container" style={{ display: 'none' }}></div>; // Hidden container for canvas
}
