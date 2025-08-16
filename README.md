
# 🤖 AI Chatbot (Nhost + Hasura + n8n + OpenRouter)

🚀 Live Demo: [https://ai-chatbot7.netlify.app/](https://ai-chatbot7.netlify.app/)

This project is a **secure, full-stack AI Chatbot** built with:

- **React + TailwindCSS (Bolt.new)** → frontend UI
- **Nhost Auth** → email/password authentication
- **Hasura GraphQL** → database, queries, mutations & subscriptions
- **n8n Workflow** → orchestrates chatbot responses
- **OpenRouter (DeepSeek R1:free)** → AI model provider
- **Netlify** → hosting & deployment

---

## 📌 Objective

The goal is to create a chatbot application that demonstrates:

- Email Sign Up / Sign In with Nhost Auth
- Chat system powered by Hasura GraphQL
- Real-time updates via GraphQL subscriptions
- AI responses using Hasura Actions → n8n → OpenRouter

---

## ⚡ Features

- 🔐 **Authentication** — Only registered users can access the app
- 💬 **Chat System** — Create new chats & send messages
- ⚡ **Real-time Updates** — Powered by GraphQL subscriptions
- 🤖 **AI Responses** — n8n workflow connects to OpenRouter for replies
- 🛡 **Row-Level Security (RLS)** — Users can only access their own data
- 🌍 **Fully Deployed** — Frontend hosted on Netlify

---

## 🛠 Tech Stack

**Frontend**
- React + TailwindCSS (via Bolt.new)
- GraphQL queries, mutations, and subscriptions only

**Backend**
- Nhost (Authentication + Hasura)
- Hasura (Postgres + GraphQL + RLS)
- n8n (workflow automation)
- OpenRouter API (AI model: DeepSeek R1:free)

**Hosting**
- Netlify (frontend)

---

## 🏗 Architecture

### High-level flow:

```

Frontend (React + Tailwind)
|
v
Nhost Auth (email/password)
|
v
Hasura (GraphQL API + RLS)
|
v
Hasura Action (sendMessage)
|
v
n8n Workflow (Webhook → OpenRouter → Hasura)
|
v
OpenRouter (AI model)

```

### n8n Workflow (ASCII Diagram)

```

[Webhook (Hasura Action: sendMessage)]
        |
        v
[Validate chat ownership via GraphQL]
        |
        v
[Send user message to OpenRouter API (DeepSeek R1:free)]
        |
        v
[Receive AI response from OpenRouter]
        |
        v
[Save assistant message back to Hasura (messages table)]
        |
        v
[Return reply to Hasura Action -> Frontend updates via subscription]


````

---

## 📂 Database Schema (Hasura)

### `chats` table
| Column     | Type      | Description                  |
|------------|-----------|------------------------------|
| id         | UUID (PK) | Unique chat ID               |
| user_id    | UUID (FK) | References Nhost auth user   |
| title      | Text      | Chat title                   |
| created_at | Timestamptz | Auto-generated timestamp   |

### `messages` table
| Column     | Type      | Description                  |
|------------|-----------|------------------------------|
| id         | UUID (PK) | Unique message ID            |
| chat_id    | UUID (FK) | References chats table       |
| role       | Text      | `user` or `assistant`        |
| content    | Text      | The actual message           |
| created_at | Timestamptz | Auto-generated timestamp   |

✅ **Row-Level Security (RLS)** ensures that:
- Users can only access chats/messages where `user_id = X-Hasura-User-Id`.

---

## 🔐 Authentication

- Implemented using **Nhost Auth** with email & password.
- All features are **restricted to authenticated users**.
- Authentication state is synced with frontend using Nhost SDK.

---

## ⚙️ Setup Instructions

### 1️⃣ Clone & Install
```bash
git clone https://github.com/your-username/ai-chatbot.git
cd ai-chatbot
npm install
````

### 2️⃣ Configure Nhost

* Create a project on [Nhost](https://nhost.io)
* Enable **Email/Password Auth**
* Copy your Nhost backend URL & API key

Update `.env.local`:

```env
VITE_NHOST_SUBDOMAIN=your-subdomain
VITE_NHOST_REGION=your-region
```

### 3️⃣ Hasura Setup

* Create `chats` and `messages` tables
* Enable Row-Level Security (RLS)
* Define permissions:

  * `user` role → insert/select/update/delete only their own rows

### 4️⃣ Hasura Action

Create an **Action** `sendMessage`:

```graphql
type Mutation {
  sendMessage(chat_id: uuid!, content: String!): Message
}
```

* Configure webhook → points to **n8n webhook URL**
* Secure with `user` role permissions

### 5️⃣ n8n Workflow

* Add **Webhook node** (entrypoint for Hasura Action)
* Add **GraphQL node** → validate chat ownership
* Add **HTTP Request node** → call OpenRouter (DeepSeek R1\:free)
* Add **GraphQL node** → insert assistant message
* Return response to Hasura

### 6️⃣ Run Locally

```bash
npm run dev
```

### 7️⃣ Deploy

* Push repo to GitHub
* Deploy frontend to **Netlify**
* Set same `.env` values in Netlify dashboard

---

## 📦 Deliverables

✅ Hosted App: [https://ai-chatbot7.netlify.app/](https://ai-chatbot7.netlify.app/)
✅ Secure authentication with Nhost (email/password)
✅ Hasura tables (`chats`, `messages`) with RLS
✅ GraphQL-only communication (no REST)
✅ Hasura Action → n8n → OpenRouter AI responses
✅ Real-time chat with subscriptions
✅ Source code (frontend only, backend handled via Nhost + Hasura + n8n)

---

## 🎯 Conclusion

This project demonstrates how to build a **secure, production-ready AI Chatbot** using only **React (frontend)**, while delegating authentication, database, and AI workflows to **Nhost, Hasura, and n8n**.

It ensures:

* Security (RLS, Auth)
* Real-time experience (subscriptions)
* Extensibility (n8n workflows)
* Clean architecture (all external API calls via backend)

---

## 📬 Feedback & Contribution

Pull requests, suggestions, and feature ideas are welcome! Feel free to fork the repo and contribute.

---

## 👤 Author

**OmXDev**  
🔗 [GitHub Profile](https://github.com/OmXDev)

---

## 📄 License

MIT – feel free to use, modify, and build upon this project.

