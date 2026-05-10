import { useEffect, useRef, useState } from "react";
import Icon from "../../components/common/Icon.jsx";
import { useRouter } from "../../hooks/useRouter.js";
import { createChatClient, formatTime, loadChatState, saveChatMessages } from "../../services/chatService.js";

const supportPrompts = ["Show me what you can do"];

export default function PatientChat({ userId }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [connectionMode, setConnectionMode] = useState("loading");
  const [isTyping, setIsTyping] = useState(false);
  const { navigate } = useRouter();
  const listRef = useRef(null);
  const socketRef = useRef(null);
  const hasHydratedScrollRef = useRef(false);
  const visibleMessages = messages.filter((message, index) => {
    const isDefaultGreeting = index === 0 && !message.isUser && message.text === "I'm NOVA. How may I help you today?";
    return !isDefaultGreeting;
  });
  const hasUserMessage = visibleMessages.some((message) => message.isUser);

  useEffect(() => {
    let active = true;

    loadChatState(userId).then((state) => {
      if (!active) return;
      setMessages(state.messages);
      setConnectionMode(state.mode);
    });

    socketRef.current = createChatClient((message) => {
      setIsTyping(false);
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
  }, [messages, userId]);

  useEffect(() => {
    if (!listRef.current) return;
    if (!visibleMessages.length && !isTyping) return;

    const behavior = hasHydratedScrollRef.current ? "smooth" : "auto";
    window.requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior });
      hasHydratedScrollRef.current = true;
    });
  }, [visibleMessages.length, isTyping]);

  function sendMessage(text) {
    if (!text) return;
    setMessages((current) => [...current, { text, isUser: true, time: formatTime() }]);
    if (socketRef.current) {
      setIsTyping(true);
      socketRef.current.send(text);
    }
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
    <main className="relative flex h-dvh max-h-dvh flex-col overflow-hidden bg-[#f7f2ff] text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(255,255,255,0.86),transparent_24%),radial-gradient(circle_at_88%_10%,rgba(167,139,250,0.24),transparent_26%),linear-gradient(180deg,#f8f4ff_0%,#f3ecff_46%,#efe8ff_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[36vh] bg-[linear-gradient(180deg,rgba(137,111,226,0.12),transparent)]" />
      <section className="relative flex h-full min-h-0 w-full flex-col overflow-hidden">
        <ChatTop connectionMode={connectionMode} onBack={() => navigate("/patient-dashboard")} />

        <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[2.4rem] bg-white pt-7 shadow-[0_-12px_38px_rgba(93,74,160,0.08)] md:pt-8 md:shadow-[0_-20px_48px_rgba(93,74,160,0.12)]">
          <div className="absolute left-1/2 top-3 h-1.5 w-10 -translate-x-1/2 rounded-full bg-slate-300" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(123,97,216,0.03),transparent)]" />

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-1 md:px-8 md:pb-6 xl:px-12" ref={listRef}>
              <div className="grid w-full gap-5">
                {!hasUserMessage ? supportPrompts.map((prompt) => (
                  <button
                    type="button"
                    className="ml-auto w-fit max-w-[82%] rounded-[0.95rem] rounded-br-[0.4rem] bg-[linear-gradient(135deg,#8f6df0,#5a3ec7)] px-5 py-4 text-left text-base font-medium text-white shadow-[0_18px_30px_rgba(96,70,200,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_38px_rgba(96,70,200,0.3)] md:max-w-[48%] md:px-6"
                    key={prompt}
                    onClick={() => sendPrompt(prompt)}
                  >
                    {prompt}
                  </button>
                )) : null}

                {visibleMessages.map((message, index) => (
                  <ChatMessage message={message} key={`${message.text}-${message.time}-${index}`} />
                ))}
                {isTyping ? <TypingCard /> : null}
              </div>
            </div>

            <ChatInput draft={draft} onDraftChange={setDraft} onSend={send} />
          </div>
        </section>
      </section>
    </main>
  );
}

