import { useState, useEffect, useRef } from "react";
import { IoMdSend } from "react-icons/io";
import { IoChatboxEllipsesOutline, IoPlanetOutline } from "react-icons/io5";
import { RiCodeSSlashLine } from "react-icons/ri"; 
import { TbBrandPython } from "react-icons/tb";
import './App.css';
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [message, setMessage] = useState('');
  const [isResponse, setIsResponse] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null); // Ref for scrolling to the bottom

  // Initialize GoogleGenerativeAI
  const genAI = new GoogleGenerativeAI('AIzaSyCNIq1n7f4vtLJQqsBySa1LrZw4OSn0Neg');
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const sendResponse = async () => {
    if (message.trim()) {
      await generateResponse(message);
      setMessage(''); // Clear the input after sending
    } else {
      alert('Please write something!');
    }
  };

  const generateResponse = async (msg) => {
    const allMessages = [
      {
        type: 'userMsg',
        text: msg,
      }
    ];

    try {
      const result = await model.generateContent(msg);
      allMessages.push({
        type: 'responseMsg',
        text: result.response.text(),
      });
      setMessages((prevMessages) => [...prevMessages, ...allMessages]);
      setIsResponse(true);
    } catch (error) {
      console.error("Error generating response:", error);
      alert('An error occurred while generating the response.');
    }
  };

  const newChat = () => {
    setIsResponse(false);
    setMessages([]);
    setMessage('');
  };

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="absolute top-0 z-0 min-h-[100vh] w-[100%] bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-white">
      {isResponse ? (
        <div className="flex flex-col justify-center items-center min-h-[75vh]">
          <div className="header flex items-center justify-between w-full px-8 lg:px-40 mt-5">
            <h2 className="font-bold text-xl">Kholio.<span className="text-gray-400">Chatbot</span></h2>
            <button onClick={newChat} className="cursor-pointer bg-[#232222] p-3 rounded-[30px] text-sm transition-all hover:bg-[#3c3c3c]">
              New Chat
            </button>
          </div>

          <div className="messages w-full px-8 lg:px-40 my-10 overflow-y-auto" style={{ maxHeight: "55vh" }}>
            {messages.map((msg, i) => (
              <div key={i} className={msg.type}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} className="relative "/> {/* Scroll anchor */}
          </div>

          <div className="input-box  ">
            <input 
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              placeholder="Write your message..."
              className="border border-gray-300 rounded-lg  w-full "
            />
            <button onClick={sendResponse}>
              <IoMdSend />
            </button>
          </div>

          <p className="text-gray-500 text-xs mb-2">
            Kholio.chatbot is developed by Mr. Khalid Er-rytouny. This AI uses the Gemini API for responses.
          </p>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center min-h-[75vh]">
          <h1 className="font-bold text-3xl">Kholio.<span className="text-gray-400">Chatbot</span></h1>
          
          <div className="boxes flex flex-wrap justify-center gap-4 mt-10">
  <div className="card">
    <p>What is coding?<br /> How can you learn it?</p>
    <RiCodeSSlashLine className="absolute right-4 bottom-4 text-[18px]" />
  </div>
  <div className="card">
    <p>Which is the red planet of the solar system?</p>
    <IoPlanetOutline className="absolute right-4 bottom-4 text-[18px]" />
  </div>
  <div className="card">
    <p>In which year was Python invented?</p>
    <TbBrandPython className="absolute right-4 bottom-4 text-[18px]" />
  </div>
  <div className="card">
    <p>How can we use AI for adoption?</p>
    <IoChatboxEllipsesOutline className="absolute right-4 bottom-4 text-[18px]" />
  </div>
</div>

          
          <div className="relative">
            <div className="inputbox mt-60">
              <input
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                placeholder="Write your message..."
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
              <button onClick={sendResponse}>
                <IoMdSend />
              </button>
            </div>  
          </div>

          <p className="text-gray-500 text-xs mt-2">
            Kholio.chatbot is developed by Mr. Khalid Er-rytouny. This AI uses the Gemini API for responses.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
