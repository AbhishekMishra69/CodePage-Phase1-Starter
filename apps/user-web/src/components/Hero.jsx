import { motion } from 'framer-motion';

export function Hero({ user, onStartCoding }) {
  return (
    <section className="hero">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <motion.div
          className="badge"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span />
          Level up your coding skills
        </motion.div>

        <h1>
          Practice.
          <br />
          <span>Compete.</span>
          <br />
          Grow.
        </h1>

        <motion.p
          className="hero-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Master programming through real coding problems, contests,
          and challenges. Build your skills one problem at a time.
        </motion.p>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            className="btn btn-primary btn-large"
            onClick={onStartCoding}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {user ? 'Start Coding →' : 'Start Coding →'}
          </motion.button>

          <motion.button
            className="btn btn-outline btn-large"
            onClick={() =>
              document
                .getElementById('problems')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Explore Problems
          </motion.button>
        </motion.div>

        <motion.div
          className="hero-trust"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <div>
            <strong>500+</strong>
            <span>Problems</span>
          </div>

          <div>
            <strong>1K+</strong>
            <span>Coders</span>
          </div>

          <div>
            <strong>50+</strong>
            <span>Contests</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="code-window"
        initial={{ opacity: 0, x: 80, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="window-header">
          <div className="window-dots">
            <span />
            <span />
            <span />
          </div>

          <span className="window-title">
            solution.js
          </span>
        </div>

        <div className="code-body">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <span className="line-number">01</span>
            <span className="keyword">function</span>{' '}
            <span className="function">solve</span>() {'{'}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
          >
            <span className="line-number">02</span>
            &nbsp;&nbsp;
            <span className="keyword">const</span>{' '}
            <span className="variable">result</span> ={' '}
            <span className="function">findSolution</span>();
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 }}
          >
            <span className="line-number">03</span>
            &nbsp;&nbsp;
            <span className="keyword">return</span>{' '}
            <span className="variable">result</span>;
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6 }}
          >
            <span className="line-number">04</span>
            {'}'}
          </motion.div>

          <motion.div
            className="code-output"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9 }}
          >
            <span className="success">✓</span>
            Accepted
            <span className="runtime">42 ms</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}