"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { FaGithub, FaLinkedinIn, FaYoutube, FaTwitter } from "react-icons/fa";

const Social = ({ containerStyles, iconStyles }) => {
  const { profile } = useSelector((state) => state.profile);

  const socials = [
    {
      icon: <FaGithub />,
      path: profile?.socials?.github || profile?.githubUrl,
    },
    {
      icon: <FaLinkedinIn />,
      path: profile?.socials?.linkedin || profile?.linkedinUrl,
    },
    {
      icon: <FaYoutube />,
      path: profile?.socials?.youtube || profile?.youtubeUrl,
    },
    {
      icon: <FaTwitter />,
      path: profile?.socials?.twitter || profile?.twitterUrl,
    },
  ].filter((item) => item.path);

  return (
    <div className={containerStyles}>
      {socials.map((item, index) => (
        <Link
          href={item.path}
          key={index}
          className={iconStyles}
          target="_blank"
        >
          {item.icon}
        </Link>
      ))}
    </div>
  );
};

export default Social;
