"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChevronsDown, ListFilter, MoreVertical, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const statuses = [
  { status: "Waiting for Development", isScalable: false, special: NaN },
  { status: "Pending", isScalable: false, special: "Initial" },
  { status: "Waiting for Testing", isScalable: false, special: NaN },
  { status: "In Testing", isScalable: true, special: NaN },
  { status: "In Development", isScalable: true, special: NaN },
  { status: "Waiting for Build", isScalable: false, special: NaN },
  { status: "Completed", isScalable: false, special: "Final" },
];

const initialStatus = statuses.find((s) => s.special === "Initial");
if (!initialStatus) {
  throw new Error(
    'Aucun statut avec special === "Initial" trouvé dans statuses.'
  );
}

const initialTasks = [
  ...Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    title: `Task #${i + 1}`,
    demandType: "New Request",
    priority: i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low",
    creationDate: new Date(),
    dueDate: new Date(),
    status: initialStatus?.status ?? "Unknown",
    isAssigned: Math.random() > 0.5,
  })),
];

const demandTypes = [
  "Client Feedback",
  "Internal Test",
  "Development",
  "New Request",
];

const demandTypeColors = {
  "Client Feedback": "bg-green-100 text-green-700",
  "Internal Test": "bg-blue-100 text-blue-700",
  Development: "bg-yellow-100 text-yellow-700",
  "New Request": "bg-purple-100 text-purple-700",
  default: "bg-gray-100 text-gray-700",
};

const priorityColors = {
  High: "bg-red-300",
  Medium: "bg-yellow-300",
  Low: "bg-indigo-300",
};

const taskStatuses = statuses.map((s) => s.status);

export default function BacklogTable() {
  const [tasks, setTasks] = useState(initialTasks);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(tasks.length / pageSize);
  const taskStatusColors = statuses.reduce((acc, { status, isScalable }) => {
    acc[status] = isScalable
      ? "bg-indigo-300 text-indigo-900"
      : "bg-gray-300 text-gray-900";
    return acc;
  }, {});

  const currentTasks = tasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleStatusChange = (id, newStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <Card className="h-full border shadow-sm rounded-2xl bg-white dark:bg-black text-neutral-700 dark:text-white">
      <CardHeader className="flex items-center justify-between p-6 border-b">
        <div>
          <CardTitle className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white text-center">
            Backlog
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">All tasks to be handled.</p>
        </div>
        <Button
          variant="default"
          size="sm"
          className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-6 py-2 mb-6"
        >
          <Plus className="w-5 h-5" />
          New Task
        </Button>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        <Table className="w-full text-sm dark:bg-gray-900">
          <TableHeader>
            <TableRow>
              {[
                "#N°",
                "Created on",
                "Demand Type",
                "Title",
                "Priority",
                "Category",
                "Assigned to",
                "Status",
              ].map((label, index) => (
                <TableHead
                  key={index}
                  className="px-6 py-3 font-semibold min-w-[130px]"
                >
                  <div className="flex items-center gap-2">
                    <ListFilter className="w-4 h-4 text-gray-500" />
                    {label}
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-10 px-6 py-3 font-semibold" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentTasks.map((task) => (
              <TableRow
                key={task.id}
                className={`transition-colors group hover:bg-gray-50 dark:hover:bg-gray-950 ${
                  task.isAssigned
                    ? "opacity-50 pointer-events-none cursor-not-allowed"
                    : ""
                }`}
              >
                <TableCell className="px-6 py-2 font-medium text-gray-900 dark:text-gray-100">
                  #{task.id}
                </TableCell>

                <TableCell className="px-6 py-2 text-gray-500">
                  {formatDate(task.creationDate)}
                </TableCell>

                <TableCell className="px-6 py-2">
                  <Select
                    value={task.demandType}
                    onValueChange={(value) => {
                      setTasks((prev) =>
                        prev.map((t) =>
                          t.id === task.id ? { ...t, demandType: value } : t
                        )
                      );
                    }}
                  >
                    <SelectTrigger
                      className={`text-xs rounded-full px-3 py-1 font-medium w-full text-gray-900 [&>svg]:hidden ${
                        demandTypeColors[task.demandType] ||
                        demandTypeColors.default
                      }`}
                    >
                      <div className="flex items-center justify-between w-full gap-2">
                        <div className="flex items-center gap-2 truncate">
                          {task.demandType}
                        </div>
                        <ChevronsDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {demandTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell className="px-6 py-2">{task.title}</TableCell>

                <TableCell className="px-6 py-2">
                  <Select
                    value={task.priority}
                    onValueChange={(value) =>
                      setTasks((prev) =>
                        prev.map((t) =>
                          t.id === task.id ? { ...t, priority: value } : t
                        )
                      )
                    }
                  >
                    <SelectTrigger
                      className={`text-xs rounded-full px-3 py-1 font-medium w-full [&>svg]:hidden text-gray-900 bg-white`}
                    >
                      <div className="flex items-center justify-between w-full gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              priorityColors[task.priority]?.split(" ")[0] ||
                              "bg-gray-300"
                            }`}
                          />
                          {task.priority}
                        </div>
                        <ChevronsDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {["High", "Medium", "Low"].map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                priorityColors[priority]?.split(" ")[0]
                              }`}
                            />
                            {priority}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell className="px-6 py-2 text-gray-500">
                  Feature
                </TableCell>

                <TableCell className="px-6 py-2 text-gray-500">
                  Unassigned
                </TableCell>

                <TableCell className="px-6 py-2">
                  <Select
                    value={task.status}
                    onValueChange={(value) =>
                      handleStatusChange(task.id, value)
                    }
                  >
                    <SelectTrigger
                      className={`text-xs rounded-full px-3 py-1 font-medium w-full [&>svg]:hidden text-gray-900 ${
                        taskStatusColors[task.status] ||
                        "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full gap-2">
                        <div className="flex items-center gap-2 truncate">
                          {task.status || "Définir"}
                        </div>
                        <ChevronsDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {taskStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell className="px-6 py-2 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* ➤ PAGINATION */}
        <div className="flex justify-center items-center p-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              <PaginationItem className="px-4 text-sm">
                Page {currentPage} of {totalPages}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}
