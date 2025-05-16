import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  Controls,
  Background,
  MiniMap,
} from "react-flow-renderer";
import { useMachine } from "@xstate/react";
import { createMachine } from "xstate";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { CirclePlus, Trash2 } from "lucide-react";
import CustomNode from "./costum-node";
import RoleSelectorPopover from "@/components/items/role-selector-popover"; // adapte le chemin si nécessaire

// Statuts prédéfinis pour les états (nodes)
const predefinedStatuses = [
  "En attente",
  "En dev",
  "En attente de build",
  "En test",
  "En review",
  "Terminé",
];

// Rôles prédéfinis pour les événements (edges)
const predefinedRoles = ["Admin", "PO", "Tester", "Developer", "Tech lead"];

const initialNodes = [];

const initialEdges = [];

const WorkflowEditorWithXState = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeCount, setNodeCount] = useState(initialNodes.length + 1);
  const [popoverState, setPopoverState] = useState(null);
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [connectParams, setConnectParams] = useState(null);
  const [initialStatus, setInitialStatus] = useState(null);

  const triggerRef = useRef(null);

  const nodeTypes = useMemo(
    () => ({
      customNode: CustomNode,
    }),
    []
  );

  const generateMachine = () => {
    const states = {};
    const idToLabel = {};

    nodes.forEach((node) => {
      const label = node.data.label;
      idToLabel[node.id] = label;
      states[label] = { on: {} };
    });

    edges.forEach(({ source, target, label }) => {
      const sourceLabel = idToLabel[source];
      const targetLabel = idToLabel[target];
      if (label && sourceLabel && targetLabel) {
        states[sourceLabel].on[label] = targetLabel;
      }
    });

    return createMachine({
      id: "workflow",
      initial: initialStatus || Object.keys(states)[0], // fallback sécurité
      states,
    });
  };

  const [machine, setMachine] = useState(() => generateMachine());
  const [state, send] = useMachine(machine);

  useEffect(() => {
    setMachine(generateMachine());
  }, [nodes, edges]);

  const onConnect = useCallback((params) => {
    setConnectParams(params);
  }, []);

  const handleSelectRole = (role) => {
    if (connectParams && role) {
      setEdges((eds) =>
        addEdge(
          {
            ...connectParams,
            label: role,
            type: "smoothstep",
            style: {
              stroke: "#404040",
              strokeWidth: 1,
              strokeDasharray: "0", //bordure continue
            },
            animated: false,
          },
          eds
        )
      );
      setConnectParams(null);
    }
  };

  const handleAddNode = () => {
    const statusInput = prompt(
      `Choisir un statut parmi :\n${predefinedStatuses.join(", ")}`
    );

    if (!statusInput) return;

    const selected = predefinedStatuses.find(
      (status) => status.toLowerCase() === statusInput.toLowerCase()
    );

    if (!selected) {
      alert("Statut non valide.");
      return;
    }

    const id = `${nodeCount}`;
    const newNode = {
      id,
      type: "customNode",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: selected },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeCount((count) => count + 1);

    // ⚡️ Si aucun statut initial défini, on l'assigne
    if (!initialStatus) {
      setInitialStatus(selected);
    }
  };

  const handleContextMenu = (event, node) => {
    event.preventDefault();
    const bounds = document
      .querySelector(".react-flow__renderer")
      ?.getBoundingClientRect();
    if (bounds) {
      const screenX = bounds.left + node.position.x;
      const screenY = bounds.top + node.position.y;
      setPopoverState({ ...node, screenX, screenY });
      setNewNodeLabel(node.data.label);
    }
  };

  const handleRenameNode = () => {
    if (popoverState) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === popoverState.id ? { ...n, data: { label: newNodeLabel } } : n
        )
      );
      setPopoverState(null);
    }
  };

  const handleDeleteNode = () => {
    if (popoverState) {
      setNodes((nds) => nds.filter((n) => n.id !== popoverState.id));
      setEdges((eds) =>
        eds.filter(
          (e) => e.source !== popoverState.id && e.target !== popoverState.id
        )
      );
      setPopoverState(null);
    }
  };

  useEffect(() => {
    if (popoverState && triggerRef.current) {
      triggerRef.current.style.position = "absolute";
      triggerRef.current.style.left = `${popoverState.screenX}px`;
      triggerRef.current.style.top = `${popoverState.screenY - 10}px`;
    }
  }, [popoverState]);

  const currentState = state.value;

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-full w-full p-2 ">
        <div className="mb-4 space-x-4 items-start pt-4">
          <button
            onClick={() => console.log(machine.config)}
            className="px-4 py-2 bg-pink-400 text-white rounded hover:bg-pink-700"
          >
            Console XState
          </button>
        </div>

        <div className="flex-grow border-2 dark:border-[#3b82f6] border-[#96baf4] border-opacity-70 rounded self-center w-full">
          <ReactFlow
            className="bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-neutral-800 dark:to-neutral-700 transition"
            nodeTypes={nodeTypes}
            nodes={nodes.map((node) => ({
              ...node,
              style: {
                borderColor:
                  node.data.label === currentState
                    ? "#3b82f6"
                    : node.data.label === initialStatus
                    ? "#a855f7"
                    : "#d1d5db",
                borderWidth:
                  node.data.label === currentState ||
                  node.data.label === initialStatus
                    ? 2
                    : 1,
                borderRadius: 8,
                backgroundColor:
                  node.data.label === currentState
                    ? "#e0f2fe"
                    : node.data.label === initialStatus
                    ? "#f3e8ff"
                    : "#fff",
                color: "#111827",
                padding: 6,
                fontSize: 14,
              },
            }))}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeContextMenu={handleContextMenu}
            fitView
            onClick={(e) => e.stopPropagation()} //
          >
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                zIndex: 50,
              }}
            >
              <div className="absolute top-6 left-6 z-50">
                <button
                  onClick={handleAddNode}
                  className=" rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-all"
                  title="Ajouter un état"
                >
                  <CirclePlus className="w-10 h-10" />
                </button>
              </div>
            </div>
            <Controls className="!bg-white !border !rounded-md !shadow" />
            <MiniMap
              nodeColor={(node) =>
                node.data.label === currentState
                  ? "#3b82f6"
                  : node.data.label === initialStatus
                  ? "#a855f7"
                  : "#9ca3af"
              }
              nodeStrokeWidth={2}
              zoomable
              pannable
            />
            <Background gap={16} />
          </ReactFlow>

          {connectParams && (
            <RoleSelectorPopover
              roles={predefinedRoles}
              onCancel={() => setConnectParams(null)}
              onConfirm={(selectedRoles) => {
                selectedRoles.forEach((role) => {
                  setEdges((eds) =>
                    addEdge(
                      {
                        ...connectParams,
                        label: role,
                        type: "smoothstep",
                        style: {
                          stroke: "#404040",
                          strokeWidth: 1,
                          strokeDasharray: "0",
                        },
                        animated: false,
                      },
                      eds
                    )
                  );
                });
                setConnectParams(null);
              }}
            />
          )}

          {popoverState && (
            <Popover
              open={true}
              onOpenChange={(open) => !open && setPopoverState(null)}
            >
              <PopoverTrigger asChild>
                <div ref={triggerRef}>
                  <div className="w-2 h-2" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-4 bg-white border border-slate-200 rounded-lg shadow-xl z-50">
                <h4 className="text-sm font-semibold mb-2">Modifier l’état</h4>
                <Input
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  placeholder="Nom de l'état"
                  className="mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleRenameNode}
                    className="flex-1 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Renommer
                  </button>
                  <button
                    onClick={handleDeleteNode}
                    className="flex-1 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Supprimer
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default WorkflowEditorWithXState;
