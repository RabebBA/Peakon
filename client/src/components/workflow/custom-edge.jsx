import { useEffect, useState } from "react";
import { BaseEdge, getSmoothStepPath, useReactFlow } from "reactflow";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RoleMultiSelect } from "./role-multi-select";
import { Badge } from "@/components/ui/badge";
import { FormBuilder } from "./form-builder";
import { Label } from "../ui/label";
import { useAccessData } from "@/components/role/projectData-fetch";

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function CustomEdge({
  id,
  source,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) {
  const [hovered, setHovered] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(!data?.configured);

  const { setEdges, getEdges } = useReactFlow();

  const { availableRoles, availablePrivileges } = useAccessData("project");

  // Récupérer toutes les edges sortantes du même node source (hors celle-ci)
  const edgesFromSameSource = getEdges().filter(
    (e) => e.source === source && e.id !== id
  );

  // On récupère les rôles autorisés verrouillés (depuis une autre edge déjà configurée)
  const lockedRoles =
    edgesFromSameSource.length > 0
      ? edgesFromSameSource[0].data?.roles || []
      : undefined;

  // Initialisation formData : si lockedRoles existe, on force la valeur
  const [formData, setFormData] = useState({
    roles: lockedRoles ?? data?.roles ?? [],
    formFields: data?.formFields ?? [],
    notifications: data?.notifications ?? [],
  });

  // Synchroniser les roles autorisés si lockedRoles changent (ex: nouvelle edge ajoutée)
  useEffect(() => {
    if (lockedRoles && !arraysEqual(formData.roles, lockedRoles)) {
      setFormData((prev) => ({ ...prev, roles: lockedRoles }));
    }
  }, [lockedRoles]);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: sourcePosition || "right",
    targetPosition: targetPosition || "left",
  });

  const handleFormOpenChange = (open) => {
    if (!open && !data?.configured) {
      setEdges((eds) => eds.filter((e) => e.id !== id));
      toast.info("Transition creation canceled");
    }
    setFormOpen(open);
  };

  const onSave = () => {
    if (formData.roles.length === 0) {
      toast.error("Please select at least one role.");
      return;
    }

    // Vérifier que tous les edges sortants ont les mêmes roles autorisés
    const edges = getEdges();
    const edgesFromSameSourceNow = edges.filter((e) => e.source === source);

    // Si roles modifiés, on applique la même valeur à toutes les edges sortantes
    const updatedEdges = edges.map((edge) => {
      if (edge.source === source) {
        return {
          ...edge,
          data: {
            ...edge.data,
            roles: formData.roles,
            // Seulement pour l'edge éditée on met à jour notifications et formFields
            ...(edge.id === id
              ? {
                  notifications: formData.notifications,
                  formFields: formData.formFields,
                  configured: true,
                }
              : {}),
          },
        };
      }
      return edge;
    });

    setEdges(updatedEdges);
    toast.success("Transition successfully configured!");
    setFormOpen(false);
    setEditOpen(false);
  };

  const onDelete = () => {
    const currentEdges = getEdges();
    const deletedEdge = currentEdges.find((e) => e.id === id);
    setEdges((eds) => eds.filter((e) => e.id !== id));

    toast.success("Transition deleted", {
      description: "You can undo it.",
      action: {
        Label: "Undo",
        onClick: () => {
          setEdges((eds) => [...eds, deletedEdge]);
          toast.success("Transition restored");
        },
      },
    });
  };

  if (!edgePath) return null;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd="url(#arrow-large)"
        interactionWidth={50}
      />

      <ContextMenu>
        <ContextMenuTrigger asChild>
          <path
            d={edgePath}
            fill="none"
            stroke="transparent"
            strokeWidth={50}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ cursor: "context-menu" }}
          />
        </ContextMenuTrigger>
        <ContextMenuContent className="text-neutral-800 dark:text-neutral-200">
          <ContextMenuItem onClick={() => setEditOpen(true)}>
            Edit
          </ContextMenuItem>
          <ContextMenuItem
            onClick={onDelete}
            className="text-red-500 focus:bg-red-50 dark:text-red-400 dark:focus:bg-red-950 dark:focus:text-neutral-200"
          >
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {hovered && data?.configured && !editOpen && !formOpen && (
        <foreignObject
          x={labelX - 100}
          y={labelY - 60}
          width={240}
          height={1000}
          style={{ pointerEvents: "none" }}
        >
          <div
            className="z-[1000] relative bg-white border rounded shadow-lg p-3 text-xs text-black space-y-2"
            style={{ pointerEvents: "auto" }}
          >
            {/* Authorized Roles */}
            <div>
              <b>Authorized roles</b> <br />
              <div className="mt-1 flex flex-wrap gap-1">
                {data.roles?.length ? (
                  data.roles.map((roleId, idx) => {
                    const role = availableRoles.find((r) => r._id === roleId);
                    return (
                      <Badge
                        key={idx}
                        className="bg-blue-100 text-blue-800 border border-blue-300 text-[10px]"
                      >
                        {role?.title || roleId}
                      </Badge>
                    );
                  })
                ) : (
                  <span className="text-gray-500">None</span>
                )}
              </div>
            </div>

            {/* Notifications */}
            <div>
              <b>Notifications</b> <br />
              <div className="mt-1 flex flex-wrap gap-1">
                {data.notifications?.length ? (
                  data.notifications.map((notifId, idx) => {
                    const role = availableRoles.find((r) => r._id === notifId);
                    return (
                      <Badge
                        key={idx}
                        className="bg-green-100 text-green-800 border border-green-300 text-[10px]"
                      >
                        {role?.title || notifId}
                      </Badge>
                    );
                  })
                ) : (
                  <span className="text-gray-500">None</span>
                )}
              </div>
            </div>

            {/* Conditions */}
            <div>
              <b>Conditions</b> <br />
              <div className="mt-1 flex flex-wrap gap-1">
                {data.formFields && data.formFields.length > 0 ? (
                  data.formFields.map((field, idx) => (
                    <Badge
                      key={idx}
                      className="bg-purple-100 text-purple-800 border border-purple-300 text-[10px]"
                    >
                      {field.label} ({field.type})
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">No conditions set</span>
                )}
              </div>
            </div>
          </div>
        </foreignObject>
      )}

      {/* Dialog de création */}
      <Dialog open={formOpen} onOpenChange={handleFormOpenChange}>
        <DialogContent
          className="max-h-[80vh] max-w-3xl w-screen overflow-y-auto"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <h2 className="text-2xl font-semibold">Configure transition</h2>
          <Label className="text-sm">
            Authorized roles <span className="text-red-500 mr-1">*</span>
          </Label>
          <div className="mb-4">
            <RoleMultiSelect
              value={formData.roles}
              onChange={(newRoles) =>
                setFormData((prev) => ({ ...prev, roles: newRoles }))
              }
              options={availableRoles}
              availablePrivileges={availablePrivileges}
              placeholder="Select roles..."
            />
          </div>
          <Label className="text-sm">Roles to be notified</Label>
          <div className="mb-4">
            <RoleMultiSelect
              value={formData.notifications}
              onChange={(newNotifs) =>
                setFormData((prev) => ({ ...prev, notifications: newNotifs }))
              }
              options={availableRoles}
              availablePrivileges={availablePrivileges}
              placeholder="Select roles..."
              disabled={edgesFromSameSource.length > 0}
            />
          </div>
          <Label className="text-sm">Conditions</Label>
          <FormBuilder
            fields={formData.formFields}
            onChange={(newFields) =>
              setFormData({ ...formData, formFields: newFields })
            }
          />
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => handleFormOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog d'édition */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          className="max-h-[80vh] max-w-3xl w-screen overflow-y-auto"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <p className="font-semibold text-lg mb-4">Edit transition</p>
          <Label className="text-sm">
            Authorized roles <span className="text-red-500 mr-1">*</span>
          </Label>
          <div className="mb-4">
            <RoleMultiSelect
              value={formData.roles}
              onChange={(newRoles) =>
                setFormData((prev) => ({ ...prev, roles: newRoles }))
              }
              options={availableRoles}
              availablePrivileges={availablePrivileges}
              placeholder="Select roles..."
            />
          </div>
          <Label className="text-sm">
            Roles to be notified{" "}
            {edgesFromSameSource.length > 0 && (
              <span className="text-gray-400 text-xs">
                (Disabled: other edges exist)
              </span>
            )}
          </Label>
          <div className="mb-4">
            <RoleMultiSelect
              value={formData.notifications}
              onChange={(newNotifs) =>
                setFormData((prev) => ({ ...prev, notifications: newNotifs }))
              }
              options={availableRoles}
              availablePrivileges={availablePrivileges}
              placeholder="Select roles..."
              disabled={edgesFromSameSource.length > 0}
            />
          </div>
          <Label className="text-sm">Conditions</Label>
          <FormBuilder
            fields={formData.formFields}
            onChange={(newFields) =>
              setFormData({ ...formData, formFields: newFields })
            }
          />
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
