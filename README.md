# FinFolio - Stock Portfolio Tracker

A modern, full-stack portfolio tracking application built with React, TypeScript, and Supabase.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

## ✨ Features

- 📊 **Real-time Portfolio Tracking**
- 👀 **Stock Watchlist**
- 📈 **Analytics & Performance Charts**
- 🔔 **Price Alerts**
- 🌙 **Dark/Light Mode**
- 💱 **Multi-currency Support**
- 📱 **Responsive Design**

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL)
- **APIs:** Alpha Vantage (Stock data)
- **Icons:** Lucide React
- **Build Tool:** Vite

## 🎯 Demo Mode

The app works perfectly in demo mode without any configuration. It uses:
- Mock stock data
- Local storage for persistence
- Sample portfolio data

## 🔧 Production Setup (Optional)

For full functionality with real data:

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Run the migration in `supabase/migrations/`

2. **Get Alpha Vantage API Key:**
   - Sign up at [alphavantage.co](https://www.alphavantage.co/support/#api-key)

3. **Environment Variables:**
   ```bash
   cp .env.example .env
   # Add your keys to .env
   ```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Customization

The app is fully customizable with:
- Theme colors in `tailwind.config.js`
- Currency settings in Settings page
- Mock data in `src/services/stockApi.ts`

## 📄 License

MIT License - feel free to use for personal or commercial projects!