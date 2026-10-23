
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';
import '../styles/Certifications.css';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const certifications = [
  {
    icon: '☕',
    title: 'Java Programming',
    description: 'Test your Java fundamentals and object-oriented programming knowledge.',
    level: 'Beginner',
    category: 'Programming',
    topics: ['Core Java', 'OOP', 'Collections', 'Exceptions'],
    color: 'java',
    type: 'java',
  },
  {
    icon: '🐍',
    title: 'Python Programming',
    description: 'Assess your knowledge of Python syntax, functions, and data structures.',
    level: 'Beginner',
    category: 'Programming',
    topics: ['Syntax', 'Functions', 'Lists', 'Dictionaries'],
    color: 'python',
    type: 'python',
  },
  {
    icon: '🧠',
    title: 'Data Structures & Algorithms',
    description: 'Practice arrays, strings, trees, and problem-solving concepts.',
    level: 'Intermediate',
    category: 'Problem Solving',
    topics: ['Arrays', 'Strings', 'Trees', 'Algorithms'],
    color: 'dsa',
    type: null,
  },
  {
    icon: '🗄️',
    title: 'SQL & Databases',
    description: 'Test your understanding of relational databases and SQL queries.',
    level: 'Beginner',
    category: 'Database',
    topics: ['SELECT', 'JOIN', 'GROUP BY', 'Subqueries'],
    color: 'sql',
    type: 'sql',
  },
  {
    icon: '🌐',
    title: 'HTML & CSS',
    description: 'Demonstrate your knowledge of web page structure and styling.',
    level: 'Beginner',
    category: 'Development',
    topics: ['HTML', 'CSS', 'Flexbox', 'Responsive Design'],
    color: 'web',
    type: 'html',
  },
  {
    icon: '☁️',
    title: 'DevOps Fundamentals',
    description: 'Review your knowledge of Linux, Git, Docker, and CI/CD.',
    level: 'Intermediate',
    category: 'Cloud & DevOps',
    topics: ['Linux', 'Git', 'Docker', 'CI/CD'],
    color: 'devops',
    type: null,
  },
];

const filters = [
  'All',
  'Programming',
  'Problem Solving',
  'Database',
  'Development',
  'Cloud & DevOps',
];

