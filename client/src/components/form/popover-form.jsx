import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { FormPicker } from "./picker-form";
import { Button } from "@/components/ui/button";
import { FormInput } from "./input-form";
import { FormSubmit } from "./submit-form";

export const FormPopover = ({
  children,
  side = "bottom",
  align,
  sideOffset = 0,
}) => {
  // États pour gérer l'envoi du formulaire, les erreurs et le chargement
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (formData) => {
    const title = formData.get("title");
    const image = formData.get("image");

    setLoading(true); // Démarrer le chargement

    try {
      // Appel API pour créer le tableau
      const response = await createBoard({ title, image });
      toast.success("Board created");
      const params = new URLSearchParams({ title, image });
      window.location.href = `/project/create?${params.toString()}`;
    } catch (err) {
      setError(err.message);
      toast.error("Error: " + err.message);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-80 pt-3"
        side={side}
        sideOffset={sideOffset}
      >
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Create Board
        </div>
        <PopoverClose asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <FormPicker id="image" errors={error} />
            <FormInput
              id="title"
              label="Board title"
              type="text"
              errors={error}
            />
          </div>
          <FormSubmit className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};

// Exemple de fonction createBoard (à adapter pour ton API)
const createBoard = async ({ title, image }) => {
  const response = await fetch("/api/create-board", {
    method: "POST",
    body: JSON.stringify({ title, image }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to create board");
  }

  return response.json();
};
