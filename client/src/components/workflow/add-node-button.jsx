import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { z } from "zod";

const statusSchema = z.object({
  label: z.string().min(1, "Status name is required"),
  type: z.enum(["evolutif", "figé"]),
  special: z.enum(["initial", "final", "none"]),
});

const getNodeColor = (data) => {
  if (data.special === "initial") return "#bbf7d0"; // vert pastel
  if (data.special === "final") return "#fecaca"; // rouge pastel
  if (data.type === "evolutif") return "#bfdbfe"; // bleu pastel
  if (data.type === "figé") return "#f3f4f6"; // gris clair

  return "#f3f4f6"; // fallback
};

export default function AddStatusButton({ existingSpecialNodes, onCreate }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedSpecial, setSelectedSpecial] = useState("none");
  const [formData, setFormData] = useState({ label: "", type: "evolutif" });

  const reset = () => {
    setPopoverOpen(false);
    setStep(1);
    setFormData({ label: "", type: "evolutif" });
    setSelectedSpecial("none");
  };

  const handleTypeSelect = (type) => {
    setSelectedSpecial(type);
    setStep(2);
  };

  const handleCreate = () => {
    try {
      statusSchema.parse({ ...formData, special: selectedSpecial });

      if (
        selectedSpecial === "initial" &&
        existingSpecialNodes.includes("initial")
      ) {
        toast.error("Initial status already exists");
        return;
      }
      if (
        selectedSpecial === "final" &&
        existingSpecialNodes.includes("final")
      ) {
        toast.error("Final status already exists");
        return;
      }
      const nodeData = {
        label: formData.label,
        type:
          selectedSpecial === "initial" || selectedSpecial === "final"
            ? "figé"
            : formData.type, // Vérifiez que `formData.type` est bien transmis
        special: selectedSpecial,
      };

      onCreate(nodeData);
      toast.success(`${nodeData.label} has been created.`);

      reset();
    } catch (err) {
      toast.error(err.errors[0].message);
    }
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="text-blue-700 border-blue-400 hover:bg-blue-100"
        >
          Add Status
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        {step === 1 ? (
          <div className="flex flex-col gap-4">
            <p className="font-semibold text-lg">Choose Status Type</p>
            <Button
              className="dark:text-white"
              variant="secondary"
              onClick={() => handleTypeSelect("initial")}
            >
              Initial Status
            </Button>
            <Button
              className="dark:text-white"
              variant="secondary"
              onClick={() => handleTypeSelect("final")}
            >
              Final Status
            </Button>
            <Button
              className="dark:text-white"
              variant="secondary"
              onClick={() => handleTypeSelect("none")}
              style={{ backgroundColor: getNodeColor({ type: formData.type }) }}
            >
              Intermediate Status
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="font-semibold text-lg">Fill Status Details</p>
            <input
              type="text"
              placeholder="Status Name"
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
              className="border rounded p-2 dark:text-neutral-800"
            />
            {selectedSpecial === "none" && (
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="border rounded p-2 dark:text-neutral-800"
              >
                <option value="evolutif">Évolutif</option>
                <option value="figé">Fige</option>
              </select>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create</Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
