import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "reactflow";
import { useState } from "react";

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, markerEnd }) => {
  const [showForm, setShowForm] = useState(false);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const handleClick = () => {
    setShowForm(true);
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <button
          onClick={handleClick}
          className="absolute bg-white text-sm border rounded p-1 shadow"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          ✏️
        </button>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
