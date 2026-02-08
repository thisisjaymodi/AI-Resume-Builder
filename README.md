# 🚀 AI Resume Builder

An intelligent full-stack application that leverages AI to help users generate professional resumes in minutes. Built with the **MERN Stack** (MongoDB, Express.js, React, Node.js).

## 🌟 Features

- **AI-Powered Content Generation**: Utilizes AI (OpenAI/Gemini) to generate professional summaries and bullet points.
- **Real-time Preview**: See changes instantly as you edit your resume.
- **PDF Export**: Download high-quality, ATS-friendly resumes.
- **Modern UI/UX**: Responsive design built with React and Tailwind CSS.
- **Secure Authentication**: User login and data protection.

## 🛠️ Tech Stack

**Frontend (Client):**
- React (Vite)
- Tailwind CSS
- Lucide React (Icons)
- Axios

**Backend (Server):**
- Node.js & Express.js
- MongoDB & Mongoose
- OpenAI API (or Gemini/Claude)
- Cors & Dotenv

## 📂 Project Structure

```bash
AI-Resume-Builder/
├── client/         # React Frontend (Vite)
├── server/         # Express Backend
└── README.md       # Project Documentation


🚀 Getting Started
Follow these steps to set up the project locally.

Prerequisites
Node.js (v16 or higher)

MongoDB (Local or Atlas URI)

An AI API Key (e.g., OpenAI or Gemini)

1. Setup Backend (Server)
Navigate to the server directory and install dependencies:

bash
cd server
npm install
Create a .env file in the server folder and add your variables:

text
PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_ai_api_key
# JWT_SECRET=your_jwt_secret (if using auth)
Start the server:

bash
npm run dev
# Server usually runs on http://localhost:5000
2. Setup Frontend (Client)
Open a new terminal, navigate to the client directory, and install dependencies:

bash
cd client
npm install
Create a .env.local file in the client folder (if you have frontend env vars):

text
VITE_API_URL=http://localhost:5000/api
Start the frontend:

bash
npm run dev
# Client usually runs on http://localhost:5173

Contributing
Contributions are welcome! Please fork the repository and create a pull request with your improvements.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is open source and available under the MIT License.

Made in 🍁 with ❤️ by Jay Modi 
