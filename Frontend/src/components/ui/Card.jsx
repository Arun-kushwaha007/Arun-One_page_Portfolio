import { motion } from 'framer-motion';

export const Card = ({ children, className = "", ...props }) => {
  return (
    <motion.div
      className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
