import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent_accepted");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent_accepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-10 md:max-w-md bg-white border border-gray-200 shadow-2xl rounded-3xl p-6 z-[9999] animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍪</span>
          <h3 className="font-black text-gray-900 uppercase tracking-tight text-sm">
            Cookie Policy
          </h3>
        </div>

        <p className="text-gray-500 text-xs leading-relaxed">
          We use cookies to enhance your experience, analyze site traffic, and
          keep your session secure. By clicking "Accept", you agree to our
          <Link to="/cookies" className="text-blue-600 underline ml-1">
            Cookie Policy
          </Link>
          .
        </p>

        <div className="flex gap-3 mt-2">
          <button
            onClick={acceptCookies}
            className="flex-1 bg-[#1E3A8A] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition"
          >
            Accept All
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="px-6 py-3 border border-gray-200 text-gray-400 rounded-xl font-bold text-[10px] uppercase hover:bg-gray-50 transition"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
