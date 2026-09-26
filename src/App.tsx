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

        <Route path="/folders" element={<FolderPage />} />
        <Route path="/notes/:id" element={<NotePage />} />
        <Route path="/tags" element={<TagPage />} />
        <Route path="/categories" element={<CategoryPage />} />

        <Route path="/folders/:id" element={<FolderPage />} />
        <Route path="/tags/:id" element={<TagPage />} />
        <Route path="/categories/:id" element={<CategoryPage />} />
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
