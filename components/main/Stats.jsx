"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CountUp from "react-countup";

import { fetchProjects } from "../../redux/features/project/projectSlice";
import { fetchSkills } from "../../redux/features/skill/skillSlice";
import { fetchGithubCommitCount } from "../../redux/features/profile/profileSlice";

const Stats = () => {
  const dispatch = useDispatch();

  const { profile, githubCommitCount } = useSelector((state) => state.profile);
  const { count: projectCount } = useSelector((state) => state.project);
  const { count: skillCount } = useSelector((state) => state.skills);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchSkills());
    dispatch(fetchGithubCommitCount());
  }, [dispatch]);

  const stats = [
    {
      num: profile?.experience || 0,
      text: "Years of experience",
    },
    {
      num: projectCount || 0,
      text: "Projects Completed",
    },
    {
      num: skillCount || 0,
      text: "Technologies mastered",
    },
    {
      num: githubCommitCount || 0,
      text: "Code commits",
    },
  ];

  return (
    <section className="pt-4 pb-12 xl:pt-0 xl:pb-0">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-[80vw] mx-auto xl:max-w-none">
          {stats.map((item, index) => (
            <div
              className="flex gap-4 items-center justify-center xl:justify-start"
              key={index}
            >
              <CountUp
                end={Number(item.num)}
                duration={2}
                className="text-4xl xl:text-6xl font-extrabold"
              />
              <p
                className={`${
                  item.text.length < 15 ? "max-w-[100px]" : "max-w-[150px]"
                } leading-snug text-white/80`}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
