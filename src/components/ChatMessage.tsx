import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`flex max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        } space-x-2`}
      >
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-2' : 'mr-2'}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            {isUser ? (
              <User className="h-4 w-4 text-white" />
            ) : (
              <Bot className="h-4 w-4 text-white" />
            )}
          </div>
        </div>

        {/* Message content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`
              px-4 py-2 rounded-lg shadow-sm
              ${isUser
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-900 rounded-bl-sm'
              }
            `}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ node, ...props }) => (
                  <p className="mb-2 last:mb-0 text-sm" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className={`text-lg font-bold mt-3 mb-2 ${
                      isUser ? 'text-white' : 'text-gray-900'
                    }`}
                    {...props}
                  />
                ),
                li: ({ node, ...props }) => (
                  <li
                    className={`ml-4 list-disc ${
                      isUser ? 'text-white' : 'text-gray-900'
                    }`}
                    {...props}
                  />
                ),
                code: ({ node, ...props }) => (
                  <code
                    className={`px-1 py-0.5 rounded ${
                      isUser
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                    {...props}
                  />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Timestamp */}
          <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
        </div>
      </div>
    </div>
  );
}
