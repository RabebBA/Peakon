import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { X, PlusCircle, Mail, Phone, Hash, ChevronRight } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { privateFetch } from "../../utils/fetch";
import { z } from "zod";

export default function UserProfile() {
  const { id } = useParams(); // Récupérer l'ID utilisateur depuis l'URL
  const [user, setUser] = useState({
    _id: "u001",
    firstname: "Nora",
    lastname: "Khelifi",
    email: "nora.khelifi@example.com",
    photo:
      "https://www.perfocal.com/blog/content/images/2021/01/Perfocal_17-11-2019_TYWFAQ_100_standard-3.jpg",
    phone: "0612345678",
    matricule: "NK-245",
    job: "Product Manager",
    role: ["Admin", "Manager"],
    privilege: ["Read Users", "Create project", "Create Role"],
    isConnected: true,
    isActivate: true,
  });

  /*useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await privateFetch.get(`/users/${id}`);

        setUser((prevUser) => ({
          ...prevUser,
          ...response.data.data,
        }));
      } catch (err) {
        console.log(
          "Erreur lors de la récupération des données utilisateur:",
          err
        );
      }
    };

    fetchUser();
  }, [id]);*/

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [isRPDrawerOpen, setIsRPDrawerOpen] = useState(false);
  const [selectedField, setSelectedField] = useState("role");
  const [newValue, setNewValue] = useState("");

  const allRoles = ["Admin", "User", "Editor", "Manager"];
  const allPrivileges = ["Read", "Write", "Execute", "Delete"];

  const updateUserRolesPrivileges = async (field, values) => {
    try {
      const response = await privateFetch.put(`/users/${id}`, {
        [field]: values,
      });
      if (response.status === 200) {
        console.log("Mise à jour réussie :", response.data);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des rôles/privilèges :",
        error
      );
    }
  };

  const handleAdd = () => {
    if (!newValue) return;
    const updatedValues = [...user[selectedField], newValue];

    setUser((prev) => ({
      ...prev,
      [selectedField]: updatedValues,
    }));

    updateUserRolesPrivileges(selectedField, updatedValues);
    setNewValue("");
  };

  const handleRemove = (field, value) => {
    const updatedValues = user[field].filter((item) => item !== value);

    setUser((prev) => ({
      ...prev,
      [field]: updatedValues,
    }));

    updateUserRolesPrivileges(field, updatedValues);
  };

  const handleEditClick = (field) => {
    setFieldToEdit(field);
    if (
      field === "phone" ||
      field === "matricule" ||
      field === "email" ||
      field === "firstname" ||
      field === "job"
    ) {
      setIsDrawerOpen(true);
    } else setIsRPDrawerOpen(true);
  };

  // Ton schéma de validation
  const UserSchema = z.object({
    firstname: z.string().min(1, "Le prénom est requis"),
    lastname: z.string().min(1, "Le nom est requis"),
    matricule: z.string().min(1, "Le matricule est requis"),
    job: z
      .string()
      .max(500, "La description du poste ne doit pas dépasser 500 caractères"),
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    role: z.array(z.string()).default(["USER"]),
    privilege: z.array(z.string()).default([]),
    photo: z.string().optional(),
    phone: z.string().regex(/^\d{8,15}$/, "Numéro de téléphone invalide"), // Accepte entre 10 et 15 chiffres
    isActive: z.boolean().default(true),
  });

  // Validation de chaque champ modifié
  const handleSaveChanges = async () => {
    try {
      // Valider le champ modifié avec `zod`
      const fieldValue = user[fieldToEdit];
      const fieldSchema = UserSchema.shape[fieldToEdit]; // Obtenir le schéma pour ce champ

      if (fieldSchema) {
        const result = fieldSchema.safeParse(fieldValue); // Valider la valeur du champ

        if (!result.success) {
          console.log(result.error.errors); // Afficher les erreurs de validation
          return; // Ne pas envoyer la requête si validation échoue
        }
      }

      // Si la validation passe, envoyer la requête PUT
      const updatedUser = { [fieldToEdit]: fieldValue };

      const response = await privateFetch.put(`/users/${id}`, updatedUser);

      console.log("Réponse API :", response.data);

      if (response.status === 200) {
        setUser((prevUser) => ({
          ...prevUser,
          ...updatedUser,
        }));

        setIsDrawerOpen(false);
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    }
  };

  const openDialog = (action) => {
    setActionType(action);
    setIsDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (actionType === "deactivate") {
      // Handle deactivate action
      setIsDialogOpen(false);
      // Deactivate logic
    } else if (actionType === "delete") {
      // Handle delete action
      setIsDialogOpen(false);
      // Delete logic
    }
  };

  const pastelColors = [
    "bg-pink-200",
    "bg-purple-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-teal-200",
    "bg-indigo-200",
    "bg-red-200",
  ];

  const getRandomPastelColor = () => {
    const randomIndex = Math.floor(Math.random() * pastelColors.length);
    return pastelColors[randomIndex];
  };

  return (
    <div className="flex w-full flex-col gap-4 px-4 py-8">
      <Card className="w-full p-6 shadow-xl rounded-3xl">
        <CardHeader className="flex flex-col items-center text-center p-6 rounded-t-2xl">
          <div className="relative">
            <Avatar className="w-28 h-28 rounded-full border-4 border-white shadow-lg">
              <AvatarImage
                src={`${user.photo}` || "/avatar.png"} // ✅ Correction de l'URL de l'image
                alt={`${user.firstname} ${user.lastname}`}
              />
              <AvatarFallback>
                {user.firstname.charAt(0)}
                {user.lastname.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {user.isConnected && (
              <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          <CardTitle
            className="mt-4 text-2xl font-semibold cursor-pointer"
            onClick={() => handleEditClick("firstname")}
          >
            {user.firstname + " " + user.lastname}
          </CardTitle>
          <Badge
            variant="secondary"
            className="mt-2 text-white bg-gray-800 cursor-pointer"
            onClick={() => handleEditClick("job")}
          >
            {user.job}
          </Badge>
          <HoverCard>
            <HoverCardTrigger>
              <span
                onClick={() => (window.location.href = `mailto:${user.email}`)}
                className=" cursor-pointer hover:text-blue-700"
              >
                {user.email}
              </span>
            </HoverCardTrigger>
            <HoverCardContent className="px-4 py-2 text-sm w-full rounded-md">
              {"Send an email to " + user.firstname}
            </HoverCardContent>
          </HoverCard>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center space-y-6">
          <div className="w-full text-left space-y-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleEditClick("email")}
            >
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Email</span>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <span>{user.email}</span>
                </div>
              </div>
              <ChevronRight className="cursor-pointer" />
            </div>
            <Separator />
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleEditClick("phone")}
            >
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Phone</span>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>{user.phone}</span>
                </div>
              </div>
              <ChevronRight className="cursor-pointer" />
            </div>
            <Separator />
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleEditClick("matricule")}
            >
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Serial Number</span>
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  <span>{user.matricule}</span>
                </div>
              </div>
              <ChevronRight className="cursor-pointer" />
            </div>
            <Separator />
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleEditClick("role")}
            >
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Roles</span>
                <div className="flex items-center gap-2">
                  {/* Vérifier si user.role est un tableau et ensuite afficher les badges */}
                  {Array.isArray(user.role) ? (
                    user.role.map((role, index) => (
                      <Badge
                        key={index}
                        className={`${getRandomPastelColor()} text-blue-950 hover:text-white`}
                      >
                        {role}
                      </Badge>
                    ))
                  ) : (
                    <Badge className={`${getRandomPastelColor()} text-white `}>
                      {user.role}
                    </Badge>
                  )}
                </div>
              </div>
              <ChevronRight className="cursor-pointer" />
            </div>
            <Separator />
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleEditClick("privilege")}
            >
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Privileges</span>
                <div className="flex items-center gap-2">
                  {Array.isArray(user.privilege) ? (
                    user.privilege.map((priv, index) => (
                      <Badge
                        key={index}
                        className={`${getRandomPastelColor()} text-blue-950 hover:text-white`}
                      >
                        {priv}
                      </Badge>
                    ))
                  ) : (
                    <Badge className={`${getRandomPastelColor()} text-white`}>
                      {user.privilege}
                    </Badge>
                  )}
                </div>
              </div>
              <ChevronRight className="cursor-pointer" />
            </div>
          </div>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" className="w-full">
                Account Ownership and Control
              </Button>
            </DrawerTrigger>
            <DrawerContent className="p-6 rounded-3xl shadow-lg w-[90%] max-w-md mx-auto">
              <h2 className="text-xl font-bold mb-4 text-center">
                Deactivating or Deleting The Account
              </h2>
              <p className="text-sm mb-4">
                As an admin, you have the ability to temporarily deactivate or
                permanently delete user accounts. Please choose the appropriate
                action.
              </p>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => openDialog("deactivate")}
                >
                  Deactivate Account
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => openDialog("delete")}
                >
                  Delete Account
                </Button>
              </div>
            </DrawerContent>
          </Drawer>
        </CardContent>
      </Card>

      {/* ShadCN Dialog for Deactivation or Deletion */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full hidden">
            Trigger Dialog (hidden, manually controlled)
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "deactivate"
                ? "Deactivate Account"
                : "Delete Account"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm mb-4">
            {actionType === "deactivate"
              ? "Are you sure you want to deactivate this account?"
              : "Are you sure you want to permanently delete this account?"}
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmAction}
              className="w-full"
            >
              {actionType === "deactivate" ? "Deactivate" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Drawer for field editing */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full hidden">
            Trigger Drawer (hidden, manually controlled)
          </Button>
        </DrawerTrigger>

        <DrawerContent className="p-6 rounded-3xl shadow-lg  w-[90%] max-w-md mx-auto">
          <DrawerTitle className="text-xl font-bold mb-4 text-center">
            Edit {fieldToEdit.charAt(0).toUpperCase() + fieldToEdit.slice(1)}
          </DrawerTitle>
          <DrawerDescription className=" text-sm mb-4">
            You can update the {fieldToEdit}.
          </DrawerDescription>
          <div className="space-y-4">
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={user[fieldToEdit]}
              onChange={(e) =>
                setUser({ ...user, [fieldToEdit]: e.target.value })
              }
            />
            <Button
              type="submit"
              className="w-full"
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
      {/*Drawer pour privilege et role*/}
      <Drawer open={isRPDrawerOpen} onOpenChange={setIsRPDrawerOpen}>
        <DrawerContent className="p-6 rounded-3xl shadow-lg w-[90%] max-w-md mx-auto">
          <DrawerTitle className="text-xl font-bold mb-4 text-center">
            Update {selectedField === "role" ? "Roles" : "Privileges"}
          </DrawerTitle>
          <DrawerDescription className="text-sm mb-4 text-center">
            Add or remove
            {selectedField === "role" ? "roles" : "privileges"}
            user.
          </DrawerDescription>

          <div className="flex gap-2 mb-4">
            <Button
              variant={selectedField === "role" ? "default" : "outline"}
              onClick={() => setSelectedField("role")}
            >
              Roles
            </Button>
            <Button
              variant={selectedField === "privilege" ? "default" : "outline"}
              onClick={() => setSelectedField("privilege")}
            >
              Privileges
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {user[selectedField]?.map((item, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-2"
              >
                {item}
                <X
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => handleRemove(selectedField, item)}
                />
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Select onValueChange={(value) => setNewValue(value)}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={`Ajouter un ${selectedField}`} />
              </SelectTrigger>
              <SelectContent>
                {(selectedField === "role" ? allRoles : allPrivileges)
                  .filter((item) => !user[selectedField]?.includes(item))
                  .map((item, index) => (
                    <SelectItem key={index} value={item}>
                      {item}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Button onClick={handleAdd}>
              <PlusCircle className="w-5 h-5" />
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
