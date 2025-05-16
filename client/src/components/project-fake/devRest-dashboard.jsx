import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, Filter, Search } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const statuses = [
  "Blocked",
  "Pending",
  "In progress",
  "Scheduled for today",
  "KO",
];

const developers = [
  {
    name: "Alice",
    avatar:
      "https://www.utopix.com/fr/blog/wp-content/uploads/2024/04/Y2E4OTI3NzQtNmUyOC00YmU2LWE5ZjctODcxY2RlMzg2ZDIy_26dfc43e-31dd-463f-ad04-56f39a430691_profilhomme1-scaled.jpg",
    tasks: {
      Blocked: 1,
      Pending: 2,
      "In progress": 4,
      "Scheduled for today": 1,
      KO: 0,
    },
  },
  {
    name: "Bob",
    avatar:
      "https://media.istockphoto.com/id/1437816897/fr/photo/portrait-de-femme-daffaires-de-gestionnaire-ou-de-ressources-humaines-pour-la-r%C3%A9ussite.jpg?s=612x612&w=0&k=20&c=cmwpzRKoMCRYrHCgy8oqo_LnJl7Afg6vOJrCqwAXz9c=",
    tasks: {
      Blocked: 0,
      Pending: 1,
      "In progress": 3,
      "Scheduled for today": 2,
      KO: 1,
    },
  },
  {
    name: "Janne",
    avatar:
      "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsfGVufDB8fDB8fHww",
    tasks: {
      Blocked: 0,
      Pending: 1,
      "In progress": 3,
      "Scheduled for today": 2,
      KO: 1,
    },
  },
  {
    name: "Jack",
    avatar:
      "https://www.shutterstock.com/image-photo/confident-middle-aged-business-man-600nw-2516789501.jpg",
    tasks: {
      Blocked: 0,
      Pending: 5,
      "In progress": 6,
      "Scheduled for today": 2,
      KO: 3,
    },
  },
];

export function DevReastDashboard() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const filteredDevelopers = developers.filter((dev) =>
    dev.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="bg-white border border-gray-300 shadow-xl rounded-2xl">
      <CardContent className="overflow-x-auto p-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-left px-4 py-2 text-gray-700">
            Tasks by Developer
          </h2>
          <div className="flex gap-3 items-center">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search for a developer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-black border-slate-600 placeholder:text-slate-400 w-full"
              />
            </div>
            {/*<Button
              variant="outline"
              className="border-slate-600 text-black hover:bg-slate-700"
              onClick={() => setFilter("")}
            >
              <Filter className="mr-2 h-4 w-4" />
              Reset
            </Button>*/}
          </div>
        </div>
        <Table className="min-w-full text-sm text-center">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Developer</TableHead>
              {statuses.map((status) => (
                <TableHead key={status} className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {status}
                    <ArrowDownUp className="w-4 h-4 text-gray-400" />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:nth-child(even)]:bg-slate-50 [&_tr:nth-child(odd)]:bg-white">
            {filteredDevelopers.map((dev) => (
              <TableRow
                key={dev.name}
                className="border-t border-gray-200 hover:bg-slate-100 transition duration-150"
              >
                <TableCell className="text-left">
                  <div className="flex items-center gap-3">
                    <img
                      src={dev.avatar}
                      alt={dev.name}
                      className="w-8 h-8 rounded-full object-cover border border-gray-300"
                    />
                    <span className="font-medium text-gray-800">
                      {dev.name}
                    </span>
                  </div>
                </TableCell>

                {statuses.map((status) => (
                  <TableCell key={status} className="text-center text-gray-700">
                    {dev.tasks[status] > 0 ? (
                      dev.tasks[status]
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
