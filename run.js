// run.js
// ⚡ WhatsApp Bot Tanpa npm install, tanpa QR
// ⚙️ Menggunakan Baileys dari GitHub: Fianz/Baileys

import makeWASocket, { fetchLatestWaWebVersion } from "https://esm.sh/@whiskeysockets/baileys@github:Fianz/Baileys"
import P from "https://esm.sh/pino@9.0.0"

// 🧩 Masukkan creds.json kamu di sini
const SESSION = {
  creds: {
    // 🔹 Ganti isi di bawah ini dengan isi creds.json kamu (salin semuanya dari file hasil QR)
    // Contoh:
    // "noiseKey": {"private":{...},"public":{...}},
    // "signedIdentityKey": {...},
    // "account": {...},
  },
  keys: {}
};

async function startBot() {
  const { version } = await fetchLatestWaWebVersion();
  console.log("🚀 WhatsApp Web version:", version.join("."));

  const sock = makeWASocket({
    version,
    auth: SESSION,
    logger: P({ level: "silent" }),
    printQRInTerminal: false,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    markOnlineOnConnect: false
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "open") console.log("✅ Connected — Tanpa QR & Tanpa npm install!");
    if (connection === "close") {
      console.log("❌ Disconnected:", lastDisconnect?.error);
      setTimeout(() => startBot(), 3000);
    }
  });

  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];
    if (!msg?.message) return;

    const from = msg.key.remoteJid;
    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";

    console.log(`[${from}] ${text}`);

    if (text.toLowerCase() === "halo") {
      await sock.sendMessage(from, { text: "Halo juga! 👋 Saya FianzBot" });
    } else if (text.toLowerCase() === "/menu") {
      await sock.sendMessage(from, { text: "✨ Menu:\n1. halo\n2. /menu\n3. /owner" });
    }
  });
}

startBot().catch(console.error);
