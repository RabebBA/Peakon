import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownUp, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const statuses = [
  "Blocked",
  "Pending",
  "In progress",
  "Scheduled for today",
  "KO",
];

const requestTypes = [
  {
    type: "Client Feedback",
    tasks: {
      Blocked: 2,
      Pending: 1,
      "In progress": 3,
      "Scheduled for today": 0,
      KO: 1,
    },
  },
  {
    type: "Internal Test",
    tasks: {
      Blocked: 0,
      Pending: 1,
      "In progress": 1,
      "Scheduled for today": 1,
      KO: 0,
    },
  },
  {
    type: "Development",
    tasks: {
      Blocked: 1,
      Pending: 3,
      "In progress": 4,
      "Scheduled for today": 2,
      KO: 2,
    },
  },
];

export function TypeDevReastDashboard() {
  const [search, setSearch] = useState("");

  const filteredRequestTypes = requestTypes.filter((request) =>
    request.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="bg-white border border-gray-300 shadow-xl rounded-2xl">
      <CardContent className="overflow-x-auto p-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-left px-4 py-2 text-gray-700">
            Tasks by Request Type
          </h2>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search for a request type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-black border-slate-600 placeholder:text-slate-400 w-full"
            />
          </div>
        </div>
        <Table className="min-w-full text-sm text-center">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Request Type</TableHead>
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
            {filteredRequestTypes.map((request) => (
              <TableRow
                key={request.type}
                className="border-t border-gray-200 hover:bg-slate-100 transition duration-150"
              >
                <TableCell className="font-medium text-gray-800 text-left">
                  {request.type}
                </TableCell>
                {statuses.map((status) => (
                  <TableCell key={status} className="text-center text-gray-700">
                    {request.tasks[status] > 0 ? (
                      request.tasks[status]
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
