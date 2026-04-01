"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../../../redux/features/courses/courseSlice";
import CoursesCard from "./CoursesCard";
import CoursesModal from "./CoursesModal";

const CoursesSection = () => {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleOpen = (item) => {
    setSelectedCourse(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCourse(null);
  };

  if (loading) {
    return <p className="text-white/60">Loading courses...</p>;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-[30px] text-center xl:text-left">
        <h3 className="text-4xl font-bold">My Courses</h3>
        <p className="max-w-[700px] text-white/60 mx-auto xl:mx-0">
          Courses, certifications, and extra learning experiences that shaped my
          skills.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses?.map((item) => (
            <CoursesCard
              key={item._id}
              item={item}
              onOpen={() => handleOpen(item)}
            />
          ))}
        </div>
      </div>

      <CoursesModal item={selectedCourse} open={open} onClose={handleClose} />
    </>
  );
};

export default CoursesSection;
