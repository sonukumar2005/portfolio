import { motion } from 'framer-motion';

export const Robot: React.FC = () => {
  return (
    <motion.div
      className="robot"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      whileHover={{ y: -5 }}
    >
      {/* Robot character/mascot SVG or image can go here */}
      <div className="robot-placeholder">🤖</div>
    </motion.div>
  );
};
