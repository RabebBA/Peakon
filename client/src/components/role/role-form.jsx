import { useEffect, useState } from "react";
import { privateFetch } from "../../../utils/fetch";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PriviMultiSelect } from "./priv-multi-select";

export function DialogCreateRole({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
  projectId,
  availablePrivileges = [],
  onCreate,
  onUpdate,
  initialData = null,
  isEditing = false,
  showProjectSwitch = true,
  showRoleType = false,
}) {
  const [open, setOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : open;
  const setIsOpen = controlledOnOpenChange || setOpen;

  const [title, setTitle] = useState("");
  const [roleType, setRoleType] = useState("Global");
  const [privileges, setPrivileges] = useState([]);
  const [assignToUser, setAssignToUser] = useState(false);
  const [targetUser, setTargetUser] = useState("");
  const [isProjectSpecific, setIsProjectSpecific] = useState(false);
  const [loading, setLoading] = useState(false);
  const [privilegeError, setPrivilegeError] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setRoleType(initialData.type || "Global");
      setPrivileges(
        Array.isArray(initialData.privId)
          ? initialData.privId.map((p) => (typeof p === "string" ? p : p._id))
          : []
      );
      setAssignToUser(initialData.userId?.length > 0 || false);
      setTargetUser(initialData.userId?.[0] || "");
      setIsProjectSpecific(initialData.projectId?.length > 0 || false);
    } else {
      setTitle("");
      setRoleType(projectId ? "Project" : "Global");
      setPrivileges([]);
      setAssignToUser(false);
      setTargetUser("");
      setIsProjectSpecific(false);
    }
    setPrivilegeError(false);
  }, [initialData, projectId, isOpen]);

  const filteredPrivileges = availablePrivileges.filter(
    (priv) => priv.type === roleType
  );

  useEffect(() => {
    const validPrivileges = privileges.filter((privId) => {
      const privilege = availablePrivileges.find((p) => p._id === privId);
      return privilege && privilege.type === roleType;
    });
    if (validPrivileges.length !== privileges.length) {
      setPrivileges(validPrivileges);
    }
  }, [roleType, availablePrivileges]);

  const handleSubmit = async () => {
    const hasErrors =
      !title || privileges.length === 0 || (assignToUser && !targetUser);

    if (privileges.length === 0) {
      setPrivilegeError(true);
    } else {
      setPrivilegeError(false);
    }

    if (hasErrors) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const role = {
      ...initialData,
      title,
      type: roleType,
      privId: privileges,
      projectId:
        showProjectSwitch && isProjectSpecific && projectId ? [projectId] : [],
      userId: assignToUser && targetUser ? [targetUser] : [],
      isEnable: isEditing ? initialData.isEnable : true,
    };

    setLoading(true);

    try {
      if (isEditing && onUpdate && initialData?._id) {
        const res = await privateFetch.put(`/role/${initialData._id}`, role);
        toast.success("Role updated successfully!");
        onUpdate(res.data);
      } else if (onCreate) {
        const res = await privateFetch.post(`/role`, role);
        toast.success("Role created successfully!");
        onCreate(res.data);
      }
      setIsOpen(false);
    } catch (err) {
      toast.error("Error while saving role.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="w-4xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEditing ? "Edit Role" : "Create New Role"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="space-y-6">
            {/* Role Title */}
            <div className="space-y-2">
              <Label>
                Role title <span className="text-red-500 mr-1">*</span>
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Frontend Developer"
                disabled={loading}
                required
              />
            </div>

            {showRoleType && (
              <div className="space-y-2">
                <Label>
                  Role Type <span className="text-red-500 mr-1">*</span>
                </Label>
                <Select
                  value={roleType}
                  onValueChange={setRoleType}
                  disabled={loading}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Global">Global</SelectItem>
                    <SelectItem value="Project">Project</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {roleType === "Global"
                    ? "Ce rôle ne peut contenir que des privilèges globaux"
                    : "Ce rôle ne peut contenir que des privilèges de projet"}
                </p>
              </div>
            )}

            {/* Privileges */}
            <div className="space-y-2">
              <Label>
                {roleType} privileges{" "}
                <span className="text-red-500 mr-1">*</span>
              </Label>
              <PriviMultiSelect
                value={privileges}
                onChange={setPrivileges}
                options={filteredPrivileges}
                placeholder={`Search or select ${roleType.toLowerCase()} privileges`}
                disabled={loading}
              />
              {privilegeError && (
                <p className="text-sm text-red-500">
                  At least one privilege is required.
                </p>
              )}
              {filteredPrivileges.length === 0 && (
                <p className="text-xs text-amber-600">
                  Aucun privilège de type {roleType} disponible
                </p>
              )}
            </div>

            {/* Project-specific switch */}
            {showProjectSwitch && (
              <div className="grid gap-4 border rounded-xl p-4 bg-muted/20">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Role Specifications
                  </Label>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">
                      Specific to this project?
                    </Label>
                    <Switch
                      checked={isProjectSpecific}
                      onCheckedChange={setIsProjectSpecific}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {isEditing
                ? loading
                  ? "Saving..."
                  : "Save"
                : loading
                ? "Creating..."
                : "Create Role"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
