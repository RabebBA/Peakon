import { Handle, Position } from "react-flow-renderer";

const CustomNode = ({ data }) => {
  return (
    <div className="px-4 py-2  ">
      {/* Handle à gauche (entrée) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-500"
      />

      <div className="text-sm font-medium text-gray-800">{data.label}</div>

      {/* Handle à droite (sortie) */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  );
};

export default CustomNode;
