import { motion } from 'framer-motion';

const contests = [
  {
    id: 1,
    title: 'CodePage Weekly Challenge',
    date: 'Oct 03, 2026',
    time: '08:00 PM',
    duration: '90 Minutes',
    participants: '1.2K+ Participants',
  },
  {
    id: 2,
    title: 'Algorithm Sprint #12',
    date: 'Oct 10, 2026',
    time: '07:00 PM',
    duration: '120 Minutes',
    participants: '850+ Participants',
  },
];

export function Contests() {
  return (
    <section className="contests-section">
      <div className="section-heading">
        <h2>Upcoming Contests</h2>
        <p>
          Compete with other developers and improve your coding skills.
        </p>
      </div>

      <motion.div
        className="contest-list"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.12,
            },
          },
        }}
      >
        {contests.map((contest) => (
          <motion.article
            key={contest.id}
            className="contest-card"
            variants={{
              hidden: {
                opacity: 0,
                y: 25,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            transition={{
              duration: 0.5,
            }}
          >
            <span className="contest-card-status">
              Upcoming
            </span>

            <h3>{contest.title}</h3>

            <div className="contest-card-meta">
              <span>📅 {contest.date}</span>
              <span>🕐 {contest.time}</span>
              <span>⏱ {contest.duration}</span>
            </div>

            <div className="contest-card-participants">
              {contest.participants}
            </div>

            <button className="contest-register-button">
              Register →
            </button>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}