import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  MarkerType,
  ReactFlowProvider,
  ConnectionMode,
} from "reactflow";
import "reactflow/dist/style.css";

import { CustomNode } from "./custom-node";
import { CustomEdge } from "./custom-edge";
import AddStatusButton from "./add-node-button";
import { toast } from "sonner";
import { useMachine } from "@xstate/react";
import { createMachine } from "xstate";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Route } from "lucide-react";
import { privateFetch } from "../../../utils/fetch"; // assure-toi que c’est ton instance Axios sécurisée

// Machine par défaut pour garantir l'appel du hook
const dummyMachine = createMachine({
  id: "dummy",
  initial: "idle",
  states: { idle: {} },
});

const initialNodes = [];
const initialEdges = [];

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedRoles, setSelectedRoles] = useState([]);

  // Empêche plusieurs statuts "initial" ou "final"
  const existingSpecialNodes = useMemo(
    () =>
      nodes
        .filter(
          (n) => n.data?.special === "initial" || n.data?.special === "final"
        )
        .map((n) => n.data.special),
    [nodes]
  );

  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);
  const edgeTypes = useMemo(() => ({ customEdge: CustomEdge }), []);

  // Recherche les statuts spéciaux
  const initialNode = useMemo(
    () => nodes.find((n) => n.data?.special === "initial"),
    [nodes]
  );
  const finalNode = useMemo(
    () => nodes.find((n) => n.data?.special === "final"),
    [nodes]
  );
  const hasInitial = !!initialNode;
  const hasFinal = !!finalNode;

  // Génère la config XState seulement si initial ET final existent
  const xstateConfig = useMemo(() => {
    if (!hasInitial || !hasFinal) return null;
    return generateXStateConfig(nodes, edges);
  }, [nodes, edges, hasInitial, hasFinal]);

  // Crée la machine ou dummy
  const workflowMachine = useMemo(
    () => (xstateConfig ? createMachine(xstateConfig) : dummyMachine),
    [xstateConfig]
  );

  // Toujours appeler le hook (jamais conditionnel)
  const [state, send] = useMachine(workflowMachine, { devTools: true });

  // Ajout d'un statut
  const handleAddStatus = useCallback(
    (nodeData) => {
      const { label, type, special } = nodeData;
      const id = crypto.randomUUID();
      setNodes((nds) => [
        ...nds,
        {
          id,
          type: "customNode",
          position: { x: Math.random() * 400, y: Math.random() * 400 },
          data: { label, type, special },
        },
      ]);
    },
    [setNodes]
  );

  // Mise à jour/suppression nodes et edges
  const updateNode = useCallback(
    (id, newData) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...(node.data ?? {}), ...newData } }
            : node
        )
      );
    },
    [setNodes]
  );

  const deleteNode = useCallback(
    (id) => {
      setNodes((nds) => nds.filter((node) => node.id !== id));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== id && edge.target !== id)
      );
    },
    [setNodes, setEdges]
  );

  const updateEdge = useCallback(
    (id, newData) => {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === id
            ? { ...edge, data: { ...(edge.data ?? {}), ...newData } }
            : edge
        )
      );
    },
    [setEdges]
  );

  const deleteEdge = useCallback(
    (id) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== id));
    },
    [setEdges]
  );

  // Connexion entre nodes (validation logique métier)
  const onConnect = useCallback(
    (params) => {
      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);
      if (!sourceNode || !targetNode) return;

      const typeSource = sourceNode.data?.type;
      const typeTarget = targetNode.data?.type;
      if (typeSource === "evolutif" && typeTarget === "evolutif") {
        toast.error("Cannot connect two evolving statuses.");
        return;
      }

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "customEdge",
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: "#404040", strokeWidth: 2 },
            animated: false,
          },
          eds
        )
      );
    },
    [setEdges, nodes]
  );

  // Génération de la config XState
  function generateXStateConfig(nodes, edges) {
    const initialNode = nodes.find((n) => n.data?.special === "initial");
    const finalNode = nodes.find((n) => n.data?.special === "final");
    if (!initialNode) throw new Error("No initial state found");
    if (!finalNode) throw new Error("No final state found");

    const idToLabel = nodes.reduce((acc, node) => {
      if (node.data?.label) {
        acc[node.id] = node.data.label;
      } else {
        console.warn("Node missing label", node);
      }
      return acc;
    }, {});

    const states = {};
    nodes.forEach((node) => {
      if (!node.data?.label) return;
      const nodeLabel = node.data.label;
      const nodeType = node.data.type;
      const outgoingEdges = edges.filter((e) => e.source === node.id);
      const on = {};

      outgoingEdges.forEach((edge) => {
        const targetLabel = idToLabel[edge.target];
        if (!targetLabel) {
          console.warn("Edge target not found for edge", edge);
          return;
        }
        const eventName =
          edge.data?.label || edge.label || `transition_${edge.id}`;
        on[eventName] = {
          target: targetLabel,
          roles: edge.data?.roles || [],
          notifications: edge.data?.notifications || [],
          conditions:
            edge.data?.formFields?.map((field) => ({
              field: field.label || field.name || "unknown",
              type: field.type || "text",
              options: field.options || [],
              isRequired: field.isRequired,
            })) || [],
        };
      });

      states[nodeLabel] = {
        type: nodeType,
        on,
      };
    });

    return {
      id: "workflow",
      initial: initialNode.data.label,
      final: finalNode.data.label,
      states,
    };
  }

  // Vérifie la connexion initial → final
  function isInitialConnectedToFinal(nodes, edges) {
    const initialNode = nodes.find((n) => n.data?.special === "initial");
    const finalNode = nodes.find((n) => n.data?.special === "final");
    if (!initialNode || !finalNode) return false;

    const visited = new Set();
    const queue = [initialNode.id];

    while (queue.length > 0) {
      const current = queue.shift();
      if (current === finalNode.id) return true;
      visited.add(current);

      edges
        .filter((e) => e.source === current)
        .forEach((e) => {
          if (!visited.has(e.target)) queue.push(e.target);
        });
    }
    return false;
  }

  const handleSaveChanges = () => {
    // Remplacez par votre logique de sauvegarde réelle
    toast.success("Workflow saved!");
  };

  const handleExport = async () => {
    try {
      if (!isInitialConnectedToFinal(nodes, edges)) {
        toast.error("Connect the initial state to the final state.");
        return;
      }

      // 1. Génère la liste unique de tous les rôles utilisés dans les transitions
      const allRoles = edges
        .flatMap((edge) => edge.data?.roles || [])
        .filter(Boolean); // retire les undefined

      const uniqueRoles = [...new Set(allRoles)];

      if (uniqueRoles.length === 0) {
        toast.error("Aucun rôle n'a été sélectionné dans les transitions.");
        return;
      }

      // 2. Prépare le reste du payload comme avant
      const statuses = nodes.map((node) => ({
        status: node.data.label,
        special:
          node.data.special === "initial"
            ? "Initial"
            : node.data.special === "final"
            ? "Final"
            : undefined,
        isScalable: node.data.type === "evolutif",
      }));

      const transitions = edges.map((edge) => {
        const targetNode = nodes.find((n) => n.id === edge.target);
        return {
          targetStatus: targetNode?.data.label,
          allowedRoles: edge.data?.roles || [],
          notifRoles: edge.data?.notifications || [],
          conditions: {
            requiredFields: (edge.data?.formFields || []).map((f) => ({
              field: f.label,
              type: f.type || "text",
              options: f.options || [],
              isRequired: f.isRequired,
            })),
            validationSchema: edge.data?.validationSchema || {},
          },
        };
      });

      const payload = {
        name: prompt("Name of the template:") || `Template ${Date.now()}`,
        statuses,
        transitions,
        roles: uniqueRoles,
      };

      await privateFetch.post("/template", payload);
      toast.success("Template créé avec succès !");
    } catch (e) {
      console.error(e);
      toast.error(
        e.response?.data?.message ||
          e.message ||
          "Une erreur est survenue lors de la création du template."
      );
    }
  };

  // --- Rendu ---
  return (
    <div className="flex-1 mt-4 overflow-hidden ">
      <ReactFlowProvider>
        <section className=" h-screen rounded-xl border border-blue-200 dark:border-blue-600 bg-blue-50/60 dark:bg-blue-900/40 shadow-md p-6 mb-2 flex flex-col">
          <div className="h-full w-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* Icône optionnelle */}
                <svg
                  className="w-6 h-6 text-blue-900 dark:text-blue-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <Route />
                </svg>
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-200">
                  Workflow Builder
                </h3>
                <Badge className="bg-blue-200 text-blue-800 ml-2">
                  {nodes.length} nodes
                </Badge>
              </div>
              <div className="flex gap-2">
                <AddStatusButton
                  existingSpecialNodes={existingSpecialNodes}
                  onCreate={handleAddStatus}
                />
                <Button
                  onClick={handleSaveChanges}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium shadow hover:from-blue-600 hover:to-purple-600"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="text-blue-700 border-blue-400 hover:bg-blue-100"
                >
                  Export workflow
                </Button>
              </div>
            </div>

            {/* Message d'alerte UX */}
            {hasInitial && !hasFinal && (
              <div className="p-2 my-2 bg-yellow-100 text-yellow-800 rounded border border-yellow-300">
                Ajoutez un statut final pour pouvoir simuler le workflow.
              </div>
            )}

            {/* Affichage XState */}
            {workflowMachine.id !== "dummy" && state && (
              <div>
                <div className="p-2 border-b flex gap-4 items-center bg-gray-50">
                  {state.nextEvents && state.nextEvents.length > 0 && (
                    <span>
                      <b>Transitions possibles :</b>{" "}
                      {state.nextEvents.map((evt) => (
                        <button
                          key={evt}
                          onClick={() => send(evt)}
                          className="mx-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          {evt}
                        </button>
                      ))}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Graph */}
            <div className="flex-1">
              <ReactFlow
                nodes={nodes.map((node) => ({
                  ...node,
                  data: {
                    ...(node.data ?? {}),
                    updateNode,
                    deleteNode,
                  },
                }))}
                edges={edges.map((edge) => ({
                  ...edge,
                  data: {
                    ...(edge.data ?? {}),
                    updateEdge,
                    deleteEdge,
                  },
                }))}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                connectionMode={ConnectionMode.Loose}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                panOnDrag={true}
              >
                <svg>
                  <defs>
                    <marker
                      id="arrow-large"
                      markerWidth="20"
                      markerHeight="20"
                      refX="10"
                      refY="5"
                      orient="auto"
                      markerUnits="userSpaceOnUse"
                    >
                      <path d="M0,0 L10,5 L0,10 Z" fill="gray" />
                    </marker>
                  </defs>
                </svg>
                <Background />
                <Controls />
                <MiniMap
                  nodeColor={(n) =>
                    n.data?.special === "initial"
                      ? "#34d399"
                      : n.data?.special === "final"
                      ? "#f87171"
                      : "#60a5fa"
                  }
                />
              </ReactFlow>
            </div>
          </div>
        </section>
      </ReactFlowProvider>
    </div>
  );
}
