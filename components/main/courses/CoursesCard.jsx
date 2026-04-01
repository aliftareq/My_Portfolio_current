"use client";

const formatCourseMeta = (completionDate, duration) => {
  const parts = [];

  if (completionDate) {
    parts.push(
      new Date(completionDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      })
    );
  }

  if (duration) {
    parts.push(duration);
  }

  return parts.join(" • ");
};

const CoursesCard = ({ item, onOpen }) => {
  return (
    <div
      onClick={onOpen}
      className="group w-full rounded-[20px] border border-white/10 bg-[#232329] p-5 cursor-pointer hover:border-accent transition-all duration-300 flex flex-col justify-between"
    >
      <div className="flex flex-col gap-4">
        {/* Provider */}
        <p className="text-accent text-sm font-medium break-words">
          {item?.provider || "Course Provider"}
        </p>

        {/* Content */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold leading-snug break-words">
            {item?.title || "Course Title"}
          </h3>

          <p className="text-lg md:text-xl text-white/90 mt-3 leading-snug break-words">
            {item?.platform || item?.provider || "Platform"}
          </p>

          <p className="text-white/60 text-base mt-3 break-words">
            {formatCourseMeta(item?.completionDate, item?.duration) || "Course Info"}
          </p>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        className="mt-5 w-full rounded-[14px] border border-accent px-4 py-3 text-lg font-medium text-accent transition hover:bg-accent hover:text-primary"
      >
        View Details
      </button>
    </div>
  );
};

export default CoursesCard;