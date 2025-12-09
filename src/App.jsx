import React, { useEffect, useState } from "react";
import "./index.css";
import { quizzes } from "./data/quizzes";
import { shuffleArray } from "./utils";


export default function App() {
  

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState("");
  const [language, setLanguage] = useState("en"); // "ja" | "en" | "es"
  const [score, setScore] = useState(0); // 正解数をカウント
  const [isFinished, setIsFinished] = useState(false); // 最終結果ページフラグ
  const [shuffledOptions, setShuffledOptions] = useState([]);


  const currentQuiz = quizzes[currentIndex];

  useEffect(() => {
    setShuffledOptions(shuffleArray(currentQuiz.options[language]));
  },[currentIndex,language]);

  const handleClick = (option) => {
    setSelected(option);
    if (option === currentQuiz.answer[language]) {
      setResult(
        language === "en" ? "Correct" :
        language === "ja" ? "正解！🎉" :
        "¡Correcto! 🎉"
      );
      setScore(prev => prev + 1);
    } else {
      setResult(
        language === "en" ? "Incorrect" :
        language === "ja" ? "不正解…😢" :
        "Incorrecto… 😢"
      );
    }
  };

  const handleNext = () => {
    setSelected("");
    setResult("");
    if (currentIndex + 1 < quizzes.length){
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  return isFinished ? (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">
        {language === "en" ? "Results" : language === "ja" ? "結果" : "Resultados"}
      </h1>
      <p className="text-xl mb-4">
        {language === "en"
          ? `You got ${score} out of ${quizzes.length} correct`
          : language === "ja"
          ? `あなたの正解数は ${score} / ${quizzes.length}です`
          : `Obtuviste ${score} de ${quizzes.length} correctas`}
      </p>
      <button
        onClick={() => {
          setCurrentIndex(0);
          setScore(0);
          setIsFinished(false);
          setSelected("");
          setResult("");
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {language === "en" ? "Try again" : language === "ja" ? "もう一度" : "Intentar de nuevo"}
        </button>
    </div>

  ) : (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setLanguage("ja")}
          className={`px-3 py-1 rounded ${language === "ja" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            日本語
          </button>
        <button
         onClick={() => setLanguage("en")}
         className={`px-3 py-1 rounded ${language === "en" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
         >
          English
         </button>
        <button
         onClick={() => setLanguage("es")}
         className={`px-3 py-1 rounded ${language === "es" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
         >
          Español
         </button>
      </div>

      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
      {/*　問題文 */}  
      <h2 className="text-2xl font-bold mb-6 text-center">{currentQuiz.question[language]}</h2>
      {/*　選択肢 */}  
      <div className="flex flex-col space-y-3">
        {/* {currentQuiz.options[language].map((option) => (
          <button
            key={option}
            onClick={() => handleClick(option)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {option}
          </button>
        ))} */}

        {shuffledOptions.map((option => {
          let bgColor = "bg-blue-500 hover:bg-blue-600 text-white";

          if (selected){
            if (option === currentQuiz.answer[language]) {
              bgColor = "bg-green-500 text-white"; // 正解
            } else if (option === selected) {
              bgColor = "bg-red-500 text-white"; // 間違えた選択
            } else {
              bgColor = "bg-gray-300 text-gray-600"; // 回答後の残り
            }
          }

          return (
            <button
              key={option}
              disabled={!!selected}
              onClick={() => handleClick(option)}
              className={`px-4 py-2 rounded ${bgColor}`}
              >
                {option}
              </button>
          );
        }))}
      </div>
    </div>

      {selected && (
        <div className="mt-6 flex flex-col items-center">
          <p 
          className={`text-xl mb-3 ${
            result === "Incorrect" || result === "不正解…😢" || result === "Incorrecto… 😢"
            ? "text-red-500"
            : "text-green-500"
          }`}
          >
            {result}</p>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {language === "en" ? "Next Question" : language === "ja" ? "次の問題" : "Siguiente pregunta"}
          </button>
        </div>
      )}
      <p className="mt-6 text-gray-500">
        {currentIndex + 1}/{quizzes.length} {language === "en" ? "Question" : language === "ja" ? "問目" : "Pregunta"}
      </p>
    </div>

  );
}
