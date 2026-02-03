import { motion } from "framer-motion";

const BookMeeting = () => {
  return (
    <motion.div className="form" initial={{ y: 80 }} animate={{ y: 0 }}>
      <h2>Book Broker Meeting</h2>
      <input type="date" />
      <input type="time" />
      <button>Confirm Meeting</button>
    </motion.div>
  );
};

export default BookMeeting;
