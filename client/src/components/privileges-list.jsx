import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash, Power, Image } from "lucide-react";

const actions = [
  {
    name: "Créer un utilisateur",
    icon: Plus,
    description: "Ajouter un nouvel utilisateur au système.",
  },
  {
    name: "Modifier un utilisateur",
    icon: Pencil,
    description: "Modifier les informations d'un utilisateur existant.",
  },
  {
    name: "Supprimer un utilisateur",
    icon: Trash,
    description: "Supprimer définitivement un utilisateur.",
  },
  {
    name: "Désactiver un utilisateur",
    icon: Power,
    description: "Désactiver temporairement un utilisateur.",
  },
  {
    name: "Réactiver un utilisateur",
    icon: Power,
    description: "Réactiver un utilisateur désactivé.",
  },
  {
    name: "Modifier la photo de profil",
    icon: Image,
    description: "Changer l'image de profil d'un utilisateur.",
  },
];

export default function PrivilegesList() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
        Actions Disponibles
      </h1>
      <div className="grid gap-4">
        {actions.map((action, index) => (
          <Card
            key={index}
            className="flex items-center p-4 shadow-md hover:shadow-lg transition"
          >
            <action.icon className="w-6 h-6 text-blue-500 mr-4" />
            <CardContent>
              <h2 className="text-lg font-semibold">{action.name}</h2>
              <p className="text-sm text-gray-600">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
