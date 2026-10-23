
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const problemsPerPage = 6;

export function Problems({ onBack }) {
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All Difficulties');
  const [topic, setTopic] = useState('All Topics');
  const [status, setStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

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
          data.message || 'Unable to load submission history.'
        );
      }

      setSubmissions(
        Array.isArray(data.submissions) ? data.submissions : []
      );
    } catch (requestError) {
      console.error('Submission history error:', requestError);
      setSubmissions([]);
    } finally {
      setSubmissionsLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadProblems() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_URL}/problems?limit=100`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || 'Unable to load problems.'
          );
        }

        const backendProblems = Array.isArray(data.problems)
          ? data.problems
          : [];

        const normalizedProblems = backendProblems.map(
          (problem, index) => ({
            id: problem.slug,
            number: index + 1,
            title: problem.title,
            difficulty: problem.difficulty,
            topics: Array.isArray(problem.topics)
              ? problem.topics
              : [],
            acceptanceRate: Number(problem.acceptanceRate || 0),
            totalSubmissions: Number(problem.totalSubmissions || 0),
          })
        );

        if (!cancelled) {
          setProblems(normalizedProblems);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError.message || 'Unable to load problems.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProblems();
    loadSubmissions();

    return () => {
      cancelled = true;
    };
  }, []);

  const solvedProblemIds = useMemo(
    () =>
      new Set(
        submissions
          .filter(
            (submission) => submission.status === 'Accepted'
          )
          .map(
            (submission) =>
              submission.problemSlug ||
              submission.problem?.slug
          )
          .filter(Boolean)
      ),
    [submissions]
  );

  const attemptedProblemIds = useMemo(
    () =>
      new Set(
        submissions
          .map(
            (submission) =>
              submission.problemSlug ||
              submission.problem?.slug
          )
          .filter(Boolean)
      ),
    [submissions]
  );

  const topics = useMemo(() => {
    const allTopics = problems.flatMap(
      (problem) => problem.topics
    );

    return [...new Set(allTopics)].sort();
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        searchValue === '' ||
        problem.title.toLowerCase().includes(searchValue) ||
        problem.topics.some((item) =>
          item.toLowerCase().includes(searchValue)
        );

      const matchesDifficulty =
        difficulty === 'All Difficulties' ||
        problem.difficulty === difficulty;

      const matchesTopic =
        topic === 'All Topics' ||
        problem.topics.includes(topic);

      const isSolved = solvedProblemIds.has(problem.id);
      const isAttempted = attemptedProblemIds.has(problem.id);

      const matchesStatus =
        status === 'All' ||
        (status === 'Solved' && isSolved) ||
        (status === 'Attempted' && isAttempted && !isSolved) ||
        (status === 'Unsolved' && !isAttempted);

      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesTopic &&
        matchesStatus
      );
    });
  }, [
    problems,
    search,
    difficulty,
    topic,
    status,
    solvedProblemIds,
    attemptedProblemIds,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProblems.length / problemsPerPage)
  );

  const visibleProblems = filteredProblems.slice(
    (currentPage - 1) * problemsPerPage,
    currentPage * problemsPerPage
  );

  const solvedCount = problems.filter((problem) =>
    solvedProblemIds.has(problem.id)
  ).length;

  const attemptedCount = problems.filter(
    (problem) =>
      attemptedProblemIds.has(problem.id) &&
      !solvedProblemIds.has(problem.id)
  ).length;

  const unsolvedCount = Math.max(
    problems.length - solvedCount - attemptedCount,
    0
  );

  function updateSearch(value) {
    setSearch(value);
    setCurrentPage(1);
  }

  function updateDifficulty(value) {
    setDifficulty(value);
    setCurrentPage(1);
  }

  function updateTopic(value) {
    setTopic(value);
    setCurrentPage(1);
  }

  function updateStatus(value) {
    setStatus(value);
    setCurrentPage(1);
  }

  function resetFilters() {
    setSearch('');
    setDifficulty('All Difficulties');
    setTopic('All Topics');
    setStatus('All');
    setCurrentPage(1);
  }

  function openProblem(problemId) {
    navigate(`/problems/${problemId}`);
  }

  function goToPage(page) {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  return (
    <div className="problems-page">
      <motion.section
        className="problems-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
         <motion.button
  type="button"
  className="back-button"
  onClick={() => navigate('/problems')}
  whileHover={{ x: -4 }}
  whileTap={{ scale: 0.96 }}
>
  ← Back
</motion.button>

          <h1>Problems</h1>

          <p>
            Practice coding problems, improve your problem-solving skills and
            prepare for technical interviews.
          </p>
        </div>

        <div className="problem-progress">
          <span>
            {solvedCount} / {problems.length}
          </span>
          <small>Problems Solved</small>
        </div>
      </motion.section>

      <motion.section
        className="problem-toolbar"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="problem-search-wrapper">
          <span className="problem-search-icon">⌕</span>

          <input
            type="text"
            className="problem-search"
            value={search}
            onChange={(event) => updateSearch(event.target.value)}
            placeholder="Search problems or topics..."
          />

          {search && (
            <button
              type="button"
              className="problem-search-clear"
              onClick={() => updateSearch('')}
            >
              ×
            </button>
          )}
        </div>

        <select
          className="problem-filter"
          value={difficulty}
          onChange={(event) =>
            updateDifficulty(event.target.value)
          }
        >
          <option>All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          className="problem-filter"
          value={topic}
          onChange={(event) => updateTopic(event.target.value)}
        >
          <option>All Topics</option>
          {topics.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </motion.section>

      <div className="problem-list-controls">
        <div className="problem-status-tabs">
          {['All', 'Unsolved', 'Attempted', 'Solved'].map((item) => (
            <button
              type="button"
              key={item}
              className={
                status === item ? 'status-tab active' : 'status-tab'
              }
              onClick={() => updateStatus(item)}
            >
              {item}
              <span>
                {item === 'All'
                  ? problems.length
                  : item === 'Solved'
                  ? solvedCount
                  : item === 'Attempted'
                  ? attemptedCount
                  : unsolvedCount}
              </span>
            </button>
          ))}
        </div>

        <div className="problem-results-info">
          {filteredProblems.length > 0
            ? `Showing ${
                (currentPage - 1) * problemsPerPage + 1
              }-${Math.min(
                currentPage * problemsPerPage,
                filteredProblems.length
              )} of ${filteredProblems.length}`
            : 'No problems found'}

          {submissionsLoading && (
            <span> · Updating submission status...</span>
          )}

          {(search ||
            difficulty !== 'All Difficulties' ||
            topic !== 'All Topics' ||
            status !== 'All') && (
            <button
              type="button"
              className="reset-filters-button"
              onClick={resetFilters}
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="problems-empty">
          <div className="empty-icon">◌</div>
          <h3>Loading problems...</h3>
          <p>Fetching the latest problems from CodePage.</p>
        </div>
      )}

      {!loading && error && (
        <div className="problems-empty">
          <div className="empty-icon">!</div>
          <h3>Unable to load problems</h3>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && filteredProblems.length > 0 && (
        <motion.section
          className="problems-list"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.06 },
            },
          }}
        >
          {visibleProblems.map((problem) => {
            const isSolved = solvedProblemIds.has(problem.id);
            const isAttempted = attemptedProblemIds.has(problem.id);

            const problemStatus = isSolved
              ? 'Solved'
              : isAttempted
              ? 'Attempted'
              : 'Unsolved';

            return (
              <motion.article
                key={problem.id}
                className={
                  isSolved
                    ? 'problem-row problem-row-solved'
                    : 'problem-row'
                }
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -3 }}
              >
                <div className="problem-number">
                  {isSolved ? (
                    <span className="solved-check">✓</span>
                  ) : (
                    String(problem.number).padStart(2, '0')
                  )}
                </div>

                <div className="problem-main">
                  <h3>{problem.title}</h3>

                  <div className="problem-topics">
                    {problem.topics.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <span
                    className={`difficulty difficulty-${problem.difficulty.toLowerCase()}`}
                  >
                    {problem.difficulty}
                  </span>
                </div>

                <div className="problem-row-actions">
                  <span
                    className={`problem-status-label problem-status-${problemStatus.toLowerCase()}`}
                  >
                    {problemStatus}
                  </span>

                  <motion.button
                    type="button"
                    className="solve-button"
                    onClick={() => openProblem(problem.id)}
                    whileTap={{ scale: 0.96 }}
                  >
                    Solve →
                  </motion.button>
                </div>
              </motion.article>
            );
          })}
        </motion.section>
      )}

      {!loading && !error && filteredProblems.length === 0 && (
        <motion.div
          className="problems-empty"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="empty-icon">⌕</div>
          <h3>No problems found</h3>
          <p>Try changing your search or filters.</p>
          <button type="button" onClick={resetFilters}>
            Clear filters
          </button>
        </motion.div>
      )}

      {!loading &&
        !error &&
        filteredProblems.length > 0 &&
        totalPages > 1 && (
          <div className="problem-pagination">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              ← Previous
            </button>

            <div className="pagination-pages">
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;

                return (
                  <button
                    type="button"
                    key={page}
                    className={page === currentPage ? 'active' : ''}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next →
            </button>
          </div>
        )}
    </div>
  );
}
