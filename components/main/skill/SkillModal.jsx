"use client";

import { X, Star, FolderKanban, TrendingUp, Clock3 } from "lucide-react";

const SkillModal = ({ item, open, onClose }) => {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-white/10 bg-[#18181b] text-left">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#18181b] px-6 md:px-8 py-6 md:py-8">
          <div className="flex items-start gap-5 w-full text-left">
            <div className="shrink-0">
              {item?.icon ? (
                <img
                  src={item.icon}
                  alt={item?.name || "Skill icon"}
                  className="h-20 w-20 rounded-2xl object-cover border border-white/10 bg-white/5"
                />
              ) : (
                <div className="h-20 w-20 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/50 text-sm">
                  No Icon
                </div>
              )}
            </div>

            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-accent text-base md:text-lg font-medium">
                  {item.category}
                </p>

                {item?.isFeatured && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs text-accent">
                    <Star size={12} />
                    Featured
                  </span>
                )}
              </div>

              <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold mt-2 break-words">
                {item?.name || "Unnamed Skill"}
              </h2>

              <div className="mt-5 flex flex-col gap-3 text-white/60 text-base md:text-lg">
                {item?.proficiency && (
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} />
                    <span>Proficiency: {item.proficiency}</span>
                  </div>
                )}

                {item?.experience && (
                  <div className="flex items-center gap-2">
                    <Clock3 size={18} />
                    <span>Experience: {item.experience}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="shrink-0 rounded-[18px] border border-white/10 px-4 md:px-5 py-3 text-base md:text-lg text-white/80 hover:border-accent hover:text-accent transition flex items-center gap-2"
          >
            <X size={20} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillModal;
