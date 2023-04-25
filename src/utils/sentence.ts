import { SPACE, DELETE, Threshold } from "./const";

export const getSentence = (
  letter: string,
  sentence: string
): string | null => {
  if (letter === DELETE && sentence.length > 0) {
    const newSentence =
      sentence.charAt(sentence.length - 1) === " "
        ? sentence.slice(0, sentence.length - 2)
        : sentence.slice(0, sentence.length - 1);
    return newSentence;
  } else if (
    letter === SPACE &&
    sentence.charAt(sentence.length - 1) !== " " &&
    sentence.length > 0
  ) {
    return sentence + " ";
  } else {
    if (letter === SPACE || letter === DELETE) {
      return null;
    }
    const newSentence =
      sentence.length === 0 ? letter : sentence + letter.toLowerCase();
    return newSentence;
  }
};