import { Handle, Position, useReactFlow } from "reactflow";
import { useState } from "react";
import { toast } from "sonner";
import { Play, Square } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";

const editSchema = z.object({
  label: z.string().min(1, "Status name is required"),
  type: z.enum(["evolutif", "figé"]),
});

const getNodeColor = (data) => {
  if (data.special === "initial") return "#bbf7d0"; // pastel green
  if (data.special === "final") return "#fecaca"; // pastel red
  if (data.type === "evolutif") return "#bfdbfe"; // pastel blue
  if (data.type === "figé") return "#f3f4f6"; // pastel gray
  return "#f3f4f6"; // fallback light gray
};

export function CustomNode({ id, data }) {
  const { updateNode, deleteNode } = data;
  const { getNodes, setNodes } = useReactFlow();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({
    label: data.label,
    type: data.type,
  });

  const bgColor = getNodeColor(data);

  const icon =
    data.special === "initial" ? (
      <Play className="w-4 h-4 inline-block mr-1" />
    ) : data.special === "final" ? (
      <Square className="w-4 h-4 inline-block mr-1" />
    ) : null;

  const handleEditSubmit = (e) => {
    e.preventDefault();
    try {
      const validated = editSchema.parse(formData);
      updateNode(id, validated);
      toast.success("Status updated!");
      setEditOpen(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error("Invalid input", {
          description: err.errors[0].message,
        });
      } else {
        toast.error("Unexpected error");
      }
    }
  };

  const handleDelete = () => {
    const currentNodes = getNodes();
    const deletedNode = currentNodes?.find((n) => n.id === id);
    setNodes((nds) => nds.filter((n) => n.id !== id));
    toast.success("Status deleted", {
      action: {
        label: "Undo",
        onClick: () => setNodes((nds) => [...nds, deletedNode]),
      },
    });
    setDeleteOpen(false);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className="relative group border rounded-xl shadow-sm px-4 py-2 min-w-[160px] text-black text-center cursor-pointer transition hover:shadow-md flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
          >
            {data.special !== "initial" && (
              <Handle
                type="target"
                position={Position.Left}
                className="w-2 h-2 bg-blue-500"
              />
            )}
            {data.special !== "final" && (
              <Handle
                type="source"
                position={Position.Right}
                className="w-2 h-2 bg-green-500"
              />
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <p className="flex items-center justify-center gap-1 text-sm font-medium">
                  {icon}
                  {data.label}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs space-y-1">
                  <div>
                    <strong>Status:</strong> {data.label}
                  </div>
                  <div>
                    <strong>Type:</strong> {data.type}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setEditOpen(true)}>
            Edit
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-red-500 focus:bg-red-50 dark:text-red-400 dark:focus:bg-red-950 dark:focus:text-neutral-200"
          >
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Status</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-1 ">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Status name
              </label>
              <input
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-800"
                placeholder="Enter status name"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-800"
              >
                <option value="figé">Fixed</option>
                <option value="évolutif">Evolutive</option>
              </select>
            </div>
            <DialogFooter className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete status?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
