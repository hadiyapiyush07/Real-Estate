import { motion } from "framer-motion";

const About = () => {
  return (
    <motion.div className="page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1>About Us</h1>
      <p>
        ANAND CORPORATION is a trusted real-estate bridge connecting buyers,
        sellers, and professional brokers with transparency and security.
      </p>
    </motion.div>
  );
};

export default About;
