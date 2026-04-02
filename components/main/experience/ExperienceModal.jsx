"use client";

import { X, MapPin, CalendarDays, Building2, Briefcase } from "lucide-react";

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const ExperienceModal = ({ item, open, onClose }) => {
  if (!open || !item) return null;

  const durationText = `${formatDate(item?.startDate)} - ${
    item?.currentlyWorking ? "Present" : formatDate(item?.endDate) || "Present"
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-white/10 bg-[#18181b] text-left">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#18181b] px-6 md:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-start gap-5 w-full text-left">
            {/* Company Logo */}
            <div className="shrink-0">
              {item?.companyLogo ? (
                <img
                  src={item.companyLogo}
                  alt={item?.companyName || "Company logo"}
                  className="h-20 w-20 rounded-2xl object-cover border border-white/10 bg-white/5"
                />
              ) : (
                <div className="h-20 w-20 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                  <Building2 className="text-white/60" size={32} />
                </div>
              )}
            </div>

            {/* Main Info */}
            <div className="flex-1 text-left">
              <p className="text-accent text-base md:text-lg font-medium">
                {item?.employmentType || "Experience"}
              </p>

              <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold mt-2 text-left">
                {item?.jobTitle || "-"}
              </h2>

              <p className="text-xl md:text-2xl text-white/90 mt-3 text-left">
                {item?.companyName || "-"}
              </p>

              <div className="mt-5 flex flex-col gap-3 text-white/60 text-base md:text-lg text-left">
                {item?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{item.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <CalendarDays size={18} />
                  <span>{durationText}</span>
                </div>
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

        {/* Body */}
        <div className="px-6 md:px-8 py-8 md:py-10 space-y-10 text-left">
          {item?.description && (
            <div className="text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-left">
                Description
              </h3>
              <p className="text-white/70 text-lg md:text-xl leading-[1.9] text-left">
                {item.description}
              </p>
            </div>
          )}

          {item?.responsibilities?.length > 0 && (
            <div className="text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-left">
                Responsibilities
              </h3>
              <ul className="space-y-3 list-disc pl-6 text-white/70 text-lg md:text-xl leading-[1.8] text-left">
                {item.responsibilities.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>
            </div>
          )}

          {item?.achievements?.length > 0 && (
            <div className="text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-left">
                Achievements
              </h3>
              <ul className="space-y-3 list-disc pl-6 text-white/70 text-lg md:text-xl leading-[1.8] text-left">
                {item.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}

          {item?.technologies?.length > 0 && (
            <div className="text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-left">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-3">
                {item.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm md:text-base text-white/80"
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
