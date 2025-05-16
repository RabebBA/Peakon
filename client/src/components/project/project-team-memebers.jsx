"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  MoreVertical,
  CheckCircle,
  Clock,
  UserCheck,
  ListFilter,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserProfile from "@/components/users/edit-user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const teamMembers = [
  {
    id: 1,
    name: "Toby Belhome",
    email: "contact@bundui.io",
    role: ["Developer"],
    jobTitle: "Frontend Developer",
    taskCount: 3,
    avatar: "https://i.pravatar.cc/100?img=1",
    currentTask: "Task #123",
  },
  {
    id: 2,
    name: "Jackson Lee",
    email: "pre@example.com",
    role: ["Developer", "Reviewer"],
    jobTitle: "Tester QA",
    taskCount: 5,
    avatar: "https://i.pravatar.cc/100?img=2",
    engagedInProject: true,
  },
  {
    id: 3,
    name: "Joen Doe",
    email: "contact@bundui.io",
    role: ["Project Owner", "Tester"],
    jobTitle: "Project Owner",
    taskCount: 2,
    avatar: "https://i.pravatar.cc/100?img=4",
    currentTask: "Task #1288",
  },
  {
    id: 4,
    name: "Maria Clara",
    email: "contact@bundui.io",
    role: ["Maintainer"],
    jobTitle: "App Developer",
    taskCount: 4,
    avatar: "https://i.pravatar.cc/100?img=5",
    currentTask: "Task #3333",
  },
  {
    id: 5,
    name: "Hally Gray",
    email: "hally@site.com",
    role: [],
    jobTitle: "Frontend Developer",
    taskCount: 3,
    avatar: "https://i.pravatar.cc/100?img=3",
    isFree: true,
  },
  {
    id: 16,
    name: "Toby Belhome",
    email: "contact@bundui.io",
    role: ["Developer"],
    jobTitle: "Frontend Developer",
    taskCount: 3,
    avatar: "https://i.pravatar.cc/100?img=1",
    currentTask: "Task #123",
  },
  {
    id: 6,
    name: "Jackson Lee",
    email: "pre@example.com",
    jobTitle: "Frontend Developer",
    taskCount: 3,
    role: ["Developer", "Reviewer"],
    avatar: "https://i.pravatar.cc/100?img=2",
    engagedInProject: true,
  },
  {
    id: 7,
    name: "Joen Doe",
    email: "contact@bundui.io",
    jobTitle: "Frontend Developer",
    taskCount: 3,
    role: ["Project Owner", "Tester"],
    avatar: "https://i.pravatar.cc/100?img=4",
    currentTask: "Task #1288",
  },
  {
    id: 8,
    name: "Maria Clara",
    email: "contact@bundui.io",
    role: ["Maintainer"],
    jobTitle: "Frontend Developer",
    taskCount: 3,
    avatar: "https://i.pravatar.cc/100?img=5",
    currentTask: "Task #3333",
  },
  {
    id: 9,
    name: "Hally Gray",
    email: "hally@site.com",
    role: [],
    jobTitle: "Frontend Developer",
    taskCount: 3,
    avatar: "https://i.pravatar.cc/100?img=3",
    isFree: true,
  },
  {
    id: 11,
    name: "Toby Belhome",
    email: "contact@bundui.io",
    role: ["Developer"],
    jobTitle: "Frontend Developer",
    taskCount: 0,
    avatar: "https://i.pravatar.cc/100?img=1",
    currentTask: "Task #123",
  },
  {
    id: 12,
    name: "Jackson Lee",
    email: "pre@example.com",
    role: ["Developer", "Reviewer"],
    jobTitle: "Frontend Developer",
    taskCount: 3,
    avatar: "https://i.pravatar.cc/100?img=2",
    engagedInProject: true,
  },
  {
    id: 13,
    name: "Joen Doe",
    email: "contact@bundui.io",
    role: ["Project Owner", "Tester"],
    avatar: "https://i.pravatar.cc/100?img=4",
    currentTask: "Task #1288",
  },
  {
    id: 14,
    name: "Maria Clara",
    email: "contact@bundui.io",
    role: ["Maintainer"],
    avatar: "https://i.pravatar.cc/100?img=5",
    currentTask: "Task #3333",
  },
  {
    id: 15,
    name: "Hally Gray",
    email: "hally@site.com",
    role: [],
    avatar: "https://i.pravatar.cc/100?img=3",
    isFree: true,
  },
  // Ajoute plus de membres ici pour tester la pagination
];

