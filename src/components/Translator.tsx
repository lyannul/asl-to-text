import React, { useEffect, useRef, useState } from "react";
import { Camera as Cam } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import Webcam from "react-webcam";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import * as tf from "@tensorflow/tfjs";
import { LABELS, SPACE, DELETE, CameraState, MODEL_URL } from "../utils/const";
import useSentence from "../hooks/useSentece";
import Dropdown from "./Dropdown";
import { BiHelpCircle, BiUserVoice } from "react-icons/bi";
import { GrPowerReset } from "react-icons/gr";
import { FiDelete } from "react-icons/fi";
import { FaHandsHelping } from "react-icons/fa";
import useCheckMobileScreen from "../hooks/useCheckMobileDevice";
import { setupCamera } from "../utils/camera";
import { MagnifyingGlass } from "react-loader-spinner";
import Modal from "./Modal";
import ASLAlphabet from "../assets/asl-alphabet-chart.png";

const Translator = () => {
  const webcamRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  const [model, setModel] = useState<tf.GraphModel>();
  const [handActive, setHandActive] = useState<boolean>(false);
  const [confirmLetter, setConfirmLetter] = useState<boolean>(false);
  const [cameraState, setCameraState] = useState<CameraState>(CameraState.IDLE);
  const [helpModalOpen, setHelpModalOpen] = useState<boolean>(false);
  const [figureModalOpen, setFigureModalOpen] = useState<boolean>(false);
  const [howToModalOpen, setHowToModalOpen] = useState<boolean>(false);
  const { letter, setLetter, sentence, setSentence, changeSkillLevel } =
    useSentence();

  const mobile = useCheckMobileScreen();

  var msg = new SpeechSynthesisUtterance();

  const fetchModel = async () => {
    const mdl = await tf.loadGraphModel(MODEL_URL);
    setModel(mdl);
  };

  useEffect(() => {
    fetchModel();
    setupCamera(webcamRef, setCameraState);
  }, []);

  useEffect(() => {
    if (model && cameraState === CameraState.READY) {
      fetchMediapipe();
    }
  }, [model, cameraState]);

  useEffect(() => {
    setConfirmLetter(true);
    setTimeout(() => {
      setConfirmLetter(false);
    }, 300);
  }, [sentence]);

  useEffect(() => {
    if (!handActive) {
      setLetter(SPACE);
    }
  }, [handActive]);

  const fetchMediapipe = async () => {
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });
    hands.setOptions({
      maxNumHands: mobile ? 1 : 2,
      modelComplexity: mobile ? 0 : 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });
    hands.onResults(onResults);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      const camera = new Cam(webcamRef.current.video, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current.video });
        },
        width: mobile ? 350 : 1280,
        height: mobile ? 380 : 720,
      });
      camera.start();
    }
  };

  const onResults = async (results: any) => {
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d", {
      willReadFrequently: true,
    });

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    if (
      results.multiHandLandmarks !== undefined &&
      results.multiHandLandmarks.length > 0
    ) {
      setHandActive(true);
      // we have two hands, we need to backspace
      if (results.multiHandedness.length === 2) {
        setLetter(DELETE);
        return;
      }

      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5,
        });
        drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
      }

      const points: any[] = [];
      results.multiHandLandmarks[0].forEach((point: any) => {
        points.push(point.x);
        points.push(point.y);
        points.push(point.z);
      });

      tf.tidy(() => {
        const pointsTensor = tf.tensor(points, [1, 63]);
        const result = (model?.predict(pointsTensor) as tf.Tensor).argMax(1);
        const prediction_idx = result.dataSync()[0];

        setLetter(LABELS[prediction_idx]);
      });
    } else {
      setHandActive(false);
    }
    canvasCtx.restore();
  };

  const handleResetClick = () => {
    setLetter("");
    setSentence("");
  };

  const handleDeleteClick = () => {
    if (sentence && sentence.length > 0) {
      const newSentence = sentence.slice(0, sentence.length - 1);
      setSentence(newSentence);
    }
  };

  const handleSpeechClick = (e: any) => {
    e.target.blur();
    if (sentence && sentence.length > 0) {
      msg.text = sentence;
      window.speechSynthesis.speak(msg);
    }
  };

  return (
    <div className="flex justify-center p-5 w-screen h-screen">
      <div className="flex flex-col lg:w-6/12 md:w-9/12 sm:w-full md:justify-center">
        <Webcam
          className="hidden"
          ref={webcamRef}
          audio={false}
          muted={true}
          videoConstraints={{ frameRate: { ideal: 60, max: 60 } }}
        />
        {/* CAMERA READY */}
        {cameraState === CameraState.READY ? (
          <div className="relative">
            <canvas
              className="w-full lg:h-full md:h-full h-96 rounded-md border-solid border-2 border-black"
              ref={canvasRef}
              width={mobile ? 640 : 960}
              height={mobile ? 420 : 640}
            />
            <div
              className={`rounded-md border-solid border-2 ${
                confirmLetter ? "border-green-500" : "border-black"
              } absolute top-0 right-0 w-3/12 h-1/4 flex items-center justify-center`}
            >
              {handActive && (
                <span
                  className={`${
                    confirmLetter ? "text-green-500" : "text-black"
                  } text-2xl`}
                >
                  {letter}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="relative flex flex-col justify-center items-center w-full lg:h-full md:h-full h-96 rounded-md border-solid border-2 border-black">
            <MagnifyingGlass
              visible={true}
              height="80"
              width="80"
              ariaLabel="MagnifyingGlass-loading"
              wrapperStyle={{}}
              wrapperClass="MagnifyingGlass-wrapper"
              glassColor="#c0efff"
              color="#e15b64"
            />
            <p className="text-2xl text-center mx-2">
              Please enable your camera to use the translator!
            </p>
          </div>
        )}

        <div className="grid grid-cols-4 gap-auto place-items-center mt-2 mb-2">
          {/* Help  */}
          <button
            className="inline-flex w-auto justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold 
            text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => setHelpModalOpen(true)}
          >
            <BiHelpCircle size={20} />
          </button>

          {/* ASL Alphabet Modal */}
          <Modal
            open={figureModalOpen}
            setOpen={setFigureModalOpen}
            title=""
            children={<img className="flex m-auto" src={ASLAlphabet}></img>}
          />

          {/* How to modal */}
          <Modal
            open={howToModalOpen}
            setOpen={setHowToModalOpen}
            title="How to Use"
            children={
              <div>
                <p>Coming soon...</p>
              </div>
            }
            icon={<FaHandsHelping />}
          />

          {/* Help Modal */}
          <Modal
            open={helpModalOpen}
            setOpen={setHelpModalOpen}
            title="Help"
            children={
              <div className="flex flex-col m-3">
                <p>
                  Welcome to the American Sign Language (ASL) to text
                  translator! For help on how to use the translator or for an
                  ASL alphabet chart, select one of the options below!
                </p>
                <div className="grid grid-cols-2 mt-5 gap-10">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      setHelpModalOpen(false);
                      setHowToModalOpen(true);
                    }}
                  >
                    How to Use
                  </button>
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      setHelpModalOpen(false);
                      setFigureModalOpen(true);
                    }}
                  >
                    ASL Alphabet
                  </button>
                </div>
              </div>
            }
            icon={
              <BiHelpCircle
                className="h-6 w-6 text-blue-600"
                aria-hidden="true"
              />
            }
          />

          {/* Text to Speech, hide on mobile and make textarea clickable  */}
          <button
            className="hidden sm:inline-flex w-auto justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold 
            text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={(e) => handleSpeechClick(e)}
          >
            <BiUserVoice size={20} />
          </button>

          {/* MOBILE ONLY: Delete */}
          <button
            className="sm:hidden inline-flex w-auto justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold 
            text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => handleDeleteClick()}
          >
            <FiDelete size={20} />
          </button>

          {/* Change Threshold/Speed  */}
          <Dropdown changeSkillLevel={changeSkillLevel} />

          {/* Reset  */}
          <button
            className="inline-flex w-auto justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold 
            text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => handleResetClick()}
          >
            <GrPowerReset size={20} />
          </button>
        </div>
        <div className="h-1/4 rounded-md border-solid border-2 border-black p-3 mt-2 relative">
          {mobile && (
            <button
              className="absolute bottom-0 right-0 m-2 w-auto justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold 
            text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={(e) => handleSpeechClick(e)}
            >
              <BiUserVoice size={20} />
            </button>
          )}
          {sentence ? (
            <>
              <span className="text-2xl mt-2 break-words w-max">
                {sentence}
              </span>
              <span className="animate-[blink_1s_ease-in-out_infinite] text-2xl text-primary-400">_</span>
            </>
          ) : (
            <span className="text-2xl mt-2 italic opacity-70">
              Begin signing to translate to text!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Translator;
