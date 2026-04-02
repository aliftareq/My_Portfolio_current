"use client";

const SkillCard = ({ item, onOpen }) => {
  return (
    <div
      onClick={onOpen}
      className="relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 group"
    >
      {/* Image */}
      {item?.icon ? (
        <img
          src={item.icon}
          alt={item?.name || "Skill"}
          className="h-40 w-full object-cover transition duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="h-40 w-full bg-[#232329] flex items-center justify-center text-white/40">
          No Image
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:from-black/80 transition" />

      {/* Centered Name */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h3 className="text-white text-3xl font-medium text-center px-3">
          {item?.name || "Unnamed"}
        </h3>
      </div>
    </div>
  );
};

export default SkillCard;