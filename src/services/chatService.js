import { storage } from "./storage.js";
import { request } from "./apiClient.js";

export function chatStorageKey(userId) {
  return `patient_chat_${userId}`;
}

function chatThreadKey(userId) {
  return `patient_chat_thread_${userId}`;
}

function welcomeMessage() {
  return {
    text: "I'm NOVA. How may I help you today?",
    isUser: false,
    time: formatTime(),
  };
}

function readLocalChatMessages(userId) {
  const saved = storage.get(chatStorageKey(userId), []);
  if (saved.length) return saved;
  return [welcomeMessage()];
}

export function saveChatMessages(userId, messages) {
  storage.set(chatStorageKey(userId), messages);
}

function saveChatThreadId(userId, chatId) {
  storage.set(chatThreadKey(userId), chatId);
}

function readChatThreadId(userId) {
  return storage.get(chatThreadKey(userId), null);
}

export function formatTime() {
  const now = new Date();
  return `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function formatMessageTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return formatTime();
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function normalizeMessages(messages) {
  const list = toArrayPayload(messages);
  if (list.length === 0) {
    return [welcomeMessage()];
  }

  return list.map((message) => ({
    text: message.content || message.text || "",
    isUser: message.sender === "user" || message.isUser === true,
    time: message.createdAt ? formatMessageTime(message.createdAt) : (message.time || formatTime()),
  }));
}

function pickLatestChatId(data, fallbackChatId = null) {
  const list = toArrayPayload(data);
  if (list.length === 0) return fallbackChatId;
  if (fallbackChatId && list.some((item) => item._id === fallbackChatId || item.id === fallbackChatId)) {
    return fallbackChatId;
  }
  return list[0]?._id || list[0]?.id || fallbackChatId;
}

function toArrayPayload(data) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];

  return Object.keys(data)
    .filter((key) => /^\d+$/.test(key))
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => data[key]);
}

async function ensureRemoteChat(userId) {
  const existingChatId = readChatThreadId(userId);

  try {
    const chats = await request("/chat", { auth: true });
    const chatId = pickLatestChatId(chats, existingChatId);
    if (chatId) {
      saveChatThreadId(userId, chatId);
      return chatId;
    }
  } catch (error) {
    const noChatsYet = error.status === 400 && /no chats found/i.test(error.message);
    if (!noChatsYet) throw error;
  }

  const created = await request("/chat", {
    auth: true,
    method: "POST",
  });
  const chatId = created?.chatId || created?.data?.chatId || null;
  if (chatId) {
    saveChatThreadId(userId, chatId);
  }
  return chatId;
}

export async function loadChatState(userId) {
  const localMessages = readLocalChatMessages(userId);

  try {
    const chatId = await ensureRemoteChat(userId);
    if (!chatId) {
      return { chatId: null, messages: localMessages, mode: "local" };
    }

    try {
      const remoteMessages = await request(`/chat/${chatId}`, { auth: true });
      return { chatId, messages: normalizeMessages(remoteMessages), mode: "remote" };
    } catch (error) {
      const noMessagesYet = error.status === 400 && /no messages found/i.test(error.message);
      if (noMessagesYet) {
        return { chatId, messages: localMessages, mode: "remote" };
      }
      throw error;
    }
  } catch {
    return { chatId: readChatThreadId(userId), messages: localMessages, mode: "local" };
  }
}

export function createChatClient(onMessage) {
  return {
    send(text) {
      window.setTimeout(() => {
        onMessage({
          text: `NOVA local reply: ${text}`,
          isUser: false,
          time: formatTime(),
        });
      }, 450);
    },
    close() {},
  };
}
