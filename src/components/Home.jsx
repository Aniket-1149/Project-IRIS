import React, { useState, useRef, useEffect } from "react";

export default function IRISChatbot() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [typingResponse, setTypingResponse] = useState("");
  const [botIsThinking, setBotIsThinking] = useState(false); // State for "analyzing" animation
  const messagesEndRef = useRef(null);

  const addMessage = (content, isUser = true) => {
    setMessages((prev) => [...prev, { content, isUser }]);
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
    setBotIsThinking(true); // Show "analyzing" message

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      // After 2 seconds, replace "Bot is thinking..." with the actual response
      setTimeout(() => {
        setBotIsThinking(false); // Stop the "thinking" message
        const responseText = data.response;
        let index = 0;

        const typeCharByChar = () => {
          if (index < responseText.length) {
            setTypingResponse((prev) => prev + responseText[index]);
            index++;
            setTimeout(typeCharByChar, 20); // Typing speed (ms)
          } else {
            addMessage(responseText, false);
            setTypingResponse("");
            setIsLoading(false);
          }
        };

        typeCharByChar();
      }, 2000); // 2 seconds of "thinking" animation
    } catch (err) {
      console.error(err);
      addMessage("Something went wrong.", false);
      setIsLoading(false);
      setBotIsThinking(false); // Stop "thinking" if error occurs
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

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingResponse]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
      {/* Header */}
      <header className="py-4 text-center bg-indigo-900 shadow-md">
        <h1 className="text-2xl font-bold">IRIS Chatbot</h1>
      </header>

      {/* Main */}
      <main className="flex flex-col lg:flex-row gap-6 p-6 flex-1 overflow-hidden">
        {/* Image Preview */}
        <div className="w-full lg:w-[40%] bg-white/10 rounded-xl p-4 flex items-center justify-center">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Uploaded Preview"
              className="max-w-full max-h-[400px] rounded-xl shadow-md"
            />
          ) : (
            <span className="text-sm text-white/60">No image uploaded</span>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex flex-col w-full lg:w-[60%] bg-white rounded-xl shadow-lg text-black">
          {/* Messages */}
          <div
            className="flex-1 px-4 py-3 overflow-y-auto space-y-4"
            style={{ maxHeight: "380px" }} // Reduced height a bit
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                    msg.isUser
                      ? "bg-indigo-500 text-white rounded-br-none"
                      : "bg-gray-200 text-black rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Analyzing animation */}
            {botIsThinking && (
              <div className="flex justify-start">
                <div className="max-w-[70%] px-4 py-2 bg-gray-200 text-black rounded-2xl rounded-bl-none text-sm">
                  <span className="italic text-gray-600">Bot is thinking...</span>
                </div>
              </div>
            )}

            {/* Typing animation (letter by letter) */}
            {typingResponse && (
              <div className="flex justify-start">
                <div className="max-w-[70%] px-4 py-2 bg-gray-200 text-black rounded-2xl rounded-bl-none text-sm">
                  {typingResponse}
                  <span className="animate-pulse ml-1">|</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 bg-white rounded-b-xl">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full sm:w-auto text-sm"
              />
              <input
                type="text"
                placeholder="Type a message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                disabled={isLoading || typingResponse || botIsThinking}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-900 text-center text-sm py-2 text-white/80">
        © 2025 IRIS Chatbot
      </footer>
    </div>
  );
}
