# 🏪 Marketplace & Live Chat Frontend  

A **React-based frontend** for a **marketplace platform**, where users can post **items, services, and jobs**, and connect via **real-time chat**. This app integrates with the **Express.js + TypeScript backend** and uses **Socket.io** for messaging. 

### Demo
http://18.217.230.205:3000/login

## Test Accounts:
| Username  | Password |
|------------|-------------|
| admin@gmail.com | password |
| user@gmail.com | password |

### Backend Repository
https://github.com/phucvtran/ngconnect_backend

## 🚀 Features  

### 🎨 UI & User Experience  
- **Modern, responsive UI** with React MUI, Emotion Styled 
- **Dynamic filters & search** for listings (in-progress)  

### 🔐 Authentication & Authorization  
- **JWT-based authentication**  
- **User roles**: Admin, Business, User  
- **Persistent login with refresh tokens**  

### 🛍️ Listings Management  
- **Create, edit, and delete listings**  
- **Filter and sort listings** (in-progress) 
- **View listing details**  

### 💬 Real-Time Chat  
- **Live messaging with Socket.io**  
- **Conversations linked to listings**

## 🛠️ Tech Stack  

| Technology  | Description |
|------------|-------------|
| **Frontend** | React.js + TypeScript |
| **State Management** | Redux Toolkit |
| **UI Library** | React MUI + Emotion Styled |
| **Real-Time** | Socket.io-client |
| **API Calls** | Axios |
| **Routing** | React Router |

## 📦 Installation  

### 1️⃣ Clone the Repository  
```sh
https://github.com/phucvtran/ngconnect.git
```

### Install Dependencies
```sh
npm install
```

### Create local .env files
```sh
REACT_APP_API_HOST=your-api-host/api
SOCKET_HOST=your-socket-host
```

### run local
```sh
npm start
```
