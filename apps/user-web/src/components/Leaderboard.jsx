import { motion } from 'framer-motion';

const users = [
  {
    rank: 1,
    name: 'CodeMaster',
    rating: 2480,
    solved: 342,
    streak: 48,
  },
  {
    rank: 2,
    name: 'AlgoNinja',
    rating: 2315,
    solved: 318,
    streak: 35,
  },
  {
    rank: 3,
    name: 'ByteHunter',
    rating: 2190,
    solved: 296,
    streak: 29,
  },
  {
    rank: 4,
    name: 'DevWizard',
    rating: 2075,
    solved: 271,
    streak: 22,
  },
  {
    rank: 5,
    name: 'LogicPro',
    rating: 1985,
    solved: 254,
    streak: 19,
  },
];

export function Leaderboard() {
  return (
    <section id="leaderboard" className="leaderboard-section">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <span className="section-label">COMPETITION</span>

          <h2>
            Global <span>Leaderboard</span>
          </h2>

          <p>
            Solve more problems, compete in contests,
            and climb the rankings.
          </p>
        </div>

        <motion.button
          className="btn btn-outline"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.96 }}
        >
          Full Leaderboard →
        </motion.button>
      </motion.div>

      <motion.div
        className="leaderboard-card"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6 }}
      >
        <div className="leaderboard-header">
          <span>Rank</span>
          <span>User</span>
          <span>Rating</span>
          <span>Solved</span>
          <span>Streak</span>
        </div>

        {users.map((user, index) => (
          <motion.div
            key={user.rank}
            className={`leaderboard-row ${
              user.rank <= 3 ? 'top-rank' : ''
            }`}
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4,
              delay: index * 0.08,
            }}
            whileHover={{
              x: 5,
            }}
          >
            <div className="rank">
              {user.rank <= 3 ? (
                <span className={`rank-medal medal-${user.rank}`}>
                  {user.rank}
                </span>
              ) : (
                user.rank
              )}
            </div>

            <div className="leader-user">
              <div className="leader-avatar">
                {user.name.charAt(0)}
              </div>

              <strong>{user.name}</strong>
            </div>

            <div className="rating">
              {user.rating}
            </div>

            <div className="solved">
              {user.solved}
            </div>

            <div className="streak">
              🔥 {user.streak}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}