const pageSize = 10;

export default function TeamMembers() {
  const [members] = useState(teamMembers);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [isEditOpen, setEditOpen] = useState(false);
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(members.length / pageSize);
  const paginatedMembers = members.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleEditClick = (userId) => {
    setSelectedUserId(userId);
    setEditOpen(true);
  };

  return (
    <Card className="h-full border shadow-sm rounded-2xl bg-white dark:bg-black text-neutral-700 dark:text-white">
      <CardHeader className="flex items-center justify-between p-6 border-b">
        <div>
          <CardTitle className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Team Members
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Invite collaborators to your project.
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-6 py-2 mb-6"
        >
          <Plus className="w-5 h-5" />
          Add Member
        </Button>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        <Table className="w-full text-sm dark:bg-gray-900">
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
              <TableHead className="min-w-[250px] py-3 px-6">Member</TableHead>
              <TableHead className="min-w-[120px] py-3 px-6">
                <div className="flex items-center gap-2">
                  <ListFilter className="w-4 h-4 text-gray-500" />
                  Fonction
                </div>
              </TableHead>
              <TableHead className="min-w-[180px] py-3 px-6">
                <div className="flex items-center gap-2">
                  <ListFilter className="w-4 h-4 text-gray-500" />
                  Roles
                </div>
              </TableHead>
              <TableHead className="min-w-[140px] py-3 px-6">
                <div className="flex items-center gap-2">
                  <ListFilter className="w-4 h-4 text-gray-500" />
                  Tasks
                </div>
              </TableHead>
              <TableHead className="min-w-[220px] py-3 px-6">
                <div className="flex items-center gap-2">
                  <ListFilter className="w-4 h-4 text-gray-500" />
                  Status
                </div>
              </TableHead>
              <TableHead className="py-3 px-6" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedMembers.map((member) => (
              <TableRow
                key={member.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors group"
              >
                <TableCell className="flex items-center gap-4 py-2 px-6 min-w-[250px]">
                  <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="leading-tight">
                    <p className="font-medium text-base text-gray-900 dark:text-white">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </TableCell>
                <TableCell className="py-2">
                  {member.jobTitle ?? "N/A"}
                </TableCell>

                <TableCell className="py-2 min-w-[180px]">
                  <div className="flex flex-wrap gap-2">
                    {member.role.length ? (
                      member.role.map((r, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="text-xs font-semibold rounded-full px-3 py-1"
                        >
                          {r}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs italic text-gray-400">
                        No roles
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-2">{member.taskCount ?? 0}</TableCell>

                <TableCell className="py-2 min-w-[220px]">
                  {member.currentTask ? (
                    <Badge
                      variant="outline"
                      className="gap-2 text-blue-700 border-blue-400 bg-blue-100 text-xs rounded-full px-3 py-1"
                    >
                      In progress: {member.currentTask}
                    </Badge>
                  ) : member.engagedInProject ? (
                    <Badge
                      variant="outline"
                      className="gap-2 text-yellow-700 border-yellow-400 bg-yellow-100 text-xs rounded-full px-3 py-1"
                    >
                      Engaged elsewhere
                    </Badge>
                  ) : member.isFree ? (
                    <Badge
                      variant="outline"
                      className="gap-2 text-green-700 border-green-400 bg-green-100 text-xs rounded-full px-3 py-1"
                    >
                      Available
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-gray-600 border-gray-300 dark:text-gray-400 dark:border-gray-700 text-xs rounded-full px-3 py-1"
                    >
                      Status unknown
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="px-6 py-2 w-20 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditClick(member.id)}
                      >
                        Edit User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex justify-center py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="text-sm text-gray-600 dark:text-gray-400 px-2">
                  Page {page} of {pageCount}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  className={
                    page === pageCount ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>

      {/* Dialog Edit User */}
      <UserProfile
        open={isEditOpen}
        onClose={() => setEditOpen(false)}
        userId={selectedUserId}
      />
    </Card>
  );
}
