import React, { useCallback, useState, useRef, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
} from "react-flow-renderer";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

const initialNodes = [
  {
    id: "1",
    type: "default",
    position: { x: 250, y: 0 },
    data: { label: "Draft" },
  },
  {
    id: "2",
    type: "default",
    position: { x: 100, y: 100 },
    data: { label: "Approved" },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", label: "APPROVE", animated: true },
];

const WorkflowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeCount, setNodeCount] = useState(initialNodes.length + 1);
  const [popoverState, setPopoverState] = useState(null);
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const triggerRef = useRef(null);

  const onConnect = useCallback(
    (params) => {
      const label = prompt("Nom de l'événement (ex: APPROVE, REJECT) :");
      if (label) {
        setEdges((eds) => addEdge({ ...params, label, animated: true }, eds));
      }
    },
    [setEdges]
  );

  const handleAddNode = () => {
    const id = `${nodeCount}`;
    const newNode = {
      id,
      type: "default",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `State ${nodeCount}` },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeCount((count) => count + 1);
  };

  const handleContextMenu = (event, node) => {
    event.preventDefault();
    const reactFlowBounds = document
      .querySelector(".react-flow__renderer")
      ?.getBoundingClientRect();

    if (reactFlowBounds) {
      const screenX = reactFlowBounds.left + node.position.x;
      const screenY = reactFlowBounds.top + node.position.y;

      setPopoverState({
        ...node,
        screenX,
        screenY,
      });
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

  const generateXStateCode = () => {
    const states = {};
    const idToLabel = {};

    // Étape 1 : Créer le mapping ID -> Label
    nodes.forEach((node) => {
      idToLabel[node.id] = node.data.label || node.id;
      states[node.data.label] = { on: {} }; // Utilise le label comme nom d'état
    });

    // Étape 2 : Ajouter les transitions
    edges.forEach((edge) => {
      const { source, target, label } = edge;
      const sourceLabel = idToLabel[source];
      const targetLabel = idToLabel[target];
      if (sourceLabel && targetLabel && label) {
        states[sourceLabel].on[label] = targetLabel;
      }
    });

    const xstate = {
      id: "workflow",
      initial: nodes[0]?.data?.label || nodes[0]?.id || "initial",
      states,
    };

    console.log(JSON.stringify(xstate, null, 2));
  };

  useEffect(() => {
    if (popoverState && triggerRef.current) {
      triggerRef.current.style.position = "absolute";
      triggerRef.current.style.left = `${popoverState.screenX}px`;
      triggerRef.current.style.top = `${popoverState.screenY - 10}px`; // Juste au-dessus du nœud
    }
  }, [popoverState]);

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen w-full p-4">
        <div className="mb-4 space-x-4">
          <button
            onClick={handleAddNode}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Ajouter un état
          </button>
          <button
            onClick={generateXStateCode}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Générer le code XState
          </button>
        </div>

        <div className="flex-grow border rounded relative">
          <ReactFlow
            className="react-flow__renderer"
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            onNodeContextMenu={handleContextMenu}
          >
            <Controls />
            <MiniMap />
            <Background gap={16} />
          </ReactFlow>

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
              <PopoverContent className="p-4 bg-white shadow-md rounded relative z-50">
                <div className="absolute top-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-b-white"></div>
                <div className="mb-2">
                  <label>Renommer l'état :</label>
                  <Input
                    value={newNodeLabel}
                    onChange={(e) => setNewNodeLabel(e.target.value)}
                    placeholder="Nom de l'état"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleRenameNode}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Renommer
                  </button>
                  <button
                    onClick={handleDeleteNode}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Supprimer
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

export default WorkflowEditor;
