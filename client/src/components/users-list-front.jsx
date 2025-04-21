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
// import { privateFetch } from "../../utils/fetch"; // <-- Réactive ça quand ton backend est prêt

// ✅ PAR CECI :
const statusLabels = {
  Connected: "Connected",
  Disconnected: "Disconnected",
  Inactive: "Inactive",
};

const statusColors = {
  Connected: "bg-green-100 text-green-700",
  Disconnected: "bg-gray-100 text-gray-700",
  Inactive: "bg-red-100 text-yellow-700",
};
const getUserStatus = (user) => {
  if (user.isActive === false) return "Inactive";
  return user.isConnected ? "Connected" : "Disconnected";
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
      // ✅ DATA MOCKÉE POUR TESTER
      const MOCK_USERS = [
        {
          _id: "1",
          firstname: "Emily",
          lastname: "Clark",
          email: "emily.clark@example.com",
          phone: "0612345678",
          matricule: "M1001",
          role: ["admin"],
          isConnected: true,
          isActive: true,
          photo: "https://randomuser.me/api/portraits/women/65.jpg",
        },
        {
          _id: "2",
          firstname: "Liam",
          lastname: "Smith",
          email: "liam.smith@example.com",
          phone: "0623456789",
          matricule: "M1002",
          role: ["user"],
          isConnected: false,
          isActive: true,
          photo: "https://randomuser.me/api/portraits/men/75.jpg",
        },
        {
          _id: "3",
          firstname: "Olivia",
          lastname: "Johnson",
          email: "olivia.johnson@example.com",
          phone: "0634567890",
          matricule: "M1003",
          role: ["user"],
          isConnected: true,
          photo: "https://randomuser.me/api/portraits/women/32.jpg",
        },
        {
          _id: "4",
          firstname: "Noah",
          lastname: "Williams",
          email: "noah.williams@example.com",
          phone: "0645678901",
          matricule: "M1004",
          role: ["manager"],
          isConnected: true,
          isActive: false,

          photo: "https://randomuser.me/api/portraits/men/42.jpg",
        },
        {
          _id: "5",
          firstname: "Sophia",
          lastname: "Brown",
          email: "sophia.brown@example.com",
          phone: "0656789012",
          matricule: "M1005",
          role: ["user"],
          isConnected: false,
          isActive: true,

          photo: "https://randomuser.me/api/portraits/women/45.jpg",
        },
        {
          _id: "6",
          firstname: "James",
          lastname: "Jones",
          email: "james.jones@example.com",
          phone: "0667890123",
          matricule: "M1006",
          role: ["admin"],
          isConnected: true,
          isActive: false,

          photo: "https://randomuser.me/api/portraits/men/38.jpg",
        },
        {
          _id: "7",
          firstname: "Ava",
          lastname: "Garcia",
          email: "ava.garcia@example.com",
          phone: "0678901234",
          matricule: "M1007",
          role: ["user"],
          isConnected: true,
          isActive: true,

          photo: "https://randomuser.me/api/portraits/women/53.jpg",
        },
        {
          _id: "8",
          firstname: "Benjamin",
          lastname: "Martinez",
          email: "ben.martinez@example.com",
          phone: "0689012345",
          matricule: "M1008",
          role: ["user"],
          isConnected: false,
          isActive: true,

          photo: "https://randomuser.me/api/portraits/men/57.jpg",
        },
        {
          _id: "9",
          firstname: "Isabella",
          lastname: "Davis",
          email: "isabella.davis@example.com",
          phone: "0690123456",
          matricule: "M1009",
          role: ["manager"],
          isConnected: true,
          photo: "https://randomuser.me/api/portraits/women/28.jpg",
        },
        {
          _id: "10",
          firstname: "Lucas",
          lastname: "Rodriguez",
          email: "lucas.rodriguez@example.com",
          phone: "0611223344",
          matricule: "M1010",
          role: ["user"],
          isConnected: false,
          photo: "https://randomuser.me/api/portraits/men/21.jpg",
        },
        {
          _id: "11",
          firstname: "Mia",
          lastname: "Miller",
          email: "mia.miller@example.com",
          phone: "0611334455",
          matricule: "M1011",
          role: ["user"],
          isConnected: true,
          photo: "https://randomuser.me/api/portraits/women/12.jpg",
        },
        {
          _id: "12",
          firstname: "Ethan",
          lastname: "Wilson",
          email: "ethan.wilson@example.com",
          phone: "0611445566",
          matricule: "M1012",
          role: ["admin"],
          isConnected: false,
          photo: "https://randomuser.me/api/portraits/men/33.jpg",
        },
        {
          _id: "13",
          firstname: "Charlotte",
          lastname: "Moore",
          email: "charlotte.moore@example.com",
          phone: "0611556677",
          matricule: "M1013",
          role: ["user"],
          isConnected: true,
          photo: "https://randomuser.me/api/portraits/women/9.jpg",
        },
        {
          _id: "14",
          firstname: "Logan",
          lastname: "Taylor",
          email: "logan.taylor@example.com",
          phone: "0611667788",
          matricule: "M1014",
          role: ["manager"],
          isConnected: false,
          photo: "https://randomuser.me/api/portraits/men/49.jpg",
        },
        {
          _id: "15",
          firstname: "Amelia",
          lastname: "Anderson",
          email: "amelia.anderson@example.com",
          phone: "0611778899",
          matricule: "M1015",
          role: ["user"],
          isConnected: true,
          photo: "https://randomuser.me/api/portraits/women/84.jpg",
        },
        {
          _id: "16",
          firstname: "Alexander",
          lastname: "Thomas",
          email: "alex.thomas@example.com",
          phone: "0611889900",
          matricule: "M1016",
          role: ["admin"],
          isConnected: true,
          photo: "https://randomuser.me/api/portraits/men/62.jpg",
        },
        {
          _id: "17",
          firstname: "Harper",
          lastname: "Jackson",
          email: "harper.jackson@example.com",
          phone: "0611990011",
          matricule: "M1017",
          role: ["user"],
          isConnected: false,
          photo: "https://randomuser.me/api/portraits/women/39.jpg",
        },
        {
          _id: "18",
          firstname: "Daniel",
          lastname: "White",
          email: "daniel.white@example.com",
          phone: "0612001122",
          matricule: "M1018",
          role: ["user"],
          isConnected: true,
          photo: "https://randomuser.me/api/portraits/men/14.jpg",
        },
        {
          _id: "19",
          firstname: "Evelyn",
          lastname: "Harris",
          email: "evelyn.harris@example.com",
          phone: "0612112233",
          matricule: "M1019",
          role: ["manager"],
          isConnected: false,
          photo: "https://randomuser.me/api/portraits/women/71.jpg",
        },
        {
          _id: "20",
          firstname: "Henry",
          lastname: "Martin",
          email: "henry.martin@example.com",
          phone: "0612223344",
          matricule: "M1020",
          role: ["user"],
          isConnected: true,
          photo: "https://randomuser.me/api/portraits/men/2.jpg",
        },
      ];

      setUsers(MOCK_USERS);

      // ⛔ Si tu veux réactiver le backend, décommente ci-dessous :
      /*
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
      */
    };

    fetchUsers();
  }, [navigate]);

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
    <div className="p-6 space-y-4 text-neutral-700 dark:text-gray-300">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Users</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => navigate("/create-user")}
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
              <CirclePlus />
              Role
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {["admin", "user", "manager"].map((role) => (
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
                  <AvatarImage src={user.photo} />
                  <AvatarFallback>
                    {user.firstname.charAt(0)}
                    {user.lastname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {user.firstname} {user.lastname}
              </TableCell>
              <TableCell>
                {user.role
                  .map((role) => role.charAt(0).toUpperCase() + role.slice(1))
                  .join(", ")}
              </TableCell>
              <TableCell>{user.matricule}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                <Badge className={statusColors[getUserStatus(user)]}>
                  {getUserStatus(user)}
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
