import React from "react";

export default function ProgressBar({ total, current, answers, onJump }) {
  const questionsPerRow = 10;
  const rows = [];
  for (let i = 0; i < total; i += questionsPerRow) {
    rows.push(Array.from({ length: Math.min(questionsPerRow, total - i) }, (_, j) => i + j));
  }
  return (
    <div className="flex flex-col gap-1 w-full md:w-auto">
      {rows.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="flex gap-1">
          {row.map((idx) => {
            
            let bgColor = "bg-gray-300";
            if (answers[idx] === "correct") bgColor = "bg-green-500";
            else if (answers[idx] === "incorrect") bgColor = "bg-red-500";
            else if (idx === current) bgColor = "bg-blue-500";// 現在の問題
            return (
              <div
              key={idx}
              onClick={() => onJump(idx)}
              className={`
                    rounded transition-all duration-300
                    ${bgColor}
                    flex-1 h-4 sm:h-5 md:h-6 lg:h-6
                    flex items-center justify-center
                    text-white text-[0.6rem] sm:text-xs md:text-sm lg:text-xs
                    lg:flex-none lg:w-6
              `}
                >
                {/* PCでは数字表示 */}
                <span className="hidden md:block">{idx + 1}</span>

                </div>
        );

            
      })}
      </div>
        );
      })}
    </div>
  );
}