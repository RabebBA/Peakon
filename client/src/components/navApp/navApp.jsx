import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import AccountDropdownMenu from "./dropdown-menu-profil";

export const NavApp = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState({
    isAuthenticated: false,
    name: "",
    photo: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        // Vérification que userData est une chaîne de caractères avant d'essayer de la parser
        if (typeof userData === "string") {
          console.log(userData);
          const parsedData = userData;
          setUser({
            isAuthenticated: true,
            ...parsedData,
          });
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Logo />

        {user.isAuthenticated ? (
          <div className="relative flex items-center space-x-6">
            <button
              className="flex items-center text-gray-600 hover:text-black"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {menuOpen && (
              <div className="absolute top-10 right-12 bg-white border shadow-md rounded-md p-2 w-40 z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                  onClick={() => {
                    navigate("/boards");
                    setMenuOpen(false);
                  }}
                >
                  Boards
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                  onClick={() => {
                    navigate("/projects");
                    setMenuOpen(false);
                  }}
                >
                  Projects
                </button>
              </div>
            )}

            <div className="cursor-pointer">
              <Avatar>
                <AvatarImage
                  src={user.photo || "/default-avatar.png"}
                  alt={user.name}
                />
                <AvatarFallback>{user.name}</AvatarFallback>
                <AccountDropdownMenu />
              </Avatar>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
