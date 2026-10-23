import { motion } from 'framer-motion';

const stats = [
  {
    value: '500+',
    label: 'Coding Problems',
  },
  {
    value: '1K+',
    label: 'Active Coders',
  },
  {
    value: '50+',
    label: 'Contests',
  },
  {
    value: '10+',
    label: 'Programming Topics',
  },
];

export function Stats() {
  return (
    <section className="stats-section">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="stat-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.5,
              delay: index * 0.12,
            }}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
          >
            <motion.strong
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.12 + 0.2,
              }}
            >
              {stat.value}
            </motion.strong>

            <span>{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}