"use client";

import { unsplash } from "@/lib/unsplash";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { defaultImages } from "@/components/constants/images";
import FormErrors from "./errors-form";

export const FormPicker = ({ id, errors }) => {
  const [images, setImages] = useState(defaultImages);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        });

        if (result && result.response) {
          setImages(result.response);
        } else {
          console.error("Failed to get images from Unsplash");
        }
      } catch (error) {
        console.error("Unsplash fetch error", error);
        setImages(defaultImages);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => (
          <label
            key={image.id}
            className={cn(
              "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
              isLoading && "opacity-50 hover:opacity-50 cursor-auto"
            )}
          >
            <input
              type="radio"
              name={id}
              className="hidden"
              checked={selectedImageId === image.id}
              value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
              onChange={() => setSelectedImageId(image.id)}
            />
            <img
              src={image.urls.thumb}
              alt="Unsplash image"
              className="object-cover w-full h-full rounded-sm"
            />
            {selectedImageId === image.id && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
            >
              {image.user.name}
            </a>
          </label>
        ))}
      </div>
      <FormErrors id="image" errors={errors} />
    </div>
  );
};