function ChatTop({ connectionMode, onBack }) {
  return (
    <header className="relative z-20 shrink-0 px-4 pb-3 pt-4 md:px-8 md:pb-4 md:pt-5 xl:px-10">
      <div className="flex w-full items-center gap-3 pt-1">
        <button
          type="button"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/70 text-[#8168d9] shadow-sm transition hover:-translate-x-0.5 hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#e7ddff]"
          onClick={onBack}
          aria-label="Back"
        >
          <Icon name="chevron-left" size={22} />
        </button>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#8068e8,#5c45c7)] text-white shadow-[0_10px_18px_rgba(91,69,199,0.22)] md:h-9 md:w-9">
          <Icon name="bot-message-square" size={17} color="#fff" />
        </span>
        <div className="min-w-0">
          <h1 className="text-[1rem] font-black leading-none tracking-[-0.03em] text-[#7560c9] md:text-[1.18rem] xl:text-[1.26rem]">Smart AI Chat</h1>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#9b8ad4]">{statusCopy(connectionMode)}</p>
        </div>
      </div>
    </header>
  );
}

function ChatMessage({ message }) {
  if (message.isUser) {
    return (
      <article className="ml-auto w-fit max-w-[84%] md:max-w-[46rem] xl:max-w-[52rem]">
        <div className="rounded-[0.95rem] rounded-br-[0.4rem] bg-[linear-gradient(135deg,#8f6df0,#5a3ec7)] px-5 py-4 text-base font-medium leading-6 text-white shadow-[0_18px_30px_rgba(96,70,200,0.24)] md:px-6 md:py-4">
          {message.text}
        </div>
        <time className="mt-1 block pr-1 text-right text-[11px] font-bold text-slate-400">{message.time}</time>
      </article>
    );
  }

  return (
    <article className="mr-auto max-w-[92%] rounded-[0.95rem] border-2 border-[#7b61d8] bg-white px-5 py-4 text-[#28243b] shadow-[0_16px_30px_rgba(84,61,145,0.08)] md:max-w-[52rem] md:px-6 md:py-5 xl:max-w-[60rem]">
      <p className="whitespace-pre-wrap text-[0.95rem] font-semibold leading-6">{message.text}</p>
      <time className="mt-3 block text-right text-[11px] font-bold text-slate-400">{message.time}</time>
    </article>
  );
}

function TypingCard() {
  return (
    <article className="mr-auto flex w-fit items-center gap-1.5 rounded-[0.85rem] border-2 border-[#7b61d8] bg-white px-5 py-4 shadow-[0_16px_30px_rgba(84,61,145,0.08)]" aria-label="AI is typing">
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#7b61d8] [animation-delay:-0.2s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#7b61d8] [animation-delay:-0.1s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#7b61d8]" />
    </article>
  );
}

function ChatInput({ draft, onDraftChange, onSend }) {
  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  }

  return (
    <form
      className="relative z-20 flex w-full shrink-0 items-center gap-4 border-t border-slate-100 bg-white px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 md:px-6 md:pb-5 md:pt-4 xl:px-8"
      onSubmit={(event) => {
        event.preventDefault();
        onSend();
      }}
    >
      <textarea
        className="min-h-12 max-h-28 min-w-0 flex-1 resize-none rounded-[1rem] bg-[#f3edfb] px-5 py-3.5 text-sm font-semibold leading-5 text-slate-900 outline-none placeholder:text-[#b5adc2] focus:ring-4 focus:ring-[#eadfff] md:min-h-14 md:text-[0.95rem] xl:min-h-16"
        value={draft}
        onChange={(event) => onDraftChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything..."
        rows={1}
      />
      <button
        type="submit"
        className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#8a67ea,#5a3fc8)] text-white shadow-[0_14px_24px_rgba(94,68,200,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_30px_rgba(94,68,200,0.34)] focus:outline-none focus:ring-4 focus:ring-[#d8ccff] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        aria-label="Send"
        disabled={!draft.trim()}
      >
        <Icon name="send" size={22} color="#fff" />
      </button>
    </form>
  );
}

function statusCopy(connectionMode) {
  if (connectionMode === "remote") return "Online";
  if (connectionMode === "loading") return "Loading";
  return "Local mode";
}
