import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatBotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const navigate = useNavigate();
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/ai/history', { credentials: 'include' });
        const result = await res.json();
        if (result.status === 200) {
          const history = result.data || [];
          if (history.length === 0) {
            setMessages([{ role: 'bot', text: '您好，我是商城 AI 客服，有什麼可以幫您？' }]);
          } else {
            setMessages(history);
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
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setLoading(true);
    setTyping(true);

    try {
      const eventSource = new EventSource(`/api/ai/chat/stream?message=${encodeURIComponent(userText)}`, {
        withCredentials: true,
      });

      let botMessage = '';
      const botIndex = messages.length + 1;
      setMessages(prev => [...prev, { role: 'bot', text: '' }]);

      eventSource.onmessage = (event) => {
        botMessage += event.data;
        setMessages(prev => {
          const updated = [...prev];
          updated[botIndex] = { role: 'bot', text: botMessage };
          return updated;
        });
      };

      eventSource.onerror = (err) => {
        console.error('SSE 錯誤:', err);
        eventSource.close();
        setTyping(false);
        setLoading(false);
        setMessages(prev => [...prev, { role: 'bot', text: 'AI 回覆失敗，請稍後再試。' }]);
      };

      eventSource.onopen = () => {
        console.log('SSE 連線成功');
      };

      eventSource.addEventListener('close', () => {
        console.log('SSE 已關閉');
        setTyping(false);
        setLoading(false);
      });

      // 偵測最後一段，判斷完成
      eventSource.addEventListener('end', () => {
        eventSource.close();
        setTyping(false);
        setLoading(false);
      });

    } catch (err) {
      console.error('發送錯誤：', err);
      setMessages(prev => [...prev, { role: 'bot', text: '伺服器錯誤，請稍後再試。' }]);
      setLoading(false);
      setTyping(false);
    }
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
