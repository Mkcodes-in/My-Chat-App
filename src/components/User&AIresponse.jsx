import { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faUser, faRobot } from '@fortawesome/free-solid-svg-icons';

export function ChatMessages({ messages, Mode }) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="flex-1 overflow-y-auto p-4 relative z-10">
      {messages.length === 0 && (
        <div className={`absolute inset-0 flex items-center justify-center ${Mode ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="text-center p-8 max-w-md">
            <div className={`text-6xl mb-6 ${Mode ? 'opacity-30' : 'opacity-20'}`}>
              <FontAwesomeIcon icon={faMessage} />
            </div>
            <h2 className={`text-2xl font-medium mb-3 ${Mode ? 'text-gray-300' : 'text-gray-700'}`}>
              Start a conversation
            </h2>
            <p className={Mode ? 'text-gray-400' : 'text-gray-500'}>
              Ask me anything or share your thoughts with your AI friend
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 max-w-3xl mx-auto min-h-full">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* AI Avatar (left side) */}

            {msg.sender === 'Ai' && (
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${Mode ? 'bg-gray-700/80' : 'bg-white/80'} shadow-sm`}>
                <FontAwesomeIcon
                  icon={faRobot}
                  className={`text-lg ${Mode ? 'text-blue-400' : 'text-blue-500'}`}
                />
              </div>
            )}

            {/* Message Bubble */}

            <div
              className={`
    max-w-[80%] p-4 rounded-3xl transition-all duration-300
    ${msg.sender === 'user'
                  ? Mode
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none shadow-lg'
                    : 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-br-none shadow-lg'
                  : Mode
                    ? 'bg-gray-700/80 backdrop-blur-sm text-gray-100 rounded-bl-none'
                    : 'bg-white/90 backdrop-blur-sm text-gray-800 rounded-bl-none'
                }
                break-words overflow-wrap-anywhere 
             `}
            >
              <p className="text-base whitespace-pre-wrap">{msg.text}</p>

              {/* Message timestamp */}

              <div className={`text-xs mt-1 flex items-center gap-1 ${msg.sender === 'user'
                ? 'text-indigo-200'
                : Mode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                {msg.time || ''} • {msg.sender === 'user' ? 'You' : 'AI'}
              </div>
            </div>

            {/* User Avatar (right side) */}

            {msg.sender === 'user' && (
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${Mode ? 'bg-gray-700/80' : 'bg-white/80'} shadow-sm`}>
                <FontAwesomeIcon
                  icon={faUser}
                  className={`text-lg ${Mode ? 'text-purple-400' : 'text-purple-500'}`}
                />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </main>
  );
}