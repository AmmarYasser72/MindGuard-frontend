import { useEffect, useRef, useState } from "react";
import Icon from "../../components/common/Icon.jsx";
import { useRouter } from "../../hooks/useRouter.js";
import { createChatClient, formatTime, loadChatState, saveChatMessages } from "../../services/chatService.js";

const supportPrompts = [
  "I feel anxious right now",
  "Help me calm down",
  "Track my mood today",
];

export default function PatientChat({ userId }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [connectionMode, setConnectionMode] = useState("loading");
  const { navigate } = useRouter();
  const listRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    let active = true;

    loadChatState(userId).then((state) => {
      if (!active) return;
      setMessages(state.messages);
      setConnectionMode(state.mode);
    });

    socketRef.current = createChatClient((message) => {
      setMessages((current) => [...current, message]);
    });

    return () => {
      active = false;
      socketRef.current?.close();
    };
  }, [userId]);

  useEffect(() => {
    if (!messages.length) return;
    saveChatMessages(userId, messages);
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, userId]);

  function sendMessage(text) {
    if (!text) return;
    setMessages((current) => [...current, { text, isUser: true, time: formatTime() }]);
    socketRef.current?.send(text);
  }

  function send() {
    const text = draft.trim();
    if (!text) return;
    sendMessage(text);
    setDraft("");
  }

  function sendPrompt(text) {
    sendMessage(text);
    setDraft("");
  }

  return (
    <main className="chat-page">
      <header className="chat-header">
        <button type="button" className="chat-back-button" onClick={() => navigate("/patient-dashboard")} aria-label="Back">
          <Icon name="arrow-left" size={20} color="#4338ca" />
        </button>
        <div className="chat-header-copy">
          <div className="chat-contact-row">
            <span className="chat-contact-avatar">N</span>
            <div>
              <span className="chat-eyebrow">Support companion</span>
              <h1>Chat with NOVA</h1>
            </div>
          </div>
          <p>{connectionMode === "remote" ? "Online now and synced with history" : connectionMode === "loading" ? "Opening your conversation" : "Available in local mode"}</p>
        </div>
      </header>
      <section className="chat-messages" ref={listRef}>
        {messages.map((message, index) => (
          <article className={`chat-row ${message.isUser ? "user" : "nova"}`} key={`${message.text}-${index}`}>
            {!message.isUser ? <span className="chat-avatar nova">N</span> : null}
            <div className={`chat-bubble ${message.isUser ? "user" : "nova"}`}>
              <p>{message.text}</p>
              <small>{message.time}</small>
            </div>
            {message.isUser ? <span className="chat-avatar user">You</span> : null}
          </article>
        ))}
      </section>
      <section className="chat-suggestions" aria-label="Suggested messages">
        {supportPrompts.map((prompt) => (
          <button type="button" key={prompt} onClick={() => sendPrompt(prompt)}>
            {prompt}
          </button>
        ))}
      </section>
      <form className="chat-input" onSubmit={(event) => { event.preventDefault(); send(); }}>
        <div className="chat-input-shell">
          <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Message NOVA..." />
          <button type="submit" aria-label="Send" disabled={!draft.trim()}>
            <Icon name="send" size={20} color="#fff" />
          </button>
        </div>
      </form>
    </main>
  );
}
