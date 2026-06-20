# AFM House of Glory Member Registration System

A modern, responsive web application developed for **AFM House of Glory** to simplify member registration and securely manage church member information.

The system replaces paper-based registration forms with a digital solution that enables church members to submit their details online while providing administrators with an organized member database.

---

## Features

### Public Member Registration
- Register without creating an account
- User-friendly registration form
- Form validation
- Secure data storage in Firebase Cloud Firestore
- Confirmation message after successful submission

### Administrator Portal
- Secure Firebase Authentication
- View all registered members
- Search member records
- Edit member information
- Delete member records
- Responsive dashboard

---

## Member Information Collected

- First Name
- Surname
- Contact Number
- WhatsApp Number (Optional)
- Email Address (Optional)
- Residential Address
- Date of Birth (Optional)
- Gender (Optional)
- Marital Status
- Occupation (Optional)
- Date Joined AFM House of Glory (Optional)
- Ministry
- Emergency Contact Name
- Emergency Contact Relationship
- Emergency Contact Number

---

## Technology Stack

- React
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Cloud Firestore
- Vite
- Lucide React

---

## Project Structure

```
src/
├── components/
├── pages/
├── hooks/
├── services/
├── firebase/
├── types/
├── utils/
└── assets/
```

---

## Firebase

### Authentication
Firebase Authentication is used to securely authenticate administrators.

### Cloud Firestore

The application stores member information in the following collection:

```
members
    memberId
        firstName
        surname
        phone
        whatsapp
        email
        address
        dob
        gender
        maritalStatus
        occupation
        dateJoined
        ministry
        emergencyContact
        createdAt
```

---

## Installation

Clone the repository

```bash
git clone <repository-url>
```

Navigate to the project

```bash
cd afm-house-of-glory-member-system
```

Install dependencies

```bash
npm install
```

Configure Firebase by creating a `.env` file and adding your Firebase configuration.

Run the development server

```bash
npm run dev
```

Build the application

```bash
npm run build
```

Preview the production build

```bash
npm run preview
```

---

## Purpose

The AFM House of Glory Member Registration System was developed to:

- Digitize member registration
- Maintain an accurate church member database
- Improve administrative efficiency
- Reduce paperwork
- Securely store member information
- Enhance communication between church leadership and members

---

## License

This project was developed for **AFM House of Glory** and is intended for church administration and member management.
