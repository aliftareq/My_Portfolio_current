"use client";

import { X } from "lucide-react";

const ExperienceModal = ({ item, open, onClose }) => {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-white/10 bg-[#18181b]">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#18181b] px-8 py-8">
          <div>
            <p className="text-accent text-lg font-medium">
              {item?.employmentType || "Experience"}
            </p>

            <h2 className="text-3xl xl:text-5xl font-bold mt-2">
              {item?.company}
            </h2>

            <p className="text-2xl text-white/90 mt-3">
              {item?.position}
            </p>

            <p className="text-white/60 text-xl mt-5">
              {item?.location} {item?.duration ? `• ${item.duration}` : ""}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-[18px] border border-white/10 px-6 py-4 text-xl text-white/80 hover:border-accent hover:text-accent transition flex items-center gap-2"
          >
            <X size={20} />
            Close
          </button>
        </div>

        <div className="px-8 py-10 space-y-10">
          {item?.description && (
            <div>
              <h3 className="text-3xl font-bold mb-5">Description</h3>
              <p className="text-white/70 text-xl leading-[1.9]">
                {item.description}
              </p>
            </div>
          )}

          {item?.responsibilities?.length > 0 && (
            <div>
              <h3 className="text-3xl font-bold mb-5">Responsibilities</h3>
              <ul className="space-y-4 list-disc pl-6 text-white/70 text-xl leading-[1.8]">
                {item.responsibilities.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>
            </div>
          )}

          {item?.technologies?.length > 0 && (
            <div>
              <h3 className="text-3xl font-bold mb-5">Technologies</h3>
              <div className="flex flex-wrap gap-3">
                {item.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-lg text-white/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceModal;