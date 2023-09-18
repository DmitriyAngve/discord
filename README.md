# Discord Clone

Welcome to the Discord Clone project! This project is built with Next.js 13, React, Clerk, Socket.io, Prisma, TailwindCSS, ShadcnUI, MySQL, UploadThing, and LiveKit. Here's an overview of the technologies used and key features of the project:

## Technologies Used
- **Next.js 13**: The foundation of the project, providing server-side rendering and routing.
- **React**: Used for building the user interface and managing the state of the application.
- **Clerk**: Provides authentication and user management.
- **Prisma**: An Object-Relational Mapping (ORM) tool used for database operations.
- **TailwindCSS**: A utility-first CSS framework for building custom designs quickly.
- **ShadcnUI**: A UI component library for enhancing the visual appearance of the application.
- **MySQL**: A relational database system used for storing data.
- **UploadThing**: Used for sending attachments as messages.
- **Socket.io**: Enables real-time messaging, updates, and chat functionality in the application.
- **LiveKit**: Enables the creation of text, audio, and video call channels, as well as 1:1 conversations and video calls.

[Live Demo](https://discord-production-b40f.up.railway.app/)

## Features
- Real-time Messaging: Utilizing Socket.io for real-time messaging functionality.
- Attachments: Send attachments as messages using UploadThing.
- Message Editing and Deletion: Edit and delete messages in real-time for all users.
- Channels: Create text, audio, and video call channels.
- 1:1 Conversations: Members can engage in 1:1 conversations.
- Video Calls: Members can have 1:1 video calls.
- Member Management: Ability to kick members and change roles (Guest, Moderator).
- Invite System: Implement a unique invite link generation and a fully working invite system.
- Infinite Loading: Messages are loaded in batches of 10, using @tanstack/query.
- Server Customization: Allow server creation and customization.
- Beautiful UI: Designed with TailwindCSS and ShadcnUI for a visually appealing interface.
- Responsiveness: The project is fully responsive with a mobile-friendly UI.
- Light/Dark Mode: Toggle between light and dark modes for user preference.
- Websocket Fallback: If websockets are not supported, the system gracefully falls back to polling with alerts.
- ORM: Prisma is used for convenient database operations.
- MySQL Database: Data is stored in a MySQL database using Planetscale.
- Authentication: Implement authentication and user management with Clerk.

## Installation and Usage

To get started with this project, follow these steps:
### 1. Clone this repository to your local machine
```bash
git clone https://github.com/DmitriyAngve/discord
```

### 2. Install the required dependencies using

 ```bash
 npm install
 ```

### 3. Setup .env file

```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
OPENAI_API_KEY=
REPLICATE_API_TOKEN=
DATABASE_URL=
STRIPE_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_WEBHOOK_SECRET=
```
### 4. Setup Prisma
Add MySQL Database

```shell
npx prisma db push
```

### 5. Run the development server using
```bash
npm run dev
```
### 6. Open your browser and navigate to
```bash
http://localhost:3000
```
to access the application.
