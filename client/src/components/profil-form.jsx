import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { privateFetch } from "../../utils/fetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PencilIcon,
  Settings,
  Mail,
  Phone,
  Hash,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PhotoEdit } from "./photo-edit";
import { Separator } from "./ui/separator";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./ui/hover-card";

export const ProfilePage = ({ className, ...props }) => {
  const [isPhotoEditOpen, setIsPhotoEditOpen] = useState(false);
  const [user, setUser] = useState({
    isAuthenticated: false,
    _id: "",
    firstname: "",
    lastname: "",
    email: "",
    photo: "",
    matricule: "",
    job: "",
    role: "",
    privilege: "",
  });

  const [userPhoto, setUserPhoto] = useState(""); // ✅ Correctement placé en dehors de useEffect
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shouldUpdate, setShouldUpdate] = useState(false); // Nouvelle variable d'état

  useEffect(() => {
    const fetchUserProfile = async () => {
      const rawToken = localStorage.getItem("token");
      const token = rawToken?.startsWith("Authorization=")
        ? rawToken.split("=")[1]
        : rawToken;

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedData = JSON.parse(userData);
          const photo = parsedData.photo || "/avatar.png";
          console.log(photo);
          setUserPhoto(photo); // ✅ Met à jour userPhoto

          setUser({
            isAuthenticated: true,
            _id: parsedData._id,
            photo: userPhoto,
            ...parsedData,
          });

          await privateFetch.get(`/users/${parsedData._id}/profil`);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate, userPhoto]); // Ajout de userPhoto ici pour ne pas provoquer de boucle infinie

  useEffect(() => {
    if (shouldUpdate) {
      window.location.reload(); // Actualisation de la page
      setShouldUpdate(false); // Réinitialise pour éviter l'actualisation infinie
    }
  }, [shouldUpdate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className={cn("flex flex-col gap-6 px-4 py-8", className)} {...props}>
      <Card className="max-w-7xl    overflow-hidden">
        <CardHeader className="flex flex-col items-center text-center p-6 rounded-t-2xl">
          <Avatar className="w-28 h-28 rounded-full border-4 border-white shadow-lg">
            <AvatarImage
              onClick={() => setIsPhotoEditOpen(true)}
              src={userPhoto || "/avatar.png"} // ✅ Correction de l'URL de l'image
              alt={`${user.firstname} ${user.lastname}`}
              className="cursor-pointer"
            />
            <AvatarFallback>
              {user.firstname[0]}
              {user.lastname[0]}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4 text-2xl font-semibold text-neutral-700 dark:text-gray-300">
            {user.firstname + " " + user.lastname}
          </CardTitle>
          <Badge variant="secondary" className="mt-2 text-white bg-gray-800">
            {user.job}
          </Badge>
          <HoverCard>
            <HoverCardTrigger>
              <span
                onClick={() => (window.location.href = `mailto:${user.email}`)}
                className="text-neutral-700 dark:text-gray-300 cursor-pointer hover:text-blue-700 dark:hover:text-blue-300"
              >
                {`@${user.email}`}
              </span>
            </HoverCardTrigger>
            <HoverCardContent className="px-4 py-2 text-sm w-full bg-white text-black rounded-md">
              {"Email " + user.firstname}
            </HoverCardContent>
          </HoverCard>
        </CardHeader>

        <CardContent className="flex flex-col items-center text-center space-y-6">
          <div className="w-full text-left space-y-4">
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Email</span>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Phone</span>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>{user.phone}</span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Serial Number</span>
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  <span>{user.matricule}</span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Roles</span>
                <div className="flex items-center gap-2">{user.role}</div>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Privileges</span>
                <div className="flex items-center gap-2">{user.privilege}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="outline"
              className="items-center gap-2 px-6 py-2 text-sm rounded-full"
              onClick={() => setIsPhotoEditOpen(true)}
            >
              <PencilIcon size={16} /> Modifier le profil
            </Button>
            <Button
              variant="default"
              className="items-center gap-2 px-6 py-2 text-sm rounded-full"
            >
              <Settings size={16} /> Paramètres
            </Button>
          </div>
        </CardContent>
      </Card>

      {isPhotoEditOpen && (
        <PhotoEdit
          open={isPhotoEditOpen}
          onOpenChange={setIsPhotoEditOpen}
          setUserPhoto={setUserPhoto}
          setShouldUpdate={setShouldUpdate} // Passe la fonction pour déclencher l'actualisation
        />
      )}
    </div>
  );
};
