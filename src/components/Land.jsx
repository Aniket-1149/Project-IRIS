import React from "react";
import bgImage from '../assets/image.jpg';
import { Link } from "react-router-dom";

const Section = () => {
  return (
    <section
      className="relative py-32 w-full h-screen bg-cover bg-center before:absolute before:inset-0 before:bg-black/60 before:z-0"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
            <div className="z-10 items-center">
              <h1 className="mb-1 text-white text-6xl lg:text-9xl font-bold transition-all duration-300 transform hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(99,102,241,0.9)] cursor-pointer">
                IRIS
              </h1>
              <h2 className="mb-6 text-white text-3xl animate-fadeInUp">
                Image Recognition and Interpretation System
              </h2>

              <p className="mx-auto max-w-5xl text-zinc-300 lg:text-xl leading-relaxed whitespace-normal break-keep text-center">
                {"IRIS is an intelligent chatbot that analyzes uploaded images to detect objects, extract meaningful features, and provide context-aware responses. It uses advanced machine learning and computer vision to understand scenes, classify visuals, and interact with users in real-time—enabling smarter, faster insights across healthcare, education, e-commerce, and more."
                  .split(" ")
                  .map((word, index) => (
                    <span
                      key={index}
                      className="inline-block transition-all duration-200 ease-in-out hover:text-white hover:underline hover:decoration-indigo-400 hover:drop-shadow-[0_0_8px_rgba(99,102,241,1)] hover:scale-110 cursor-pointer mr-[0.25em]"
                    >
                      {word}
                    </span>
                  ))}
              </p>

              <div className="mt-12 flex w-full flex-col justify-center gap-2 sm:flex-row">
                {/* Get Started Button */}
                <Link to="/index">
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 h-10 px-4 py-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Get started now
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevron-right ml-2 h-4"
                    >
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  </button>
                </Link>

                {/* Learn More Button */}
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-gray-800 text-zinc-300 hover:bg-zinc-700 hover:text-white h-10 px-4 py-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2">
                  Learn more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-right ml-2 h-4"
                  >
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section;
