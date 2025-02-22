"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import { Bot } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import "@/styles/fade-in.css";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Add these styles to your global CSS file (app/globals.css)
// If you don't have it, create it in the app directory:
/*
.prose {
  max-width: none;
}
.prose-sm {
  font-size: 0.875rem;
  line-height: 1.5;
}
.prose-pre\:bg-transparent pre {
  background-color: transparent;
}
.prose-pre\:p-0 pre {
  padding: 0;
}
*/

const thinkingMessages = ["Thinking...", "Processing...", "Please wait...", "Loading...", "Analyzing...", "Generating...", "请主人稍等一下喵！"];

const Conversations = ({ messages, isLoading }: { 
  messages: Array<{ role: 'user' | 'assistant'; content: string }>, 
  isLoading: boolean 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayedTexts, setDisplayedTexts] = useState<{ [key: number]: string }>({});
  const [isTyping, setIsTyping] = useState(false);

  // Handle typing animation for new messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const messageIndex = messages.length - 1;

    if (lastMessage?.role === 'assistant' && !isLoading && !displayedTexts[messageIndex]) {
      setIsTyping(true);
      let index = 0;
      const text = lastMessage.content;
      
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedTexts(prev => ({
            ...prev,
            [messageIndex]: text.substring(0, index + 1)
          }));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 15);

      return () => {
        clearInterval(interval);
        setIsTyping(false);
      };
    }
  }, [messages, isLoading]);

  // Save complete content of previous messages
  useEffect(() => {
    messages.forEach((message, index) => {
      if (message.role === 'assistant' && !displayedTexts[index]) {
        setDisplayedTexts(prev => ({
          ...prev,
          [index]: message.content
        }));
      }
    });
  }, [messages]);

  // Auto-scroll to bottom on content change
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new MutationObserver(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, []);

  // 测试message
  useEffect(() => {
    console.log("messages", messages);
  }, [messages]);

  const renderMessage = (content: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code: ({ node, inline, className, children, ...props }: {
            node?: any;
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
          }) => {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : '';

            if (inline || !lang) {
              return (
                <code className="bg-gray-700 rounded px-1 text-white" {...props}>
                  {children}
                </code>
              );
            }

            return (
              <SyntaxHighlighter
                language={lang || 'text'}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: '0.375rem',
                  background: '#1e1e1e'
                }}
                PreTag="div"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
          },
          p: ({ children }) => (
            <p className="mb-2 last:mb-0">{children}</p>
          ),
          a: ({ node, ...props }) => (
            <a 
              className="text-blue-600 hover:text-blue-800 underline" 
              target="_blank" 
              rel="noopener noreferrer" 
              {...props} 
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div ref={containerRef} className="overflow-y-auto h-full w-full">
      <div className="fade-in flex items-center justify-start gap-2 mb-2">
        <Bot className="w-6 h-6" />
        <p className="text-sm bg-gray-200 rounded-2xl p-2">
          您好有什么可以帮您的吗？
        </p>
      </div>
      {messages.map((message, index) => (
        <div key={index}>
          {message.role === 'user' ? (
            <div className="flex gap-2 mb-2 justify-end">
              <div className="text-sm bg-gray-200 rounded-2xl p-2 max-w-[70%] break-words">
                {renderMessage(message.content)}
              </div>
              <div className="rounded-full h-[36px] w-[36px] border border-gray-300">
                <img src="/images/TestProfilePicture.JPG" alt="Profile Picture" className="w-full h-full object-cover rounded-full" />
              </div>
            </div>
          ) : (
            <div className="flex gap-2 mb-2 fade-in">
              <Bot className="w-6 h-6" />
              <div className="text-sm bg-gray-200 rounded-2xl p-2 max-w-[70%] break-words">
                {renderMessage(
                  isTyping && index === messages.length - 1
                    ? displayedTexts[index] || ''
                    : message.content
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      {isLoading && (
        <div className="flex gap-2 mb-2 fade-in">
          <Bot className="w-6 h-6" />
          <div className="flex items-center gap-2 text-sm bg-gray-200 rounded-2xl p-2 max-w-[70%] break-words">
            {renderMessage(thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)])}
          </div>
        </div>
      )}
    </div>
  );
}

export default Conversations;