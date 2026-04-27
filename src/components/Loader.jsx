import React, { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";

export default function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;

    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="text-center">

  
        <div className="relative mb-8 flex items-center justify-center">
          
      
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-2xl opacity-30 animate-pulse" />

    
          
            <BookOpen className="w-16 h-16 text-amber-700 animate-bounce" />
          

        </div>

        {/* Library Name */}
        <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-2">
          Library
        </h1>
        <p className="text-amber-700 text-sm mb-8">
          Your Reading Haven
        </p>

        {/* Progress Bar */}
        <div className="w-80 max-w-full mx-auto">
          <div className="bg-amber-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-amber-600 to-orange-600 h-full rounded-full transition-all duration-300 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-amber-600 font-semibold mt-3 text-sm">
            Loading... {progress}%
          </p>
        </div>

        {/* Animated Books */}
        <div className="flex justify-center gap-2 mt-12">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-amber-700 rounded-sm shadow-md"
              style={{
                width: "12px",
                height: "50px",
                animation: `bookPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes bookPulse {
          0%, 100% {
            transform: scaleY(1);
            opacity: 0.6;
          }
          50% {
            transform: scaleY(1.3);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}