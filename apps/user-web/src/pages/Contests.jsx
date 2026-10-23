import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';

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
    description:
      'Solve algorithmic problems and compete with developers from the CodePage community.',
    startsIn: 3 * 24 * 60 * 60 + 6 * 60 * 60,
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
    description:
      'A challenging contest designed to test algorithms, data structures and problem solving.',
    startsIn: 9 * 24 * 60 * 60,
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
    description:
      'Solve as many problems as possible before the clock runs out.',
    endsIn: 42 * 60,
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
  },
  {
    id: 'codepage-beginner-01',
    title: 'Beginner Coding Cup',
    type: 'Beginner',
    status: 'past',
    date: 'Sep 20, 2026',
    startTime: '6:00 PM',
    duration: '1h',
    participants: 2104,
    difficulty: 'Easy',
    prize: '300 XP',
    description:
      'A beginner-friendly contest covering basic programming and data structures.',
  },
  {
    id: 'codepage-algorithm-01',
    title: 'Algorithm Masters',
    type: 'Challenge',
    status: 'past',
    date: 'Sep 13, 2026',
    startTime: '7:00 PM',
    duration: '2h',
    participants: 934,
    difficulty: 'Hard',
    prize: '1500 XP',
    description:
      'Advanced algorithmic problems for experienced competitive programmers.',
  },
];

const tabs = [
  {
    value: 'all',
    label: 'All Contests',
  },
  {
    value: 'upcoming',
    label: 'Upcoming',
  },
  {
    value: 'live',
    label: 'Live',
  },
  {
    value: 'past',
    label: 'Past',
  },
];

function formatTime(seconds) {
  const safeSeconds = Math.max(0, seconds);

  const days = Math.floor(
    safeSeconds / (24 * 60 * 60)
  );

  const hours = Math.floor(
    (safeSeconds % (24 * 60 * 60)) / (60 * 60)
  );

  const minutes = Math.floor(
    (safeSeconds % (60 * 60)) / 60
  );

  const secs = safeSeconds % 60;

  if (days > 0) {
    return `${days}d ${String(hours).padStart(
      2,
      '0'
    )}h ${String(minutes).padStart(2, '0')}m`;
  }

  return `${String(hours).padStart(
    2,
    '0'
  )}:${String(minutes).padStart(
    2,
    '0'
  )}:${String(secs).padStart(2, '0')}`;
}

function ContestCard({
  contest,
  countdown,
  onOpen,
}) {
  const isLive = contest.status === 'live';
  const isPast = contest.status === 'past';

  function handleOpen() {
    onOpen(contest.id);
  }

  return (
    <motion.article
      className="contest-card"
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -5,
      }}
      transition={{
        duration: 0.35,
      }}
      onClick={handleOpen}
    >
      <div className="contest-card-top">
        <div className="contest-type">
          {contest.type}
        </div>

        <span
          className={`contest-status contest-status-${contest.status}`}
        >
          {isLive
            ? '● LIVE'
            : isPast
            ? 'ENDED'
            : 'UPCOMING'}
        </span>
      </div>

      <h3>{contest.title}</h3>

      <p className="contest-description">
        {contest.description}
      </p>

      <div className="contest-info-grid">
        <div>
          <span>Date</span>
          <strong>{contest.date}</strong>
        </div>

        <div>
          <span>Time</span>
          <strong>{contest.startTime}</strong>
        </div>

        <div>
          <span>Duration</span>
          <strong>{contest.duration}</strong>
        </div>

        <div>
          <span>Participants</span>
          <strong>
            {contest.participants.toLocaleString()}
          </strong>
        </div>
      </div>

      <div className="contest-card-footer">
        <div className="contest-difficulty">
          <span
            className={`contest-difficulty-dot contest-dot-${contest.difficulty.toLowerCase()}`}
          />

          {contest.difficulty}
        </div>

        <div className="contest-prize">
          🏆 {contest.prize}
        </div>
      </div>

      {!isPast && (
        <div
          className={`contest-countdown ${
            isLive
              ? 'contest-countdown-live'
              : ''
          }`}
        >
          <span>
            {isLive
              ? 'Ends in'
              : 'Starts in'}
          </span>

          <strong>
            {formatTime(countdown)}
          </strong>
        </div>
      )}

      <div
        className="contest-card-actions"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {isLive && (
          <motion.button
            type="button"
            className="contest-primary-button"
            onClick={handleOpen}
            whileTap={{
              scale: 0.96,
            }}
          >
            Enter Contest →
          </motion.button>
        )}

        {!isLive && !isPast && (
          <motion.button
            type="button"
            className="contest-primary-button"
            onClick={handleOpen}
            whileTap={{
              scale: 0.96,
            }}
          >
            Register →
          </motion.button>
        )}

        {isPast && (
          <motion.button
            type="button"
            className="contest-secondary-button"
            onClick={handleOpen}
            whileTap={{
              scale: 0.96,
            }}
          >
            View Results →
          </motion.button>
        )}
      </div>
    </motion.article>
  );
}

