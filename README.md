# 🌆 CommunityPulse AI

### AI-Powered Civic Issue Intelligence Platform

> **Turning citizen complaints into structured civic intelligence.**

CommunityPulse AI is an AI-powered platform that helps citizens report community issues and transforms those reports into structured, actionable insights using **Google Gemini**.

Instead of storing complaints as raw text, the system analyzes them to identify the **issue, severity, priority, responsible department, and suggested actions**.

## 🌐 Live Demo

**[CommunityPulse AI](https://community-pulse-ai.onrender.com/)**

## ✨ Key Features

* 📝 **Civic Issue Reporting** - Submit complaints with descriptions, categories, and supporting information.
* 🤖 **AI Analysis** - Gemini analyzes complaints and generates structured insights.
* 🚨 **Severity & Priority Detection** - Helps identify which issues may require greater attention.
* 🏢 **Department Recommendation** - Suggests the appropriate department for handling an issue.
* 📊 **Admin Dashboard** - View complaints, categories, priorities, severity, and analytics.
* 🔎 **Complaint Management** - Review individual complaints and their AI-generated analysis.
* 📱 **Responsive UI** - Designed for desktop and mobile screens.

## ⚙️ How It Works

```text
Citizen Report
      ↓
AI Analysis
      ↓
Classification
      ↓
Severity & Priority
      ↓
Department Recommendation
      ↓
Actionable Insights
      ↓
Admin Dashboard
```

## 🏗️ Architecture

```text
React + Vite + Tailwind
          ↓
   Node.js + Express
       ↙       ↘
Google Gemini   PostgreSQL
       ↘       ↙
   Civic Dashboard
```

## 🧰 Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, Recharts
**Backend:** Node.js, Express, TypeScript, REST APIs
**AI:** Google Gemini API
**Database:** PostgreSQL, Drizzle ORM
**Validation:** Zod
**Deployment:** Render
**Package Manager:** pnpm

## 🛠️ Run Locally

```bash
git clone https://github.com/rakshachahar/community-pulse-ai.git
cd community-pulse-ai
pnpm install
```

Create a `.env` file:

```env
DATABASE_URL=your_postgresql_connection_string
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
NODE_ENV=development
```

Start the application:

```bash
pnpm dev
```

Build and type-check:

```bash
pnpm run typecheck
pnpm run build
```

## 🔌 API

### Health Check

```http
GET /api/healthz
```

### Complaint Analysis

```http
POST /api/complaints/analyze
```

Example:

```json
{
  "description": "flooding after heavy rain",
  "category": "drainage"
}
```

## ⚠️ Limitations

* AI-generated analysis may occasionally be inaccurate.
* AI recommendations should be reviewed by humans before real-world action.
* Analysis quality depends on the information provided.
* Large-scale deployment would require additional security, privacy, and compliance measures.

## 🔮 Future Scope

* Real-time complaint tracking
* Regional language support
* Voice-based reporting
* GIS-based issue heatmaps
* Duplicate complaint detection
* Predictive civic maintenance
* Automated department routing
* Mobile application
* AI civic assistant

## 👩‍💻 Author

**Raksha Chahar**
B.Tech AI/ML Engineering Student

[GitHub](https://github.com/rakshachahar)

## 📄 License

MIT License

---

> **CommunityPulse AI — From citizen complaints to actionable civic intelligence.**
