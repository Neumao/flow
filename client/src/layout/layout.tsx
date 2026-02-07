import { AppSidebar } from "@/components/app-sidebar"
import { useState, useEffect } from "react"

import { Separator } from "@/components/ui/separator"
// ...existing code...
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Routes,
  Route,
} from "react-router-dom"
import DashboardPage from "@/pages/dashboard/index"
import ProfilePage from "@/pages/profile/ProfilePage"
import NotFoundPage from "@/pages/errors/404"
import InternalServerErrorPage from "@/pages/errors/500"
import ForbiddenPage from "@/pages/errors/403"
import UnauthorizedPage from "@/pages/errors/401"
import MaintenancePage from "@/pages/errors/503"
// ...existing code...

export default function Page() {
  const [activeTeam, setActiveTeam] = useState(() => {
    const saved = localStorage.getItem("activeTeam");
    return saved ? JSON.parse(saved) : { name: "Point Of Sale" };
  });

  useEffect(() => {
    localStorage.setItem("activeTeam", JSON.stringify(activeTeam));
  }, [activeTeam]);

  // Navigation is handled by AppSidebar component
  // ...existing code...

  return (
    <SidebarProvider>
      <AppSidebar activeTeam={activeTeam} onTeamChange={setActiveTeam} />
      <SidebarInset className="p-0 m-0  overflow-x-hidden">
        <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          {/* Breadcrumbs removed */}
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            {/* Breadcrumbs removed */}
          </div>
        </header>
        <Separator />
        <Routes>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          {/* Error Pages */}
          <Route path="404" element={<NotFoundPage />} />
          <Route path="500" element={<InternalServerErrorPage />} />
          <Route path="403" element={<ForbiddenPage />} />
          <Route path="401" element={<UnauthorizedPage />} />
          <Route path="503" element={<MaintenancePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </SidebarInset>
    </SidebarProvider>
  )
}
