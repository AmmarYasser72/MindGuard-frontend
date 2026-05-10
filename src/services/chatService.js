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
          text: createLocalReply(text),
          isUser: false,
          time: formatTime(),
        });
      }, 700);
    },
    close() {},
  };
}

function createLocalReply(text) {
  const normalized = text.toLowerCase();

  if (normalized.includes("show me") || normalized.includes("what you can do")) {
    return "Of course! I can assist you with a wide range of tasks and answer questions on various topics. Here are some things I can do:\n\n- Answer questions: Just ask me anything you like.\n\n- Generate text: I can write notes, reflections, reports, stories and more.\n\n- Conversation AI: I can engage in natural conversations and help you think through what is on your mind.";
  }

  if (normalized.includes("anxious") || normalized.includes("panic") || normalized.includes("worried")) {
    return "I'm here with you. Let's slow this down together: breathe in for 4, hold for 2, and breathe out for 6. What are you noticing in your body right now?";
  }

  if (normalized.includes("calm") || normalized.includes("breath")) {
    return "Let's do a quick reset. Drop your shoulders, unclench your jaw, and take three slow breaths. I'll stay with you while your nervous system catches up.";
  }

  if (normalized.includes("mood") || normalized.includes("feel")) {
    return "We can track that. If you had to choose one word for your mood right now, what would it be?";
  }

  return "I hear you. Tell me a little more about what's been going on, and we'll take it one step at a time.";
}
