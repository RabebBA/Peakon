import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowDownUp,
  ChevronDown,
  MoreVertical,
  PlusSquare,
} from "lucide-react";
import { privateFetch } from "../../../utils/fetch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DialogCreateRole } from "./role-form";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

function StatusBadge({ enabled }) {
  return enabled ? (
    <Badge className="bg-green-100 text-green-700 border-green-500 hover:bg-green-50">
      Enabled
    </Badge>
  ) : (
    <Badge className="bg-red-100 text-red-700 border-red-500 hover:bg-red-50">
      Disabled
    </Badge>
  );
}

export default function RoleDashboard() {
  const [roles, setRoles] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [searchGlobal, setSearchGlobal] = useState("");
  const [searchProject, setSearchProject] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      const [rolesRes, privsRes, routesRes] = await Promise.all([
        privateFetch.get("/role"),
        privateFetch.get("/privileges"),
        privateFetch.get("/routes"),
      ]);
      setRoles(
        Array.isArray(rolesRes.data) ? rolesRes.data : rolesRes.data?.data || []
      );
      setPrivileges(
        Array.isArray(privsRes.data) ? privsRes.data : privsRes.data?.data || []
      );
      setRoutes(
        Array.isArray(routesRes.data)
          ? routesRes.data
          : routesRes.data?.data || []
      );
    }
    fetchAll();
  }, []);

  const rolesGlobal = roles
    .filter((role) => role.type === "Global")
    .filter((role) =>
      role.title.toLowerCase().includes(searchGlobal.toLowerCase())
    )
    .slice(0, 5);

  const rolesProject = roles
    .filter((role) => role.type === "Project")
    .filter((role) =>
      role.title.toLowerCase().includes(searchProject.toLowerCase())
    )
    .slice(0, 5);

  useEffect(() => {
    async function fetchAll() {
      const [rolesRes, privsRes, routesRes] = await Promise.all([
        privateFetch.get("/role"),
        privateFetch.get("/privileges"),
        privateFetch.get("/routes"),
      ]);
      setRoles(
        Array.isArray(rolesRes.data) ? rolesRes.data : rolesRes.data?.data || []
      );
      setPrivileges(
        Array.isArray(privsRes.data) ? privsRes.data : privsRes.data?.data || []
      );
      setRoutes(
        Array.isArray(routesRes.data)
          ? routesRes.data
          : routesRes.data?.data || []
      );
    }
    fetchAll();
  }, []);

  // Handlers pour Dialog
  const handleCreateRole = (newRole) => {
    setRoles((prev) => [...prev, newRole]);
    setAddOpen(false);
  };

  const handleEditRole = (updatedRole) => {
    setRoles((prev) =>
      prev.map((role) => (role._id === updatedRole._id ? updatedRole : role))
    );
    setEditRole(null);
  };

  const handleDisableRole = (roleId) => {
    setRoles((prev) =>
      prev.map((role) =>
        role._id === roleId ? { ...role, isEnable: false } : role
      )
    );
  };

  return (
    <div className="p-2 bg-muted min-h-screen text-neutral-800">
      <h1 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200 py-6">
        Roles & Privileges
      </h1>
      <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Best Selling Product */}
        <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Best Selling Product</h3>
              <p className="text-xs text-muted-foreground">
                Top-Selling Products at a Glance
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <ChevronDown className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <ProductItem name="Sports Shoes" sold={316} img="/img/shoes.jpg" />
            <ProductItem
              name="Black T-Shirt"
              sold={274}
              img="/img/tshirt.jpg"
            />
            <ProductItem name="Jeans" sold={195} img="/img/jeans.jpg" />
            <ProductItem
              name="Red Sneakers"
              sold={402}
              img="/img/sneakers.jpg"
            />
            <ProductItem name="Red Scarf" sold={280} img="/img/scarf.jpg" />
            <ProductItem
              name="Kitchen Accessory"
              sold={150}
              img="/img/kitchen.jpg"
            />
          </div>
        </div>

        {/* Tableau des rôles */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
          {/* Tableau des rôles globaux */}
          <h3 className="text-lg font-semibold">Global Roles</h3>
          <Input
            className="w-64 mb-2"
            placeholder="Search global roles..."
            value={searchGlobal}
            onChange={(e) => setSearchGlobal(e.target.value)}
          />
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center align-middle w-4/5">
                    <div className="flex flex-row items-center gap-2">
                      Role
                      <ArrowDownUp className="w-4 h-4 " />
                    </div>
                  </TableHead>
                  <TableHead className="text-center align-middle">
                    <div className="flex flex-row items-center gap-2">
                      Status
                      <ArrowDownUp className="w-4 h-4 " />
                    </div>
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rolesGlobal.map((role) => (
                  <TableRow key={role._id}>
                    <TableCell>{role.title}</TableCell>

                    <TableCell>
                      <StatusBadge enabled={role.isEnable} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setEditRole(role)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDisableRole(role._id)}
                            className="text-red-500"
                          >
                            Disable
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Tableau des rôles de projet */}
          <h4 className="text-lg font-semibold mt-6">Project Roles</h4>
          <Input
            className="w-64 mb-2"
            placeholder="Search project roles..."
            value={searchProject}
            onChange={(e) => setSearchProject(e.target.value)}
          />
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center align-middle w-4/5">
                    <div className="flex flex-row items-center gap-2">
                      Role
                      <ArrowDownUp className="w-4 h-4 " />
                    </div>
                  </TableHead>
                  <TableHead className="text-center align-middle">
                    <div className="flex flex-row items-center gap-2">
                      Status
                      <ArrowDownUp className="w-4 h-4 " />
                    </div>
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rolesProject.map((role) => (
                  <TableRow key={role._id}>
                    <TableCell>{role.title}</TableCell>

                    <TableCell>
                      <StatusBadge enabled={role.isEnable} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setEditRole(role)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDisableRole(role._id)}
                            className="text-red-500"
                          >
                            Disable
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end">
            <DialogCreateRole
              open={addOpen}
              onOpenChange={setAddOpen}
              availablePrivileges={privileges.map((p) => ({
                ...p,
                label:
                  routes.find((r) => r._id === p.routeId)?.title ||
                  "Unknown Route",
              }))}
              trigger={
                <Button variant="default" size="sm">
                  Add Role
                </Button>
              }
              onCreate={handleCreateRole}
              showProjectSwitch={false}
              showRoleType
            />
          </div>
        </div>
      </div>
      {/* Dialog d'édition */}
      <DialogCreateRole
        open={!!editRole}
        onOpenChange={(open) => setEditRole(open ? editRole : null)}
        initialData={editRole}
        availablePrivileges={privileges.map((p) => ({
          ...p,
          label:
            routes.find((r) => r._id === p.routeId)?.title || "Unknown Route",
        }))}
        onUpdate={handleEditRole}
        isEditing
        showProjectSwitch={false}
        showRoleType
      />
    </div>
  );
}

function ProductItem({ name, sold, img }) {
  return (
    <div className="flex items-center gap-3 py-2 text-neutral-800">
      <img
        src={img}
        alt={name}
        className="w-12 h-12 rounded-lg object-cover border"
      />
      <div className="flex-1">
        <div className="font-medium">{name}</div>
        <div className="text-green-600 text-xs font-semibold">
          {sold} items sold
        </div>
      </div>
    </div>
  );
}
