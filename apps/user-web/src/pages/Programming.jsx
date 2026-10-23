import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';

export function Programming({
  user,
  onLogout,
  darkMode,
  onToggleDarkMode,
}) {
  const languages = [
    {
      name: 'Java',
      icon: '☕',
      level: 'Beginner → Advanced',
    },
    {
      name: 'Python',
      icon: '🐍',
      level: 'Beginner → Advanced',
    },
    {
      name: 'C++',
      icon: '⚙️',
      level: 'Beginner → Advanced',
    },
    {
      name: 'JavaScript',
      icon: '🟨',
      level: 'Beginner → Advanced',
    },
    {
      name: 'C#',
      icon: '#️⃣',
      level: 'Beginner → Advanced',
    },
    {
      name: 'Go',
      icon: '🔵',
      level: 'Beginner → Advanced',
    },
  ];

  const topics = [
    'Variables & Data Types',
    'Conditional Statements',
    'Loops',
    'Functions',
    'Object Oriented Programming',
    'Exception Handling',
    'Collections',
    'File Handling',
    'Multithreading',
    'Problem Solving',
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

      <main className="programming-page">

        <section className="programming-hero">
          <Link
            to="/explore"
            className="back-link"
          >
            ← Explore
          </Link>

          <span className="section-badge">
            PROGRAMMING
          </span>

          <h1>
            Master Programming
          </h1>

          <p>
            Learn languages, understand
            programming concepts and solve
            real coding problems.
          </p>
        </section>

        <section className="programming-section">
          <div className="section-heading">
            <div>
              <span>LANGUAGES</span>
              <h2>Choose your language</h2>
            </div>
          </div>

          <div className="language-grid">
            {languages.map((language) => (
              <Link
                key={language.name}
                to="/problems"
                className="language-card"
              >
                <div className="language-icon">
                  {language.icon}
                </div>

                <div>
                  <h3>
                    {language.name}
                  </h3>

                  <p>
                    {language.level}
                  </p>
                </div>

                <span className="arrow">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="programming-section">
          <div className="section-heading">
            <div>
              <span>CORE CONCEPTS</span>
              <h2>
                Programming fundamentals
              </h2>
            </div>
          </div>

          <div className="topic-grid">
            {topics.map((topic, index) => (
              <Link
                key={topic}
                to="/problems"
                className="topic-card"
              >
                <span>
                  {String(index + 1).padStart(
                    2,
                    '0'
                  )}
                </span>

                <h3>{topic}</h3>

                <b>→</b>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}