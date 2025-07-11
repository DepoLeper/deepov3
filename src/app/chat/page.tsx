'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant', 
      content: 'Szia! Én vagyok DeepO, a T-DEPO intelligens marketing asszisztense! 🚀\n\nMiben segíthetek ma? Itt vannak a főbb dolgok, amiben tudok segíteni:\n\n📝 **Blog cikkek** - témajavaslatok, generálás, SEO optimalizáció\n🛍️ **Termékleírások** - Unas termékek alapján\n📧 **Hírlevél szövegek** - heti akciók, tematikus tartalmak\n📱 **Social media** - Facebook, Instagram posztok\n📊 **SEO elemzés** - tartalmak optimalizálása\n\nMit szeretnél csinálni?',
      timestamp: new Date(),
      suggestions: [
        'Írjunk blog cikket!',
        'Elemezzük a téli trendeket',
        'Mit javasolsz ma?',
        'Segítség a termékleírásokkal'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [lastApiResponse, setLastApiResponse] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Betöltés...</div>;
  }

  if (!session) {
    redirect('/login');
  }

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/deepo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          userId: session.user?.email || 'anonymous'
        }),
      });

      if (!response.ok) {
        throw new Error('Hálózati hiba');
      }

      const data = await response.json();
      
      // Debug információ mentése
      setLastApiResponse(data);

      const assistantMessage: ChatMessage = {
        id: Date.now().toString() + '_assistant',
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat hiba:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '_error',
        role: 'assistant',
        content: 'Sajnálom, hiba történt. Próbáld újra!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              D
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">DeepO Chat</h1>
              <p className="text-sm text-slate-600">T-DEPO Marketing Asszisztens</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          
          {/* Messages Area */}
          <div className="h-[600px] overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                    : 'bg-white/80 text-slate-800 border border-slate-200'
                } rounded-2xl px-4 py-3 shadow-sm`}>
                  
                  {/* Avatar */}
                  <div className="flex items-start gap-3">
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        D
                      </div>
                    )}
                    
                    <div className="flex-1">
                      {/* Message Content */}
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>

                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-full transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Timestamp */}
                      <div className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-slate-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString('hu-HU', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>

                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {session.user?.email?.[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/80 text-slate-800 border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      D
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Debug Panel */}
            {debugMode && lastApiResponse && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">🔍 Debug Info - Fázis 2: Memory Integration</h3>
                <div className="space-y-4">
                  
                  {/* Memory Debug Info */}
                  {lastApiResponse.metadata?.memory && (
                    <div className="bg-gray-700/50 rounded p-3">
                      <strong className="text-purple-400">🧠 Memory Info:</strong>
                      <div className="text-xs text-gray-300 mt-2 space-y-1">
                        <div>📊 Releváns beszélgetések: <span className="text-green-400">{lastApiResponse.metadata.memory.relevantConversations}</span></div>
                        <div>🔑 Kulcsszavak: <span className="text-yellow-400">[{lastApiResponse.metadata.memory.keywords?.join(', ')}]</span></div>
                        <div>📝 Összefoglaló: <span className="text-blue-400">{lastApiResponse.metadata.memory.summary}</span></div>
                        {lastApiResponse.metadata.memory.stats && (
                          <>
                            <div>💾 Összes beszélgetés: <span className="text-green-400">{lastApiResponse.metadata.memory.stats.totalConversations}</span></div>
                            <div>🏷️ Összes kulcsszó: <span className="text-green-400">{lastApiResponse.metadata.memory.stats.totalKeywords}</span></div>
                            <div>🕒 Friss témák: <span className="text-cyan-400">[{lastApiResponse.metadata.memory.stats.recentTopics?.join(', ')}]</span></div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Agent Info */}
                  <div className="bg-gray-700/50 rounded p-3">
                    <strong className="text-blue-400">🤖 Agent Info:</strong>
                    <div className="text-xs text-gray-300 mt-2">
                      <div>Agent: <span className="text-green-400">{lastApiResponse.metadata?.agent || 'DeepO'}</span></div>
                      <div>Forrás: <span className="text-yellow-400">{lastApiResponse.metadata?.source || 'N/A'}</span></div>
                      <div>Válasz típus: <span className="text-purple-400">{lastApiResponse.metadata?.agentType || 'standard'}</span></div>
                      <div>Megbízhatóság: <span className="text-green-400">{Math.round((lastApiResponse.confidence || 0) * 100)}%</span></div>
                    </div>
                  </div>

                  {/* Full JSON Response */}
                  <div>
                    <button 
                      onClick={() => {
                        const details = document.getElementById('fullApiResponse');
                        if (details) {
                          details.style.display = details.style.display === 'none' ? 'block' : 'none';
                        }
                      }}
                      className="text-green-400 hover:text-green-300 text-sm"
                    >
                      📋 Teljes API válasz megjelenítése/elrejtése
                    </button>
                    <div id="fullApiResponse" style={{ display: 'none' }} className="mt-2">
                      <pre className="text-xs text-gray-300 mt-1 overflow-x-auto max-h-40 overflow-y-auto bg-gray-900/50 p-2 rounded">
                        {JSON.stringify(lastApiResponse, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Debug Toggle */}
                         <div className="flex justify-between items-center mb-6">
               <div className="flex items-center space-x-4">
                 <div className="flex items-center space-x-2">
                   <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                   <span className="text-gray-300 text-sm">SimpleHybrid Controller + Memory</span>
                 </div>
               </div>
              <button
                onClick={() => setDebugMode(!debugMode)}
                className="text-xs px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full hover:bg-blue-500/30 transition-colors"
              >
                {debugMode ? '🐛 Debug OFF' : '🔍 Debug ON'}
              </button>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 p-4">
            <div className="flex gap-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Írj üzenetet DeepO-nak..."
                disabled={isLoading}
                className="flex-1 resize-none border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                rows={3}
              />
              <button
                onClick={() => sendMessage(inputMessage)}
                disabled={!inputMessage.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Küldés
              </button>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => sendMessage('Írjunk blog cikket!')}
                disabled={isLoading}
                className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-sm rounded-full transition-colors disabled:opacity-50"
              >
                📝 Blog cikk
              </button>
              <button
                onClick={() => sendMessage('Elemezzük a SEO-t!')}
                disabled={isLoading}
                className="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 text-sm rounded-full transition-colors disabled:opacity-50"
              >
                📊 SEO elemzés
              </button>
              <button
                onClick={() => sendMessage('Mit javasolsz ma?')}
                disabled={isLoading}
                className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm rounded-full transition-colors disabled:opacity-50"
              >
                💡 Javaslatok
              </button>
              <button
                onClick={() => sendMessage('Mutasd a blog cikkek listáját!')}
                disabled={isLoading}
                className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-full transition-colors disabled:opacity-50"
              >
                📋 Cikkek listája
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 