# 🧠 Memory Anchor

**Memory Anchor** is an assistive web application designed to help caregivers support people living with dementia by recognizing familiar faces and presenting calm, useful personal context.

The app gives caregivers a simple place to add familiar visitors, save relationship notes, and open a patient-friendly reminder screen when someone is recognized.

---

## 🧩 What Problem It Solves

For people living with dementia, recognizing visitors and recalling relationships can be stressful or disorienting. Memory Anchor aims to reduce that confusion by showing gentle reminders such as a person's name, relationship, last visit, recent conversation, and current update.

It is designed for **caretaker-assisted use** and should be treated as a supportive prototype, not a medical device or diagnostic tool.

---

## 🚀 Core Features

- 🧑‍🤝‍🧑 **Browser-based face recognition** powered by `face-api.js`
- 📸 **Add people by photo upload or camera capture**
- 📝 Stores helpful visitor context:
  - Name
  - Age
  - Relationship
  - Last visit
  - Last conversation summary
  - Current update
- 🧠 **Patient-facing reminder view** with calm, readable information
- 🗂️ **Caregiver management screen** for adding and removing saved faces
- 🎯 Minimal interface designed to avoid cognitive overload
- 💾 Saves registered face descriptors locally in the browser using `localStorage`

---

## ✨ Tech Stack

- `React`
- `TypeScript`
- `Vite`
- `Tailwind CSS`
- `shadcn/ui`
- `Radix UI`
- `React Router`
- `TanStack Query`
- `face-api.js`
- `lucide-react`

---

## 🛠️ Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## ▲ Deploying to Vercel

Use these settings when importing the repository into Vercel:

- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

This repo includes a `vercel.json` rewrite so client-side routing works correctly after deployment.

---

## 🔐 Privacy Notes

Memory Anchor currently runs entirely in the browser. Camera access is requested only when scanning or capturing a photo, and saved face descriptors are stored in the user's browser storage.

There is no backend database in this prototype, so data is local to the browser and device being used.

---

## 🔮 Planned Improvements

- 🥽 VR or headset-friendly interaction mode
- 🎙️ Speech recognition for hands-free notes and retrieval
- ☁️ Secure caregiver accounts and cloud profile storage
- ♿ More accessibility refinements for patient-facing screens
- 🧪 More robust face matching, consent flows, and safety checks
