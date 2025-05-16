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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListFilter, Workflow, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { privateFetch } from "../../../utils/fetch";
import { Hint } from "@/components/items/hint";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function StatusBadge({ enabled }) {
  return enabled ? (
    <Badge className="bg-green-100 text-green-700 border border-green-300">
      Enabled
    </Badge>
  ) : (
    <Badge className="bg-red-100 text-red-700 border border-red-300">
      Disabled
    </Badge>
  );
}

export function WorkflowTemplateTable() {
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await privateFetch.get("/template");
        setTemplates(res.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch templates", error);
      }
    }
    fetchTemplates();
  }, []);

  const filteredTemplates = templates
    .filter((t) => t.name?.toLowerCase().includes(search.toLowerCase()))
    .filter((t) => {
      if (selectedStatus.length === 0) return true;
      return selectedStatus.includes(t.isEnabled ? "Enabled" : "Disabled");
    });

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const paginated = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function toggleStatusFilter(status) {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  }

  return (
    <Card className="py-4 h-full border shadow-sm rounded-2xl bg-white dark:bg-black text-neutral-700 dark:text-white">
      <CardHeader className="flex items-center justify-between p-6 border-b">
        <div>
          <CardTitle className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white text-center">
            Workflows
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Manage your project's workflows and transitions.
          </p>
        </div>
        <Link to="/create-workflow">
          <Button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-6 py-2">
            <Plus className="w-4 h-4 mr-2" />
            Add Workflow
          </Button>
        </Link>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
          <Input
            className="w-64"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <DropdownMenu>
            <Hint description="Filter by status">
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2 items-center">
                  <ListFilter className="w-4 h-4" />
                  Filter Status
                </Button>
              </DropdownMenuTrigger>
            </Hint>
            <DropdownMenuContent>
              {["Enabled", "Disabled"].map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={selectedStatus.includes(status)}
                  onCheckedChange={() => toggleStatusFilter(status)}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((template) => (
                <TableRow
                  key={template._id}
                  className="hover:bg-muted transition"
                >
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{template.createdBy}</TableCell>
                  <TableCell>
                    {new Date(template.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge enabled={template.isEnabled} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="pt-6">
          <Pagination className="text-neutral-800 dark:text-neutral-200">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-disabled={currentPage === 1}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, idx) => (
                <PaginationItem key={idx}>
                  <PaginationLink
                    isActive={currentPage === idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  aria-disabled={currentPage === totalPages}
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

/*
"use client";

import { Button } from "@/components/ui/button";
import { Plus, ListFilter, MoreVertical } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { useState } from "react";

const mockWorkflows = [
  {
    id: 1,
    name: "Bug Fix Flow",
    statusCount: 5,
    createdBy: "Toby Belhome",
    roles: ["Developer", "Tester"],
    updatedAt: "2025-05-12",
  },
  {
    id: 2,
    name: "Feature Flow",
    statusCount: 7,
    createdBy: "Maria Clara",
    roles: ["Admin", "PO"],
    updatedAt: "2025-04-22",
  },
  // ...
];

const pageSize = 10;

export default function WorkflowList() {
  const [page, setPage] = useState(1);

  const pageCount = Math.ceil(mockWorkflows.length / pageSize);
  const paginated = mockWorkflows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Card className="h-full border shadow-sm rounded-2xl bg-white dark:bg-black text-neutral-700 dark:text-white">
      <CardHeader className="flex items-center justify-between p-6 border-b">
        <div>
          <CardTitle className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Workflows
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">Manage your project's workflows and transitions.</p>
        </div>
        <Button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-6 py-2">
          <Plus className="w-4 h-4 mr-2" />
          Add Workflow
        </Button>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
              <TableHead className="py-3 px-6 min-w-[220px]">Workflow</TableHead>
              <TableHead className="py-3 px-6">Statuses</TableHead>
              <TableHead className="py-3 px-6">Roles</TableHead>
              <TableHead className="py-3 px-6">Created By</TableHead>
              <TableHead className="py-3 px-6">Updated</TableHead>
              <TableHead className="py-3 px-6 text-right" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginated.map((workflow) => (
              <TableRow key={workflow.id} className="hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors group">
                <TableCell className="px-6 py-4 font-medium">{workflow.name}</TableCell>
                <TableCell className="px-6 py-4">{workflow.statusCount}</TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {workflow.roles.map((role, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs font-semibold rounded-full px-3 py-1">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">{workflow.createdBy}</TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-500">{workflow.updatedAt}</TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => alert("Edit")}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => alert("Delete")}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between px-6 py-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} />
              </PaginationItem>
              <PaginationItem>
                Page {page} of {pageCount}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext onClick={() => setPage((p) => Math.min(pageCount, p + 1))} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}*/
