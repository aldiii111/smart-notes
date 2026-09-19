import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { TooltipProvider } from "./components/ui/tooltip";
import AppLayout from "./components/layout/AppLayout";
import FolderPage from "./pages/FolderPage";
import NotePage from "./pages/NotePage";
import HomePage from "./pages/HomePage";
import TagPage from "./pages/TagPage";
import CategoryPage from "./pages/CategoryPage";

function RouteApp() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/folder/:id" element={<FolderPage />} />
        <Route path="/note/:id" element={<NotePage />} />
        <Route path="/tag/:id" element={<TagPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <TooltipProvider>
        <RouteApp />
      </TooltipProvider>
    </Router>
  )
}

export default App
