import { motion } from 'framer-motion';

export const Section = ({ id, children, className = "" }) => {
  return (
    <section id={id} className={`py-20 px-6 relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {children}
      </motion.div>
    </section>
  );
};
