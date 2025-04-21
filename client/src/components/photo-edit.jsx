import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage"; // Fonction utilitaire pour extraire l'image recadrée
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { privateFetch } from "../../utils/fetch";

export function PhotoEdit({ open, onOpenChange, setUserPhoto }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  if (typeof setUserPhoto !== "function") {
    console.error("setUserPhoto is not a function.");
    return null; // Évite l'affichage du bouton si la fonction est invalide
  }

  // 📌 Gestion du fichier sélectionné
  const onFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // 📌 Capture de la zone rognée
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // 📌 Sauvegarde de l'image recadrée
  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    try {
      // Générer l'image recadrée
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

      // Convertir en Blob pour l'envoi
      const response = await fetch(croppedImage);
      const blob = await response.blob();

      // Préparer le FormData
      const formData = new FormData();
      formData.append("photo", blob, "profile.jpg");

      // Envoyer la requête PUT
      const res = await privateFetch.put("/users/profile/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      let photo = res.data.data.photo;
      console.log(photo);
      // Mettre à jour l'avatar avec l'URL retournée par l'API
      setUserPhoto(photo);

      // Mise à jour de la photo dans localStorage
      const userData = JSON.parse(localStorage.getItem("user"));
      userData.photo = photo;
      localStorage.setItem("user", JSON.stringify(userData));

      // Fermer la modale
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de l'upload de la photo :", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <h3 className="items-center text-center p-6 space-y-4mt-4 text-2xl font-semibold text-neutral-700 dark:text-white">
              Edit your profil photo
            </h3>
          </DialogTitle>
          <DialogDescription>
            <h1 className="items-center text-center text-neutral-700  dark:text-gray-300">
              Update the user's photo here and click 'Save' to apply changes, or
              'Cancel' to discard.
            </h1>
          </DialogDescription>
        </DialogHeader>

        {/* Sélection du fichier */}
        <Input type="file" accept="image/*" onChange={onFileChange} />

        {/* Aperçu et Cropper */}
        {imageSrc && (
          <div className="relative w-full h-64 bg-gray-200  text-neutral-700 dark:text-gray-300">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1} // Format carré
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}

        {/* Contrôle du zoom */}
        <Slider
          min={1}
          max={3}
          step={0.1}
          value={[zoom]}
          onValueChange={(val) => setZoom(val[0])}
        />

        {/* Boutons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
