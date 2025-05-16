import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, PlusCircle, PlusSquare, Trash2 } from "lucide-react";
import { Hint } from "../items/hint";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DialogCreateRole } from "../role/role-form";
import { RoleMultiSelect } from "../workflow/role-multi-select";
import { SearchUser } from "../users/user.serach";
import { useAccessData } from "@/components/role/projectData-fetch";
import { useEffect, useState } from "react";
import { privateFetch } from "../../../utils/fetch"; // Ton instance Axios privée
import { toast } from "sonner";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await privateFetch.get("/users");

        setUsers(res.data.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading };
}

// ... [imports identiques]

export default function CreateProjectForm({
  templates = [],
  onCreateRole,
  onSubmit,
}) {
  const { availableRoles, availablePrivileges } = useAccessData("project");
  const roles = availableRoles;
  const { users, loading } = useUsers();

  const [date, setDate] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [projectName, setProjectName] = useState("");
  const [desc, setDesc] = useState("");
  const [members, setMembers] = useState([]);

  const [errors, setErrors] = useState({});
  const userData =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const currentUser = userData ? JSON.parse(userData) : null;

  const addMember = () => {
    setMembers([...members, { userId: "", roles: [] }]);
  };

  const updateMember = (index, key, value) => {
    const updated = [...members];
    updated[index][key] = value;
    setMembers(updated);
  };

  const removeMember = (index) => {
    const updated = [...members];
    updated.splice(index, 1);
    setMembers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!projectName.trim())
      newErrors.projectName = "Project name is required.";
    if (!desc.trim()) newErrors.desc = "Description is required.";
    if (!date) newErrors.date = "Delivery date is required.";
    if (!selectedTemplate)
      newErrors.template = "Workflow selection is required.";
    if (members.length === 0) {
      newErrors.members = "At least one member is required.";
    } else {
      members.forEach((m, idx) => {
        if (!m.userId) {
          newErrors[`member_${idx}`] = "User selection is required.";
        }
      });
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      name: projectName,
      description: desc,
      deliveryDate: date,
      template: selectedTemplate,
      members: members.map((m) => ({
        userId: m.userId,
        roles: m.roles,
      })),
      createdBy: currentUser?._id, // <-- ici on ajoute le champ automatiquement
    };

    onSubmit?.(payload);
  };

  return (
    <Card className="mt-4 w-full max-w-3xl mx-auto p-4 shadow-xl rounded-2xl">
      <CardContent className="space-y-6">
        <h2 className="text-2xl font-semibold">Create a new project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project name */}
          <div className="space-y-1">
            <Label>
              Project name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className={errors.projectName && "border-red-500"}
            />
            {errors.projectName && (
              <p className="text-red-500 text-sm">{errors.projectName}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label>
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Enter project description"
              className={errors.desc && "border-red-500"}
            />
            {errors.desc && (
              <p className="text-red-500 text-sm">{errors.desc}</p>
            )}
          </div>

          {/* Delivery date */}
          <div className="space-y-1">
            <Label>
              Delivery date <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left",
                    !date && "text-muted-foreground",
                    errors.date && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(day) => day < new Date()}
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}
          </div>

          {/* Workflow */}
          <div className="space-y-1">
            <Label>
              Workflow <span className="text-red-500">*</span>
            </Label>
            <Select onValueChange={setSelectedTemplate}>
              <SelectTrigger
                className={cn("w-full", errors.template && "border-red-500")}
              >
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t._id} value={t._id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.template && (
              <p className="text-red-500 text-sm">{errors.template}</p>
            )}
          </div>

          {/* Members */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>
                Project members <span className="text-red-500">*</span>
              </Label>
              <Button type="button" variant="outline" onClick={addMember}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add member
              </Button>
            </div>

            {errors.members && (
              <p className="text-red-500 text-sm">{errors.members}</p>
            )}

            {members.map((member, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 border p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex justify-between items-center">
                  <Label>Member #{index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMember(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                {loading ? (
                  <p>Loading users...</p>
                ) : (
                  <>
                    <SearchUser
                      options={users.map((u) => ({
                        label: `${u.firstname} ${u.lastname}`,
                        value: u._id,
                      }))}
                      placeholder="Select a user"
                      onChange={(value) => updateMember(index, "userId", value)}
                    />
                    {errors[`member_${index}`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`member_${index}`]}
                      </p>
                    )}
                  </>
                )}

                <div className="flex items-center gap-2">
                  <RoleMultiSelect
                    placeholder="Select a role"
                    value={member.roles}
                    onChange={(roles) => updateMember(index, "roles", roles)}
                    options={roles}
                    availablePrivileges={availablePrivileges}
                  />
                  <DialogCreateRole
                    projectId="abc123"
                    availablePrivileges={availablePrivileges}
                    availableUsers={users}
                    onCreate={(newRole) => {
                      onCreateRole(newRole).then((created) => {
                        roles.push(created);
                      });
                    }}
                    trigger={
                      <Hint description={"Add new role"} sideOffset={10}>
                        <Button variant="ghost" size="icon">
                          <PlusSquare className="w-4 h-4 text-neutral-800 dark:text-neutral-200 " />
                        </Button>
                      </Hint>
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
