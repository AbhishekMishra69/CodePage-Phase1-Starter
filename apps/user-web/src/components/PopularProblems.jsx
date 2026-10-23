import { motion } from 'framer-motion';

const problems = [
  {
    number: '01',
    title: 'Two Sum',
    difficulty: 'Easy',
    topics: ['Array', 'Hash Map'],
    solved: '82%',
  },
  {
    number: '02',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topics: ['Stack', 'String'],
    solved: '76%',
  },
  {
    number: '03',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topics: ['String', 'Sliding Window'],
    solved: '64%',
  },
  {
    number: '04',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    topics: ['Array', 'Sorting'],
    solved: '58%',
  },
  {
    number: '05',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    topics: ['Array', 'Dynamic Programming'],
    solved: '71%',
  },
  {
    number: '06',
    title: 'Binary Tree Inorder Traversal',
    difficulty: 'Easy',
    topics: ['Tree', 'DFS'],
    solved: '69%',
  },
];

export function PopularProblems() {
  return (
    <section id="problems" className="popular-problems-section">

      <motion.div
        className="popular-problems-heading"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <span className="popular-problems-label">
            PRACTICE
          </span>

          <h2>
            Popular <span>Problems</span>
          </h2>

          <p>
            Start with problems that developers solve every day.
          </p>
        </div>

        <motion.button
          className="popular-problems-view-all"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.96 }}
        >
          View All →
        </motion.button>
      </motion.div>

      <div className="popular-problems-grid">

        {problems.map((problem, index) => (
          <motion.article
            key={problem.number}
            className="popular-problem-card"

            initial={{
              opacity: 0,
              y: 35,
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
              duration: 0.45,
              delay: index * 0.08,
            }}

            whileHover={{
              y: -5,
            }}
          >

            <div className="popular-problem-top">

              <span className="popular-problem-number">
                {problem.number}
              </span>

              <span
                className={`popular-problem-difficulty popular-difficulty-${problem.difficulty.toLowerCase()}`}
              >
                {problem.difficulty}
              </span>

            </div>

            <h3>
              {problem.title}
            </h3>

            <div className="popular-problem-topics">

              {problem.topics.map((topic) => (
                <span key={topic}>
                  {topic}
                </span>
              ))}

            </div>

            <div className="popular-problem-footer">

              <span className="popular-problem-solve-rate">
                {problem.solved} solved
              </span>

              <motion.button
                className="popular-problem-solve-button"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
              >
                Solve →
              </motion.button>

            </div>

          </motion.article>
        ))}

      </div>

    </section>
  );
}