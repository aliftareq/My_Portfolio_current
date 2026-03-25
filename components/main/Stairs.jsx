import { animate, easeInOut, motion } from "framer-motion";

const stairAnimation = {
  initial: {
    top: "0%",
  },
  animate: {
    top: "100%",
  },
  exit: {
    top: ["100%", "0%"],
  },
};

//calculate the reverse index for staggered delay
const reverseIndex = (index) => {
  const totalSteps = 6;
  return totalSteps - index - 1;
};

const Stairs = () => {
  return (
    <>
      {/* render 6 motion div, each representing a step of the stairs.
    Each div will have the same animation defined by the stair animation object. 
    The delay for each div is calculated dynamically based on its reverse index,
    creating a staggerd effect with decreasing delay for each subSequent step.
  */}
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          variants={stairAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            delay: reverseIndex(index) * 0.1,
            ease: "easeInOut",
          }}
          className="h-full w-full bg-white relative"
        />
      ))}
    </>
  );
};

export default Stairs;
