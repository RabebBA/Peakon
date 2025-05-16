import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transitionSchema } from "./zod";

export const TransitionDialog = ({ open, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transitionSchema),
    defaultValues: {
      transitions: [
        {
          targetStatus: "",
          allowedRoles: [],
          notifUsers: [],
          notifRoles: [],
          conditions: {},
        },
      ],
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>Configurer la transition</DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm">Target Status</label>
            <Input {...register("transitions.0.targetStatus")} />
            {errors?.transitions?.[0]?.targetStatus && (
              <p className="text-red-500 text-xs">
                {errors.transitions[0].targetStatus.message}
              </p>
            )}
          </div>

          {/* Ajoute ici d'autres champs si besoin */}

          <Button type="submit">Sauvegarder</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
