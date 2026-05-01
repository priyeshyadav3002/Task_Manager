🚀 Human Pattern Workspace (TaskQuest)
A professional, full-stack Task Management System designed for high-performance teams. This application allows Project Managers (Admins) to assign tasks, set priorities, and track progress in real-time, while providing Members with a streamlined interface to manage their daily contributions.

🔗 Live Demo
Frontend: https://task-manager-five-delta-94.vercel.app/team


Backend API: https://task-manager-bk86.onrender.com

📸 Project Preview

1. Professional Dashboard
A high-level view of pending, accepted, and active assignments.

2. Task Assignment (Admin)
The modal interface for creating and assigning tasks to specific team members.

3. User Authentication
Secure login and registration with role-based access control.

🛠 Tech Stack
Frontend: React.js, Vite, Tailwind CSS, Framer Motion (Animations), Lucide-React (Icons).

Backend: Node.js, Express.js.

Database: MongoDB Atlas (NoSQL).

Deployment: Vercel (Frontend), Render (Backend).

State Management: React Context API.

✨ Key Features
Role-Based Access (RBAC): Distinct dashboards and capabilities for Admins and Members.

Real-Time Alerts: Pulse-animation notifications for new pending tasks.

Task Lifecycle: Full workflow from "Pending" → "Accepted" → "Completed".

Priority Management: Color-coded priority levels (High, Medium, Low).

Mobile-First Design: Fully responsive Sidebar and Workspace layout.

Global Configuration: Centralized API management for seamless cloud deployment.

🚀 Getting Started
1. Clone the repository
Bash
git clone https://github.com/priyeshyadav3002/Task_Manager.git
cd Task_Manager
2. Frontend Setup
Bash
cd frontend
npm install
npm run dev
3. Backend Setup
Bash
cd backend
npm install
# Ensure you have your MONGO_URI and PORT set in your environment variables
npm start
📝 Environment Configuration
To run this project locally, create a src/config.js in the frontend and point it to your local server:

JavaScript
export const API_BASE_URL = "http://localhost:5001";
👨‍💻 Author
Priyesh Yadav

Computer Science (AI & ML Specialization)