export function Certifications({
  user,
  onLogout,
  darkMode,
  onToggleDarkMode,
}) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeTest, setActiveTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);

 const getAuthToken = () => {
  const keys = Object.keys(localStorage);

  for (const key of keys) {
    const value = localStorage.getItem(key);

    if (
      value &&
      (key.toLowerCase().includes('token') ||
        key.toLowerCase().includes('auth'))
    ) {
      return value;
    }
  }

  return null;
};

  const startTest = async (cert) => {
    if (!cert.type) {
      setTestError('This assessment is not available yet.');
      return;
    }

    setTestLoading(true);
    setTestError('');
    setTestResult(null);
    setAnswers({});
    setQuestions([]);
    setCurrentQuestion(0);

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error('Please log in before starting a test.');
      }

      const response = await fetch(
        `${API_URL}/certifications/${cert.type}/questions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not load questions.');
      }

      setQuestions(data.questions);
      setActiveTest({
        type: cert.type,
        name: data.name,
        passingScore: data.passingScore,
      });
    } catch (error) {
      setTestError(error.message || 'Something went wrong.');
    } finally {
      setTestLoading(false);
    }
  };

  const submitTest = async () => {
    if (!activeTest) return;

    setTestLoading(true);
    setTestError('');

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error('Please log in again.');
      }

      const response = await fetch(
        `${API_URL}/certifications/${activeTest.type}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            answers: questions.map((_, index) =>
              Number.isInteger(answers[index]) ? answers[index] : -1
            ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not submit your test.');
      }

      setTestResult(data);
    } catch (error) {
      setTestError(error.message || 'Could not submit your test.');
    } finally {
      setTestLoading(false);
    }
  };

  const closeTest = () => {
    setActiveTest(null);
    setQuestions([]);
    setAnswers({});
    setTestResult(null);
    setTestError('');
    setCurrentQuestion(0);
  };

  const downloadCertificate = () => {
    if (!testResult?.passed || !testResult.certificate) return;

    const certificate = testResult.certificate;
    const certificateId = certificate.certificateId;
    const verifyUrl = `${window.location.origin}/certificates/verify/${encodeURIComponent(certificateId)}`;

    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      setTestError('Allow pop-ups in your browser to print the certificate.');
      return;
    }

    const safe = (value) =>
      String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char]);

    const studentName = safe(user?.name || 'CodePage Learner');
    const certificationName = safe(certificate.certificationName);
    const issueDate = safe(
      certificate.issueDate
        ? new Date(certificate.issueDate).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : new Date().toLocaleDateString('en-IN')
    );

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>CodePage Certificate - ${safe(certificateId)}</title>
          <meta charset="utf-8" />
          <style>
            @page { size: landscape; margin: 10mm; }
            * { box-sizing: border-box; }
            body {
              margin: 0; padding: 20px; color: #18243b;
              font-family: Georgia, 'Times New Roman', serif;
              background: #fff;
            }
            .certificate {
              min-height: 175mm; border: 7px double #3159b8;
              padding: 35px; text-align: center; position: relative;
              display: flex; flex-direction: column; align-items: center;
              justify-content: center;
            }
            .brand {
              font-family: Arial, sans-serif; font-size: 24px;
              font-weight: 800; letter-spacing: 4px; color: #3159b8;
            }
            .eyebrow {
              margin-top: 24px; font: 12px Arial, sans-serif;
              letter-spacing: 4px; color: #68758a;
            }
            h1 { font-size: 42px; margin: 14px 0; color: #18243b; }
            .intro { font: 16px Arial, sans-serif; }
            .name {
              font-size: 34px; color: #3159b8;
              margin: 18px 0; border-bottom: 1px solid #aebbd5;
              padding: 0 35px 10px;
            }
            .course { font-size: 23px; margin: 10px 0; }
            .details {
              font: 13px Arial, sans-serif; line-height: 1.9;
              margin-top: 15px; overflow-wrap: anywhere;
            }
            .footer {
              display: flex; width: 100%; justify-content: space-between;
              gap: 25px; margin-top: 32px; font: 12px Arial, sans-serif;
              text-align: left;
            }
            .verify { max-width: 60%; overflow-wrap: anywhere; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <main class="certificate">
            <div class="brand">CODEPAGE</div>
            <div class="eyebrow">CERTIFICATE OF ACHIEVEMENT</div>
            <h1>Certificate of Completion</h1>
            <p class="intro">This certificate is proudly presented to</p>
            <div class="name">${studentName}</div>
            <p class="intro">for successfully passing the assessment in</p>
            <div class="course">${certificationName}</div>
            <div class="details">
              Score: ${safe(testResult.score)}%<br />
              Date issued: ${issueDate}
            </div>
            <div class="footer">
              <div>CodePage<br />Learn. Practice. Achieve.</div>
              <div class="verify">
                Certificate ID: ${safe(certificateId)}<br />
                Verify at: ${safe(verifyUrl)}
              </div>
            </div>
          </main>
          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const filteredCertifications =
    activeFilter === 'All'
      ? certifications
      : certifications.filter((cert) => cert.category === activeFilter);

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

      <main className="cert-page">
        {!activeTest && (
          <>
            <section className="cert-hero">
              <div className="cert-hero-content">
                <span className="section-badge">
                  CODEPAGE CERTIFICATIONS
                </span>
                <h1>
                  Put your coding skills
                  <br />
                  <span>to the test.</span>
                </h1>
                <p>
                  Take skill-based MCQ assessments and earn a CodePage
                  certificate when you pass.
                </p>
                <a href="#certification-list" className="cert-primary-btn">
                  Explore certifications <span>→</span>
                </a>
              </div>

              <div className="cert-hero-aside">
                <div className="cert-hero-icon">✓</div>
                <h3>Learn. Practice. Demonstrate.</h3>
                <p>
                  Choose an assessment, answer the questions, and check your
                  result.
                </p>
              </div>
            </section>

            <section className="cert-benefits">
              <div className="cert-benefit">
                <span>01</span>
                <div>
                  <h3>Choose your skill</h3>
                  <p>Select a certification.</p>
                </div>
              </div>
              <div className="cert-benefit">
                <span>02</span>
                <div>
                  <h3>Take the assessment</h3>
                  <p>Answer every MCQ.</p>
                </div>
              </div>
              <div className="cert-benefit">
                <span>03</span>
                <div>
                  <h3>Earn your certificate</h3>
                  <p>Pass with the required score.</p>
                </div>
              </div>
            </section>

            <section className="cert-list-section" id="certification-list">
              <div className="cert-section-heading">
                <div>
                  <span className="cert-eyebrow">SKILL ASSESSMENTS</span>
                  <h2>Explore certifications</h2>
                  <p>Choose a subject and test your knowledge.</p>
                </div>
                <span className="cert-total">
                  {filteredCertifications.length} certifications
                </span>
              </div>

              <div className="cert-filters">
                {filters.map((filter) => (
                  <button
                    type="button"
                    key={filter}
                    className={activeFilter === filter ? 'active' : ''}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {testError && (
                <p className="cert-error" role="alert">{testError}</p>
              )}

              <div className="cert-grid">
                {filteredCertifications.map((cert) => (
                  <article className="cert-card" key={cert.title}>
                    <div className="cert-card-top">
                      <div className={`cert-icon ${cert.color}`}>
                        {cert.icon}
                      </div>
                      <span className="cert-level">{cert.level}</span>
                    </div>
                    <h3>{cert.title}</h3>
                    <p className="cert-description">{cert.description}</p>
                    <div className="cert-topics-label">TOPICS COVERED</div>
                    <div className="cert-topics">
                      {cert.topics.map((topic) => (
                        <span key={topic}>{topic}</span>
                      ))}
                    </div>
                    <div className="cert-card-footer">
                      <span>MCQ Assessment</span>
                      <button
                        type="button"
                        className="cert-primary-btn"
                        disabled={testLoading || !cert.type}
                        onClick={() => startTest(cert)}
                      >
                        {!cert.type
                          ? 'Coming soon'
                          : testLoading
                            ? 'Loading...'
                            : 'Start Test →'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="cert-bottom">
              <div>
                <span className="cert-eyebrow">KEEP IMPROVING</span>
                <h2>Build your skills one problem at a time.</h2>
                <p>Practice coding challenges before your assessment.</p>
              </div>
              <Link to="/problems" className="cert-primary-btn">
                Go to problems <span>→</span>
              </Link>
            </section>
          </>
        )}

        {activeTest && (
          <section className="cert-quiz">
            <button
              type="button"
              className="cert-back-btn"
              onClick={closeTest}
              disabled={testLoading}
            >
              ← Back to certifications
            </button>

            <span className="cert-eyebrow">CODEPAGE ASSESSMENT</span>
            <h1>{activeTest.name}</h1>

            {!testResult && questions.length > 0 && (
              <>
                <div className="cert-quiz-meta">
                  <span>
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span>Passing score: {activeTest.passingScore}%</span>
                </div>

                <div
                  className="cert-quiz-progress"
                  aria-label="Question progress"
                >
                  <span
                    style={{
                      width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>

                <article className="cert-question-card">
                  <h2>{questions[currentQuestion].question}</h2>
                  <div className="cert-options">
                    {questions[currentQuestion].options.map((option, index) => (
                      <label
                        key={`${currentQuestion}-${index}`}
                        className={
                          answers[currentQuestion] === index
                            ? 'cert-option selected'
                            : 'cert-option'
                        }
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          checked={answers[currentQuestion] === index}
                          onChange={() =>
                            setAnswers((previous) => ({
                              ...previous,
                              [currentQuestion]: index,
                            }))
                          }
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </article>

                {testError && (
                  <p className="cert-error" role="alert">{testError}</p>
                )}

                <div className="cert-quiz-actions">
                  <button
                    type="button"
                    className="cert-secondary-btn"
                    disabled={currentQuestion === 0 || testLoading}
                    onClick={() =>
                      setCurrentQuestion((current) => current - 1)
                    }
                  >
                    Previous
                  </button>

                  {currentQuestion < questions.length - 1 ? (
                    <button
                      type="button"
                      className="cert-primary-btn"
                      onClick={() =>
                        setCurrentQuestion((current) => current + 1)
                      }
                    >
                      Next question →
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="cert-primary-btn"
                      disabled={testLoading}
                      onClick={submitTest}
                    >
                      {testLoading ? 'Submitting...' : 'Submit assessment'}
                    </button>
                  )}
                </div>

                <p className="cert-answer-count">
                  {Object.keys(answers).length} of {questions.length} answered
                </p>
              </>
            )}

            {testResult && (
              <article className="cert-result-card">
                <div className="cert-result-icon">
                  {testResult.passed ? '✓' : '↻'}
                </div>
                <h2>
                  {testResult.passed ? 'Congratulations!' : 'Keep practising'}
                </h2>
                <p>{testResult.message}</p>
                <div className="cert-score">{testResult.score}%</div>
                <p>
                  Correct answers: {testResult.correct} / {testResult.totalQuestions}
                </p>

                {testResult.passed && testResult.certificate && (
                  <div className="cert-earned">
                    <h3>Your CodePage certificate is ready</h3>
                    <p>
                      Certificate ID: {testResult.certificate.certificateId}
                    </p>
                    <button
                      type="button"
                      className="cert-primary-btn"
                      onClick={downloadCertificate}
                    >
                      Download / Save as PDF ↓
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  className="cert-secondary-btn"
                  onClick={closeTest}
                >
                  Back to certifications
                </button>
              </article>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
