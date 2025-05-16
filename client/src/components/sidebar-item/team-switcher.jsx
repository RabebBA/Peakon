import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function TeamSwitcher({ teams }) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);
  const navigate = useNavigate(); // Initialize the navigate function

  const handleTeamClick = (team) => {
    setActiveTeam(team);
    // Navigate to the team's specific URL
    if (team.link) {
      navigate(team.link); // Make sure each team has a 'link' property
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/*<DropdownMenu>
          <DropdownMenuTrigger asChild>*/}
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <img src="/white-logo.png" className="size-5 shrink-0 " />
          </div>
          <div className="grid flex-1 text-left text-base leading-tight">
            <span className="truncate font-semibold">{activeTeam.name}</span>
          </div>
        </SidebarMenuButton>
        {/*</DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel>
            {teams?.map((team, index) => (
              <DropdownMenuItem
                key={team?.name}
                onClick={() => handleTeamClick(team)} // Handle the click to navigate
                className="gap-2 p-2"
              >
                {typeof team.logo === "string" ? (
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <img
                      src={team.logo}
                      alt={`${team.name} logo`}
                      className="size-4 shrink-0"
                    />
                  </div>
                ) : (
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <team.logo className="size-4 shrink-0" />
                  </div>
                )}
                {team?.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>*/}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
