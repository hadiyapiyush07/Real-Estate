import { motion } from "framer-motion";

const Contact = () => {
  return (
    <motion.form className="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2>Contact Us</h2>
      <input placeholder="Name" />
      <input placeholder="Email" />
      <textarea placeholder="Message"></textarea>
      <button>Send Message</button>
    </motion.form>
  );
};

export default Contact;
