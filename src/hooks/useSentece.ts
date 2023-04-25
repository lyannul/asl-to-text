import { useEffect, useState, useCallback } from "react";
import { SPACE, DELETE, Threshold } from "../utils/const";
import { getSentence } from "../utils/sentence";

const useSentence = () => {
  const [sentence, setSentence] = useState<string>("");
  const [letter, setLetter] = useState<string>("");
  const [threshold, setThreshold] = useState<Threshold>(Threshold.BEGINNER);

  useEffect(() => {
    let prevLetter = letter;

    let timerId = setTimeout(() => {
      if (letter === prevLetter) {
        const newSentence = getSentence(letter, sentence);
        if (newSentence) {
          setSentence(newSentence);
        }
      }
    }, threshold);

    // if they dont hold the sign for long enough, reset timer
    return () => {
      clearTimeout(timerId);
    };
  }, [letter]);

  const changeSkillLevel = useCallback((choice: number) => {
    switch (choice) {
      case 0:
        setThreshold(Threshold.BEGINNER);
        return;
      case 1:
        setThreshold(Threshold.INTERMEDIATE);
        return;
      case 2:
        setThreshold(Threshold.ADVANCED);
        return;
      default:
    }
  }, []);

  return {
    sentence,
    letter,
    setLetter,
    setSentence,
    changeSkillLevel,
  };
};

export default useSentence;
