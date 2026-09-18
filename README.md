# CRM - Customer Relationship Management System

A modern and responsive **Customer Relationship Management (CRM)** web application built with React. The application helps organizations manage customers, leads, deals, contacts, tasks, and team members from a centralized dashboard.

The project focuses on a clean user interface, responsive design, CRUD functionality, role-based access, search, notifications, and browser-based data persistence.

## Features

### Authentication
- User Signup
- User Login
- Logout functionality
- Protected routes
- Persistent login using LocalStorage
- User-specific CRM data

### Dashboard
- Total Customers
- Active Leads
- Active Deals
- Total Revenue
- Revenue analytics
- CRM activity overview
- Responsive dashboard layout

### Customers
- Add customers
- Edit customers
- Delete customers
- Search customers
- Filter customers by status
- Customer information management

### Leads
- Add leads
- Edit leads
- Delete leads
- Search leads
- Lead status management
- Assign leads to team members

### Deals
- Create deals
- Edit deals
- Delete deals
- Deal pipeline management
- Deal stages:
  - New
  - Qualified
  - Proposal
  - Negotiation
  - Won
- Priority management
- Assign deals to team members
- Revenue tracking

### Contacts
- Add contacts
- Edit contacts
- Delete contacts
- Search contacts
- Contact information management

### Tasks
- Create tasks
- Edit tasks
- Delete tasks
- Task status management
- Assign tasks to team members
- Task tracking

### Team Members
- Add team members
- Edit team members
- Delete team members
- Assign roles
- Active/Inactive status
- Password management
- Shared team member list
- Team member assignment across CRM modules

### Global Search
The navbar includes a global search feature that allows users to search across:

- Team Members
- Customers
- Leads
- Deals
- Contacts
- Tasks

Search results display relevant information and allow users to navigate directly to the corresponding module.

### Notifications
- Recent CRM activity
- Add/update notifications
- Unread notification count
- Mark notifications as read
- Clear notifications
- Responsive notification dropdown

### Responsive Design
The application is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile devices

The navbar, dashboard, forms, tables, search, notifications, and other components adapt to different screen sizes.

---

## Tech Stack

### Frontend

- React.js
- React Router
- JavaScript
- Tailwind CSS
- Lucide React
- Recharts

### Data Storage

- Browser LocalStorage

### Development Tools

- Vite
- npm
- Git
- GitHub

---

## Project Structure


crm-frontend/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ...
│   │
│   ├── context/
│   │   ├── NotificationsContext.jsx
│   │   └── useNotifications.js
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Customers.jsx
│   │   ├── Leads.jsx
│   │   ├── Deals.jsx
│   │   ├── Contacts.jsx
│   │   ├── Tasks.jsx
│   │   ├── Reports.jsx
│   │   ├── TeamMembers.jsx
│   │   └── ...
│   │
│   ├── utils/
│   │   └── userStorage.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md

Installation
1. Clone the repository
git clone YOUR_GITHUB_REPOSITORY_URL
2. Navigate to the project
cd crm-frontend
3. Install dependencies
npm install
4. Start the development server
npm run dev

The application will run on the local Vite development server.

Available Scripts
Start Development Server
npm run dev
Build for Production
npm run build
Preview Production Build
npm run preview
Authentication Flow

The application provides a simple authentication system for demonstration purposes.

Signup

Users can create an account by providing:

Name
Email
Password
Role
Login

Registered users can log in using their email and password.

The currently logged-in user is stored in:

currentUser

Authentication state is maintained using LocalStorage.

Role-Based Access

The CRM supports different user roles such as:

Admin
Manager
Sales
Support
Marketing

Roles can be used to control access to different CRM functionality.

For example:

Admin
 ├── Dashboard
 ├── Customers
 ├── Leads
 ├── Deals
 ├── Contacts
 ├── Tasks
 ├── Reports
 └── Team Members

The application can be extended further with more granular permissions for each role.

Data Management

Since this project is currently a frontend-based CRM, LocalStorage is used for data persistence.

Examples of stored data include:

currentUser
crmUsers
crmTeamMembers
crmCustomers
crmLeads
crmDeals
crmContacts
crmTasks

User-specific data is separated using the logged-in user's email.

For example:

user@email.com_crmCustomers
user@email.com_crmLeads
user@email.com_crmDeals

This allows different users to maintain separate CRM data within the browser.

Team member information can be stored using the shared:

crmTeamMembers

key so that team members can be used across different CRM modules.

Global Search

The navbar search provides a centralized search experience.

Users can search for:

Customer name
Lead name
Deal title
Company
Contact
Task
Team member
Email

The search results are displayed in a responsive dropdown.

Selecting a result automatically navigates the user to the relevant CRM page.

Notifications

CRM activities generate notifications such as:

Customer added
Customer updated
Lead added
Deal updated
Team member added
Team member updated

The notification system provides:

Activity history
Unread count
Notification dropdown
Clear all functionality
Deal Pipeline

Deals are organized using a pipeline system:

New
  ↓
Qualified
  ↓
Proposal
  ↓
Negotiation
  ↓
Won

Each deal can contain information such as:

Deal title
Customer
Company
Value
Priority
Assigned team member
Date
Pipeline stage
UI & Design

The application uses Tailwind CSS for styling.

Design principles include:

Clean dashboard layout
Responsive components
Consistent spacing
Rounded cards
Modern navigation
Responsive tables
Modal-based forms
Interactive buttons
Responsive search
Notification dropdown
Mobile-friendly navbar
Charts & Reports

The project uses Recharts to display CRM analytics.

Examples include:

Revenue charts
Monthly performance
CRM statistics
Deal analytics

These visualizations provide a quick overview of business performance.

Security Note

This project is designed as a frontend demonstration project.

Passwords are currently stored in LocalStorage for development/demo purposes.

This approach should not be used in a production application.

For a production CRM, authentication should be handled using:

Backend authentication
Password hashing
Secure HTTP-only cookies or tokens
Database storage
Role-based authorization
API-level access control
Future Improvements

The project can be extended with:

Backend API
MongoDB / PostgreSQL database
JWT authentication
Password hashing
Real-time notifications
Advanced role-based permissions
Email integration
File uploads
Customer activity timeline
Advanced reports
Export to Excel/PDF
Dark mode
Cloud deployment
Search with backend indexing
Audit logs
Team performance analytics
Learning Outcomes

Through this project, I worked with:

React component development
React Hooks
React Router
State management
CRUD operations
LocalStorage
Form handling
Authentication flow
Protected routes
Role-based UI
Responsive UI design
Tailwind CSS
Data visualization
Search functionality
Notification systems
Reusable components
JavaScript array methods
Frontend project architecture
