"use client";

import { X, MapPin, CalendarDays, GraduationCap, School } from "lucide-react";

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

const formatDateRange = (startDate, endDate, currentlyStudying) => {
  if (!startDate) return "Duration not available";

  const start = formatDate(startDate);
  const end = currentlyStudying || !endDate ? "Present" : formatDate(endDate);

  return `${start} - ${end}`;
};

const EducationModal = ({ item, open, onClose }) => {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-white/10 bg-[#18181b] text-left">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#18181b] px-6 md:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-start gap-5 w-full text-left">
            {/* Institution Logo */}
            <div className="shrink-0">
              {item?.institutionLogo ? (
                <img
                  src={item.institutionLogo}
                  alt={item?.institutionName || "Institution logo"}
                  className="h-20 w-20 rounded-2xl object-cover border border-white/10 bg-white/5"
                />
              ) : (
                <div className="h-20 w-20 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                  <School className="text-white/60" size={32} />
                </div>
              )}
            </div>

            {/* Main Info */}
            <div className="flex-1 text-left">
              <p className="text-accent text-base md:text-lg font-medium">
                {item?.degree || "Degree"}
              </p>

              <h2 className="text-2xl md:text-4xl xl:text-5xl font-bold mt-2 break-words text-left">
                {item?.institutionName || "Institution Name"}
              </h2>

              <p className="text-lg md:text-xl text-white/70 mt-2 break-words text-left">
                {item?.fieldOfStudy || "Field of Study"}
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
                  <span>
                    {formatDateRange(
                      item?.startDate,
                      item?.endDate,
                      item?.currentlyStudying,
                    )}
                  </span>
                </div>

                {item?.currentlyStudying && (
                  <div className="flex items-center gap-2">
                    <GraduationCap size={18} />
                    <span>Currently studying here</span>
                  </div>
                )}

                {item?.grade && (
                  <div className="flex items-center gap-2">
                    <span className="text-white/50">Grade:</span>
                    <span>{item.grade}</span>
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

          {item?.honors?.length > 0 && (
            <div className="text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-left">
                Honors
              </h3>
              <ul className="space-y-3 list-disc pl-6 text-white/70 text-lg md:text-xl leading-[1.8] text-left">
                {item.honors.map((honor, index) => (
                  <li key={index}>{honor}</li>
                ))}
              </ul>
            </div>
          )}

          {item?.relevantCoursework?.length > 0 && (
            <div className="text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-left">
                Relevant Coursework
              </h3>
              <ul className="space-y-3 list-disc pl-6 text-white/70 text-lg md:text-xl leading-[1.8] text-left">
                {item.relevantCoursework.map((course, index) => (
                  <li key={index}>{course}</li>
                ))}
              </ul>
            </div>
          )}

          {item?.projects?.length > 0 && (
            <div className="text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-left">
                Projects
              </h3>
              <div className="space-y-5">
                {item.projects.map((project, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left"
                  >
                    <h4 className="text-lg md:text-xl font-semibold text-white mb-2 text-left">
                      {project?.title || "Untitled Project"}
                    </h4>
                    {project?.description && (
                      <p className="text-white/70 text-base md:text-lg leading-[1.8] text-left">
                        {project.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationModal;
