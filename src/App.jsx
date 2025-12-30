import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./index.css";
import { quizzes } from "./data/quizzes";
import { shuffleArray } from "./utils";
import ProgressBar from "./components/ProgressBar";
import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
    'https://econidmgwpkzvdvrpnka.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjb25pZG1nd3BrenZkdnJwbmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzAzOTUsImV4cCI6MjA4MjYwNjM5NX0.Z0MXoqxM_yEGsgooch5HotoWRTg7V5RwAyKYGpgFheU'
  );

export default function App({ sessionId }) {
  console.log("Session ID:", sessionId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState("");
  const [language, setLanguage] = useState("en"); // "ja" | "en" | "es"
  const [score, setScore] = useState(0); // 正解数をカウント
  const [isFinished, setIsFinished] = useState(false); // 最終結果ページフラグ
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [answers, setAnswers] = useState(Array(quizzes.length).fill(undefined)); // 各問題の回答状況を保存
  // const [showFeedback, setShowFeedback] = useState(false);

  const currentQuiz = quizzes[currentIndex];

  useEffect(() => {
    setShuffledOptions(shuffleArray(currentQuiz.options[language]));
  }, [currentIndex, language]);

  const handleClick = async (option) => {
    setSelected(option);
    const isCorrect = option === currentQuiz.answer[language];

    gtag('event','quiz_answer',{
      question_index : currentIndex + 1,
      selected_option : option,
      is_correct : isCorrect
    });

    console.log("Sending event to Supabase:", {
    session_id: sessionId,
    question_index: currentIndex + 1,
    selected_option: option,
    is_correct: isCorrect
  });


    await supabase.from('quiz_events').insert({
      session_id: sessionId || "test-session",
      event_type: 'answer',
      question_index: Number(currentIndex + 1),
      selected_option: option,
      is_correct: isCorrect
    });

    if (isCorrect) {
      setResult(
        language === "en" ? "Correct" :
        language === "ja" ? "正解！🎉" :
        "¡Correcto! 🎉"
      );
      setScore((prev) => prev + 1);
    } else {
      setResult(
        language === "en" ? "Incorrect" :
        language === "ja" ? "不正解…😢" :
        "Incorrecto… 😢"
      );
    }

    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentIndex] = isCorrect ? "correct" : "incorrect";
      return copy;
    });
  };

  const handleNext = async () => {
    setSelected("");
    setResult("");
    if (currentIndex + 1 < quizzes.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      gtag('event','quiz_complete',{
        score:score,
        total:quizzes.length
      });
      await supabase.from('quiz_events').insert({
        session_id: sessionId,
        event_type: 'complete',
        score: score,
        total: quizzes.length
      });
    }
  };

  const resetQuiz = () => {
    // GA4イベント
    if (typeof gtag === "function") {
      gtag('event','quiz_restart',{
        language:language
      });
    }

    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelected("");
    setResult("");
    setAnswers(Array(quizzes.length).fill(undefined));
  };
  const tryAgain = () => {
    // GA4イベント
    if (typeof gtag === "function") {
      gtag('event','quiz_try_again',{
        language:language
      });
    }

    // 状態リセット
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelected("");
    setResult("");
    setAnswers(Array(quizzes.length).fill(undefined));

    // ページ遷移
    // navigate("/quiz");
  };

  


  useEffect(() => {
    const sendStartEvent = async () => {
      await supabase.from('quiz_events').insert({
        session_id: sessionId,
        event_type: 'start',
      });
    };
    sendStartEvent();
  },[]);


  const accuracy = score / quizzes.length;
  const isPassed = accuracy > 0.8; // ※ 0.8以下は不合格

  const finishQuizShortcut = () => {
  // 最終結果画面に必要な状態をセット
  setIsFinished(true);
  // スコアを途中までの値にしても良い
  // 例えば今のスコアをそのまま使う
  gtag('event','quiz_shortcut_complete',{
    score: score,
    total: quizzes.length
  });
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

      {isPassed ? (
        <p className="text-lg font-semibold text-green-600 mb-4">
          {language === "en"
            ? "You passed the exam!"
            : language === "ja"
            ? "あなたは試験に合格しました"
            : "¡Aprobaste el examen!"}
        </p>

      ) : (
        

                <p className="text-lg font-semibold text-red-600 mb-4">
          {language === "en"
            ? "You failed the exam."
            : language === "ja"
            ? "あなたは試験に不合格でした"
            : "No aprobaste el examen."}
        </p>
      )}
      
      <button
        onClick={tryAgain}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {language === "en" ? "Try again" : language === "ja" ? "もう一度" : "Intentar de nuevo"}
      </button>
    </div>
  ) : (
    
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      {/* 言語選択ボタン */}
      <h1 className="text-4xl font-bold mb-6 text-center">DMV Practice Quiz</h1>
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

      {/* クイズカードと進捗バー */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-4 w-full">
        {/* クイズカード */}
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 mb-4 md:mb-0">
          <h2 className="text-2xl font-bold mb-6 text-center">{currentQuiz.question[language]}</h2>

          {currentQuiz.image && (
            <img
              src={currentQuiz.image}
              alt="Quiz Illustration"
              className="w-full h-auto mb-6 rounded"
            />
          )}

          <div className="flex flex-col space-y-3">
            {shuffledOptions.map((option) => {
              let bgColor = "bg-blue-500 hover:bg-blue-600 text-white";

              if (selected) {
                if (option === currentQuiz.answer[language]) {
                  bgColor = "bg-green-500 text-white";
                } else if (option === selected) {
                  bgColor = "bg-red-500 text-white";
                } else {
                  bgColor = "bg-gray-300 text-gray-600";
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
            })}
          </div>
        </div>

        {/* 進捗バー */}
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
            {result}
          </p>
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

      <div className="flex flex-col items-center justify-center mt-6">
        <button
          onClick={resetQuiz}
          className="px-4 py-2 bg-gray-500 rounded text-white text-sm hover:text-blue-600 mt-4"
        >
          {language === "en" ? "Try again" : language === "ja" ? "もう一度" : "Intentar de nuevo"}
        </button>
      </div>

      <div className="fixed bottom-16 right-4 z-50">
        
  {/* <button
    onClick={finishQuizShortcut}
    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
  >
    ショートカットで結果画面へ
  </button> */}
</div>


      {/* Feedback ボタン */}
      <button
        onClick={() => {
          gtag('event','feedback_click',{
            page:'quiz',
            question_id:currentIndex+1
          });
          window.open(
            "https://forms.gle/nsjAKAJebV9gW5C58",
            "_blank"
          );
        }}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
      >
        💬 Feedback
      </button>


    </div>
  );
}

