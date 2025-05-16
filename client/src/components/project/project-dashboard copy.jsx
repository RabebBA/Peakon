"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronsDown, LayoutDashboard, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const initialTasks = [
  {
    id: 1,
    title: "Follow up with Acme Inc.",
    desc: "Send proposal and schedule meeting",
    priority: "High",
    due: "Due Today",
    badgeColor: "border-red-300 text-red-600 ",
    checked: false,
    demandType: "Urgence",
  },
  {
    id: 2,
    title: "Prepare quarterly report",
    desc: "Compile sales data and forecasts",
    priority: "Medium",
    due: "Due Tomorrow",
    badgeColor: "border-yellow-300 text-yellow-600 ",
    checked: false,
    demandType: "Développement",
  },
  {
    id: 3,
    title: "Update customer profiles",
    desc: "Verify contact information and preferences",
    priority: "Low",
    due: "Due Oct 15",
    badgeColor: "border-green-300 text-green-600 ",
    checked: true,
    demandType: "Retour client",
  },
];

const teamMembers = [
  {
    name: "Toby Belhome",
    email: "contact@bundui.io",
    role: "Viewer",
    avatar: "https://i.pravatar.cc/100?img=1",
    currentTask: "Task #123",
  },
  {
    name: "Jackson Lee",
    email: "pre@example.com",
    role: "Developer",
    avatar: "https://i.pravatar.cc/100?img=2",
    engagedInProject: true, // Ajouté explicitement
  },
  {
    name: "Joen Doe",
    email: "contact@bundui.io",
    role: "Viewer",
    avatar: "https://i.pravatar.cc/100?img=4",
    currentTask: "Task #1288",
  },
  {
    name: "Maria Clara",
    email: "contact@bundui.io",
    role: "Viewer",
    avatar: "https://i.pravatar.cc/100?img=5",
    currentTask: "Task #3333",
  },
  {
    name: "Hally Gray",
    email: "hally@site.com",
    role: "Viewer",
    avatar: "https://i.pravatar.cc/100?img=3",
    isFree: true, // Ajouté explicitement
  },
];

const demandTypeColors = {
  Urgence: "bg-red-100 text-red-700",
  Développement: "bg-yellow-100 text-yellow-700",
  "Retour client": "bg-green-100 text-green-700",
  default: "bg-gray-100 text-gray-700",
};

const taskStatuses = [
  "Waiting for Development",
  "Pending",
  "Waiting for Testing",
  "In Testing",
  "In Development",
  "Waiting for Build",
  "Completed",
];

const taskStatusColors = {
  "Waiting for Development": "bg-gray-300 text-gray-700",
  Pending: "bg-orange-300 text-orange-700",
  "Waiting for Testing": "bg-yellow-300 text-yellow-700",
  "In Testing": "bg-blue-300 text-blue-700",
  "In Development": "bg-purple-300 text-purple-700",
  "Waiting for Build": "bg-indigo-300 text-indigo-700",
  Completed: "bg-green-300 text-green-700",
};

export default function Dashboard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [members, setMembers] = useState(teamMembers);

  const handleStatusChange = (id, newStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const toggleCheck = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, checked: !task.checked } : task
      )
    );
  };

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-black text-neutral-800 dark:text-neutral-200">
      <div className="flex items-center gap-3 mb-4">
        <LayoutDashboard className="w-6 h-6" />
        <h1 className="text-2xl font-semibold">Project Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* Team Members */}
        <div className="col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">
                  Team Members
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Invite your team members to collaborate.
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <PlusCircle className="w-4 h-4" />
                Add Member
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 p-3 border rounded-lg bg-white dark:bg-gray-900 hover:shadow transition"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-right">
                    {member.currentTask ? (
                      <Badge
                        variant="outline"
                        className="text-blue-600 border-blue-300"
                      >
                        In progress : {member.currentTask}
                      </Badge>
                    ) : member.engagedInProject ? (
                      <Badge
                        variant="outline"
                        className="text-yellow-600 border-yellow-300"
                      >
                        Engaged in another project
                      </Badge>
                    ) : member.isFree ? (
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-300"
                      >
                        Available
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-gray-500 border-gray-300"
                      >
                        Status invalid
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Tasks */}
        <div className="col-span-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">Tasks</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Track and manage your upcoming tasks.
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                <PlusCircle className="w-4 h-4" />
                Add Task
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="relative flex gap-4 items-start border rounded-lg p-4 bg-white dark:bg-gray-900 hover:shadow-md transition"
                >
                  <div
                    className={`absolute -top-2 left-4 text-[11px] font-medium uppercase px-2 py-0.5 rounded shadow-sm ${
                      demandTypeColors[task.demandType] ||
                      demandTypeColors.default
                    }`}
                  >
                    {task.demandType}
                  </div>

                  <div className="flex flex-1 items-start gap-4 pt-3">
                    <Checkbox
                      checked={task.checked}
                      onCheckedChange={() => toggleCheck(task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h4
                        className={`font-semibold text-sm mb-1 ${
                          task.checked
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {task.title}
                      </h4>
                      <p
                        className={`text-sm mb-2 ${
                          task.checked
                            ? "line-through text-muted-foreground"
                            : "text-gray-500"
                        }`}
                      >
                        {task.desc}
                      </p>
                      <div className="flex items-center gap-3 text-xs flex-wrap">
                        <Badge
                          variant="outline"
                          className={`rounded-full px-2.5 py-0.5 font-medium text-[11px] ${task.badgeColor}`}
                        >
                          {task.priority}
                        </Badge>
                        <span className="text-muted-foreground">
                          {task.due}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm flex-wrap">
                      {/* Sélecteur de statut */}
                      <Select
                        value={task.status}
                        onValueChange={(newStatus) =>
                          handleStatusChange(task.id, newStatus)
                        }
                      >
                        <SelectTrigger className="w-[160px] h-8 px-3 py-1 text-sm font-medium border rounded-md shadow-sm hover:border-muted-foreground transition-colors [&>svg]:hidden">
                          <div className="flex items-center justify-between w-full gap-2">
                            <div className="flex items-center gap-2 truncate">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  taskStatusColors[task.status]?.split(
                                    " "
                                  )[0] || "bg-gray-300"
                                }`}
                              />
                              <span className="truncate">
                                {task.status || "Set Status"}
                              </span>
                            </div>
                            <ChevronsDown className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </SelectTrigger>

                        <SelectContent>
                          {taskStatuses.map((status) => (
                            <SelectItem
                              key={status}
                              value={status}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  taskStatusColors[status]?.split(" ")[0] ||
                                  "bg-gray-300"
                                }`}
                              />
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
