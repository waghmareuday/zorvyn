Luminous Ledger ✦ FinTech Dashboard
Welcome to Luminous Ledger. For this frontend assignment, I wanted to go beyond building a standard budget tracker. My goal was to design and develop a premium, interactive "Digital Vault"—an interface that feels like a production-ready FinTech application, drawing inspiration from the clean, dark-mode aesthetics of platforms like Stripe and modern Indian FinTech unicorns.

My Approach & Architecture
Rather than just hitting the functional requirements, I focused heavily on the user experience, technical polish, and architectural scalability. Here is a look at my thought process behind the build:

Design & UI/UX: I aimed for a "Dark Mode First" environment (#020617 slate). To make the data feel alive, I incorporated subtle glassmorphism, careful typographic hierarchy (using Manrope and Inter), and smooth Framer Motion micro-interactions.

State Management: I chose Zustand for global state. It provides a leaner, boilerplate-free alternative to Redux while perfectly handling the complexity of this dashboard. I paired it with persist middleware so all user data (transactions, filters, and active roles) survives page reloads.

Technical Note: To prevent Next.js SSR/CSR mismatch errors when reading from local storage, I built a custom HydrationGuard to ensure seamless mounting.

Data Visualization: Out-of-the-box charts often look disconnected from custom UIs. I heavily customized Recharts to blend perfectly into the dark theme by removing native borders, adjusting SVG strokes, and building custom glowing tooltips that react to hover states.

Advanced Filtering: Instead of basic singular filters, I built a real-time cross-filtering engine. Users can search by query, filter by transaction type, and sort by category all at the same time without the UI lagging.

Core Features
Dashboard Overview (/): A high-level view featuring dynamic summary cards, an interactive balance trajectory (Area Chart), and a Spending Donut Chart with custom hover physics.

Transactions Ledger (/transactions): A fully functional CRUD data table.

Role-Based Access Control (RBAC): You can use the toggle in the top navigation to switch between Admin and Viewer modes. Viewers get a clean, read-only experience. Switch to Admin, and the UI seamlessly unlocks the ability to add, edit, or delete transactions.

Export to CSV: A handy utility that allows users to instantly download their currently filtered view as a local .csv file.

Insights Engine (/insights): An automated analysis section that calculates daily burn rates, retention percentages, and isolates "Outflow Anomalies" (highlighting the top 5 highest expenses).

Fully Responsive: The layout is fluid. Tables transform into readable cards and padding condenses safely on mobile screens, ensuring no text collapses or overlaps.

Tech Stack
Framework: Next.js 14 (App Router)

Styling: Tailwind CSS v4

State Management: Zustand

Animations: Framer Motion

Data Viz: Recharts

Icons: Lucide React

🛠 Setup & Local Development
Want to spin this up locally? It just takes a few seconds:

Clone or download the repository.

Install the dependencies:

npm install
Boot up the development server:

npm run dev
Open http://localhost:3000 in your browser.

Note on Data: All mock data initialized in the application is based on Indian contexts (INR ₹, local merchants) to demonstrate localization. If you log in as an Admin, everything is immediately mutable, so feel free to add your own data!