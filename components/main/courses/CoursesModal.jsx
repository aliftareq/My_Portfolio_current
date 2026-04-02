"use client";

import { useState } from "react";
import { X, CalendarDays, Clock3, Star, ExternalLink } from "lucide-react";

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

const CoursesModal = ({ item, open, onClose }) => {
  const [isImageOpen, setIsImageOpen] = useState(false);

  if (!open || !item) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-4 backdrop-blur-sm md:py-8">
        <div className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[28px] border border-white/10 bg-[#18181b] text-left">
          {/* Header */}
          <div className="border-b border-white/10 px-5 py-5 md:px-8 md:py-6 lg:h-[50vh] lg:min-h-[320px] lg:max-h-[460px]">
            <div className="flex h-full flex-col">
              {/* Top bar */}
              <div className="mb-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="flex shrink-0 items-center gap-2 rounded-[18px] border border-white/10 px-4 py-2.5 text-sm text-white/80 transition hover:border-accent hover:text-accent md:px-5 md:py-3 md:text-base"
                >
                  <X size={18} />
                  Close
                </button>
              </div>

              {/* Main header content */}
              <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 pb-2 md:pb-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,42%)] lg:gap-6 lg:pb-6">
                {/* Left */}
                <div className="min-h-0 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-accent text-sm font-medium md:text-base">
                      {item?.provider || "Course Provider"}
                    </p>

                    {item?.isFeatured && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] text-accent md:text-xs">
                        <Star size={12} />
                        Featured
                      </span>
                    )}
                  </div>

                  <h2 className="mt-2 max-w-[12ch] break-words text-xl font-bold leading-[0.95] md:text-2xl xl:text-4xl">
                    {item?.title || "Course Title"}
                  </h2>

                  {(item?.platform || item?.provider) && (
                    <p className="mt-3 text-lg text-white/90 md:mt-4 md:text-xl xl:text-2xl">
                      {item?.platform || item?.provider}
                    </p>
                  )}

                  <div className="mt-4 flex flex-col gap-2.5 text-sm text-white/60 md:mt-5 md:gap-3 md:text-base lg:text-lg">
                    {item?.completionDate && (
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        <span>
                          Completed: {formatDate(item.completionDate)}
                        </span>
                      </div>
                    )}

                    {item?.duration && (
                      <div className="flex items-center gap-2">
                        <Clock3 size={16} />
                        <span>Duration: {item.duration}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right image - desktop only */}
                <div className="hidden min-h-0 items-center justify-center lg:flex lg:justify-end">
                  {item?.thumbnail ? (
                    <div className="flex w-full items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setIsImageOpen(true)}
                        className="aspect-[1.4/1] w-[90%] max-w-[360px] cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 bg-[#232329] p-3 transition hover:scale-[1.02]"
                      >
                        <img
                          src={item.thumbnail}
                          alt={item?.title || "Course thumbnail"}
                          className="h-full w-full rounded-xl object-contain"
                        />
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-[200px] w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm text-white/40">
                      No Thumbnail
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-8 px-5 pb-10 pt-6 md:space-y-10 md:px-8 md:pb-14 md:pt-8">
            {/* Mobile image - before description */}
            {item?.thumbnail && (
              <div className="flex justify-center lg:hidden">
                <button
                  type="button"
                  onClick={() => setIsImageOpen(true)}
                  className="w-full max-w-[420px] cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 bg-[#232329] p-2 transition hover:scale-[1.02]"
                >
                  <img
                    src={item.thumbnail}
                    alt={item?.title || "Course thumbnail"}
                    className="h-auto w-full rounded-xl object-contain"
                  />
                </button>
              </div>
            )}

            {item?.description && (
              <div>
                <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl">
                  Description
                </h3>
                <p className="text-base leading-[1.8] text-white/70 md:text-lg xl:text-xl">
                  {item.description}
                </p>
              </div>
            )}

            {item?.skills?.length > 0 && (
              <div>
                <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-3">
                  {item.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 md:text-base"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {item?.projects?.length > 0 && (
              <div>
                <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl">
                  Projects
                </h3>
                <div className="space-y-5">
                  {item.projects.map((project, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <h4 className="mb-2 text-lg font-semibold text-white md:text-xl">
                        {project?.title || "Untitled Project"}
                      </h4>

                      {project?.description && (
                        <p className="text-base leading-[1.8] text-white/70 md:text-lg">
                          {project.description}
                        </p>
                      )}

                      {project?.projectLink && (
                        <a
                          href={project.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-2 text-accent underline"
                        >
                          <ExternalLink size={16} />
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
                <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl">
                  Certificate
                </h3>

                {item?.certificate?.name && (
                  <p className="mb-3 text-base text-white/70 md:text-lg xl:text-xl">
                    {item.certificate.name}
                  </p>
                )}

                {item?.certificate?.url && (
                  <a
                    href={item.certificate.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-accent underline"
                  >
                    <ExternalLink size={16} />
                    View Certificate
                  </a>
                )}
              </div>
            )}

            {item?.courseLink && (
              <div>
                <h3 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl">
                  Course Link
                </h3>
                <a
                  href={item.courseLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent underline"
                >
                  <ExternalLink size={16} />
                  Open Course
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Zoom Popup */}
      {isImageOpen && item?.thumbnail && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 px-4 py-4"
          onClick={() => setIsImageOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsImageOpen(false)}
            className="absolute right-2 top-2 flex items-center gap-2 rounded-[18px] border border-white/10 bg-[#18181b]/80 px-4 py-2.5 text-sm text-white/80 transition hover:border-accent hover:text-accent md:right-6 md:top-6 md:px-5 md:text-base"
          >
            <X size={18} />
            Close
          </button>

          <div
            className="flex max-h-[90vh] max-w-[90vw] items-center justify-center rounded-2xl border border-white/10 bg-[#232329] p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={item.thumbnail}
              alt={item?.title || "Course thumbnail"}
              className="max-h-[85vh] max-w-[85vw] rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CoursesModal;
