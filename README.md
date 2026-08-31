# 🏥 Consult360 AI — Pre-Consultation Intelligence Copilot

[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini%203.6%20Flash-4285F4?style=flat&logo=google)](https://ai.google.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=flat&logo=nodedotjs)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](#)

> **Consult360 AI** is an intelligent, full-stack pre-consultation copilot designed for physicians and healthcare systems. It ingests complex, multi-page patient records—including digital PDFs, scanned hospital reports, ECG/EKG strips, echocardiograms, X-rays, and handwritten doctor prescriptions—and transforms them into a concise, clinically structured 360° patient intelligence brief in seconds.

---

## 🌟 Key Capabilities

- 📄 **Multi-Source Report Ingestion**: Upload multiple PDFs and high-resolution medical images simultaneously for a single patient.
- 👁️ **Multimodal Medical Vision OCR**: Uses Gemini Vision to read:
  - 🫀 **ECG / EKG Strips**: Heart rate, rhythm, PR/QRS/QT intervals, ST elevations/depressions, bundle branch blocks.
  - 🫀 **Echocardiograms**: Ejection Fraction (EF%), wall motion abnormalities, valve regurgitations, chamber dimensions.
  - 🫁 **Chest Radiographs / X-Rays**: Consolidations, pleural effusions, cardiomegaly.
  - 📝 **Handwritten Clinical Notes & Prescriptions**: Transcribes messy doctor handwriting into structured dosages and regimens.
- ⚡ **Real-Time SSE Streaming Pipeline**: Live Server-Sent Events (SSE) stream each stage of the extraction pipeline to the physician's screen with sub-second feedback.
- 📊 **Dynamic Longitudinal Trend Analysis**: Automatically computes percentage changes, delta indicators ($\Delta$), and clinical direction for key biometrics (e.g., HbA1c, eGFR, BP, LDL).
- 🚨 **Explainable AI (XAI) Risk Flags**: Every detected risk factor includes the underlying clinical reasoning, extracted evidence citation, source document reference, and suggested mitigation.
- 🔬 **Missing Investigation Alerts**: Proactively detects gaps in clinical workup based on condition guidelines (e.g., missing Urine Microalbumin in Type 2 Diabetes).
- 🖨️ **Print & Export Ready**: Clean medical-grade print stylesheet for clinic paper workflows.

---

## 🏗️ Architecture & 7-Stage Intelligence Pipeline

```
  [ Patient Reports: PDFs, ECG, Echo, X-Ray, Handwritten Rx ]
                              │
                              ▼
  ┌─────────────────────────────────────────────────────────┐
  │                 Node.js / Express Server                 │
  │                                                         │
  │  1. Multi-file Buffer Parser (Multer Memory Storage)    │
  │  2. Hybrid OCR Engine (pdf-parse + Gemini 3.6 Vision)   │
  │  3. Smart Medical Token Extractor & Prioritizer         │
  └───────────────────────────┬─────────────────────────────┘
                              │
                              ▼
  ┌─────────────────────────────────────────────────────────┐
  │                   Google Gemini 3.6 Flash               │
  │                                                         │
  │  4. Named Entity Recognition (NER) & Normalization      │
  │  5. Chronological Timeline Synthesizer                  │
  │  6. Delta Computation & Clinical Change Detection       │
  │  7. Explainable Risk Assessment & Protocol Auditing     │
  └───────────────────────────┬─────────────────────────────┘
                              │
               (Real-Time SSE Streaming)
                              │
                              ▼
  ┌─────────────────────────────────────────────────────────┐
  │               Physician Dashboard Frontend              │
  │                                                         │
  │  • 360° Overview  • Clinical Timeline  • Metric Trends  │
  │  • Risk Engine    • Missing Test Radar • Print Brief    │
  └─────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
antigravity_project/
├── server/
│   ├── routes/
│   │   └── analyze.js       # SSE streaming & multi-file API routes
│   ├── services/
│   │   ├── gemini.js        # Google Gemini 3.6 Flash synthesis service
│   │   ├── pdfParser.js     # Text extraction & scanned PDF fallback
│   │   └── visionOcr.js     # Multimodal Vision OCR (ECG/Echo/Handwriting)
│   ├── .env.example         # Template for environment variables
│   ├── index.js             # Express application entry point
│   └── package.json         # Backend dependencies
├── app.js                   # Client-side state, SSE listener & render engine
├── demo-data.js             # Offline patient benchmark records
├── index.html               # Main physician console UI
├── styles.css               # Glassmorphism dark design system
├── presentation.html        # Interactive presentation slide deck
├── Consult360-AI.pptx       # Slide deck presentation file
├── package.json             # Root workspace configuration
├── vercel.json              # Serverless deployment configuration
└── .gitignore               # Airtight repository ignore rules
```

---

## 🚀 Quickstart & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/divyansh24bce10143-coder/CONSULT-360-AI.git
cd CONSULT-360-AI
```

### 2. Install Dependencies
```bash
# Install root & server dependencies
cd server
npm install
```

### 3. Configure API Key
Create a `.env` file inside the `server/` directory:
```bash
cp .env.example .env
```
Open `server/.env` and insert your Gemini API Key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3000
```
> 💡 *Get a free API key with generous limits from [Google AI Studio](https://aistudio.google.com/).*

### 4. Start the Application
```bash
# From the server directory
npm start
```
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🌐 Public Sharing & Deployment

### Option A: Instant Hackathon Demo via ngrok (Recommended)
Expose your local server securely to external judges or mobile devices:
```bash
# 1. In Terminal 1, ensure server is running:
cd server && npm start

# 2. In Terminal 2, launch ngrok:
ngrok http 3000
```
Share the generated `https://xxxx.ngrok-free.app` URL.

### Option B: Deploy to Vercel / Railway
- **Vercel**: Import the GitHub repo on [Vercel](https://vercel.com). Add `GEMINI_API_KEY` in Project Settings $\rightarrow$ Environment Variables.
- **Railway / Render**: Connect repository, set build command to `npm install` and start command to `node server/index.js`.

---

## 🔒 Privacy & Compliance Considerations

- **Memory-Only Processing**: Uploaded documents are buffered in server memory during extraction and are never permanently persisted to disk or databases without explicit clinician consent.
- **Explainable Audits**: Every AI-generated finding includes a direct link to the underlying laboratory result or image section, ensuring clinicians retain ultimate verification authority.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
