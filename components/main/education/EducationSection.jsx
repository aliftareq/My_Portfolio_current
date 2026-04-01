"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEducations } from "../../../redux/features/education/educationSlice";
import EducationCard from "./EducationCard";
import EducationModal from "./EducationModal";

const EducationSection = () => {
  const dispatch = useDispatch();
  const { educations, loading, error } = useSelector((state) => state.education);

  const [selectedEducation, setSelectedEducation] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEducations());
  }, [dispatch]);

  const handleOpen = (item) => {
    setSelectedEducation(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEducation(null);
  };

  if (loading) {
    return <p className="text-white/60">Loading education...</p>;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-[30px] text-center xl:text-left">
        <h3 className="text-4xl font-bold">My Education</h3>
        <p className="max-w-[700px] text-white/60 mx-auto xl:mx-0">
          My academic background, learning journey, and qualifications.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {educations?.map((item) => (
            <EducationCard
              key={item._id}
              item={item}
              onOpen={() => handleOpen(item)}
            />
          ))}
        </div>
      </div>

      <EducationModal
        item={selectedEducation}
        open={open}
        onClose={handleClose}
      />
    </>
  );
};

export default EducationSection;