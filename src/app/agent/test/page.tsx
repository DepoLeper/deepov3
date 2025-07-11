'use client';

import { useState } from 'react';
// import { useSession } from 'next-auth/react';

export default function AgentTestPage() {
  // const { data: session } = useSession();
  const [testMessage, setTestMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const runAgentTest = async () => {
    if (!testMessage.trim()) {
      alert('Kérlek írj be egy tesztüzenetet!');
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/agent/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: testMessage,
          userId: 'test-user',
          sessionId: `test-session-${Date.now()}`
        }),
      });

      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Agent teszt futtatása sikertelen',
        error: error instanceof Error ? error.message : 'Ismeretlen hiba'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runComponentTests = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/agent/test/components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // userId: session?.user?.id || 'test-user'
          userId: 'test-user'
        }),
      });

      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Komponens tesztek futtatása sikertelen',
        error: error instanceof Error ? error.message : 'Ismeretlen hiba'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testOpenAISDK = async () => {
    if (!testMessage.trim()) {
      alert('Kérlek írj be egy tesztüzenetet!');
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/agent/poc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: testMessage,
          agentType: 'main'
        }),
      });

      const result = await response.json();
      setTestResult({
        ...result,
        testType: 'OpenAI SDK Agent'
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'OpenAI SDK Agent teszt sikertelen',
        error: error instanceof Error ? error.message : 'Ismeretlen hiba',
        testType: 'OpenAI SDK Agent'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testSDKCapabilities = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/agent/poc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testMode: true
        }),
      });

      const result = await response.json();
      setTestResult({
        ...result,
        testType: 'SDK Képességek'
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'SDK képesség tesztek sikertelenek',
        error: error instanceof Error ? error.message : 'Ismeretlen hiba',
        testType: 'SDK Képességek'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Simple header for test environment */}
      <div className="bg-gray-800 bg-opacity-30 backdrop-blur-lg text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-bold">🧪 DeepO Test Environment</h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🧪 Agent Teszt Labor
          </h1>
          <p className="text-xl text-gray-300">
            DeepO AI Agent rendszer tesztelése és fejlesztése
          </p>
        </div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chat Agent Test */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">💬 Chat Agent Test</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Teszt üzenet:
                </label>
                <textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Pl.: Írj egy blog cikket a higiéniáról..."
                  rows={3}
                />
              </div>
              
              <button
                onClick={runAgentTest}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? 'Tesztelés...' : '🚀 Agent Teszt'}
              </button>
            </div>
          </div>

          {/* Component Tests */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">⚙️ Komponens Tesztek</h2>
            
            <div className="space-y-4">
              <div className="text-sm text-gray-300">
                <p>Teszteli a következő komponenseket:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Memory Manager</li>
                  <li>Context Loader</li>
                  <li>Personality Engine</li>
                  <li>Tool Manager</li>
                </ul>
              </div>
              
              <button
                onClick={runComponentTests}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? 'Tesztelés...' : '🔧 Komponens Tesztek'}
              </button>
            </div>
          </div>
        </div>

        {/* OpenAI Agent SDK POC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* OpenAI SDK Agent Test */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">🚀 OpenAI Agent SDK POC</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Teszt üzenet (OpenAI SDK):
                </label>
                <textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Pl.: Írj egy SEO blog cikket a munkavédelemről..."
                  rows={3}
                />
              </div>
              
              <button
                onClick={testOpenAISDK}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? 'Tesztelés...' : '🧠 OpenAI SDK Agent'}
              </button>
            </div>
          </div>

          {/* OpenAI SDK Capabilities Test */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">🔬 SDK Képesség Tesztek</h2>
            
            <div className="space-y-4">
              <div className="text-sm text-gray-300">
                <p>Teszteli az OpenAI SDK funkciókat:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Multi-agent handoffs</li>
                  <li>Content guides integration</li>
                  <li>SEO analysis tools</li>
                  <li>Native function calling</li>
                </ul>
              </div>
              
              <button
                onClick={testSDKCapabilities}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? 'Tesztelés...' : '🔥 SDK Képességek'}
              </button>
            </div>
          </div>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              📊 Teszt Eredmények
              {testResult.testType && <span className="text-sm text-gray-400 ml-2">({testResult.testType})</span>}
            </h2>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{testResult.success ? '✅' : '❌'}</span>
                  <span className="font-medium text-white">{testResult.message}</span>
                </div>
                
                {testResult.error && (
                  <div className="text-red-300 text-sm mt-2">
                    <strong>Hiba:</strong> {testResult.error}
                  </div>
                )}
              </div>
              
              {testResult.data && (
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-2">Részletes eredmények:</h3>
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 