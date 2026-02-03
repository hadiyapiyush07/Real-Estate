import PropertyCard from "../components/PropertyCard";
import { motion } from "framer-motion";

const Buy = () => {
  return (
    <motion.div className="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PropertyCard img="https://picsum.photos/300/200" price="45,00,000" location="Pune" />
      <PropertyCard img="https://picsum.photos/301/200" price="60,00,000" location="Mumbai" />
      <PropertyCard img="https://picsum.photos/302/200" price="30,00,000" location="Nagpur" />
    </motion.div>
  );
};

export default Buy;
