import axios from "axios";

const publicFetch = axios.create({
  baseURL: "http://127.0.0.1:3001",
  withCredentials: true,
});

const privateFetch = axios.create({
  baseURL: "http://127.0.0.1:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajout d'un interceptor pour ajouter le token d'authentification aux requêtes
privateFetch.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse pour gérer les erreurs liées au token expiré
privateFetch.interceptors.response.use(
  (response) => response, // Si la réponse est OK, on la retourne telle quelle
  async (error) => {
    // Si une erreur se produit
    if (error.response) {
      // Si l'erreur est liée à un token expiré (statut 401)
      if (error.response.status === 401) {
        console.warn("Token expiré ou invalide. Déconnexion...");

        // Suppression du token et des données utilisateur du localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Appeler l'API de logout pour garantir une déconnexion côté serveur
        try {
          await axios.post(
            "http://127.0.0.1:3001/logout",
            {},
            { withCredentials: true }
          );
        } catch (logoutError) {
          console.error(
            "Erreur lors de la déconnexion côté serveur :",
            logoutError
          );
        }

        // Rediriger l'utilisateur vers la page de connexion
        window.location.href = "/login"; // Redirige vers la page de connexion
      }

      // Vous pouvez ajouter d'autres conditions pour gérer des erreurs spécifiques
      if (error.response.status === 500) {
        console.error(
          "Erreur interne du serveur. Veuillez réessayer plus tard."
        );
      }
    } else if (error.request) {
      // Si la requête a été faite mais qu'il n'y a pas de réponse
      console.error(
        "Aucune réponse du serveur. Veuillez vérifier votre connexion."
      );
    } else {
      // Si une autre erreur se produit (par exemple, erreur dans la configuration de la requête)
      console.error(
        "Erreur lors de la configuration de la requête:",
        error.message
      );
    }

    // Renvoyer l'erreur pour qu'elle puisse être gérée plus loin si nécessaire
    return Promise.reject(error);
  }
);

export { privateFetch, publicFetch };
