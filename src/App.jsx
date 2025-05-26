import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faRobot, faSun, faPaperPlane, faEllipsisVertical, faBroom } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { ChatMessages } from './components/User&AIresponse';
import { useForm } from 'react-hook-form';
import { AiResponseHandling } from './components/ApiHandling';

function App() {

  {/* Edit text */ }

  const [text, setText] = useState("Ai Assistant");
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("editabletext");
    if (savedName) {
      setText(savedName);
    }
  }, [])

  const handleTextChange = (e) => {
    setText(e.target.value);
    localStorage.setItem("editabletext", e.target.value);
  }

  {/* Localstorage for modes */ }

  const [Mode, setMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) || false
  );
  const [messages, setMessages] = useState([]);
  const [show, setShow] = useState(false);

  const messageRef = useRef(null);
  const { register, handleSubmit, reset, setValue } = useForm();
  const handleInput = (e) => {
    setValue("message", e.target.textContent);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  {/* Localstorage for chat */ }

  useEffect(() => {
    const savedMsg = localStorage.getItem("chatMessages");
    if (savedMsg) {
      setMessages(JSON.parse(savedMsg));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chatMessages`, JSON.stringify(messages));
    }
  }, [messages]);



  {/* Form and response managing */ }

  const onSubmit = async (data) => {
    if (!data.message.trim()) return;

    const userMsg = {
      sender: "user",
      text: data.message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    reset();

    const AiResponse = await AiResponseHandling(data.message);

    const aiRes = {
      sender: "Ai",
      text: AiResponse,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, aiRes]);

    reset();
    if (messageRef.current) {
      messageRef.current.textContent = '';
      messageRef.current.style.height = '44px';
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex flex-col min-h-[100dvh] ${Mode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 text-gray-900'}`}
    >
      {/* Header */}

      <header className={`backdrop-blur-lg p-2 sticky top-0 z-50 ${Mode
        ? "bg-gray-900/80 border-b border-gray-700 shadow-xl"
        : "bg-white/80 border-b border-gray-200 shadow-sm"}`}>

        <div className='flex justify-between p-2 items-center max-w-6xl mx-auto w-full'>
          <div className='flex gap-2 items-center'>
            <div className='flex justify-center bg-orange-600 h-10 w-10 rounded-full items-center text-white'>
              <FontAwesomeIcon className='text-xl' icon={faRobot} />
            </div>
            <h1 className={Mode ? "text-xl font-medium font-[sans] bg-gradient-to-r from-gray-300 to-yellow-100 bg-clip-text text-transparent" : "text-xl"}>
              {edit ? (
                <input
                  type="text"
                  className="bg-transparent border-b border-gray-400 focus:outline-none"
                  value={text}
                  autoFocus
                  onChange={(e) => handleTextChange(e)}
                  onBlur={() => setEdit(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setEdit(false);
                    }
                  }}
                />
              ) : (
                <span
                  onDoubleClick={() => setEdit(true)}
                  className="cursor-pointer"
                >
                  {text}
                </span>
              )}
            </h1>

          </div>
          <div className='flex items-center gap-6 justify-center'>
            <button
              type="button"
              className='cursor-pointer bg-gray-100 size-8 rounded-full'
              onClick={() => {
                const newMode = !Mode;
                setMode(newMode);
                localStorage.setItem("darkMode", JSON.stringify(newMode));
              }}
            >
              {Mode
                ? <FontAwesomeIcon className='text-gray-900' icon={faMoon} />
                : <FontAwesomeIcon className='text-yellow-500' icon={faSun} />}
            </button>

            {/* Replace button with div for dropdown container */}

            <div className='relative pr-2'>
              <button
                type="button"
                onClick={() => setShow(!show)}
                className={`text-xl p-2 ${Mode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} rounded-full`}
              >
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </button>

              {show && (
                <div className={`absolute rounded-lg right-0 mt-2 w-48 shadow-xl z-50 ${Mode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Want To Clear Chat?")) {
                        setMessages([]);
                        localStorage.removeItem("chatMessages");
                      }
                      setShow(false);
                    }}
                    className={`w-full text-left px-4 py-3 flex items-center gap-2 ${Mode
                      ? 'hover:bg-gray-700 text-gray-200'
                      : 'hover:bg-gray-100 text-gray-800'}`}
                  >
                    <FontAwesomeIcon icon={faBroom} />
                    <span>Clear Chat</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}

      {<ChatMessages messages={messages} Mode={Mode} />}

      {/* Footer */}

<footer className={`backdrop-blur-lg p-4 z-10 border-t sticky bottom-0 ${Mode
  ? "bg-gray-900/80 border-gray-700 shadow-xl"
  : "bg-white/80 border-gray-200 shadow-sm"}`}>
  <div className='max-w-3xl mx-auto px-2'>
    <div className="relative flex items-end">
      <div className="flex-1 min-w-0"> {/* Add this wrapper */}
        <textarea
          {...register("message")}
          placeholder="Type a message..."
          className={`
            w-full py-3 px-4 pr-12 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 
            min-h-[44px] max-h-[120px] overflow-y-auto resize-none ${Mode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: '1.5',
          }}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
          }}
          rows={1}
        />
      </div>
      <div className='absolute right-1 bottom-[7.4px]'>
        <button
          type='submit'
          className="bg-blue-500 h-10 w-10 hover:bg-blue-600 text-white rounded-full flex items-center justify-center"
        >
          <FontAwesomeIcon className='size-5' icon={faPaperPlane} />
        </button>
      </div>
    </div>
  </div>
</footer>
    </form>
  );
}

export default App;
