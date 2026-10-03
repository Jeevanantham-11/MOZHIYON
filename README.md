<div align="center">
  <h1>MOZHIYON (மொழியோன்)</h1>
  <p><strong>Premium, Enterprise-Grade English to Tamil Translation Platform</strong></p>

  ![Status](https://img.shields.io/badge/Status-Production_Ready-brightgreen) 
  ![React](https://img.shields.io/badge/React-18.3-blue) 
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue) 
  ![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B2AC)
  ![Supabase](https://img.shields.io/badge/Supabase-Backend-green)
</div>

---

## About The Project

**Mozhiyon** was designed and engineered as a highly interactive, premium English-to-Tamil translation workspace. Moving beyond a basic text converter, this application operates like a professional B2B SaaS tool. It bridges the language gap seamlessly with advanced features like phonetic Tanglish typing, live readability analytics, multi-format studio exports, and secure cloud-synced history.

### Architectural Highlight: Zero-Cost Distributed API
To optimize operational costs and prevent API rate-limiting, Mozhiyon utilizes a **distributed client-side architecture**. Instead of routing translation requests through a centralized paid backend, translations interface directly with public endpoints from the client's browser. This means API requests are distributed across individual users' IP addresses, ensuring practically unlimited translation capabilities with zero backend token costs.

---

## System Architecture

The following diagram illustrates the data flow between the Client interface, the external zero-cost APIs, and the secure Supabase database backend:

```mermaid
graph TD
    subgraph Client [Client-Side Architecture (React + Vite)]
        UI[Mozhiyon Interface]
        Auth[Supabase Auth Session]
        Tanglish[Tanglish Processing Engine]
    end

    subgraph External_APIs [Public Keyless APIs]
        GoogleTrans[Google Translate GTX]
        GoogleInput[Google Input Tools]
        FreeDict[Free Dictionary API]
    end

    subgraph Cloud_Backend [Supabase Backend]
        DB[(PostgreSQL Database)]
        RLS[Row Level Security]
    end

    %% Data Flow
    UI -->|Phonetic English Typing| Tanglish
    Tanglish -->|Fetch native Tamil script| GoogleInput
    UI -->|Translation Request| GoogleTrans
    UI -->|Word Double Click| FreeDict
    
    Auth -->|Validates Active Session| RLS
    UI -->|Saves & Fetches Translation History| RLS
    RLS -->|CRUD Operations| DB
```

---

## Comprehensive Feature Breakdown

### 1. The Tanglish Engine (Phonetic Typing)
Typing natively in Tamil can be difficult for many users. Mozhiyon integrates a phonetic conversion engine utilizing the Google Input Tools API. Users can simply type in "Tanglish" (e.g., typing "vanakkam"), and the system will instantly and dynamically convert it to the native Tamil script ("வணக்கம்") before translation.

### 2. Cloud-Synced Translation History
Every translation is securely backed up to the cloud. By integrating Supabase (PostgreSQL) and Supabase Auth, each user gets a private workspace. Users can access past translations, clear their history, and maintain their workflow across different devices.

### 3. Studio-Grade Exports
Mozhiyon features an advanced export utility that allows users to extract their translations in multiple professional formats:
- **MP3 Audio:** Generates spoken audio files of the Tamil translation for pronunciation practice or media use.
- **PDF Documents:** Formats the English and Tamil text into a clean, downloadable PDF document.
- **SRT Subtitles:** Chunks the translated text into 3-second timestamped segments, generating a YouTube/Vimeo-ready .srt subtitle file.

### 4. Live Readability Analytics
As the user types, a floating HUD (Heads Up Display) calculates live metrics, providing:
- Total word count
- Estimated reading time
- Academic reading level (ARI calculation)

### 5. Interactive Dictionary Mode
Double-clicking any English word inside the translation interface instantly opens a sliding drawer that fetches the official definition, part of speech, and phonetic spelling via the Free Dictionary API.

### 6. Focus Mode
For users reading long translated documents, a single click activates "Cinema Mode"—a distraction-free, cinematic overlay that darkens the UI and focuses entirely on the typography.

### 7. AI Prompt Studio [Experimental]
A UI concept demonstrating how custom LLM (Large Language Model) instructions (e.g., "Translate this into Chennai slang" or "Explain this to a 5-year-old") can be injected into the translation pipeline.

### 8. Interactive Onboarding
New users are greeted with a smooth, interactive highlight tour (utilizing driver.js) that guides them through the workspace features, ensuring zero learning curve.

---

## Tech Stack & Technologies

*   **Frontend Framework:** React 18 (built with Vite)
*   **Language:** TypeScript (Strict typing for enterprise reliability)
*   **Styling:** Tailwind CSS v4 & custom Glassmorphism UI
*   **Animations:** Framer Motion
*   **Database & Auth:** Supabase (PostgreSQL backend)
*   **Icons:** Lucide React
*   **Translation Engine:** Client-side public GTX endpoint
*   **Routing:** React Router v6

---

## Complete Setup Guide (Run Locally)

To download, inspect, and run this application on your local machine, follow these precise steps:

### Step 1: Prerequisites
Make sure you have Node.js installed on your computer. You will also need a free Supabase account for the database.

### Step 2: Clone & Install
Open your terminal and run the following commands:
```bash
git clone https://github.com/your-username/mozhiyon.git
cd mozhiyon
npm install
```

### Step 3: Database Setup (Supabase)
1. Create a new project in your Supabase dashboard.
2. Go to the **SQL Editor** in Supabase and run the following query to set up the secure History table:

```sql
CREATE TABLE translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  english_text TEXT NOT NULL,
  tamil_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own translations." 
ON translations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view shared translations by ID." 
ON translations FOR SELECT USING (true);

CREATE POLICY "Users can delete their own translations." 
ON translations FOR DELETE USING (auth.uid() = user_id);
```

### Step 4: Environment Variables
1. Duplicate the `.env.example` file and rename it to `.env`.
2. Open the new `.env` file and paste your specific Supabase credentials (found in Supabase Settings > API):
```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 5: Launch the Application
Start the Vite development server:
```bash
npm run dev
```
Open http://localhost:5173 in your browser. The application is now fully functional!

---

<div align="center">
  <i>Designed and Engineered for the Uproot Innovation Tech Team.</i>
</div>
