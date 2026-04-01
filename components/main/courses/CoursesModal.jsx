"use client";

import { X } from "lucide-react";

const formatCourseMeta = (completionDate, duration) => {
  const parts = [];

  if (completionDate) {
    parts.push(
      new Date(completionDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      }),
    );
  }

  if (duration) {
    parts.push(duration);
  }

  return parts.join(" • ");
};

const CoursesModal = ({ item, open, onClose }) => {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-white/10 bg-[#18181b]">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#18181b] px-8 py-8">
          <div>
            <p className="text-accent text-lg font-medium break-words">
              {item?.provider || "Course Provider"}
            </p>

            <h2 className="text-3xl xl:text-5xl font-bold mt-2 break-words">
              {item?.title || "Course Title"}
            </h2>

            <p className="text-2xl text-white/90 mt-3 break-words">
              {item?.platform || item?.provider || "Platform"}
            </p>

            <p className="text-white/60 text-xl mt-5 break-words">
              {formatCourseMeta(item?.completionDate, item?.duration) ||
                "Course Info"}
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

          {item?.skills?.length > 0 && (
            <div>
              <h3 className="text-3xl font-bold mb-5">Skills</h3>
              <div className="flex flex-wrap gap-3">
                {item.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-lg text-white/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
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
                    <h4 className="text-xl font-semibold text-white mb-2 break-words">
                      {project?.title}
                    </h4>

                    {project?.description && (
                      <p className="text-white/70 text-lg leading-[1.8]">
                        {project.description}
                      </p>
                    )}

                    {project?.projectLink && (
                      <a
                        href={project.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-accent text-base underline"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(item?.certificate?.name || item?.certificate?.url) && (
            <div>
              <h3 className="text-3xl font-bold mb-5">Certificate</h3>

              {item?.certificate?.name && (
                <p className="text-white/70 text-xl leading-[1.9] mb-3">
                  {item.certificate.name}
                </p>
              )}

              {item?.certificate?.url && (
                <a
                  href={item.certificate.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent text-xl underline"
                >
                  View Certificate
                </a>
              )}
            </div>
          )}

          {item?.courseLink && (
            <div>
              <h3 className="text-3xl font-bold mb-5">Course Link</h3>
              <a
                href={item.courseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent text-xl underline"
              >
                Open Course
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesModal;
