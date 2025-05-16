import { Globe, Layers, ArrowDownUp, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { DialogCreateRole } from "./role-form";
import { useEffect, useState } from "react";
import { privateFetch } from "../../../utils/fetch";

import { toast } from "sonner";

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

export function RoleTable() {
  const [roles, setRoles] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [searchGlobal, setSearchGlobal] = useState("");
  const [searchProject, setSearchProject] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [editRoleData, setEditRoleData] = useState(null);

  const handleToggleRoleEnable = async (role) => {
    try {
      const endpoint = role.isEnable
        ? `/role/${role._id}/disable`
        : `/role/${role._id}/enable`;
      const res = await privateFetch.patch(endpoint);

      setRoles((prev) =>
        prev.map((r) =>
          r._id === role._id ? { ...r, isEnable: !role.isEnable } : r
        )
      );
      toast.success(
        `Role ${role.isEnable ? "disabled" : "enabled"} successfully!`
      );
    } catch (err) {
      toast.error("Failed to update role status");
    }
  };

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

  useEffect(() => {
    if (!editRole) {
      setEditRoleData(null);
      return;
    }
    async function fetchRoleDetails() {
      try {
        const res = await privateFetch.get(`/role/${editRole._id}`);
        setEditRoleData(res.data);
      } catch (error) {
        console.error("Failed to fetch role details", error);
      }
    }
    fetchRoleDetails();
  }, [editRole]);

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
  return (
    <div className="rounded-xl shadow-lg p-8 flex flex-col gap-8 dark:bg-gray-900">
      {/* GLOBAL ROLES */}
      <section className="rounded-xl border border-blue-200 dark:border-blue-600 bg-blue-50/60 dark:bg-blue-900/40 shadow-md p-6 mb-2">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-6 h-6 text-blue-700 dark:text-blue-300" />
          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-200">
            Global Roles
          </h3>
          <Badge className="bg-blue-200 text-blue-800 ml-2">
            {rolesGlobal.length}
          </Badge>
        </div>
        <Input
          className="w-64 mb-4"
          placeholder="Search global roles..."
          value={searchGlobal}
          onChange={(e) => setSearchGlobal(e.target.value)}
        />
        <div className="overflow-x-auto rounded-lg border border-blue-200 dark:border-blue-600 bg-white dark:bg-blue-950">
          <Table>
            <TableHeader>
              <TableRow className="border-blue-200 dark:border-blue-600">
                <TableHead className="text-center w-4/5">
                  <div className="flex items-center gap-2">
                    Role
                    <ArrowDownUp className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center gap-2">
                    Status
                    <ArrowDownUp className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rolesGlobal.map((role) => (
                <TableRow
                  key={role._id}
                  className="border-blue-200 dark:border-blue-600 hover:bg-blue-100/60 dark:hover:bg-blue-900/40 transition"
                >
                  <TableCell className="font-medium">{role.title}</TableCell>
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
                          onClick={() => handleToggleRoleEnable(role)}
                          className={
                            role.isEnable ? "text-red-500" : "text-green-600"
                          }
                        >
                          {role.isEnable ? "Disable" : "Enable"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* PROJECT ROLES */}
      <section className="rounded-xl border border-purple-200 dark:border-purple-600 bg-purple-50/60 dark:bg-purple-900/40 shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="w-6 h-6 text-purple-700 dark:text-purple-300" />
          <h4 className="text-xl font-bold text-purple-900 dark:text-purple-200">
            Project Roles
          </h4>
          <Badge className="bg-purple-200 text-purple-800 ml-2">
            {rolesProject.length}
          </Badge>
        </div>
        <Input
          className="w-64 mb-4"
          placeholder="Search project roles..."
          value={searchProject}
          onChange={(e) => setSearchProject(e.target.value)}
        />
        <div className="overflow-x-auto rounded-lg border border-purple-200 dark:border-purple-600 bg-white dark:bg-purple-950">
          <Table>
            <TableHeader>
              <TableRow className="border-purple-200 dark:border-purple-600">
                <TableHead className="text-center w-4/5">
                  <div className="flex items-center gap-2">
                    Role
                    <ArrowDownUp className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center gap-2">
                    Status
                    <ArrowDownUp className="w-4 h-4" />
                  </div>
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rolesProject.map((role) => (
                <TableRow
                  key={role._id}
                  className="border-purple-200 dark:border-purple-600 hover:bg-purple-100/60 dark:hover:bg-purple-900/40 transition"
                >
                  <TableCell className="font-medium">{role.title}</TableCell>
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
                          onClick={() => handleToggleRoleEnable(role)}
                          className={
                            role.isEnable ? "text-red-500" : "text-green-600"
                          }
                        >
                          {role.isEnable ? "Disable" : "Enable"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Bouton Add Role */}
      <div className="flex items-center justify-end mt-4">
        <DialogCreateRole
          open={addOpen}
          onOpenChange={setAddOpen}
          availablePrivileges={privileges.map((p) => ({
            ...p,
            label:
              routes.find((r) => r._id === p.routeId)?.title || "Unknown Route",
          }))}
          trigger={
            <Button
              variant="default"
              size="lg"
              className="text-white font-semibold shadow-md bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              + Add Role
            </Button>
          }
          onCreate={handleCreateRole}
          showProjectSwitch={false}
          showRoleType
        />
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
