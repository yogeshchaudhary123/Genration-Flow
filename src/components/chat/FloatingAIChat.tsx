"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, Image as ImageIcon, Mic, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { useChat } from "@ai-sdk/react";
import { ProductCard } from "@/components/products/ProductCard";

export function FloatingAIChat() {
  const { isAiChatOpen, toggleAiChat } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { messages, status, sendMessage } = useChat();

  const isLoading = status === "streaming" || status === "submitted";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status, isAiChatOpen]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    sendMessage({ text: inputValue });
    setInputValue("");
  };

  const toggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      sendMessage({ text: transcript });
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isAiChatOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAiChat}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white shadow-[0_0_20px_rgba(139,92,246,0.6)] z-50 overflow-hidden group"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              <Bot size={28} />
            </motion.div>
            <div className="absolute inset-0 bg-white/20 blur-md rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isAiChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 w-[400px] h-[650px] max-h-[85vh] max-w-[calc(100vw-3rem)] glass-panel rounded-3xl flex flex-col z-50 overflow-hidden shadow-2xl border border-white/10"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/5 dark:bg-black/20 flex items-center justify-between backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white relative">
                  <Bot size={20} />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full shadow-sm"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground dark:text-white flex items-center gap-1">
                    GenFlow AI <Sparkles size={14} className="text-brand-pink animate-pulse" />
                  </h3>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Personal Shopper</p>
                </div>
              </div>
              <button
                onClick={toggleAiChat}
                className="p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-muted-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <Bot size={32} />
                  </div>
                  <h4 className="font-medium mb-1">Welcome to GenFlow AI</h4>
                  <p className="text-sm">Ask me about products, gift ideas, or track your orders.</p>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[90%] p-4 rounded-2xl ${msg.role === "user"
                      ? "bg-brand-blue text-white rounded-br-sm"
                      : "bg-black/5 dark:bg-white/5 text-foreground rounded-bl-sm border border-black/5 dark:border-white/10"
                      }`}
                  >
                    {msg.parts.map((part, i) => {
                      if (part.type === "text") {
                        return <p key={i} className="text-sm leading-relaxed whitespace-pre-wrap">{part.text}</p>;
                      }

                      // Handle tool parts
                      if (part.type.startsWith("tool-")) {
                        const toolName = part.type.replace("tool-", "");
                        const invocation = part as any;

                        if (invocation.state === 'result') {
                          const result = invocation.result;
                          if (toolName === 'search_products' || toolName === 'compare_products') {
                            return (
                              <div key={i} className="mt-4 grid grid-cols-1 gap-3">
                                {result.map((product: any) => (
                                  <ProductCard key={product.id} product={product} variant="compact" />
                                ))}
                              </div>
                            );
                          }
                        } else {
                          return (
                            <div key={i} className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground animate-pulse">
                              <Loader2 size={10} className="animate-spin" />
                              Processing {toolName}...
                            </div>
                          );
                        }
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 p-4 rounded-2xl rounded-bl-sm flex items-center gap-1">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-muted-foreground rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-muted-foreground rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-muted-foreground rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none">
              {(messages.length === 0 || messages.length === 1) && !isLoading && (
                ["Best gaming laptops", "Shoes for gym", "Gift for mother", "Track my order"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage({ text: suggestion })}
                    className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] text-brand-blue font-medium transition-colors"
                  >
                    {suggestion}
                  </button>
                ))
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-white/5 dark:bg-black/40 backdrop-blur-xl">
              <div className="relative flex items-end gap-2">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl flex items-center p-1 focus-within:border-brand-purple/50 transition-all shadow-inner">
                  <button className="p-2 text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors">
                    <ImageIcon size={18} />
                  </button>
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask AI shopping assistant..."
                    className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[40px] py-2.5 px-2 text-sm text-foreground dark:text-white placeholder:text-muted-foreground/50 scrollbar-none"
                    rows={1}
                  />
                  <button
                    onClick={toggleVoice}
                    className={`p-2 transition-colors ${isRecording ? "text-brand-pink animate-pulse" : "text-muted-foreground hover:text-foreground dark:hover:text-white"}`}
                  >
                    <Mic size={18} />
                  </button>
                </div>
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white shadow-lg shadow-brand-blue/20 disabled:opacity-50 transition-all hover:brightness-110 active:scale-95"
                >
                  <Send size={18} className="ml-1" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
