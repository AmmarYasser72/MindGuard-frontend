import { useEffect, useRef, useState } from "react";
import Icon from "../../components/common/Icon.jsx";
import { useRouter } from "../../hooks/useRouter.js";
import { createEchoSocket, formatTime, loadChatMessages, saveChatMessages } from "../../services/chatService.js";

export default function PatientChat({ userId }) {
  const [messages, setMessages] = useState(() => loadChatMessages(userId));
  const [draft, setDraft] = useState("");
  const { navigate } = useRouter();
  const listRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = createEchoSocket((message) => {
      setMessages((current) => [...current, message]);
    });
    const timer = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { text: "Hello! I'm a mock response 😊", isUser: false, time: formatTime() },
      ]);
    }, 1000);
    return () => {
      socketRef.current?.close();
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    saveChatMessages(userId, messages);
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, userId]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [...current, { text, isUser: true, time: formatTime() }]);
    socketRef.current?.send(text);
    setDraft("");
  }

  return (
    <main className="chat-page">
      <header className="chat-header">
        <button type="button" onClick={() => navigate("/patient-dashboard")} aria-label="Back">
          <Icon name="arrow-left" size={22} />
        </button>
        <div>
          <h1>Chat with NOVA</h1>
          <span>Online</span>
        </div>
      </header>
      <section className="chat-messages" ref={listRef}>
        {messages.map((message, index) => (
          <article className={`chat-bubble ${message.isUser ? "user" : "nova"}`} key={`${message.text}-${index}`}>
            <p>{message.text}</p>
            <span>{message.time}</span>
          </article>
        ))}
      </section>
      <form className="chat-input" onSubmit={(event) => { event.preventDefault(); send(); }}>
        <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type your message..." />
        <button type="submit" aria-label="Send">
          <Icon name="send" size={20} color="#fff" />
        </button>
      </form>
    </main>
  );
}
