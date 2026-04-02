"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../../redux/features/profile/profileSlice";

const AboutSection = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (loading) {
    return <p className="text-white/60">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  return (
    <div className="flex flex-col gap-[30px] text-center xl:text-left">
      <h3 className="text-4xl font-bold">About me</h3>

      <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">
        {profile?.description || "No description available"}
      </p>

      <ul className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 max-w-[620px] mx-auto xl:mx-0">
        <li className="flex items-center gap-4">
          <span className="text-white/60">Name</span>
          <span className="text-xl">{profile?.name || "-"}</span>
        </li>

        <li className="flex items-center gap-4">
          <span className="text-white/60">Phone</span>
          <span className="text-xl">{profile?.phone || "-"}</span>
        </li>

        <li className="flex items-center gap-4">
          <span className="text-white/60">Experience</span>
          <span className="text-xl">
            {profile?.experience ? `${profile.experience} Years` : "-"}
          </span>
        </li>

        <li className="flex items-center gap-4">
          <span className="text-white/60">Skype</span>
          <span className="text-xl">{profile?.skype || "-"}</span>
        </li>

        <li className="flex items-center gap-4">
          <span className="text-white/60">Nationality</span>
          <span className="text-xl">{profile?.nationality || "-"}</span>
        </li>

        <li className="flex items-center gap-4">
          <span className="text-white/60">Email</span>
          <span className="text-xl">{profile?.email || "-"}</span>
        </li>

        <li className="flex items-center gap-4">
          <span className="text-white/60">Freelance</span>
          <span className="text-xl">{profile?.freelance || "-"}</span>
        </li>

        <li className="flex items-center gap-4">
          <span className="text-white/60">Languages</span>
          <span className="text-xl">
            {profile?.languages?.length ? profile.languages.join(", ") : "-"}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default AboutSection;
