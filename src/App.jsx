import { BrowserRouter, Routes, Route } from "react-router-dom"

import Sidebar from "./components/layout/Sidebar"
import Header from "./components/layout/Header"
import Dashboard from "./pages/Dashboard"
import Campaigns from "./pages/Campaigns"

export default function App() {
  return (
    <BrowserRouter>

    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/campaings" element={<Campaigns />} />
          </Routes>
        </main>
      </div>
    </div>

    </BrowserRouter>
  )
}