import React, { useEffect, useState } from "react";
import "./index.css";
import { quizzes } from "./data/quizzes";
import { shuffleArray } from "./utils";
import ProgressBar from "./components/ProgressBar";


export default function App() {
  

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState("");
  const [language, setLanguage] = useState("en"); // "ja" | "en" | "es"
  const [score, setScore] = useState(0); // 正解数をカウント
  const [isFinished, setIsFinished] = useState(false); // 最終結果ページフラグ
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [answers, setAnswers] = useState(Array(quizzes.length).fill(undefined)); // 各問題の回答状況を保存


  const currentQuiz = quizzes[currentIndex];

  useEffect(() => {
    setShuffledOptions(shuffleArray(currentQuiz.options[language]));
  },[currentIndex,language]);

  const handleClick = (option) => {

    setSelected(option);
    const isCorrect = option === currentQuiz.answer[language];
    if (isCorrect) {
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

    setAnswers(prev => {
      const copy = [...prev];
      copy[currentIndex] = isCorrect ? "correct" : "incorrect";
      return copy;

    });
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
    // 最終結果ページ
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
          setAnswers(Array(quizzes.length).fill(undefined));
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {language === "en" ? "Try again" : language === "ja" ? "もう一度" : "Intentar de nuevo"}
        </button>
    </div>

  ) : (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
        {/* 言語選択ボタン */}
    <h1 className="text-4xl font-bold mb-6 text-center">
      DMV Practice Quiz
      </h1>
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
      {/* PC:　横並び　スマホ:　縦並び */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-4 w-full">

        


        {/* クイズカード */}
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 mb-4 md:mb-0">
          {/*　問題文 */}  
          <h2 className="text-2xl font-bold mb-6 text-center">{currentQuiz.question[language]}</h2>

          {/*　画像 */}
          {currentQuiz.image && (
            <img 
              src={currentQuiz.image}
              alt="Quiz Illustration"
              className="w-full h-auto mb-6 rounded"
            />  
          )}  

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

      {/* 進捗バーコンポーネント呼び出し */}
      <div className="w-full md:w-auto p-6 mb-4">
        <ProgressBar 
          total={quizzes.length} 
          current={currentIndex}
          answers={answers}
          onJump={(idx) => {
            setCurrentIndex(idx);
            setSelected("");
            setResult("");
          }} 
          />  
          </div>
      </div>

      {/* 結果表示と次の問題ボタン */}

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

     <div className="flex flex-col items-centerjustify-center mt-6">
     <button 
        onClick={() => {
          setCurrentIndex(0);
          setScore(0);
          setSelected("");
          setResult("");
          setAnswers(Array(quizzes.length).fill(undefined));
        }}
        className="px-4 py-2 bg-gray-500 rounded text-white text-sm text-gray-500 hover:text-blue-600 mt-4"
      >
        
        {language === "en" ? "Try again" : language === "ja" ? "もう一度" : "Intentar de nuevo"}
      </button>
      </div>
    </div>

  );
}
