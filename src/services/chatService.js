import { storage } from "./storage.js";

export function chatStorageKey(userId) {
  return `patient_chat_${userId}`;
}

export function loadChatMessages(userId) {
  const saved = storage.get(chatStorageKey(userId), []);
  if (saved.length) return saved;
  return [
    {
      text: "I'm NOVA. How may I help you today?",
      isUser: false,
      time: formatTime(),
    },
  ];
}

export function saveChatMessages(userId, messages) {
  storage.set(chatStorageKey(userId), messages);
}

export function formatTime() {
  const now = new Date();
  return `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function createEchoSocket(onMessage) {
  let socket = null;
  try {
    socket = new WebSocket("wss://echo.websocket.events");
    socket.onmessage = (event) => {
      onMessage({ text: event.data, isUser: false, time: formatTime() });
    };
  } catch {
    socket = null;
  }

  return {
    send(text) {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(text);
        return;
      }
      window.setTimeout(() => {
        onMessage({ text: `Mock response: ${text}`, isUser: false, time: formatTime() });
      }, 450);
    },
    close() {
      socket?.close();
    },
  };
}
