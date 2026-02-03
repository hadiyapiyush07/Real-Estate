import { motion } from "framer-motion";

const Sell = () => {
  return (
    <motion.form
      className="form"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <h2>Sell Your Land</h2>
      <input placeholder="Location" />
      <input placeholder="Expected Price" />
      <input type="file" />
      <button>Submit Property</button>
    </motion.form>
  );
};

export default Sell;
