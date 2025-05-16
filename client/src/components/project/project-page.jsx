"use client";

import { useState } from "react";
import { MessageCircle, Smile, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Backlog from "./project-backlog";
import TeamMembers from "./project-team-memebers";

const TabButton = ({ value, children }) => (
  <TabsTrigger
    value={value}
    className="text-base px-6 py-3 rounded-t-md data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
  >
    {children}
  </TabsTrigger>
);

const Header = ({ onToggleSidebar }) => (
  <div className="mb-6 flex items-center gap-4">
    <span className="text-gray-400 text-sm">&lt; PROJETS</span>
    <span className="text-2xl font-semibold">#558: Government Application</span>
    <div className="ml-auto flex gap-4">
      <Button
        variant="outline"
        onClick={onToggleSidebar}
        className="flex items-center gap-2"
      >
        Projet Info
      </Button>
    </div>
  </div>
);

const ProjectSidebar = () => (
  <div className="fixed right-6 top-14 w-72 bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 border z-50">
    <SidebarItem label="CRÉÉ PAR" value="Rabeb Ben Abed" />
    <SidebarItem label="CRÉÉ LE" value="3. Fev 2025" />
    <SidebarItem label="CLIENT" value="Neopolis Developpement" />
    <SidebarItem label="CHEF" value="—" valueClass="text-gray-400" />
    <SidebarItem label="CATÉGORIE" value="PFE" />
    <div className="mb-2 text-xs text-gray-500">ÉTIQUETTE</div>
    <Badge className="bg-yellow-200 text-yellow-700 mb-3">NEW</Badge>
    <SidebarItem
      label="E-MAIL DU PROJET"
      value="project-management+oj2tyy775r@neopolis-dev.com"
      valueClass="text-blue-600 break-words"
    />
    <div className="mb-2 text-xs text-gray-500">URL DU CALENDRIER</div>
    <a href="#" className="text-blue-600 text-sm underline">
      Lien d’abonnement
    </a>
    <p className="text-xs text-gray-400 mt-2">
      Copiez l’URL pour afficher les dates du projet dans une autre application
      de calendrier.
    </p>
  </div>
);

const SidebarItem = ({ label, value, valueClass = "text-sm font-medium" }) => (
  <>
    <div className="mb-2 text-xs text-gray-500">{label}</div>
    <div className={`mb-3 ${valueClass}`}>{value}</div>
  </>
);

const TeamMembersTab = () => (
  <Card className="flex flex-col items-center justify-center py-24 bg-white shadow rounded-xl">
    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-2 mb-6">
      <Plus /> Nouvelle discussion
    </Button>
    <div className="flex items-center gap-4 mb-2">
      <MessageCircle className="w-16 h-16 text-gray-400" />
      <Smile className="w-16 h-16 text-violet-600 bg-yellow-100 rounded-full p-2" />
    </div>
    <p className="text-gray-500 text-center mb-1">
      Aucune discussion active dans ce projet.
      <br />
      Peut-être n’êtes-vous qu’à une conversation de la prochaine grosse
      affaire!
    </p>
    <a href="#" className="text-violet-600 text-sm underline">
      En savoir plus sur les discussions.
    </a>
  </Card>
);

export default function ProjectPage() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="relative p-6 min-h-screen  text-neutral-800 dark:text-neutral-200">
      <Header onToggleSidebar={() => setShowSidebar((prev) => !prev)} />

      <Tabs defaultValue="backlog" className="mb-6">
        <TabsList className="flex gap-4 border-b border-gray-200 dark:border-gray-700 bg-transparent">
          <TabButton value="backlog">Backlog</TabButton>
          <TabButton value="team-members">Team Members</TabButton>
          <TabButton value="dashboard">Dashboard</TabButton>
        </TabsList>

        <TabsContent value="team-members">
          <TeamMembers />
        </TabsContent>
        <TabsContent value="backlog">
          <Backlog />
        </TabsContent>
        <TabsContent value="dashboard">
          <TeamMembersTab />
        </TabsContent>
      </Tabs>

      {showSidebar && <ProjectSidebar />}
    </div>
  );
}
