import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <motion.div
          className="footer-brand"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="footer-logo">
            <span>&gt;_</span> CodePage
          </div>

          <p>
            Practice. Compete. Grow.
            <br />
            Your journey to becoming a better developer starts here.
          </p>
        </motion.div>

        <div className="footer-links">
          <div>
            <h4>Platform</h4>
            <a href="#problems">Problems</a>
            <a href="#practice">Practice</a>
            <a href="#contests">Contests</a>
            <a href="#leaderboard">Leaderboard</a>
          </div>

          <div>
            <h4>Resources</h4>
            <a href="#practice">DSA</a>
            <a href="#practice">Algorithms</a>
            <a href="#practice">SQL</a>
            <a href="#practice">Java</a>
          </div>

          <div>
            <h4>Company</h4>
            <a href="/">About</a>
            <a href="/">Contact</a>
            <a href="/">Privacy</a>
            <a href="/">Terms</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © 2026 CodePage. All rights reserved.
        </span>

        <span>
          Built with ❤️ for developers.
        </span>
      </div>
    </footer>
  );
}