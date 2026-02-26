import React, { useState, useEffect } from "react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      // Changed 'right-6' to 'left-6'
      className="fixed bottom-10 left-6 md:left-10 z-[100] group flex flex-row-reverse items-center gap-2"
    >
      {/* Label - flipped order so it appears to the right of the button */}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
        Back to Top
      </span>

      {/* The Actual Button */}
      <div className="bg-[#1E3A8A] text-white w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-200 hover:bg-black hover:-translate-y-1 transition-all duration-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="w-5 h-5 md:w-6 md:h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 15.75l7.5-7.5 7.5 7.5"
          />
        </svg>
      </div>
    </button>
  );
};

export default BackToTop;
