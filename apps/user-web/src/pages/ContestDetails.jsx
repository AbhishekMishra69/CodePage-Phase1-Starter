import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const contests = [
  {
    id: 'codepage-weekly-01',
    title: 'CodePage Weekly Contest 01',
    type: 'Weekly',
    status: 'upcoming',
    date: 'Oct 4, 2026',
    startTime: '8:00 PM',
    duration: '1h 30m',
    participants: 1248,
    difficulty: 'Medium',
    prize: '500 XP',
    startsIn: 3 * 24 * 60 * 60 + 6 * 60 * 60,
    description:
      'Solve algorithmic problems and compete with developers from the CodePage community.',
    problems: 4,
  },
  {
    id: 'codepage-biweekly-01',
    title: 'CodePage Biweekly Challenge',
    type: 'Biweekly',
    status: 'upcoming',
    date: 'Oct 10, 2026',
    startTime: '7:00 PM',
    duration: '2h',
    participants: 2341,
    difficulty: 'Hard',
    prize: '1000 XP',
    startsIn: 9 * 24 * 60 * 60,
    description:
      'A challenging contest designed to test algorithms, data structures and problem solving.',
    problems: 5,
  },
  {
    id: 'codepage-speed-01',
    title: 'Speed Coding Challenge',
    type: 'Speed',
    status: 'live',
    date: 'Today',
    startTime: '10:00 AM',
    duration: '1h',
    participants: 876,
    difficulty: 'Medium',
    prize: '750 XP',
    endsIn: 42 * 60,
    description:
      'Solve as many problems as possible before the clock runs out.',
    problems: 5,
  },
  {
    id: 'codepage-weekly-00',
    title: 'CodePage Weekly Contest 00',
    type: 'Weekly',
    status: 'past',
    date: 'Sep 27, 2026',
    startTime: '8:00 PM',
    duration: '1h 30m',
    participants: 1587,
    difficulty: 'Medium',
    prize: '500 XP',
    description:
      'The first CodePage weekly programming contest.',
    problems: 4,
  },
];

const contestProblems = [
  {
    number: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    points: 100,
    solved: 842,
  },
  {
    number: 2,
    title: 'Longest Substring',
    difficulty: 'Medium',
    points: 200,
    solved: 521,
  },
  {
    number: 3,
    title: 'Merge Intervals',
    difficulty: 'Medium',
    points: 250,
    solved: 386,
  },
  {
    number: 4,
    title: 'Maximum Path',
    difficulty: 'Hard',
    points: 350,
    solved: 143,
  },
];

const rankingPreview = [
  { rank: 1, username: 'CodeMaster', score: 850 },
  { rank: 2, username: 'AlgoNinja', score: 790 },
  { rank: 3, username: 'JavaDev', score: 720 },
  { rank: 4, username: 'PythonPro', score: 680 },
  { rank: 5, username: 'DevHunter', score: 640 },
];

