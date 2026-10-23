import { motion } from 'framer-motion';

const topics = [
  {
    icon: '▣',
    name: 'Arrays',
    problems: '80+ Problems',
  },
  {
    icon: 'Aa',
    name: 'Strings',
    problems: '60+ Problems',
  },
  {
    icon: '↔',
    name: 'Linked List',
    problems: '35+ Problems',
  },
  {
    icon: '▤',
    name: 'Stack & Queue',
    problems: '40+ Problems',
  },
  {
    icon: '⌘',
    name: 'Trees',
    problems: '55+ Problems',
  },
  {
    icon: '◈',
    name: 'Graphs',
    problems: '45+ Problems',
  },
  {
    icon: '↗',
    name: 'Dynamic Programming',
    problems: '50+ Problems',
  },
  {
    icon: '⌕',
    name: 'Searching',
    problems: '30+ Problems',
  },
  {
    icon: '⇅',
    name: 'Sorting',
    problems: '35+ Problems',
  },
  {
    icon: 'DB',
    name: 'SQL',
    problems: '40+ Problems',
  },
  {
    icon: 'J',
    name: 'Java',
    problems: '30+ Problems',
  },
  {
    icon: '{}',
    name: 'Algorithms',
    problems: '70+ Problems',
  },
];

export function Topics() {
  return (
    <section id="practice" className="topics-section">
      <motion.div
        className="section-heading topics-heading"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <span className="section-label">LEARN & PRACTICE</span>

          <h2>
            Choose your <span>Topic</span>
          </h2>

          <p>
            Strengthen your fundamentals and master important
            programming concepts.
          </p>
        </div>
      </motion.div>

      <div className="topics-grid">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.name}
            className="topic-card"
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.4,
              delay: index * 0.06,
            }}
            whileHover={{
              y: -7,
              scale: 1.02,
            }}
          >
            <div className="topic-icon">
              {topic.icon}
            </div>

            <div className="topic-content">
              <h3>{topic.name}</h3>

              <span>{topic.problems}</span>
            </div>

            <motion.span
              className="topic-arrow"
              whileHover={{ x: 5 }}
            >
              →
            </motion.span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}