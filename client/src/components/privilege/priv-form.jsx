import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { privateFetch } from "@/utils/fetch";

export function DialogCreatePrivilege({ onCreated }) {
  const [open, setOpen] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    routeId: "",
    type: "Global",
    userId: [],
  });

  useEffect(() => {
    privateFetch.get("/routes").then((res) => setRoutes(res.data));
    privateFetch.get("/users").then((res) => setUsers(res.data));
  }, []);

  const handleSubmit = async () => {
    if (!form.routeId || !form.type) {
      alert("Route and type are required.");
      return;
    }

    try {
      const res = await privateFetch.post("/privileges", form);
      onCreated?.(res.data);
      setForm({ routeId: "", type: "Global", userId: [] });
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création du privilège.");
    }
  };

  const toggleUser = (id) => {
    setForm((prev) => ({
      ...prev,
      userId: prev.userId.includes(id)
        ? prev.userId.filter((uid) => uid !== id)
        : [...prev.userId, id],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouveau privilège
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un privilège</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* Route */}
          <div>
            <Label>Route</Label>
            <Select
              value={form.routeId}
              onValueChange={(value) =>
                setForm((f) => ({ ...f, routeId: value }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionner une route" />
              </SelectTrigger>
              <SelectContent>
                {routes.map((route) => (
                  <SelectItem key={route._id} value={route._id}>
                    {route.title || route.path}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type */}
          <div>
            <Label>Type</Label>
            <Select
              value={form.type}
              onValueChange={(value) => setForm((f) => ({ ...f, type: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Global">Global</SelectItem>
                <SelectItem value="Project">Project</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Utilisateurs (facultatif) */}
          <div>
            <Label>Utilisateurs </Label>
            <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
              {users.map((u) => (
                <Badge
                  key={u._id}
                  onClick={() => toggleUser(u._id)}
                  className={`cursor-pointer transition ${
                    form.userId.includes(u._id)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {u.firstName} {u.lastName}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Créer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