function formatCountdown(totalSeconds) {
  const seconds = Math.max(totalSeconds, 0);

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) {
    return `${days}d ${String(hours).padStart(2, '0')}h ${String(
      minutes
    ).padStart(2, '0')}m`;
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}:${String(secs).padStart(2, '0')}`;
}

export function ContestDetails({
  user,
  onLogout,
  darkMode,
  onToggleDarkMode,
}) {
  const { contestId } = useParams();
  const navigate = useNavigate();

  const contest = useMemo(
    () =>
      contests.find((item) => item.id === contestId) ||
      contests[0],
    [contestId]
  );

  const initialCountdown =
    contest.status === 'live'
      ? contest.endsIn || 0
      : contest.startsIn || 0;

  const [countdown, setCountdown] = useState(initialCountdown);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    setCountdown(initialCountdown);

    const timer = setInterval(() => {
      setCountdown((previous) =>
        previous > 0 ? previous - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [initialCountdown]);

  const isLive = contest.status === 'live';
  const isPast = contest.status === 'past';

  function handlePrimaryAction() {
    if (isPast) {
      navigate(`/contests/${contest.id}/ranking`);
      return;
    }

    if (isLive) {
      navigate(`/contests/${contest.id}/problems`);
      return;
    }

    setRegistered(true);
  }

  return (
    <div className="contest-details-page">
      <header className="contest-details-header">
        <div className="contest-details-header-inner">
          <button
            className="contest-back-button"
            onClick={() => navigate('/contests')}
          >
            ← Back to Contests
          </button>

          <div className="contest-header-actions">
            <button
              className="contest-theme-button"
              onClick={onToggleDarkMode}
              title="Toggle theme"
            >
              {darkMode ? '☀' : '☾'}
            </button>

            {user ? (
              <button
                className="contest-profile-button"
                onClick={() =>
                  navigate(`/profile/${user.username || 'me'}`)
                }
              >
                {user.username || 'Profile'}
              </button>
            ) : (
              <button
                className="contest-login-button"
                onClick={() => navigate('/')}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="contest-details-main">
        <motion.section
          className="contest-details-hero"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="contest-details-hero-content">
            <div className="contest-breadcrumb">
              Contests <span>/</span> {contest.type}
            </div>

            <div className="contest-title-row">
              <div>
                <div className="contest-type-badge">
                  {isLive ? '🔴 LIVE CONTEST' : contest.type}
                </div>

                <h1>{contest.title}</h1>

                <p>{contest.description}</p>
              </div>

              <div className={`contest-status-large ${contest.status}`}>
                {isLive
                  ? 'Live Now'
                  : isPast
                  ? 'Completed'
                  : 'Upcoming'}
              </div>
            </div>

            <div className="contest-details-meta">
              <div className="contest-meta-item">
                <span>📅</span>
                <div>
                  <small>Date</small>
                  <strong>{contest.date}</strong>
                </div>
              </div>

              <div className="contest-meta-item">
                <span>🕐</span>
                <div>
                  <small>Start Time</small>
                  <strong>{contest.startTime}</strong>
                </div>
              </div>

              <div className="contest-meta-item">
                <span>⏱</span>
                <div>
                  <small>Duration</small>
                  <strong>{contest.duration}</strong>
                </div>
              </div>

              <div className="contest-meta-item">
                <span>👥</span>
                <div>
                  <small>Participants</small>
                  <strong>
                    {contest.participants.toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="contest-meta-item">
                <span>🏆</span>
                <div>
                  <small>Prize</small>
                  <strong>{contest.prize}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="contest-countdown-card">
            <span>
              {isLive
                ? 'Contest Ends In'
                : isPast
                ? 'Contest Status'
                : 'Contest Starts In'}
            </span>

            <strong>
              {isPast ? 'Completed' : formatCountdown(countdown)}
            </strong>

            {!isPast && (
              <div className="countdown-labels">
                <span>TIME REMAINING</span>
              </div>
            )}

            <button
              className={`contest-main-action ${
                isLive ? 'live-action' : ''
              }`}
              onClick={handlePrimaryAction}
            >
              {isPast
                ? 'View Ranking'
                : isLive
                ? 'Enter Contest'
                : registered
                ? '✓ Registered'
                : 'Register Now'}
            </button>
          </div>
        </motion.section>

        <nav className="contest-details-nav">
          <button className="active">Overview</button>

          <button
            onClick={() =>
              navigate(`/contests/${contest.id}/problems`)
            }
          >
            Problems
          </button>

          <button
            onClick={() =>
              navigate(`/contests/${contest.id}/ranking`)
            }
          >
            Ranking
          </button>
        </nav>

        <div className="contest-details-layout">
          <section className="contest-details-left">
            <motion.div
              className="contest-content-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="contest-card-heading">
                <span>📋</span>
                <div>
                  <h2>About This Contest</h2>
                  <p>Everything you need to know before competing.</p>
                </div>
              </div>

              <p className="contest-description">
                {contest.description} This contest focuses on
                algorithmic thinking, efficient problem solving and
                practical data structure knowledge.
              </p>

              <div className="contest-highlight-grid">
                <div>
                  <strong>{contest.problems}</strong>
                  <span>Problems</span>
                </div>

                <div>
                  <strong>{contest.duration}</strong>
                  <span>Duration</span>
                </div>

                <div>
                  <strong>{contest.difficulty}</strong>
                  <span>Difficulty</span>
                </div>

                <div>
                  <strong>{contest.prize}</strong>
                  <span>Total Prize</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="contest-content-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="contest-card-heading">
                <span>💻</span>
                <div>
                  <h2>Problems</h2>
                  <p>
                    {contest.problems} problems are included in this
                    contest.
                  </p>
                </div>
              </div>

              <div className="contest-problem-list">
                {contestProblems
                  .slice(0, contest.problems)
                  .map((problem) => (
                    <div
                      className="contest-problem-row"
                      key={problem.number}
                    >
                      <div className="contest-problem-number">
                        {problem.number}
                      </div>

                      <div className="contest-problem-title">
                        <strong>{problem.title}</strong>
                        <span>
                          {problem.solved.toLocaleString()} solved
                        </span>
                      </div>

                      <span
                        className={`contest-problem-difficulty ${problem.difficulty.toLowerCase()}`}
                      >
                        {problem.difficulty}
                      </span>

                      <span className="contest-problem-points">
                        {problem.points} pts
                      </span>
                    </div>
                  ))}
              </div>

              <button
                className="view-all-problems"
                onClick={() =>
                  navigate(`/contests/${contest.id}/problems`)
                }
              >
                View All Problems →
              </button>
            </motion.div>

            <motion.div
              className="contest-content-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="contest-card-heading">
                <span>📜</span>
                <div>
                  <h2>Contest Rules</h2>
                  <p>Please read the rules before starting.</p>
                </div>
              </div>

              <ol className="contest-rules">
                <li>
                  Each participant must use their own CodePage
                  account.
                </li>
                <li>
                  Solutions must be submitted during the contest
                  duration.
                </li>
                <li>
                  Participants may choose from the supported
                  programming languages.
                </li>
                <li>
                  Ranking is determined by score and submission
                  time.
                </li>
                <li>
                  Any form of cheating or plagiarism is prohibited.
                </li>
                <li>
                  Contest submissions may be reviewed for
                  violations.
                </li>
              </ol>
            </motion.div>
          </section>

          <aside className="contest-details-right">
            <motion.div
              className="contest-side-card prize-card"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="side-card-icon">🏆</div>

              <h3>Contest Rewards</h3>

              <div className="prize-main">
                <strong>{contest.prize}</strong>
                <span>Total XP</span>
              </div>

              <div className="prize-row">
                <span>🥇 1st Place</span>
                <strong>250 XP</strong>
              </div>

              <div className="prize-row">
                <span>🥈 2nd Place</span>
                <strong>150 XP</strong>
              </div>

              <div className="prize-row">
                <span>🥉 3rd Place</span>
                <strong>100 XP</strong>
              </div>
            </motion.div>

            <motion.div
              className="contest-side-card"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="side-card-title">
                <span>📊</span>
                <h3>Ranking Preview</h3>
              </div>

              <div className="ranking-preview">
                {rankingPreview.map((item) => (
                  <div
                    className="ranking-preview-row"
                    key={item.rank}
                  >
                    <span className="ranking-position">
                      #{item.rank}
                    </span>

                    <div className="ranking-avatar">
                      {item.username.charAt(0)}
                    </div>

                    <strong>{item.username}</strong>

                    <span className="ranking-score">
                      {item.score}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className="side-card-link"
                onClick={() =>
                  navigate(`/contests/${contest.id}/ranking`)
                }
              >
                View Full Ranking →
              </button>
            </motion.div>

            <motion.div
              className="contest-side-card participants-card"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="participants-icon">👥</div>

              <strong>
                {contest.participants.toLocaleString()}
              </strong>

              <span>developers participating</span>

              <div className="participant-bars">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </motion.div>
          </aside>
        </div>
      </main>
    </div>
  );
}