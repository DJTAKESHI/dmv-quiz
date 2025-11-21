// src/data/quizzes.js
export const quizzes = [
  {
    question: {
      ja: "赤信号で右折できますか？",
      en: "Can you turn right on a red light?",
      es: "¿Se puede girar a la derecha con luz roja?",
    },
    options: {
      ja: ["常にできる", "停止してからできる", "絶対にできない", "状況による"],
      en: ["Always", "After stopping", "Never", "Depends"],
      es: ["Siempre", "Después de detenerse", "Nunca", "Depende"],
    },
    answer: {
      ja: "停止してからできる",
      en: "After stopping",
      es: "Después de detenerse",
    },
  },
  {
    question: {
      ja: "スクールバスが停車して赤いランプを点滅させたときは？",
      en: "What should you do when a school bus stops and flashes red lights?",
      es: "¿Qué debes hacer cuando un autobús escolar se detiene y enciende luces rojas?",
    },
    options: {
      ja: ["追い越してもよい", "停止して待つ", "徐行する", "方向指示器を出して通過する"],
      en: ["You may pass", "Stop and wait", "Slow down", "Signal and pass"],
      es: ["Se puede adelantar", "Detenerse y esperar", "Reducir velocidad", "Señalizar y pasar"],
    },
    answer: {
      ja: "停止して待つ",
      en: "Stop and wait",
      es: "Detenerse y esperar",
    },
  },
];
