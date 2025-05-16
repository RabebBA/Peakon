import { useState, useEffect } from "react";
import { CardContent, CardTitle } from "@/components/ui/card";
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
import { Mail, Phone, Hash, Pencil } from "lucide-react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { privateFetch } from "../../../utils/fetch";
import { useAccessData } from "@/components/role/projectData-fetch";
import { RoleMultiSelect } from "../workflow/role-multi-select";

export default function UserProfile({ open, onClose, userId }) {
  const id = userId;
  const [user, setUser] = useState({});
  const { availableRoles, availablePrivileges } = useAccessData("global");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [isRPDrawerOpen, setIsRPDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await privateFetch.get(`/users/${id}`);
        const userData = response.data.data;

        const rolesIds =
          Array.isArray(userData.role) && userData.role.length > 0
            ? typeof userData.role[0] === "object"
              ? userData.role.map((r) => r._id)
              : userData.role
            : [];

        setUser({
          ...userData,
          role: rolesIds,
        });
      } catch (err) {
        console.log(
          "Erreur lors de la récupération des données utilisateur:",
          err
        );
      }
    };

    if (id) fetchUser();
  }, [id]);

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

  const handleEditClick = (field) => {
    setFieldToEdit(field);
    if (
      field === "phone" ||
      field === "serial number" ||
      field === "email" ||
      field === "firstname" ||
      field === "job"
    ) {
      setIsDrawerOpen(true);
    } else setIsRPDrawerOpen(true);
  };

  const handleSaveChanges = async () => {
    try {
      const fieldValue = user[fieldToEdit];
      const updatedUser = { [fieldToEdit]: fieldValue };
      const response = await privateFetch.put(`/users/${id}`, updatedUser);

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
    setIsDialogOpen(false);
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
    <Dialog
      open={open}
      onOpenChange={onClose}
      className="bg-transparent max-w-3xl max-h-80"
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Modify user information</DialogDescription>
        </DialogHeader>
        <CardContent className="overflow-auto max-h-[70vh] px-4">
          <div className="flex flex-col items-center text-center p-4 pb-10 ">
            <div className="relative">
              <Avatar className="w-20 h-20 rounded-full border-4 border-white shadow-lg">
                <AvatarImage
                  src={`${user.photo}` || "/avatar.png"}
                  alt={`${user.firstname} ${user.lastname}`}
                />
                <AvatarFallback>
                  {user.firstname?.charAt(0) || ""}
                  {user.lastname?.charAt(0) || ""}
                </AvatarFallback>
              </Avatar>
              {user.isConnected && (
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
              )}
            </div>

            <HoverCard
              openDelay={0}
              closeDelay={0}
              className="transition-all duration-300"
            >
              <HoverCardTrigger>
                <CardTitle
                  className="mt-0 text-2xl font-semibold cursor-pointer"
                  onClick={() => handleEditClick("firstname")}
                >
                  {user.firstname + " " + user.lastname}
                </CardTitle>
              </HoverCardTrigger>
              <HoverCardContent
                side="top"
                align="end"
                sideOffset={8}
                className="px-4 py-2 text-sm rounded-md w-fit border  "
              >
                Edit username
              </HoverCardContent>
            </HoverCard>
            <HoverCard
              openDelay={0}
              closeDelay={0}
              className="transition-all duration-300"
            >
              <HoverCardTrigger>
                <Badge
                  variant="secondary"
                  className="mt-2 text-white bg-gray-800 cursor-pointer hover:bg-gray-700"
                  onClick={() => handleEditClick("job")}
                >
                  {user.job}
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent
                side="top"
                align="end"
                sideOffset={8}
                className="px-4 py-2 text-sm rounded-md w-fit border  "
              >
                Edit user Job
              </HoverCardContent>
            </HoverCard>

            <HoverCard
              openDelay={0}
              closeDelay={0}
              className="transition-all duration-300"
            >
              <HoverCardTrigger>
                <span
                  onClick={() =>
                    (window.location.href = `mailto:${user.email}`)
                  }
                  className=" cursor-pointer hover:text-blue-700"
                >
                  {user.email}
                </span>
              </HoverCardTrigger>
              <HoverCardContent
                side="top"
                align="end"
                sideOffset={8}
                className="px-4 py-2 text-sm rounded-md w-fit border  "
              >
                {"Send an email to " + user.firstname}
              </HoverCardContent>
            </HoverCard>
          </div>
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
              <Pencil className="cursor-pointer h-4 w-4" />
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
              <Pencil className="cursor-pointer h-4 w-4" />
            </div>
            <Separator />
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleEditClick("serial number")}
            >
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Serial Number</span>
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  <span>{user.matricule}</span>
                </div>
              </div>
              <Pencil className="cursor-pointer h-4 w-4" />
            </div>
            <Separator />
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleEditClick("role")}
            >
              <div className="flex flex-col gap-2 pb-4">
                <span className="font-semibold">Roles</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.roleId && user.roleId.length > 0 ? (
                    user.roleId.map((roleId) => {
                      const role = availableRoles?.find(
                        (r) => r._id === roleId
                      );
                      if (!role) return null;

                      return (
                        <Badge
                          key={roleId}
                          className={`${getRandomPastelColor()}  text-neutral-700  `}
                        >
                          {role.title}
                        </Badge>
                      );
                    })
                  ) : (
                    <span className="text-sm text-gray-500">
                      Aucun rôle attribué
                    </span>
                  )}
                </div>
              </div>
              <Pencil className="cursor-pointer h-4 w-4" />
            </div>
          </div>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" className="w-full ">
                Account Ownership and Control
              </Button>
            </DrawerTrigger>
            <DrawerContent className="p-6 rounded-3xl shadow-lg w-[90%] max-w-md mx-auto">
              <h2 className="text-xl font-bold mb-4 text-center">
                Deactivating The Account
              </h2>
              <p className="text-sm mb-4">
                As an admin, you have the ability to temporarily deactivate user
                accounts. Please choose the appropriate action.
              </p>

              <div className="space-y-4">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => openDialog("delete")}
                >
                  Deactivate Account
                </Button>
              </div>
            </DrawerContent>
          </Drawer>
        </CardContent>

        {/* ShadCN Dialog for Deactivation or Deletion */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full hidden">
              Trigger Dialog (hidden, manually controlled)
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deactivate Account</DialogTitle>
            </DialogHeader>
            <p className="text-sm mb-4">
              Are you sure you want to deactivate this account?
            </p>
            <DialogFooter>
              <DialogClose>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={handleConfirmAction}
                className="w-full"
              >
                Deactivate
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
        {/*Drawer pour role*/}
        <Drawer open={isRPDrawerOpen} onOpenChange={setIsRPDrawerOpen}>
          <DrawerContent className="p-6 rounded-3xl shadow-lg w-[90%] max-w-md mx-auto">
            <DrawerTitle className="text-xl font-bold mb-4 text-center">
              Update Roles
            </DrawerTitle>
            <DrawerDescription className="text-sm mb-4 text-center">
              Add or remove user's roles.
            </DrawerDescription>

            {/* RoleMultiSelect */}
            <RoleMultiSelect
              value={user.role || []} // tableau d'id de rôles
              onChange={async (newRoles) => {
                setUser((prev) => ({ ...prev, role: newRoles }));
                await updateUserRolesPrivileges("role", newRoles);
              }}
              options={availableRoles}
              availablePrivileges={availablePrivileges}
              placeholder="Select roles"
            />

            <Button
              className="mt-4 w-full"
              onClick={() => setIsRPDrawerOpen(false)}
            >
              Close
            </Button>
          </DrawerContent>
        </Drawer>

        <DialogFooter className="mt-4 w-full px-4">
          <DialogClose>
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" className="w-full sm:w-auto">
            Finish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
