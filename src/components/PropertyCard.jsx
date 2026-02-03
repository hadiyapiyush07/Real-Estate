import { motion } from "framer-motion";

const PropertyCard = ({ img, price, location }) => {
  return (
    <motion.div
      className="card"
      whileHover={{ y: -10, scale: 1.02 }}
    >
      <img src={img} alt="land" />
      <h3>{location}</h3>
      <p>₹ {price}</p>
      <button>Buy Now</button>
      <button className="outline">Meet Broker</button>
    </motion.div>
  );
};

export default PropertyCard;
