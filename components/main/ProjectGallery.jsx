"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export default function ProjectGallery({ title, mainImage, gallery = [] }) {
  const images = useMemo(() => {
    return [mainImage, ...gallery]
      .filter(Boolean)
      .filter((img, index, arr) => arr.indexOf(img) === index);
  }, [mainImage, gallery]);

  const [selectedImage, setSelectedImage] = useState(images[0] || "");

  useEffect(() => {
    if (!images.length) return;

    if (!selectedImage || !images.includes(selectedImage)) {
      setSelectedImage(images[0]);
    }
  }, [images, selectedImage]);

  if (!images.length || !selectedImage) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-white/5">
        <Image
          src={selectedImage}
          alt={title}
          width={1600}
          height={900}
          priority
          className="w-full h-auto block"
        />
      </div>

      {/* Thumbnail list */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, index) => {
          const isActive = selectedImage === img;

          return (
            <button
              key={`${img}-${index}`}
              type="button"
              onClick={() => setSelectedImage(img)}
              className={`relative aspect-[16/10] rounded-xl overflow-hidden border transition-all ${
                isActive
                  ? "border-accent scale-[1.02]"
                  : "border-white/10 hover:border-accent/50"
              }`}
            >
              <Image
                src={img}
                alt={`${title} gallery ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}