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
import { Plus, CirclePlus, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { privateFetch } from "../../../utils/fetch";

const statusLabels = {
  true: "Active",
  false: "Inactive",
};
const statusColors = {
  Active: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Inactive: "bg-gray-100 text-gray-700",
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const rawToken = localStorage.getItem("token");
      const token = rawToken?.startsWith("Authorization=")
        ? rawToken.split("=")[1]
        : rawToken;

      if (!token) {
        navigate("/login");
        return;
      }

      await privateFetch
        .get("/users")
        .then((response) => {
          if (Array.isArray(response.data.data)) {
            setUsers(response.data.data);
          } else {
            console.error("Unexpected response format:", response.data.data[0]);
            setUsers([]); // Ensure users is always an array
          }
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          setUsers([]); // Prevent users from being undefined/null
        });
    };

    fetchUsers();
  }, [navigate]); // Ajout de userPhoto ici pour ne pas provoquer de boucle infinie

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const filteredUsers = users.filter((user) => {
    return (
      (selectedStatus.length === 0 ||
        selectedStatus.includes(statusLabels[user.isConnected])) &&
      (selectedRoles.length === 0 ||
        selectedRoles.some((role) => user.role?.includes(role))) &&
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
    <div className="p-6 space-y-4  text-neutral-700 dark:text-gray-300">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Users</h1>
        <Button
          className="flex items-center gap-2 dark:text-white"
          onClick={() => {
            navigate("/create-user");
          }}
        >
          <Plus size={16} />
          Add New User
        </Button>
      </div>
      <div className="flex space-x-2">
        <Input
          placeholder="Search users..."
          className="w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <CirclePlus />
              Status
            </Button>
          </DropdownMenuTrigger>
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <CirclePlus /> Role
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {["admin", "user"].map((role) => (
              <DropdownMenuCheckboxItem
                key={role}
                checked={selectedRoles.includes(role)}
                onCheckedChange={() => toggleRoleFilter(role)}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Matricule</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={user.photo}
                    alt={`${user.firstname} ${user.lastname}`}
                  />
                  <AvatarFallback>
                    {user.firstname.charAt(0)}
                    {user.lastname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {user.firstname} {user.lastname}{" "}
              </TableCell>
              <TableCell>
                {user.role
                  .map(
                    (role) =>
                      role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
                  )
                  .join(", ")}
              </TableCell>

              <TableCell>{user.matricule}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                <Badge className={statusColors[statusLabels[user.isConnected]]}>
                  {statusLabels[user.isConnected]}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="font-semibold">
                      Actions
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => navigate(`/user/${user._id}`)}
                    >
                      View user
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
