"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import { fetchHealth, sendChat } from "@/lib/signalApi";
import { getCookie, setCookie } from "@/lib/cookies";
import { pageName } from "@/lib/pageNames";

type Message = { role: "user" | "assistant"; content: string; failed?: boolean };

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatStatus, setChatStatus] = useState<"checking" | "ready" | "noKey" | "offline">("checking");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHealth()
      .then((health) => setChatStatus(health.chat ? "ready" : "noKey"))
      .catch(() => setChatStatus("offline"));
  }, []);

  // Block body: newer Chromium returns a Promise from scrollIntoView, which
  // React would otherwise treat as the effect's cleanup and crash on unmount.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const stored = getCookie('chatMessages');
    if (stored) {
      try {
        const loadedMessages: Message[] = JSON.parse(stored);
        setMessages(loadedMessages);
      } catch (e) {
        console.error('Error parsing chat messages cookie:', e);
      }
    }
  }, []);

  useEffect(() => {
    setCookie('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || chatStatus !== "ready") return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Add loading message
    const loadingMessage: Message = { role: "assistant", content: "typing" };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Read addedPages from cookie
      const stored = getCookie('addedPages');
      let addedFeatures: string[] = [];
      if (stored) {
        try {
          const addedPages: string[] = JSON.parse(stored);
          addedFeatures = addedPages.map(page => pageName(page));
        } catch (e) {
          console.error('Error parsing cookie:', e);
        }
      }

      const history = [...messages, userMessage]
        .filter((m) => !m.failed && m.content !== "typing")
        .map(({ role, content }) => ({ role, content }));
      const reply = await sendChat(history, addedFeatures);

      // Replace loading message with actual response
      setMessages((prev) => prev.slice(0, -1).concat({ role: "assistant", content: reply }));
    } catch (err) {
      const errorMessage: Message = {
        role: "assistant",
        content: `Error: ${err instanceof Error ? err.message : "could not get a response"}`,
        failed: true,
      };
      setMessages((prev) => prev.slice(0, -1).concat(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full full  rounded-xl shadow-lg p-4 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">GAIA Chat</h1>
          <p className="text-gray-500 text-sm">Conversational AI for medical insights</p>
        </div>
      </div>
      {(chatStatus === "noKey" || chatStatus === "offline") && (
        <p className="mx-auto mb-4 max-w-xl rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2 text-center text-sm text-yellow-800">
          {chatStatus === "noKey"
            ? "Chat is off: set GROQ_API_KEY in server/.env and restart the server."
            : "Chat is off: the GAIA server is not reachable. Start it with python server/app.py."}
        </p>
      )}
      {/* Clear Chat Button */}
      <div className="fixed top-8 right-4 z-10">
        <button
          onClick={() => setMessages([])}
          className="px-4 py-2 bg-primary/40 text-white rounded-full shadow hover:bg-primary transition-colors duration-200 cursor-pointer"
        >
          Clear Chat
        </button>
      </div>
      {/* === Chat Messages === */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2 pt-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`w-fit max-w-[75%] p-3 rounded-2xl shadow-md wrap-break-word 
            ${msg.role === "user" 
              ? "self-end bg-linear-to-r from-blue-400 to-blue-600 text-white ml-auto" 
              : "self-start bg-white border border-gray-300 text-gray-900 mr-auto"} 
            `}
          >
            {msg.content === "typing" ? (
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            ) : (
              <div className="prose prose-lg max-w-none leading-relaxed">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* === Input Bar === */}
      <div className="flex gap-2 pb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white placeholder-gray-400 shadow-sm transition-all duration-200"
          placeholder="Ask me anything..."
        />
        <button
          onClick={sendMessage}
          disabled={loading || chatStatus !== "ready"}
          className="px-5 py-3 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200 flex items-center justify-center"
        >
          {loading ? <span className="animate-pulse">...</span> : "Send"}
        </button>
      </div>
      {/* Suggestion Questions */}
      <div className="center gap-16 flex-wrap mt-2 mx-36">
        <button
          onClick={() => setInput("What are the symptoms of diabetes?")}
          className="text-sm text-white font-semibold hover:underline"
        >
          What are the symptoms of diabetes?
        </button>
        <button
          onClick={() => setInput("How to interpret an ECG?")}
          className="text-sm text-white font-semibold hover:underline"
        >
          How to interpret an ECG?
        </button>
        <button
          onClick={() => setInput("Explain lung function analysis")}
          className="text-sm text-white font-semibold hover:underline"
        >
          Explain lung function analysis
        </button>
        <button
          onClick={() => setInput("What is AI in medicine?")}
          className="text-sm text-white font-semibold hover:underline"
        >
          What is AI in medicine?
        </button>
      </div>
    </div>
  );
}
