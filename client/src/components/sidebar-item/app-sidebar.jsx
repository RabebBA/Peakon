"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  VenetianMask,
  BookOpen,
  Bot,
  LayoutDashboard,
  Frame,
  Map,
  UsersRound,
  PieChart,
  Settings2,
  Workflow,
  History,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useTheme } from "@/components/context/theme.context";

// Composant principal pour le Sidebar avec hooks à l'intérieur
export function AppSidebar({ ...props }) {
  // État pour l'utilisateur
  const { darkMode } = useTheme();
  const [user, setUser] = useState({
    isAuthenticated: false,
    firstname: "",
    email: "",
    photo: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        // Vérification que userData est une chaîne de caractères avant d'essayer de la parser
        if (typeof userData === "string") {
          const parsedData = JSON.parse(userData); // Parsing des données
          setUser({
            isAuthenticated: true,
            ...parsedData,
          });
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  // Les données, y compris les informations utilisateur et les équipes
  const data = {
    user: {
      name: user.firstname,
      email: user.email,
      avatar: user.photo || "/avatar.png", // Avatar de l'utilisateur
    },
    teams: [
      {
        name: "Peakon",
        logo: darkMode ? "/white-logo.png" : "/black.logo.png",
        plan: "Enterprise",
        link: "/home",
      },
      {
        name: "Members",
        logo: UsersRound,
        plan: "Startup",
        link: "/users",
      },
      {
        name: "Roles",
        logo: VenetianMask,
        plan: "Startup",
        link: "/roles",
      },
      {
        name: "Workflow",
        logo: Workflow,
        plan: "Startup",
        link: "/templates",
      },
    ],
    navMain: [
      {
        title: "Dashboards",
        url: "#",
        icon: LayoutDashboard,
        items: [
          {
            title: "Project",
            url: "/projects",
          },
          {
            title: "User",
            url: "#",
          },
        ],
      },
      {
        title: "Log",
        url: "#",
        icon: History,
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "Language",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Roles",
        icon: VenetianMask,
        url: "/roles", // optionnel si un lien par défaut est requis
        items: [
          {
            title: "Global Role",
            url: "/roles/global",
          },
          {
            title: "Project Role",
            url: "/roles/project",
          },
        ],
      },
      {
        name: "Members",
        icon: UsersRound,
        url: "/users",
      },

      {
        name: "Workflow",
        url: "/workflows",
        icon: Workflow,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain teams={data.teams} items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
