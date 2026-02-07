import * as React from "react"
import {
  CircleGauge,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar"

const nav = [
  {
    title: "Dashboard",
    url: "/layout/dashboard",
    icon: CircleGauge,
    isActive: true,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    name: "Loading...",
    email: "",
  });

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          name: parsedUser.name || parsedUser.firstName + " " + parsedUser.lastName || "User",
          email: parsedUser.email,
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={nav} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between gap-2 px-2 py-2">
          <div className="flex-1">
            <NavUser user={user} />
          </div>
          <ThemeToggle />
        </div>
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  )
}
