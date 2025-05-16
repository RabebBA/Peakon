import { Globe, ArrowDownUp, MoreVertical, ListFilter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Hint } from "../items/hint";

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

export function GlobalRoleTable() {
  const [roles, setRoles] = useState([]);
  const [searchGlobal, setSearchGlobal] = useState("");
  const [privileges, setPrivileges] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [editRoleData, setEditRoleData] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState([]); // "Enabled", "Disabled"

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // ou 10 selon ton besoin

  const statusColors = {
    Enabled: "green",
    Disabled: "red",
  };

  // Filtrage et pagination
  const filteredRoles = roles
    .filter((role) => role.type === "Global")
    .filter((role) =>
      role.title.toLowerCase().includes(searchGlobal.toLowerCase())
    )
    .filter((role) => {
      // Si aucun status n'est sélectionné, on garde tout
      if (selectedStatus.length === 0) return true;
      // Sinon, on filtre selon le status
      return selectedStatus.includes(role.isEnable ? "Enabled" : "Disabled");
    });

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    async function fetchAll() {
      const [rolesRes, privsRes, routesRes] = await Promise.all([
        privateFetch.get("/role/global"),
        privateFetch.get("/privileges/global"),
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

  const handleToggleRoleEnable = async (role) => {
    try {
      const endpoint = role.isEnable
        ? `/role/${role._id}/disable`
        : `/role/${role._id}/enable`;
      await privateFetch.patch(endpoint);
      setRoles((prev) =>
        prev.map((r) =>
          r._id === role._id ? { ...r, isEnable: !r.isEnable } : r
        )
      );
      toast.success(
        `Role ${role.isEnable ? "disabled" : "enabled"} successfully!`
      );
    } catch {
      toast.error("Failed to update role status");
    }
  };

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
  function toggleStatusFilter(status) {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  }

  return (
    <div className="pt-4 text-neutral-800 dark:text-neutral-200">
      {/* GLOBAL ROLES */}
      <section className="h-screen rounded-xl border  shadow-md p-6 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 " />
            <h3 className="text-xl font-bold ">Global Roles</h3>
          </div>
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
              <Button className="text-white font-medium bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow">
                Add Role
              </Button>
            }
            onCreate={handleCreateRole}
            showProjectSwitch={false}
            showRoleType={false} // Important : masquer le champ Type
          />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <Input
            className="w-64"
            placeholder="Search global roles..."
            value={searchGlobal}
            onChange={(e) => setSearchGlobal(e.target.value)}
          />
          <DropdownMenu>
            <Hint sideOffset={10} description="Filter by status.">
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-neutral-800 dark:text-neutral-200"
                >
                  <ListFilter /> Status
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
        </div>

        <div className="overflow-x-auto rounded-lg border  bg-white dark:bg-black">
          <Table className="compact-table bg-gray-900">
            <TableHeader>
              <TableRow className=" py-0.5 font-medium leading-none">
                <TableHead className="text-center py-0.5">
                  <div className="flex items-center gap-2">
                    <ArrowDownUp className="w-4 h-4" />
                    Role
                  </div>
                </TableHead>
                <TableHead className="text-center py-0.5">
                  <div className="flex items-center gap-2">
                    <ArrowDownUp className="w-4 h-4" />
                    Created At
                  </div>
                </TableHead>
                <TableHead className="text-center py-0.5">
                  <div className="flex items-center gap-2">
                    <ArrowDownUp className="w-4 h-4" />
                    Updated At
                  </div>
                </TableHead>
                <TableHead className="text-center py-0.5">
                  <div className="flex items-center gap-2">
                    <ArrowDownUp className="w-4 h-4" />
                    Status
                  </div>
                </TableHead>
                <TableHead className="items-end py-0.5" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRoles.map((role) => (
                <TableRow
                  key={role._id}
                  className="leading-none py-1 transition"
                >
                  <TableCell className="font-medium text-neutral-700 dark:text-neutral-300 py-1">
                    {role.title}
                  </TableCell>
                  <TableCell className="py-1">
                    {new Date(role.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </TableCell>

                  <TableCell className="py-1">
                    {new Date(role.updatedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </TableCell>

                  <TableCell className="py-1">
                    <StatusBadge enabled={role.isEnable} />
                  </TableCell>
                  <TableCell className="text-end py-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="p-1">
                          <MoreVertical className="w-4 h-4" />
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
        <div className="pt-4">
          <Pagination className="text-neutral-800 dark:text-neutral-200 absolute inset-x-0 bottom-10 h-16 pt-8">
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
        {/* Edit Dialog */}
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
          showRoleType={false} // Important : masquer le champ Type
        />
      </section>

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
        showRoleType={false} // Important : masquer le champ Type
      />
    </div>
  );
}
