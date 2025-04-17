import React, { useState, useRef, useEffect } from "react";

export default function IRISChatbot() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [typingResponse, setTypingResponse] = useState("");
  const [botIsThinking, setBotIsThinking] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply theme classes to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addMessage = (content, isUser = true) => {
    setMessages((prev) => [...prev, { content, isUser, timestamp: new Date() }]);
  };

  const sendMessage = async () => {
    if (!image && !userInput.trim()) {
      alert("Please upload an image or enter a message.");
      return;
    }

    const formData = new FormData();
    if (image) formData.append("image", image);
    if (userInput.trim()) formData.append("text", userInput);

    if (userInput.trim()) {
      addMessage(userInput, true);
    }

    setUserInput("");
    setIsLoading(true);
    setTypingResponse("");
    setBotIsThinking(true);
    setIsScanning(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      setTimeout(() => {
        setBotIsThinking(false);
        setIsScanning(false);
        const responseText = data.response;
        let index = 0;

        const typeCharByChar = () => {
          if (index < responseText.length) {
            setTypingResponse((prev) => prev + responseText[index]);
            index++;
            setTimeout(typeCharByChar, 20);
          } else {
            addMessage(responseText, false);
            setTypingResponse("");
            setIsLoading(false);
          }
        };

        typeCharByChar();
      }, 2000);
    } catch (err) {
      console.error(err);
      addMessage("Something went wrong.", false);
      setIsLoading(false);
      setBotIsThinking(false);
      setIsScanning(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingResponse]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-[#e5ddd5]'}`}>
      {/* Navbar */}
      <header className={`py-3 px-4 ${isDarkMode ? 'bg-gray-800' : 'bg-[#008069]'} text-white shadow-sm`}>
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">IRIS ChatBot</h1>
            <p className="text-xs text-white/90">
              A Conversational Image Recognition ChatBot - See, Understand, and Chat About Your Images
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/10 transition"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`flex flex-col lg:flex-row gap-4 p-4 flex-1 overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-[#e5ddd5]'}`}>
        {/* Image Preview Section */}
        <div className={`w-full lg:w-[40%] ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} rounded-2xl shadow-xl overflow-hidden border-2 border-dashed ${imagePreview ? 'border-solid' : ''} transition-all duration-300 hover:shadow-2xl hover:border-[#008069]`}>
          <div className="h-full flex flex-col">
            <div className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-[#f0f2f5] border-gray-300'} px-4 py-3 border-b flex justify-between items-center`}>
              <h2 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                Image Preview
              </h2>
              {imagePreview && (
                <button 
                  onClick={clearImage}
                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full transition"
                >
                  Clear
                </button>
              )}
            </div>
            
            {/* Animated Preview Area */}
            <div className={`flex-1 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-[#f0f2f5]'} flex items-center justify-center relative overflow-hidden`}>
              {imagePreview ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 z-0"></div>
                  <img
                    src={imagePreview}
                    alt="Uploaded Preview"
                    className="max-w-full max-h-[400px] rounded-xl shadow-lg object-contain z-10 transform hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Stylized Scanning Animation */}
                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
                      <div className="text-center">
                        <div className="iris-animation mb-6">
                          <div className="iris-logo">
                            <div className="iris-circle">
                              <div className="iris-inner">
                                <div className="iris-pattern"></div>
                              </div>
                            </div>
                            <div className="iris-rays">
                              {[...Array(8)].map((_, i) => (
                                <div key={i} className="iris-ray" style={{ transform: `rotate(${i * 45}deg)` }}></div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-white font-medium text-lg animate-pulse">Scanning Image...</p>
                        <div className="w-full bg-gray-300 h-1.5 mt-4 rounded-full overflow-hidden">
                          <div className="bg-[#008069] h-full animate-progress"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div 
                  className={`text-center cursor-pointer p-8 w-full h-full flex flex-col items-center justify-center transition-all duration-300 hover:bg-opacity-70 ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg border-2 border-dashed ${isDarkMode ? 'border-gray-600 hover:border-[#008069]' : 'border-gray-400 hover:border-[#008069]'} group`}
                  onClick={triggerFileInput}
                >
                  {/* Animated IRIS Logo */}
                  <div className="iris-idle-animation mb-6">
                    <div className="iris-logo">
                      <div className="iris-circle">
                        <div className="iris-inner">
                          <div className="iris-pattern"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated Text */}
                  <div className="space-y-2 transform group-hover:translate-y-1 transition-transform duration-300">
                    <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      <span className="inline-block transition-all duration-300 group-hover:text-[#008069]">Drag & Drop</span> or <span className="inline-block transition-all duration-300 group-hover:text-[#008069]">Click to Browse</span>
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Supports JPG, PNG, GIF (Max 10MB)</p>
                  </div>
                  
                  {/* Floating Particles */}
                  <div className="particles">
                    {[...Array(8)].map((_, i) => (
                      <div 
                        key={i}
                        className="particle absolute bg-[#008069] rounded-full opacity-0 group-hover:opacity-70"
                        style={{
                          width: `${Math.random() * 6 + 4}px`,
                          height: `${Math.random() * 6 + 4}px`,
                          top: `${Math.random() * 80 + 10}%`,
                          left: `${Math.random() * 80 + 10}%`,
                          animation: `float ${Math.random() * 6 + 4}s infinite ${Math.random() * 2}s`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Enhanced File Input Button */}
            <div className={`p-3 border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  onClick={triggerFileInput}
                  className={`w-full py-3 px-4 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-[#008069] hover:bg-[#017561]'} text-white rounded-lg transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg overflow-hidden relative`}
                >
                  <span className="relative z-10 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Choose Image File
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-[#008069] to-[#00a884] opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex flex-col w-full lg:w-[60%] ${isDarkMode ? 'bg-gray-800' : 'bg-[#e5ddd5]'} rounded-lg shadow-md overflow-hidden`}>
          {/* Messages Container */}
          <div
            className={`flex-1 p-4 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-[#e5ddd5] bg-opacity-90 bg-[url("https://web.whatsapp.com/img/bg-chat-tile-light_a4be512e7195b6b733d9110b408f075d.png")]'}`}
            style={{ maxHeight: 'calc(100vh - 180px)' }}
          >
            <div className="space-y-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg relative ${
                      msg.isUser
                        ? isDarkMode
                          ? 'bg-blue-900 text-gray-200 rounded-br-none'
                          : 'bg-[#d9fdd3] text-gray-800 rounded-br-none'
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-200 rounded-bl-none'
                          : 'bg-white text-gray-800 rounded-bl-none'
                    } shadow-sm`}
                  >
                    <div className="text-sm">{msg.content}</div>
                    <div className={`text-xs mt-1 text-right ${msg.isUser ? (isDarkMode ? 'text-gray-400' : 'text-gray-500') : (isDarkMode ? 'text-gray-400' : 'text-gray-400')}`}>
                      {formatTime(msg.timestamp)}
                    </div>
                    {/* WhatsApp-style triangle notch */}
                    {msg.isUser ? (
                      <div className="absolute right-0 bottom-0 w-2 h-2 overflow-hidden">
                        <div className={`absolute bottom-0 right-0 w-3 h-3 ${isDarkMode ? 'bg-blue-900' : 'bg-[#d9fdd3]'} transform rotate-45 origin-bottom-right`}></div>
                      </div>
                    ) : (
                      <div className="absolute left-0 bottom-0 w-2 h-2 overflow-hidden">
                        <div className={`absolute bottom-0 left-0 w-3 h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} transform rotate-45 origin-bottom-left`}></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Analyzing animation */}
              {botIsThinking && (
                <div className="flex justify-start">
                  <div className={`max-w-[80%] px-3 py-2 ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'} rounded-lg rounded-bl-none shadow-sm`}>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                        <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                        <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-sm italic">IRIS is analyzing...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Typing animation */}
              {typingResponse && (
                <div className="flex justify-start">
                  <div className={`max-w-[80%] px-3 py-2 ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'} rounded-lg rounded-bl-none shadow-sm text-sm`}>
                    {typingResponse}
                    <span className="animate-pulse ml-1">|</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className={`p-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#f0f2f5] border-gray-300'} border-t`}>
            <div className="flex items-center gap-2">
              {/* Text input */}
              <input
                type="text"
                placeholder="Type a message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className={`flex-1 px-4 py-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 'bg-white text-gray-800 placeholder-gray-500 border-gray-300'} focus:outline-none border`}
              />
              
              {/* Send button */}
              <button
                onClick={sendMessage}
                className={`p-2 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#008069] hover:bg-[#017561]'} text-white rounded-full transition disabled:opacity-50`}
                disabled={isLoading || typingResponse || botIsThinking}
                title="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Custom CSS Animations */}
      <style jsx global>{`
        body.dark {
          background-color: #111827;
          color: #f3f4f6;
        }

        /* Stylized IRIS Animation */
        .iris-animation, .iris-idle-animation {
          width: 120px;
          height: 120px;
          position: relative;
        }
        
        .iris-logo {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .iris-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #008069, #00c897);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(0, 192, 150, 0.5);
          animation: ${isScanning ? 'pulse 1.5s infinite alternate' : 'none'};
        }
        
        .iris-inner {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: white;
          position: relative;
          overflow: hidden;
        }
        
        .iris-pattern {
          position: absolute;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at center, transparent 40%, #008069 40.5%, #008069 59.5%, transparent 60%),
            repeating-conic-gradient(#008069 0deg 10deg, transparent 10deg 20deg);
          animation: ${isScanning ? 'spin 4s linear infinite' : 'spin 8s linear infinite'};
        }
        
        .iris-rays {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
        
        .iris-ray {
          position: absolute;
          width: 4px;
          height: 30px;
          background: #00c897;
          top: 50%;
          left: 50%;
          transform-origin: 0 0;
          border-radius: 2px;
          box-shadow: 0 0 10px #00c897;
          animation: ${isScanning ? 'ray-pulse 1.5s infinite' : 'none'};
        }
        
        .iris-idle-animation .iris-circle {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Keyframes */
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 20px rgba(0, 192, 150, 0.5); }
          100% { transform: scale(1.1); box-shadow: 0 0 30px rgba(0, 192, 150, 0.8); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes ray-pulse {
          0%, 100% { opacity: 0.5; height: 20px; }
          50% { opacity: 1; height: 30px; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes animate-progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        .animate-progress {
          animation: animate-progress 2s infinite alternate;
        }
        
        /* Upload Animation */
        .particle {
          animation-timing-function: ease-in-out;
        }
        
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
          100% { transform: translateY(0) rotate(360deg); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}