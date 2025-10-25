"use client";

import { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { fetch } from "@tauri-apps/plugin-http";
import ReactMarkdown from 'react-markdown';

type Message = { role: "user" | "assistant"; content: string };

const featureMap: Record<string, string> = {
  "/": "Clinic Statistics",
  "/about": "About",
  "/contact": "Contact",
  "/settings": "Settings",
  "/patients": "Patients",
  "/chat": "Chat",
  "/dashboard": "Dashboard",
  "/dashboard/general": "General Medicine",
  "/dashboard/general/symptom-ai": "Symptom Analyzer (AI)",
  "/dashboard/general/diagnosis": "Diagnosis Suggestions",
  "/dashboard/general/treatment": "Treatment Recommendations",
  "/dashboard/cardiology": "Cardiology",
  "/dashboard/cardiology/ecg-ai": "ECG Interpretation (AI)",
  "/dashboard/cardiology/risk-prediction": "Heart Risk Prediction",
  "/dashboard/cardiology/imaging": "Imaging Utility",
  "/dashboard/radiology": "Radiology",
  "/dashboard/radiology/ai-imaging": "X-ray / MRI Analysis (AI)",
  "/dashboard/radiology/lesion-detection": "Lesion Detection",
  "/dashboard/radiology/report-gen": "Image Reports Generator",
  "/dashboard/neurology": "Neurology",
  "/dashboard/neurology/eeg-ai": "ECG Pattern Recognition",
  "/dashboard/neurology/scan-analyzer": "Brain Scan Analyzer",
  "/dashboard/neurology/ai-cognition": "Cognitive Assessment Tools",
  "/dashboard/pathology": "Pathology",
  "/dashboard/pathology/cell-classification": "Cell Image Classifier",
  "/dashboard/pathology/report-summary": "Report Summarizer (AI)",
  "/dashboard/pathology/specimen": "Specimen Tracker",
  "/dashboard/monitoring": "Monitoring & Analytics",
  "/dashboard/monitoring/dashboard": "Patient Data Dashboard",
  "/dashboard/monitoring/anomaly": "Anomaly Detection (AI)",
  "/dashboard/monitoring/insights": "Performance Insights",
  "/dashboard/pulmonology": "Pulmonology",
  "/dashboard/pulmonology/lung-function": "Lung Function Analysis (AI)",
  "/dashboard/pulmonology/risk-prediction": "Heart Risk Prediction",
  "/dashboard/pulmonology/imaging": "Imaging Utility",
};

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const ai = new GoogleGenAI({ apiKey: "AIzaSyBQ_mOWqULh4oaJMre1HdLfgLXK851tw9w" });

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
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Add loading message
    const loadingMessage: Message = { role: "assistant", content: "typing" };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const docs = await fetchRelevantDocs(input);
      const contents: any[] = [];

      // Read addedPages from cookie
      const stored = getCookie('addedPages');
      let addedFeatures: string[] = [];
      if (stored) {
        try {
          const addedPages: string[] = JSON.parse(stored);
          addedFeatures = addedPages.map(page => featureMap[page] || page);
        } catch (e) {
          console.error('Error parsing cookie:', e);
        }
      }

      const assumptionText = addedFeatures.length > 0 
        ? `Assume there are results for the following features: ${addedFeatures.join(', ')}. Provide analysis accordingly.\n` 
        : '';

      const instructions = "Provide a concise, witty response using markdown for titles and better separations. Limit each section to about 3 lines. Minimize emojis.\n";

      if (input.toLowerCase().includes("book")) {
        const pdfUrl =
          "https://discovery.ucl.ac.uk/id/eprint/10089234/1/343019_3_art_0_py4t4l_convrt.pdf";
        const response = await fetch(pdfUrl);
        const arrayBuffer = await response.arrayBuffer();
        const base64Data = arrayBufferToBase64(arrayBuffer);

        contents.push({
          role: "user",
          parts: [
            { inlineData: { mimeType: "application/pdf", data: base64Data } },
            { text: docs.length ? docs.join("\n") + "\n" : "" },
            { text: instructions + assumptionText + `Question: ${input}` },
          ],
        });
      } else {
        contents.push({
          role: "user",
          parts: [
            { text: docs.length ? docs.join("\n") + "\n" : "" },
            { text: instructions + assumptionText + `Question: ${input}` },
          ],
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.text || "No response",
      };
      // Replace loading message with actual response
      setMessages((prev) => prev.slice(0, -1).concat(assistantMessage));
    } catch (err) {
      console.error("Gemini Error:", err);
      const errorMessage: Message = { role: "assistant", content: "Error: could not get response" };
      setMessages((prev) => prev.slice(0, -1).concat(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full full  rounded-xl shadow-lg p-4 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">MAIA Chat</h1>
          <p className="text-gray-500 text-sm">Conversational AI for medical insights</p>
        </div>
      </div>
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
          disabled={loading}
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

// === Mock RAG Retrieval ===
async function fetchRelevantDocs(query: string): Promise<string[]> {
  const docs = [
    "Doc1: Google Gemini API supports conversational AI with RAG context.",
    "Doc2: React + Vite + Tailwind is fast for UIs.",
    "Doc3: Retrieval-Augmented Generation improves chatbot answers.",
  ];
  return docs.filter((d) => d.toLowerCase().includes(query.toLowerCase())).slice(0, 2);
}

// === Convert ArrayBuffer → Base64 ===
function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}
