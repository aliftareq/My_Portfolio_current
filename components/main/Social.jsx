import Link from "next/link";
import { FaGithub, FaLinkedinIn, FaYoutube, FaTwitter } from "react-icons/fa";

const socials = [
  { icon: <FaGithub />, path: "https://github.com/aliftareq" },
  {
    icon: <FaLinkedinIn />,
    path: "https://www.linkedin.com/in/alif-tareq-9048091bb/",
  },
  { icon: <FaYoutube />, path: "https://www.youtube.com/@alifibnnoor1891" },
  { icon: <FaTwitter />, path: "https://x.com/aliftareq" },
];

const Social = ({ containerStyles, iconStyles }) => {
  return (
    <div className={containerStyles}>
      {socials.map((item, index) => {
        return (
          <Link
            href={item.path}
            key={index}
            className={iconStyles}
            target="_blank"
          >
            {item.icon}
          </Link>
        );
      })}
    </div>
  );
};

export default Social;
