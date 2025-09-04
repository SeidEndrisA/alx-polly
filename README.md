# Alx-Polly: Modern Polling App

Alx-Polly is a sleek, modern, and feature-rich polling application designed to make creating, sharing, and analyzing polls effortless. Built with the latest web technologies, it offers a delightful user experience with real-time updates and a clean, intuitive interface.

## ✨ Features

*   **Authentication:** Secure user registration, login, and logout powered by Supabase Auth.
*   **Intuitive Poll Creation:** Easily create new polls with a question and multiple dynamic options. Supports up to 10 options per poll.
*   **Real-time Voting & Results:** Users can vote on polls, and see results update in real-time with a visually appealing bar chart.
*   **Dynamic Polls List:** Browse all available polls with search and filtering capabilities (open/closed polls).
*   **User Profile:** View all polls created by the authenticated user, with options to view or delete their polls.
*   **Shareable Polls:** Generate unique links and QR codes for easy sharing of any poll.
*   **Modern UI/UX:** A minimalist, professional design inspired by platforms like Stripe and Vercel, featuring:
    *   **Dark/Light Mode:** Seamless theme switching for personalized viewing.
    *   **Responsive Layout:** Optimized for various screen sizes (desktop, tablet, mobile).
    *   **Consistent Styling:** Utilizes `shadcn/ui` components and Tailwind CSS for a cohesive look and feel.
    *   **Subtle Animations:** Enhanced user experience with smooth transitions.

## 🚀 Technologies Used

*   **Next.js 14+:** React framework for building performant web applications (with App Router and Server Components).
*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** Strongly typed JavaScript for enhanced code quality and maintainability.
*   **Supabase:** Open-source Firebase alternative for backend services (Authentication, PostgreSQL Database, Realtime, Storage).
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **shadcn/ui:** Reusable UI components built with Radix UI and Tailwind CSS.
*   **React Hook Form:** For efficient and flexible form management with Zod for schema validation.
*   **Recharts:** A composable charting library built on React components for visualizing poll results.
*   **Framer Motion:** A production-ready motion library for React for animations.
*   **Sonner:** An opinionated toast component for React.
*   **Lucide React:** A beautiful, customizable icon library.
*   **React QR Code:** For generating QR codes.
*   **use-debounce:** A hook for debouncing values.

## 🛠️ Setup and Installation

Follow these steps to get your development environment running:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/alx-polly.git
cd alx-polly
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Supabase Project

If you don't have a Supabase project, create one at [Supabase.com](https://supabase.com/).

#### a. Environment Variables

Create a `.env.local` file in the root of your project and add your Supabase project URL and Anon Key:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

#### b. Database Schema

Run the provided SQL schemas in your Supabase SQL Editor to set up the necessary tables, RLS policies, and functions.

1.  Go to your Supabase project dashboard.
2.  In the left sidebar, click on **"SQL Editor"**.
3.  **Paste the content of `profiles_schema.sql`** (from your project root) into the editor and click "Run".
4.  **Then, paste the content of `new_schema.sql`** (from your project root) into the editor and click "Run".

### 4. Run the Development Server

```bash
npm run dev
```

The application should now be running at `http://localhost:3000`.

## 💡 Usage

*   **Register/Login:** Create an account or log in to access full features.
*   **Create Polls:** Navigate to the "Create Poll" page to design your own polls.
*   **Vote:** Select an option on any poll and submit your vote. See results update instantly.
*   **Manage Polls:** On your profile page, view and delete polls you've created.
*   **Share:** Use the share button on poll detail pages to get a link or QR code.
*   **Toggle Theme:** Use the moon/sun icon in the header to switch between dark and light modes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
