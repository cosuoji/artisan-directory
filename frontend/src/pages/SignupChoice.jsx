import React from "react";
import { Link } from "react-router-dom";

const SignupChoice = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-6 bg-gray-50">
      <div className="max-w-4xl w-full text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Join ABEG FIX
        </h2>
        <p className="text-gray-600 mb-12 text-lg">
          Choose how you want to use the platform to get started.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Choice */}
          <Link
            to="/customer-signup"
            className="group bg-white p-10 rounded-2xl border-2 border-transparent hover:border-blue-600 transition-all shadow-sm hover:shadow-xl text-center"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
              <svg
                className="w-10 h-10 text-blue-600 group-hover:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              I'm looking for an Artisan
            </h3>
            <p className="text-gray-500">
              Search, contact, and book the best local experts in Lagos.
            </p>
          </Link>

          {/* Artisan Choice */}
          <Link
            to="/artisan-signup"
            className="group bg-white p-10 rounded-2xl border-2 border-transparent hover:border-blue-600 transition-all shadow-sm hover:shadow-xl text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
              <svg
                className="w-10 h-10 text-green-600 group-hover:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              I am an Artisan
            </h3>
            <p className="text-gray-500">
              List your services, showcase your work, and grow your business.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupChoice;
