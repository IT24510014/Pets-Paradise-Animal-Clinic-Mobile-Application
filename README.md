# 🐾 Pets Paradise Mobile Application

## 📱 Overview

**Pets Paradise Mobile Application** is a full-stack veterinary clinic management and pet care service platform designed to help pet owners interact with the clinic digitally. The application allows users to book appointments, manage pets, browse products, place orders, and track their service history through a mobile interface.

The system includes:

* React Native (Expo) mobile frontend
* Node.js + Express backend REST API
* MongoDB cloud database (MongoDB Atlas)
* Backend deployment via Render / Railway

This solution improves clinic efficiency while providing a convenient digital experience for pet owners.

---

# 🚀 Features

## 👤 User Management Module

Handles authentication and profile operations.

Functions:

* User registration
* Secure login/logout
* Profile management
* Role-based navigation (Admin / User)
* JWT authentication support

---

## 🐶 Pet Records Management Module

Stores and manages pet details digitally.

Functions:

* Add pet profiles
* Edit pet details
* View pet history
* Maintain vaccination and medical notes

---

## 📅 Appointment Booking Module

Allows users to schedule clinic visits easily.

Functions:

* Book appointments
* View upcoming appointments
* Cancel appointments
* Appointment history tracking

---

## 🛒 Pet Shop Module

Mobile shopping experience for clinic products.

Functions:

* View product catalog
* Product categories browsing
* Product search
* Product detail viewing

---

## 🛍 Cart & Checkout Module

Handles purchase workflow.

Functions:

* Add products to cart
* Update quantity
* Remove items
* Checkout processing
* Order confirmation

---

## 📦 Order Management Module

Tracks purchases made by users.

Functions:

* View order history
* Track order status
* Display purchased product details

---

## 🏥 Clinic Services Module

Provides access to clinic-related services.

Functions:

* Service browsing
* Appointment-based service requests
* Surgery scheduling support (future extension)

---

## 🔔 Notification Module (Planned Extension)

Improves communication between clinic and users.

Future Features:

* Appointment reminders
* Order updates
* Vaccination alerts

---

# 🧱 System Architecture

```
Mobile App (React Native + Expo)
        |
        | REST API Requests
        |
Backend Server (Node.js + Express)
        |
MongoDB Atlas (Cloud Database)
```

---

# 🛠 Tech Stack

## 📱 Frontend (Mobile)

* React Native (Expo)
* React Navigation / Expo Router
* Axios (API communication)
* Context API / Local storage (state persistence)
* Custom reusable components

---

## 🌐 Backend

* Node.js
* Express.js
* REST API architecture
* JWT authentication
* dotenv environment configuration

---

## 🗄 Database

* MongoDB Atlas (Cloud)
* Mongoose ODM

---

## ☁ Deployment

Backend hosted on:

* Railway

Frontend runs using:

* Expo Go
* Android Emulator
* Physical Android device

---

# ▶ Running the Backend

```
cd backend
npm install
npm run dev
```

Server runs on:

```
http://localhost:5000
```

---

# 📲 Running the Mobile App

```
cd mobile
npm install
npx expo start
```

Then open using:

* Android Emulator
* Expo Go mobile app
* USB debugging device

---

# 🔗 API Base URL Configuration

Inside:

```
services/api.js
```

Example:

```
export default axios.create({
 baseURL: "https://your-railway-backend-url.com"
});
```

Use localhost during development:

```
http://10.0.2.2:5000
```

---

# 👨‍💻 Development Team

Developed as a group academic mobile application project for veterinary clinic digital transformation.

Modules implemented collaboratively including:

* Authentication
* Appointment system
* Pet management
* Product ordering
* User dashboard

---

# 📌 Future Improvements

Planned enhancements:

* Online payment gateway integration
* Push notifications
* Admin mobile dashboard
* Real-time appointment approval
* Prescription history tracking

---

# 📄 License

This project is developed for academic purposes and learning full-stack mobile application development.

---

# ❤️ Project Goal

To create a smart veterinary clinic companion application that simplifies appointment booking, pet record management, and pet product purchasing through a modern mobile platform.
