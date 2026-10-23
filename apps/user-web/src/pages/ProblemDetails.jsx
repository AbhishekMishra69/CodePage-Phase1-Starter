import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const languages = [
  { value: 'Java', label: 'Java', icon: '☕', apiValue: 'java' },
  { value: 'Python', label: 'Python', icon: '🐍', apiValue: 'python' },
  {
    value: 'JavaScript',
    label: 'JavaScript',
    icon: 'JS',
    apiValue: 'javascript',
  },
  { value: 'Cpp', label: 'C++', icon: 'C+', apiValue: 'cpp' },
];

const emptyStarterCode = {
  Java: '',
  Python: '',
  JavaScript: '',
  Cpp: '',
};

export function ProblemDetails({
  problemId,
  onBack,
  darkMode,
  onToggleDarkMode,
}) {
  const navigate = useNavigate();
  const { problemId: routeProblemId } = useParams();
  const slug = routeProblemId || problemId;

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [language, setLanguage] = useState('Java');
  const [starterCode, setStarterCode] = useState(emptyStarterCode);
  const [code, setCode] = useState('');
  const [languageOpen, setLanguageOpen] = useState(false);
  const [resultStatus, setResultStatus] = useState('Ready');
  const [executionResult, setExecutionResult] = useState(null);

  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  const dropdownRef = useRef(null);
  const textareaRef = useRef(null);
  const gutterRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setLanguageOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  async function loadSubmissions() {
    const token = localStorage.getItem('codepage_token');

    if (!token) {
      setSubmissions([]);
      return;
    }

    setSubmissionsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/execution/submissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to load submissions.'
        );
      }

      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error('Submission history error:', error);
      setSubmissions([]);
    } finally {
      setSubmissionsLoading(false);
    }
  }

  useEffect(() => {
    if (!slug) {
      setError('Problem identifier is missing.');
      setLoading(false);
      return;
    }

    async function loadProblem() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_URL}/problems/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || 'Unable to load problem.'
          );
        }

        const loadedProblem = data.problem;

        if (!loadedProblem) {
          throw new Error('Problem not found.');
        }

        const nextStarterCode = { ...emptyStarterCode };

        (loadedProblem.starterCode || []).forEach((item) => {
          const languageItem = languages.find(
            (entry) => entry.apiValue === item.language
          );

          if (languageItem) {
            nextStarterCode[languageItem.value] = item.code || '';
          }
        });

        setProblem(loadedProblem);
        setStarterCode(nextStarterCode);
        setLanguage('Java');
        setCode(nextStarterCode.Java || '');
        setResultStatus('Ready');
        setExecutionResult(null);
      } catch (requestError) {
        setError(
          requestError.message || 'Unable to load problem.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadProblem();
    loadSubmissions();
  }, [slug]);

  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    setCode(starterCode[nextLanguage] || '');
    setLanguageOpen(false);
    setResultStatus('Ready');
    setExecutionResult(null);
  }

  function handleEditorScroll(event) {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = event.target.scrollTop;
    }
  }

  async function handleRun() {
    if (!problem?.slug) {
      setResultStatus('Problem not loaded');
      return;
    }

    if (!code.trim()) {
      setResultStatus('Code is empty');
      return;
    }

    setResultStatus('Running...');
    setExecutionResult(null);

    try {
      const response = await fetch(`${API_URL}/execution/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemSlug: problem.slug,
          language: selectedLanguage.apiValue,
          sourceCode: code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Code execution failed.'
        );
      }

      setExecutionResult(data);
      setResultStatus(data.status);
    } catch (error) {
      setExecutionResult(null);
      setResultStatus(
        error.message || 'Execution failed'
      );
    }
  }

  async function handleSubmit() {
    if (!problem?.slug) {
      setResultStatus('Problem not loaded');
      return;
    }

    if (!code.trim()) {
      setResultStatus('Code is empty');
      return;
    }

    const token = localStorage.getItem('codepage_token');

    if (!token) {
      setResultStatus('Login required');
      setExecutionResult(null);
      return;
    }

    setResultStatus('Submitting...');
    setExecutionResult(null);

    try {
      const response = await fetch(
        `${API_URL}/execution/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            problemSlug: problem.slug,
            language: selectedLanguage.apiValue,
            sourceCode: code,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Code submission failed.'
        );
      }

      setExecutionResult(data);
      setResultStatus(data.status);

      await loadSubmissions();
    } catch (error) {
      setExecutionResult(null);
      setResultStatus(
        error.message || 'Submission failed'
      );
    }
  }

  const selectedLanguage =
    languages.find((item) => item.value === language) ||
    languages[0];

  const lineCount = Math.max(
    code.split('\n').length,
    12
  );

  if (loading) {
    return (
      <div className="problem-details-page">
        <div className="problems-empty">
          <div className="empty-icon">◌</div>
          <h3>Loading problem...</h3>
          <p>Fetching the problem from CodePage.</p>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="problem-details-page">
        <div className="problems-empty">
          <div className="empty-icon">!</div>
          <h3>Unable to load problem</h3>
          <p>{error || 'Problem not found.'}</p>

          <button type="button" onClick={() => navigate('/problems')}>
            ← Back to Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="problem-details-page">
      <motion.header
        className="problem-details-header"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.button
          type="button"
          className="problem-back-button"
          onClick={() => navigate('/problems')}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="back-arrow">←</span>
          Problems
        </motion.button>

        <div className="problem-header-actions">
          <motion.button
            type="button"
            className="problem-theme-button"
            onClick={onToggleDarkMode}
            title={
              darkMode
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            }
            whileTap={{ scale: 0.92 }}
          >
            {darkMode ? '☀' : '☾'}
          </motion.button>
        </div>
      </motion.header>

      <main className="problem-workspace">
        <motion.section
          className="problem-description-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="problem-title-row">
            <div className="problem-heading">
              <span className="problem-id">
                {problem.title}
              </span>

              <h1>{problem.title}</h1>
            </div>

            <span className="problem-difficulty">
              {problem.difficulty}
            </span>
          </div>

          <div className="problem-topic-list">
            {(problem.topics || []).map((topic) => (
              <span key={topic}>{topic}</span>
            ))}
          </div>

          <div className="problem-section">
            <h2>Description</h2>
            <p>{problem.description}</p>
          </div>

          <div className="problem-section">
            <h2>Examples</h2>

            <div className="examples-list">
              {(problem.examples || []).map((example, index) => (
                <div
                  className="example-card"
                  key={index}
                >
                  <div className="example-title">
                    Example {index + 1}
                  </div>

                  <div className="example-line">
                    <strong>Input</strong>
                    <code>{example.input}</code>
                  </div>

                  <div className="example-line">
                    <strong>Output</strong>
                    <code>{example.output}</code>
                  </div>

                  {example.explanation && (
                    <p>{example.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="problem-section">
            <h2>Constraints</h2>

            <ul className="constraints-list">
              {(problem.constraints || []).map(
                (constraint) => (
                  <li key={constraint}>
                    {constraint}
                  </li>
                )
              )}
            </ul>
          </div>
        </motion.section>

        <motion.section
          className="code-editor-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.45,
            delay: 0.05,
          }}
        >
          <div className="editor-toolbar">
            <div
              className="language-dropdown"
              ref={dropdownRef}
            >
              <button
                type="button"
                className={`language-trigger ${
                  languageOpen
                    ? 'language-trigger-open'
                    : ''
                }`}
                onClick={() =>
                  setLanguageOpen(
                    (previous) => !previous
                  )
                }
              >
                <span className="language-selected">
                  <span className="language-icon">
                    {selectedLanguage.icon}
                  </span>

                  <span>
                    {selectedLanguage.label}
                  </span>
                </span>

                <span
                  className={`language-chevron ${
                    languageOpen
                      ? 'language-chevron-open'
                      : ''
                  }`}
                >
                  ▼
                </span>
              </button>

              {languageOpen && (
                <motion.div
                  className="language-menu"
                  initial={{
                    opacity: 0,
                    y: -5,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.15,
                  }}
                >
                  {languages.map((item) => (
                    <button
                      type="button"
                      key={item.value}
                      className={`language-option ${
                        language === item.value
                          ? 'language-option-active'
                          : ''
                      }`}
                      onClick={() =>
                        changeLanguage(item.value)
                      }
                    >
                      <span className="language-option-icon">
                        {item.icon}
                      </span>

                      <span>{item.label}</span>

                      {language === item.value && (
                        <span className="language-check">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="editor-actions">
              <motion.button
                type="button"
                className="run-button"
                onClick={handleRun}
                whileTap={{ scale: 0.96 }}
              >
                <span>▶</span> Run
              </motion.button>

              <motion.button
                type="button"
                className="submit-button"
                onClick={handleSubmit}
                whileTap={{ scale: 0.96 }}
              >
                Submit
              </motion.button>
            </div>
          </div>

          <div className="code-editor">
            <div
              className="editor-gutter"
              ref={gutterRef}
              aria-hidden="true"
            >
              {Array.from(
                { length: lineCount },
                (_, index) => (
                  <span key={index}>
                    {index + 1}
                  </span>
                )
              )}
            </div>

            <textarea
              ref={textareaRef}
              className="code-textarea"
              value={code}
              onChange={(event) =>
                setCode(event.target.value)
              }
              onScroll={handleEditorScroll}
              spellCheck="false"
              autoCapitalize="off"
              autoCorrect="off"
              wrap="off"
              aria-label="Code editor"
            />
          </div>

          <div className="result-panel">
            <div className="result-header">
              <div className="result-title">
                <span className="result-icon">◉</span>
                <h3>Test Result</h3>
              </div>

              <span
                className={`result-status result-${resultStatus
                  .toLowerCase()
                  .replace(/\s+/g, '-')}`}
              >
                {resultStatus}
              </span>
            </div>

            <p>
              {resultStatus === 'Ready'
                ? 'Run your code to see the test results.'
                : resultStatus === 'Accepted'
                ? `All ${
                    executionResult?.totalTests || 0
                  } test cases passed.`
                : resultStatus === 'Running...' ||
                  resultStatus === 'Submitting...'
                ? 'Executing your code against test cases...'
                : resultStatus === 'Login required'
                ? 'Please login to submit your solution.'
                : resultStatus === 'Not connected'
                ? 'The code execution engine will be connected in the next step.'
                : resultStatus === 'Code is empty'
                ? 'Please write some code before running.'
                : executionResult
                ? `${executionResult.passedTests} of ${executionResult.totalTests} test cases passed.`
                : resultStatus}
            </p>

            {executionResult?.results?.length > 0 && (
              <div className="execution-results">
                {executionResult.results.map((result) => (
                  <div
                    className="execution-test-case"
                    key={result.testCase}
                  >
                    <div className="execution-test-header">
                      <strong>
                        Test Case {result.testCase}
                      </strong>

                      <span
                        className={
                          result.status === 'Passed'
                            ? 'test-passed'
                            : 'test-failed'
                        }
                      >
                        {result.status}
                      </span>
                    </div>

                    <div className="execution-test-details">
                      <div>
                        <strong>Input</strong>
                        <code>
                          {result.input || '(empty)'}
                        </code>
                      </div>

                      <div>
                        <strong>
                          Expected Output
                        </strong>

                        <code>
                          {result.expectedOutput ||
                            '(empty)'}
                        </code>
                      </div>

                      <div>
                        <strong>
                          Actual Output
                        </strong>

                        <code>
                          {result.actualOutput ||
                            '(empty)'}
                        </code>
                      </div>

                      {result.time && (
                        <div>
                          <strong>Runtime</strong>
                          <span>
                            {result.time}s
                          </span>
                        </div>
                      )}

                      {result.memory && (
                        <div>
                          <strong>Memory</strong>
                          <span>
                            {result.memory} KB
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="submission-history-panel">
            <div className="submission-history-header">
              <div className="submission-history-title">
                <span className="submission-history-icon">
                  ◷
                </span>

                <h3>Submission History</h3>
              </div>

              <span className="submission-count">
                {submissions.length}
              </span>
            </div>

            {submissionsLoading ? (
              <div className="submission-history-empty">
                Loading submissions...
              </div>
            ) : submissions.length === 0 ? (
              <div className="submission-history-empty">
                No submissions yet.
              </div>
            ) : (
              <div className="submission-history-list">
                {submissions.map((submission) => (
                  <div
                    className="submission-history-item"
                    key={submission._id}
                  >
                    <div className="submission-problem-info">
                      <strong>
                        {submission.problem?.title ||
                          submission.problemSlug}
                      </strong>

                      <span>
                        {submission.language.toUpperCase()}
                      </span>
                    </div>

                    <div className="submission-result-info">
                      <span
                        className={`submission-status submission-${submission.status
                          .toLowerCase()
                          .replace(/\s+/g, '-')}`}
                      >
                        {submission.status}
                      </span>

                      <span className="submission-runtime">
                        {submission.runtime !== null
                          ? `${submission.runtime}s`
                          : '--'}
                      </span>

                      <span className="submission-memory">
                        {submission.memory !== null
                          ? `${submission.memory} KB`
                          : '--'}
                      </span>

                      <span className="submission-date">
                        {new Date(
                          submission.createdAt
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
}