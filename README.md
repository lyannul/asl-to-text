![Translator Demo](assets/desktop_demo.gif) ![Translator Demo](assets/mobile_demo.gif)

Real-time American Sign Language (ASL) to text translation using your laptop or mobile device's webcam! The translator is capable of translating the all letters in the ASL alphabet (except the moving gestures 'J' and 'Z'). Make sure to use Chrome and enable WebGL for best performace!

# Features

The translator provides the following features:

- Fingerspell words
- Change translation speed based on signing skill level
- Text to speech for translated text
- Inferred spaces if no hand is detected
- Delete letters by holding both hands up

# How it works

This model leverages the [MediaPipe Hands](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker) model to detect 21 hand keypoints from the webcam. These keypoints are then passed through a dense layers model to classify the hand sign with a 96% validation accuracy. 

# Getting Started

You can try it for yourself at [Signr.]()

Alternatively you can set up a local development environment with the instructions below

# Development Environment (Local)

Follow these simple instructions to set up a local development environment.

1. Clone the repository and install dependencies:

  ```bash
  git clone https://github.com/lyannul/asl-to-text.git
  cd asl-to-text
  npm install
  ```

2. To start the local development server:
  ```bash
  npm start
  ```

**That's it, you are good to go! 👾**

