import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatBotPage = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const navigate = useNavigate();
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 第一次載入從後端抓取歷史，並合併 localStorage 紀錄
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/ai/history', { credentials: 'include' });
        const result = await res.json();
        if (result.status === 200) {
          const history = result.data || [];
          if (history.length === 0 && messages.length === 0) {
            const welcome = [{ role: 'bot', text: '您好，我是商城 AI 客服，有什麼可以幫您？' }];
            setMessages(welcome);
            localStorage.setItem('chatHistory', JSON.stringify(welcome));
          } else {
            const merged = [...history];
            setMessages(merged);
            localStorage.setItem('chatHistory', JSON.stringify(merged));
          }
        }
      } catch (err) {
        console.error('載入歷史失敗：', err);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
        credentials: 'include'
      });

      const result = await res.json();

      if (res.status === 401 || res.status === 403) {
        alert(result.message);
        navigate('/login');
        return;
      }

      const fullText = result.data?.response || 'AI 沒有回應';
      const newIndex = messages.length + 1;
      setMessages(prev => [...prev, { role: 'bot', text: '' }]);

      typeWriterEffect(fullText, newIndex);

    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: '伺服器錯誤，請稍後再試。' }]);
      setLoading(false);
      setTyping(false);
    }
  };

  const typeWriterEffect = (text, msgIndex) => {
    let index = 0;
    const interval = setInterval(() => {
      setMessages(prev => {
        const updated = [...prev];
        if (!updated[msgIndex]) return updated;
        updated[msgIndex].text = text.slice(0, index + 1);
        return updated;
      });
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        setLoading(false);
        setTyping(false);
        scrollToBottom();
      }
    }, 30);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">💬 AI 客服</h2>
      <div className="h-96 overflow-y-auto border rounded p-3 bg-gray-50 mb-3">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 text-sm ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-3 py-2 rounded ${msg.role === 'user' ? 'bg-blue-200' : 'bg-gray-300'}`}>
              {msg.text}
            </span>
          </div>
        ))}
        {typing && (
          <div className="text-sm text-left text-gray-500 animate-pulse">
            客服正在輸入中...
          </div>
        )}
        <div ref={messageEndRef} />
      </div>
      <div className="flex gap-2">
        <textarea
          className="flex-1 border rounded px-3 py-2 resize-none"
          placeholder="請輸入問題，按 Enter 送出，Shift+Enter 換行..."
          rows={2}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? '回覆中...' : '送出'}
        </button>
      </div>
    </div>
  );
};

export default ChatBotPage;
