import { AppSidebar } from "@/components/sidebar-item/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "./nav-app";
import { ThemeProvider } from "@/components/context/theme.context";

export default function Sidebar({ children }) {
  return (
    <ThemeProvider>
      <div className="text-white flex min-h-svh w-full items-center justify-center bg-transparent p-6 md:p-0">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header>
              <Navbar />
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </ThemeProvider>
  );
}
