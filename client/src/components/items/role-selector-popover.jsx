import React, { useState } from "react";

const RoleSelectorPopover = ({ roles, onConfirm, onCancel }) => {
  const [selectedRoles, setSelectedRoles] = useState([]);

  const toggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleConfirm = () => {
    if (selectedRoles.length) {
      onConfirm(selectedRoles);
    }
  };

  return (
    <div className="absolute bottom-4 left-4 p-4 bg-white border rounded shadow-md z-50 w-64 text-neutral-700">
      <h3 className="mb-2 font-semibold text-sm text-gray-800">
        Sélectionnez un ou plusieurs rôles :
      </h3>
      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
        {roles.map((role) => (
          <label key={role} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selectedRoles.includes(role)}
              onChange={() => toggleRole(role)}
            />
            {role}
          </label>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={onCancel}
          className="text-sm text-red-600 underline hover:text-red-800"
        >
          Annuler
        </button>
        <button
          onClick={handleConfirm}
          disabled={selectedRoles.length === 0}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Valider
        </button>
      </div>
    </div>
  );
};

export default RoleSelectorPopover;
