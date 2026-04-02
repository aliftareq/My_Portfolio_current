"use client";

const formatDateRange = (startDate, endDate, currentlyWorking) => {
  const format = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });

  if (!startDate) return "";

  const start = format(startDate);
  const end = currentlyWorking || !endDate ? "Present" : format(endDate);

  return `${start} - ${end}`;
};

const ExperienceCard = ({ item, onOpen }) => {
  return (
    <div
      onClick={onOpen}
      className="group w-full rounded-[20px] border border-white/10 bg-[#232329] p-5 cursor-pointer hover:border-accent transition-all duration-300 flex flex-col justify-between"
    >
      <div className="flex flex-col gap-4">
        {/* Employment Type (like degree in education) */}
        <p className="text-accent text-sm font-medium break-words">
          {item?.employmentType || "Full-time"}
        </p>

        {/* Main Content */}
        <div>
          {/* Company */}
          <h3 className="text-2xl md:text-3xl font-bold leading-snug break-words">
            {item?.companyName || "Company Name"}
          </h3>

          {/* Job Title */}
          <p className="text-lg md:text-xl text-white/90 mt-3 leading-snug break-words">
            {item?.jobTitle || "Job Title"}
          </p>

          {/* Location */}
          <p className="text-white/60 text-base mt-3 break-words">
            {item?.location || "Location"}
          </p>
        </div>

        {/* Duration */}
        <div className="self-center rounded-full border border-white/10 px-4 py-2 text-sm text-white/80">
          {formatDateRange(
            item?.startDate,
            item?.endDate,
            item?.currentlyWorking,
          )}
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

export default ExperienceCard;
