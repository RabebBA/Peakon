import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ListFilter,
  MoreVertical,
  ArrowDownUp,
  Search,
  UsersRound,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Hint } from "../items/hint";
import CreateUserDialog from "./user-form";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import UserProfile from "./edit-user";

import { privateFetch } from "../../../utils/fetch";

const statusLabels = {
  Connected: "Connected",
  Disconnected: "Disconnected",
  Disactivated: "Disactivated",
};

const statusColors = {
  Connected: "bg-green-100 text-green-700 border-green-500",
  Disconnected: "bg-gray-100 text-gray-700 border-gray-500",
  Disactivated: "bg-red-100 text-red-700 border-red-500",
};
const getUserStatus = (user) => {
  if (user.isActive === false) return "Disactivated";
  return user.isConnected ? "Connected" : "Disconnected";
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isEditOpen, setEditOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rolesMap, setRolesMap] = useState({});

  const [selectedUserId, setSelectedUserId] = useState(null);

  setIsDialogOpen;

  const itemsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await privateFetch.get("/users");
        if (Array.isArray(response.data.data)) {
          setUsers(response.data.data);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, [navigate]);

  useEffect(() => {
    // Récupère les rôles globaux
    const fetchRoles = async () => {
      try {
        const response = await privateFetch.get("/role/global");
        // Adaptez la structure selon votre API, ici on suppose un tableau d'objets { _id, title }
        if (Array.isArray(response.data.data)) {
          const map = {};
          response.data.data.forEach((role) => {
            map[role._id] = role.title;
          });
          setRolesMap(map);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des rôles :", error);
      }
    };

    fetchRoles();
  }, []);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const filteredUsers = users.filter((user) => {
    return (
      (selectedStatus.length === 0 ||
        selectedStatus.includes(statusLabels[user.isConnected])) &&
      (selectedRoles.length === 0 ||
        selectedRoles.some((roleId) => user.roleId?.includes(roleId))) &&
      `${user.firstname} ${user.lastname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleStatusFilter = (status) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const toggleRoleFilter = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  return (
    <div className="pt-4 text-neutral-800 dark:text-neutral-200">
      <section className="h-screen rounded-xl border  shadow-md p-6 mb-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <UsersRound className="w-6 h-6" />
            <h3 className="text-xl font-semibold ">Users</h3>
          </div>
          <CreateUserDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            trigger={
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow hover:from-blue-600 hover:to-purple-600">
                Add User
              </Button>
            }
          />
        </div>

        {/* Search + Filters */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <DropdownMenu>
            <Hint sideOffset={10} description="Filter by status.">
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <ListFilter />
                  Status
                </Button>
              </DropdownMenuTrigger>
            </Hint>
            <DropdownMenuContent>
              {Object.keys(statusColors).map((status) => (
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

          {/* Role Filter */}
          <DropdownMenu>
            <Hint sideOffset={10} description="Filter by role.">
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <ListFilter />
                  Role
                </Button>
              </DropdownMenuTrigger>
            </Hint>
            <DropdownMenuContent>
              {Object.entries(rolesMap).map(([id, title]) => (
                <DropdownMenuCheckboxItem
                  key={id}
                  checked={selectedRoles.includes(id)}
                  onCheckedChange={() => toggleRoleFilter(id)}
                >
                  {title}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border  bg-white dark:bg-black">
          <Table className="compact-table bg-gray-50/40 dark:bg-gray-900 ">
            <TableHeader>
              <TableRow className=" py-0.5 font-medium leading-none">
                <TableHead className="text-center py-0.5">Name</TableHead>
                <TableHead className="text-center py-0.5">
                  <div className="flex items-center gap-2 justify-center">
                    Role
                    <ArrowDownUp className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="text-center py-0.5">
                  <div className="flex items-center gap-2 justify-center">
                    Serial Number
                    <ArrowDownUp className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="text-center py-0.5">
                  <div className="flex items-center gap-2 justify-center">
                    Email
                    <ArrowDownUp className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="text-center py-0.5">
                  <div className="flex items-center gap-2 justify-center">
                    Phone
                    <ArrowDownUp className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="text-center py-0.5">
                  <div className="flex items-center gap-2 justify-center">
                    Status
                    <ArrowDownUp className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="py-0.5" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow
                  key={user._id}
                  className="leading-none py-1  transition"
                >
                  <TableCell className="flex items-center gap-3 py-2">
                    <Avatar>
                      <AvatarImage src={user.photo} />
                      <AvatarFallback>
                        {user.firstname.charAt(0)}
                        {user.lastname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {user.firstname} {user.lastname}
                  </TableCell>
                  <TableCell className="text-start py-2">
                    {user.roleId && user.roleId.length > 0 ? (
                      user.roleId.map((roleId) => (
                        <Badge
                          key={roleId}
                          className="mr-1 mb-1 bg-yellow-100 text-yellow-800 border-yellow-500"
                        >
                          {rolesMap[roleId] || roleId}
                        </Badge>
                      ))
                    ) : (
                      <span>No Role</span>
                    )}
                  </TableCell>

                  <TableCell className="text-center py-2">
                    {user.matricule}
                  </TableCell>
                  <TableCell className="text-center py-2">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-center py-2">
                    {user.phone}
                  </TableCell>
                  <TableCell className="text-center py-2">
                    <Badge className={statusColors[getUserStatus(user)]}>
                      {getUserStatus(user)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-end py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="p-1">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUserId(user._id);
                            setEditOpen(true);
                          }}
                        >
                          Edit User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <UserProfile
                      open={isEditOpen}
                      onClose={() => setEditOpen(false)}
                      userId={selectedUserId}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination className="text-neutral-800 dark:text-neutral-200 absolute inset-x-0 bottom-10 h-16 pt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
        {/* Pagination */}
      </section>
    </div>
  );
}
