import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';

import '../styles/Explore.css';
export function Explore({
  user,
  onLogout,
  darkMode,
  onToggleDarkMode,
}) {
  const categories = [
    {
      icon: '💻',
      title: 'Programming Languages',
      description: 'Learn language fundamentals, syntax, and coding concepts.',
      topics: ['Java', 'Python', 'C++', 'JavaScript'],
      path: '/explore/programming',
      count: '4 languages',
    },
    {
      icon: '🧩',
      title: 'Data Structures',
      description: 'Understand how data is stored, organized, and accessed.',
      topics: ['Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Queues'],
      path: '/problems',
      count: 'Practice problems',
    },
    {
      icon: '⚙️',
      title: 'Algorithms',
      description: 'Improve your logic with common algorithmic patterns.',
      topics: ['Searching', 'Sorting', 'Recursion', 'Greedy', 'DP'],
      path: '/problems',
      count: 'Practice problems',
    },
    {
      icon: '🗃️',
      title: 'SQL & Databases',
      description: 'Practice queries and learn relational database concepts.',
      topics: ['SELECT', 'JOIN', 'GROUP BY', 'Subqueries', 'Indexes'],
      path: '/explore/programming',
      count: 'SQL fundamentals',
    },
    {
      icon: '🌐',
      title: 'Web Development',
      description: 'Explore the technologies used to build modern websites.',
      topics: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
      path: '/explore/programming',
      count: 'Web technologies',
    },
    {
      icon: '🧠',
      title: 'Interview Preparation',
      description: 'Prepare for coding rounds with frequently practiced topics.',
      topics: ['Two Pointers', 'Sliding Window', 'Hash Maps', 'Binary Search'],
      path: '/problems',
      count: 'Start practicing',
    },
  ];

  const resources = [
    {
      number: '01',
      title: 'Problem Solving',
      description: 'Build confidence by solving coding challenges step by step.',
      path: '/problems',
      action: 'Solve problems',
    },
    {
      number: '02',
      title: 'Learn by Topic',
      description: 'Choose a topic and strengthen your fundamentals.',
      path: '/problems',
      action: 'Browse topics',
    },
    {
      number: '03',
      title: 'Write and Run Code',
      description: 'Write solutions, run your code, and review the output.',
      path: '/problems',
      action: 'Open practice',
    },
  ];

  return (
    <div className="page-content">
      <Navbar
        user={user}
        onLogin={() => {}}
        onRegister={() => {}}
        onLogout={onLogout}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />

      <main className="explore-page">
        <section className="explore-hero">
          <div className="explore-hero-copy">
            <span className="section-badge">CODEPAGE LEARNING</span>
            <h1>
              Learn to code.
              <br />
              <span>Practice with purpose.</span>
            </h1>
            <p>
              Explore programming concepts, strengthen your problem-solving
              skills, and prepare for coding interviews — one problem at a time.
            </p>
            <div className="explore-hero-actions">
              <Link to="/problems" className="explore-primary-btn">
                Start solving problems <span>→</span>
              </Link>
              <Link to="/explore/programming" className="explore-secondary-btn">
                Explore languages
              </Link>
            </div>
          </div>
          <div className="explore-hero-note">
            <span className="explore-note-icon">⌘</span>
            <div>
              <strong>Your next challenge starts here.</strong>
              <p>Learn the concept. Write the code. Test your solution.</p>
            </div>
          </div>
        </section>

        <section className="explore-section">
          <div className="explore-section-heading">
            <div>
              <span className="explore-eyebrow">LEARNING PATHS</span>
              <h2>Explore by category</h2>
              <p>Choose a subject and build your skills from the basics.</p>
            </div>
            <Link to="/problems" className="explore-text-link">
              View problems <span>→</span>
            </Link>
          </div>

          <div className="explore-grid">
            {categories.map((category) => (
              <Link
                key={category.title}
                to={category.path}
                className="explore-card"
              >
                <div className="explore-card-top">
                  <div className="explore-icon">{category.icon}</div>
                  <span className="explore-card-arrow">↗</span>
                </div>

                <h3>{category.title}</h3>
                <p className="explore-card-description">
                  {category.description}
                </p>

                <div className="explore-topics">
                  {category.topics.map((topic) => (
                    <span key={topic}>{topic}</span>
                  ))}
                </div>

                <div className="explore-card-footer">
                  <span>{category.count}</span>
                  <span className="explore-card-cta">Explore →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="explore-practice-section">
          <div className="explore-section-heading">
            <div>
              <span className="explore-eyebrow">YOUR PRACTICE SPACE</span>
              <h2>Learn by doing</h2>
              <p>Move from understanding a concept to writing a working solution.</p>
            </div>
          </div>

          <div className="explore-resources">
            {resources.map((resource) => (
              <article className="explore-resource" key={resource.number}>
                <span className="explore-resource-number">
                  {resource.number}
                </span>
                <div className="explore-resource-content">
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <Link to={resource.path}>
                    {resource.action} <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="explore-bottom-cta">
          <div>
            <span className="explore-eyebrow">READY TO PRACTICE?</span>
            <h2>Every problem is a chance to improve.</h2>
            <p>Pick a challenge, write your solution, and keep learning.</p>
          </div>
          <Link to="/problems" className="explore-primary-btn">
            Go to problems <span>→</span>
          </Link>
        </section>
      </main>
    </div>
  );
}
