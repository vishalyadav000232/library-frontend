import React, { useMemo } from "react";
import { BookOpen, Home, ArrowLeft, AlertTriangle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const ErrorPages = () => {
  const navigate = useNavigate();
  const location = useLocation();

  
  const { status = 404, title = "Page Not Found", message } = location.state || {};

  const defaultMessage = "Oops! Looks like this page has been misplaced.";

  // ---------------- BACKGROUND BOOKS ----------------
  const generateBooks = () => {
    const colors = [
      "#8B4513", "#A0522D", "#654321", "#704214", "#6B5344",
      "#8B7355", "#9370DB", "#6A5ACD", "#483D8B", "#2F4F4F",
      "#4B0082", "#191970", "#8B0000", "#DC143C", "#CD5C5C",
    ];
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      height: Math.random() * 40 + 60,
    }));
  };

  const books = useMemo(() => generateBooks(), []);

  // ---------------- NAVIGATION HANDLERS ----------------
  const handleGoHome = () => navigate("/");
  const handleGoBack = () => navigate(-1);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 px-4 relative overflow-hidden">

      {/* Background Books */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-2 top-0 h-full flex flex-col justify-around py-8">
          {books.slice(0, 6).map((book) => (
            <div
              key={book.id}
              className="w-12 rounded-sm shadow-lg opacity-70"
              style={{ height: `${book.height}px`, backgroundColor: book.color }}
            />
          ))}
        </div>
        <div className="absolute right-2 top-0 h-full flex flex-col justify-around py-8">
          {books.slice(6, 12).map((book) => (
            <div
              key={book.id}
              className="w-12 rounded-sm shadow-lg opacity-70"
              style={{ height: `${book.height}px`, backgroundColor: book.color }}
            />
          ))}
        </div>
      </div>

      {/* Error Card */}
      <div className="relative h-180 w-full max-w-2xl bg-white/95 backdrop-blur rounded-2xl shadow-2xl border border-amber-200 p-8 md:p-12">
        
        {/* Icon */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertTriangle className="w-16 h-16 text-red-600" />
              </div>
              <div className="absolute -top-2 -right-2 p-2 bg-amber-100 rounded-full">
                <BookOpen className="w-6 h-6 text-amber-800" />
              </div>
            </div>
          </div>

          {/* Dynamic Error Number */}
          <h1 className="text-8xl md:text-9xl font-bold text-amber-900 mb-4">{status}</h1>

          {/* Dynamic Error Message */}
          <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-3">
            {title}
          </h2>
          <p className="text-amber-700 text-base md:text-lg mb-2">
            {message || defaultMessage}
          </p>
        </div>

        {/* Suggestions */}
        <div className="bg-amber-50 rounded-lg p-6 mb-8 border border-amber-200">
          <h3 className="font-semibold text-amber-900 mb-3">
            Here's what you can do:
          </h3>
          <ul className="space-y-2 text-amber-700 text-sm">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Check the URL for any typos or errors</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Return to the homepage and start fresh</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Use the navigation menu to find what you need</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Contact support if you believe this is an error</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleGoHome}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:scale-105 transition shadow-lg"
          >
            <Home className="w-5 h-5" />
            Go to Homepage
          </button>
          <button
            onClick={handleGoBack}
            className="flex-1 flex items-center justify-center gap-2 bg-amber-100 border-2 border-amber-300 text-amber-900 font-semibold py-3 px-6 rounded-lg hover:bg-amber-200 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-amber-600 mt-8">
          Need assistance? Contact{' '}
          <span className="font-semibold text-amber-700">Yadav Library Support</span>
        </p>
      </div>
    </div>
  );
};

export default ErrorPages;
