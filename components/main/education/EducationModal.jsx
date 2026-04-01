"use client";

import { X } from "lucide-react";

const formatDateRange = (startDate, endDate, currentlyStudying) => {
  const format = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });

  if (!startDate) return "Duration not available";

  const start = format(startDate);
  const end = currentlyStudying || !endDate ? "Present" : format(endDate);

  return `${start} - ${end}`;
};

const EducationModal = ({ item, open, onClose }) => {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-white/10 bg-[#18181b]">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#18181b] px-8 py-8">
          <div>
            <p className="text-accent text-lg font-medium">Education</p>

            <h2 className="text-3xl xl:text-5xl font-bold mt-2 break-words">
              {item?.institutionName || "Institution Name"}
            </h2>

            <p className="text-2xl text-white/90 mt-3 break-words">
              {item?.degree || "Degree"}
            </p>

            <p className="text-xl text-white/70 mt-2 break-words">
              {item?.fieldOfStudy || "Field of Study"}
            </p>

            <p className="text-white/60 text-xl mt-5 break-words">
              {item?.location || "Location"} •{" "}
              {formatDateRange(
                item?.startDate,
                item?.endDate,
                item?.currentlyStudying
              )}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-[18px] border border-white/10 px-6 py-4 text-xl text-white/80 hover:border-accent hover:text-accent transition shrink-0"
          >
            <X size={22} />
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

          {item?.grade && (
            <div>
              <h3 className="text-3xl font-bold mb-5">Grade</h3>
              <p className="text-white/70 text-xl leading-[1.9]">
                {item.grade}
              </p>
            </div>
          )}

          {item?.honors?.length > 0 && (
            <div>
              <h3 className="text-3xl font-bold mb-5">Honors</h3>
              <ul className="space-y-4 list-disc pl-6 text-white/70 text-xl leading-[1.8]">
                {item.honors.map((honor, index) => (
                  <li key={index}>{honor}</li>
                ))}
              </ul>
            </div>
          )}

          {item?.relevantCoursework?.length > 0 && (
            <div>
              <h3 className="text-3xl font-bold mb-5">Relevant Coursework</h3>
              <ul className="space-y-4 list-disc pl-6 text-white/70 text-xl leading-[1.8]">
                {item.relevantCoursework.map((course, index) => (
                  <li key={index}>{course}</li>
                ))}
              </ul>
            </div>
          )}

          {item?.projects?.length > 0 && (
            <div>
              <h3 className="text-3xl font-bold mb-5">Projects</h3>
              <div className="space-y-6">
                {item.projects.map((project, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <h4 className="text-xl font-semibold text-white mb-2">
                      {project?.title}
                    </h4>
                    {project?.description && (
                      <p className="text-white/70 text-lg leading-[1.8]">
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