export function Contests({
  user,
  onLogout,
  darkMode,
  onToggleDarkMode,
}) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState('all');

  const [search, setSearch] =
    useState('');

  const [countdowns, setCountdowns] =
    useState(() =>
      contests.reduce((result, contest) => {
        if (contest.status === 'upcoming') {
          result[contest.id] =
            contest.startsIn;
        }

        if (contest.status === 'live') {
          result[contest.id] =
            contest.endsIn;
        }

        return result;
      }, {})
    );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdowns((previous) => {
        const next = {
          ...previous,
        };

        Object.keys(next).forEach((id) => {
          next[id] = Math.max(
            0,
            next[id] - 1
          );
        });

        return next;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const filteredContests = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return contests.filter((contest) => {
      const matchesTab =
        activeTab === 'all' ||
        contest.status === activeTab;

      const matchesSearch =
        !searchValue ||
        contest.title
          .toLowerCase()
          .includes(searchValue) ||
        contest.type
          .toLowerCase()
          .includes(searchValue) ||
        contest.difficulty
          .toLowerCase()
          .includes(searchValue);

      return (
        matchesTab &&
        matchesSearch
      );
    });
  }, [activeTab, search]);

  function openContest(contestId) {
    navigate(
      `/contests/${contestId}`
    );
  }

  return (
    <div className="page-content">
      <Navbar
        user={user}
        onLogin={() => {}}
        onRegister={() => {}}
        onLogout={onLogout}
        darkMode={darkMode}
        onToggleDarkMode={
          onToggleDarkMode
        }
      />

      <main className="contests-page">
        {/* =================================================
            HERO
        ================================================= */}

        <motion.section
          className="contests-hero"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
        >
          <div className="contests-hero-content">
            <span className="section-badge">
              CODEPAGE CONTESTS
            </span>

            <h1>
              Compete.
              <br />
              <span>Code. Win.</span>
            </h1>

            <p>
              Challenge yourself with
              algorithmic problems, compete
              with developers and climb the
              CodePage rankings.
            </p>
          </div>

          <div className="contest-hero-stats">
            <div>
              <strong>6</strong>
              <span>Contests</span>
            </div>

            <div>
              <strong>
                {contests
                  .reduce(
                    (total, contest) =>
                      total +
                      contest.participants,
                    0
                  )
                  .toLocaleString()}
              </strong>

              <span>Participants</span>
            </div>

            <div>
              <strong>4</strong>
              <span>Contest Types</span>
            </div>
          </div>
        </motion.section>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="contests-toolbar">
          <div className="contest-search-wrapper">
            <span className="contest-search-icon">
              ⌕
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search contests..."
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch('')
                }
                className="contest-search-clear"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* =================================================
            TABS
        ================================================= */}

        <div className="contest-tabs">
          {tabs.map((tab) => {
            const count =
              tab.value === 'all'
                ? contests.length
                : contests.filter(
                    (contest) =>
                      contest.status ===
                      tab.value
                  ).length;

            return (
              <button
                type="button"
                key={tab.value}
                className={
                  activeTab === tab.value
                    ? 'contest-tab active'
                    : 'contest-tab'
                }
                onClick={() =>
                  setActiveTab(
                    tab.value
                  )
                }
              >
                {tab.label}

                <span>{count}</span>
              </button>
            );
          })}
        </div>

        {/* =================================================
            CONTEST GRID
        ================================================= */}

        {filteredContests.length > 0 ? (
          <motion.section
            className="contests-grid"
            layout
          >
            {filteredContests.map(
              (contest) => (
                <ContestCard
                  key={contest.id}
                  contest={contest}
                  countdown={
                    countdowns[
                      contest.id
                    ] || 0
                  }
                  onOpen={
                    openContest
                  }
                />
              )
            )}
          </motion.section>
        ) : (
          <motion.div
            className="contests-empty"
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <div>🏆</div>

            <h3>
              No contests found
            </h3>

            <p>
              Try a different search or
              select another category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch('');
                setActiveTab('all');
              }}
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}