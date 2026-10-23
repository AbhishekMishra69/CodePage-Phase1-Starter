import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-box">

        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <motion.div
          className="loading-logo"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span>&gt;_</span> CodePage
        </motion.div>

        <motion.div
          className="loading-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
          }}
        >
          Loading...
        </motion.div>

      </div>
    </div>
  );
}