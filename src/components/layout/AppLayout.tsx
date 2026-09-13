import Sidebar from "./Sidebar"
import Header from "./Header"
import { Outlet } from "react-router"

export default function AppLayout() {
return (
  <div className="flex">
    <Sidebar />
    <div className="flex flex-col w-full">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  </div>
)
}