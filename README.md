# Forel Restaurant — Multilingual Restaurant Website & Ordering System

A premium, modern web application for a multilingual restaurant website, featuring a live shopping cart, tables/booking system, interactive menu filtering, reviews, an administrative panel, and a webhook server that instantly dispatches notifications (orders, bookings, and reviews) directly to the staff's Telegram group.

Built using **Next.js (React)** for a performant frontend and **Express.js** for the backend API.

---

## 🎨 Interface Preview (Screenshots)

> [!NOTE]
> Below are placeholders for visual walkthroughs. Replace these with actual images when deployed.

| Page / State | Preview |
|---|---|
| **Main Landing Page** (Hero section & Branding) | ![Main Page](screenshots/hero.png) |
| **Interactive Menu** (Responsive categories & cart integration) | ![Interactive Menu](screenshots/menu.png) |
| **Table Booking Form** (Validation & guest selector) | ![Table Booking Form](screenshots/booking.png) |
| **Telegram Notifications** (Instant webhook messages) | ![Telegram Notifications](screenshots/telegram_notif.png) |

---

## 🚀 Key Features

*   **🌐 Full Multilingual Localization**: Built using `react-i18next` and static JSON catalogs supporting English (`en`) and Russian (`ru`). Switches instantly without page reloading.
*   **🛒 Interactive Shopping Cart**: Client-side React context stores cart states securely, dynamically calculating subtotals, delivery fees, and order totals.
*   **🔔 Real-Time Telegram Integration**: Every order, table booking, or review submission triggers a Telegram Bot API notification sent directly to a kitchen/staff chat channel.
*   **📅 Table Reservation System**: Responsive form with front-end validation (date, time, guests, phone verification) using `react-hook-form`.
*   **🔒 Administrative Dashboard**: An internal control panel (`/admin`) to oversee bookings, pending orders, manage the menu, and review customer feedback.
*   **⚡ Premium User Experience**: Animated with `framer-motion` for fluid page transitions, micro-interactions, and responsive layout scaling across all devices.

---

## 🛠️ Technology Stack

*   **Frontend**: Next.js 14 (Pages Router), React 18, Tailwind CSS, Framer Motion, Headless UI, Heroicons, i18next + react-i18next.
*   **Backend**: Node.js, Express, body-parser, CORS, node-telegram-bot-api (Telegram Bot integration).
*   **Utilities**: axios, date-fns, react-hot-toast (slick toast messages), concurrently (run dev client and backend server simultaneously).

---

## 📁 Project Layout

```text
forel-restaurant/
├── components/          # Reusable React layout, cart, and menu card components
├── contexts/            # Global shopping cart React Context
├── data/                # Mock data / fallbacks for menus and categories
├── lib/                 # Core API Client and i18next configuration
├── pages/               # Next.js Pages (index, menu, booking, delivery, reviews, contacts, admin)
├── public/              # Static assets (images, localized strings, manifest, PWA worker)
│   └── locales/         # Translation JSON files (ru/common.json, en/common.json)
├── server/              # Express API Server
│   ├── routes/          # REST endpoints (orders, menu, booking, reviews, admin)
│   └── services/        # Service layer (Database layer, Telegram notification formatter)
├── styles/              # Global CSS & Tailwind styles
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Project manifests and startup scripts
```

---

## ⚙️ Setup and Installation

### 1. Prerequisites
Make sure you have Node.js (version 18 or newer) installed.

### 2. Set Up Environment Variables
Create a `.env` file in the root of the project (copy from `.env.example`):

```bash
cp .env.example .env
```

Fill in the variables in `.env`:
```env
PORT=5000
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

### 3. Install Dependencies
Run the installation command in the root directory:

```bash
npm install
```

### 4. Running the Project

To run both the Next.js development server (port 3000) and the Express backend server (port 5000) concurrently:

```bash
npm run dev:all
```

Alternatively, you can run them separately in different terminals:
```bash
# Run Next.js frontend (client)
npm run dev

# Run Express backend (server)
npm run server
```

The application will be accessible at:
*   Frontend Client: `http://localhost:3000`
*   Backend API: `http://localhost:5000`

---

## 📢 Telegram Bot Setup Instructions

1.  Message [@BotFather](https://t.me/BotFather) on Telegram and send `/newbot` to create a bot.
2.  Copy the provided HTTP API token and paste it as `TELEGRAM_BOT_TOKEN` in your `.env`.
3.  Add the bot to your channel or group chat where you want to receive restaurant notifications. Make sure the bot is granted Admin privileges to send messages.
4.  Retrieve the chat/channel ID (often using a utility bot like `@getidsbot` or checking group details) and set it as `TELEGRAM_CHAT_ID` in `.env` (note: channel IDs usually start with `-100`).

---

## 📄 License
This project is proprietary and confidential. All rights reserved.
