import { useMemo, useState } from 'react';

import { motion } from 'framer-motion';

import { Link, useNavigate, useParams } from 'react-router-dom';

const contestData = {
  'codepage-weekly-01': {
    title: 'CodePage Weekly Contest #01',

    participants: [
      {
        rank: 1,
        username: 'CodeMaster',
        solved: 5,
        score: 1250,
        time: '01:42:18',
        penalty: 0,
      },

      {
        rank: 2,
        username: 'AlgoNinja',
        solved: 5,
        score: 1180,
        time: '01:51:42',
        penalty: 0,
      },

      {
        rank: 3,
        username: 'JavaDev',
        solved: 4,
        score: 950,
        time: '01:38:21',
        penalty: 12,
      },

      {
        rank: 4,
        username: 'ByteRunner',
        solved: 4,
        score: 880,
        time: '01:56:34',
        penalty: 18,
      },

      {
        rank: 5,
        username: 'LogicPro',
        solved: 3,
        score: 720,
        time: '01:27:45',
        penalty: 21,
      },

      {
        rank: 6,
        username: 'DevHunter',
        solved: 3,
        score: 650,
        time: '01:44:29',
        penalty: 25,
      },

      {
        rank: 7,
        username: 'PythonPro',
        solved: 3,
        score: 610,
        time: '01:52:10',
        penalty: 31,
      },

      {
        rank: 8,
        username: 'CodeExplorer',
        solved: 2,
        score: 480,
        time: '01:15:40',
        penalty: 35,
      },

      {
        rank: 9,
        username: 'BugHunter',
        solved: 2,
        score: 420,
        time: '01:33:17',
        penalty: 41,
      },

      {
        rank: 10,
        username: 'StackCoder',
        solved: 2,
        score: 390,
        time: '01:48:52',
        penalty: 46,
      },

      {
        rank: 11,
        username: 'WebWizard',
        solved: 1,
        score: 210,
        time: '00:52:16',
        penalty: 18,
      },

      {
        rank: 12,
        username: 'NewCoder',
        solved: 1,
        score: 180,
        time: '01:04:38',
        penalty: 23,
      },
    ],
  },

  'codepage-biweekly-01': {
    title: 'CodePage Biweekly Contest #01',

    participants: [
      {
        rank: 1,
        username: 'AlgoKing',
        solved: 3,
        score: 700,
        time: '01:21:34',
        penalty: 0,
      },

      {
        rank: 2,
        username: 'CodeMaster',
        solved: 3,
        score: 650,
        time: '01:35:18',
        penalty: 4,
      },

      {
        rank: 3,
        username: 'DevHunter',
        solved: 2,
        score: 480,
        time: '01:17:42',
        penalty: 8,
      },

      {
        rank: 4,
        username: 'JavaDev',
        solved: 2,
        score: 430,
        time: '01:29:22',
        penalty: 13,
      },

      {
        rank: 5,
        username: 'PythonPro',
        solved: 1,
        score: 210,
        time: '00:58:15',
        penalty: 20,
      },
    ],
  },
};

const defaultContest = {
  title: 'CodePage Contest',

  participants: [
    {
      rank: 1,
      username: 'CodeMaster',
      solved: 3,
      score: 700,
      time: '01:21:34',
      penalty: 0,
    },

    {
      rank: 2,
      username: 'AlgoNinja',
      solved: 2,
      score: 500,
      time: '01:35:18',
      penalty: 5,
    },

    {
      rank: 3,
      username: 'JavaDev',
      solved: 2,
      score: 430,
      time: '01:42:22',
      penalty: 9,
    },
  ],
};

/* =========================================
   SAFE USERNAME HELPERS
========================================= */

function getInitial(username) {
  const safeUsername = String(username || 'User').trim();

  return safeUsername.charAt(0).toUpperCase();
}

function getSafeUsername(username) {
  return String(username || 'Unknown User').trim();
}

/* =========================================
   PODIUM CARD
========================================= */

function PodiumCard({ participant, position }) {
  const username = getSafeUsername(participant?.username);

  return (
    <motion.div
      className={`ranking-podium-card position-${position}`}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: position * 0.08,
      }}
    >
      <div className="ranking-medal">
        {position === 1
          ? '🥇'
          : position === 2
          ? '🥈'
          : '🥉'}
      </div>

      <div className="ranking-avatar large">
        {getInitial(username)}
      </div>

      <h3>{username}</h3>

      <div className="ranking-podium-score">
        {participant?.score ?? 0}

        <span>pts</span>
      </div>

      <div className="ranking-podium-solved">
        {participant?.solved ?? 0} problems solved
      </div>
    </motion.div>
  );
}

/* =========================================
   CONTEST RANKING
========================================= */

export function ContestRanking({
  user,
  onLogout,
  darkMode,
  onToggleDarkMode,
}) {
  const { contestId } = useParams();

  const navigate = useNavigate();

  const contest = useMemo(
    () => contestData[contestId] || defaultContest,
    [contestId]
  );

  const [search, setSearch] = useState('');

  /* =========================================
     FILTER PARTICIPANTS
  ========================================= */

  const filteredParticipants = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return contest.participants.filter((participant) => {
      const username = getSafeUsername(
        participant?.username
      ).toLowerCase();

      return username.includes(searchValue);
    });
  }, [contest.participants, search]);

  const topThree = contest.participants.slice(0, 3);

  const currentUsername = String(
    user?.username || ''
  )
    .trim()
    .toLowerCase();

  return (
    <div className="contest-ranking-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="contest-ranking-header">
        <div className="contest-ranking-header-inner">

          <button
            className="contest-ranking-back"
            onClick={() =>
              navigate(`/contests/${contestId}`)
            }
          >
            ← Back to Contest
          </button>

          <div className="contest-ranking-brand">
            <Link to="/">CodePage</Link>
          </div>

          <div className="contest-ranking-header-actions">

            <button
              className="contest-ranking-theme"
              onClick={onToggleDarkMode}
            >
              {darkMode ? '☀' : '☾'}
            </button>

            {user ? (
              <button
                className="contest-ranking-profile"
                onClick={() =>
                  user?.username
                    ? navigate(
                        `/profile/${user.username}`
                      )
                    : null
                }
              >
                {getInitial(user?.username)}
              </button>
            ) : (
              <Link
                to="/"
                className="contest-ranking-login"
              >
                Login
              </Link>
            )}

          </div>
        </div>
      </header>

      {/* =========================================
          MAIN
      ========================================= */}

      <main className="contest-ranking-container">

        {/* =========================================
            HERO
        ========================================= */}

        <motion.section
          className="contest-ranking-hero"
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <div>

            <div className="contest-ranking-eyebrow">
              Contest Leaderboard
            </div>

            <h1>{contest.title}</h1>

            <p>
              See how participants performed in this
              contest.
            </p>

          </div>

          <div className="ranking-participant-count">
            <strong>
              {contest.participants.length}
            </strong>

            <span>Participants</span>
          </div>
        </motion.section>

        {/* =========================================
            PODIUM
        ========================================= */}

        {topThree.length >= 3 && (
          <section className="ranking-podium">

            <PodiumCard
              participant={topThree[1]}
              position={2}
            />

            <PodiumCard
              participant={topThree[0]}
              position={1}
            />

            <PodiumCard
              participant={topThree[2]}
              position={3}
            />

          </section>
        )}

        {/* =========================================
            RANKING TABLE
        ========================================= */}

        <section className="ranking-table-section">

          <div className="ranking-table-header">

            <div>
              <h2>Contest Ranking</h2>

              <p>All participants</p>
            </div>

            <div className="ranking-search">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search username..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

            </div>

          </div>

          <div className="ranking-table-wrapper">

            {/* TABLE HEADER */}

            <div className="ranking-table-head">

              <span>Rank</span>

              <span>Participant</span>

              <span>Solved</span>

              <span>Score</span>

              <span>Time</span>

              <span>Penalty</span>

            </div>

            {/* TABLE BODY */}

            <div className="ranking-table-body">

              {filteredParticipants.length > 0 ? (

                filteredParticipants.map(
                  (participant, index) => {

                    const participantUsername =
                      getSafeUsername(
                        participant?.username
                      );

                    const isCurrentUser =
                      currentUsername &&
                      participantUsername
                        .toLowerCase() ===
                        currentUsername;

                    return (
                      <motion.div
                        key={`${participantUsername}-${participant?.rank ?? index}`}
                        className={`ranking-table-row ${
                          isCurrentUser
                            ? 'current-user'
                            : ''
                        }`}
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.25,
                          delay: index * 0.035,
                        }}
                      >

                        {/* RANK */}

                        <div className="ranking-rank">
                          #{participant?.rank ?? index + 1}
                        </div>

                        {/* USER */}

                        <div className="ranking-user">

                          <div className="ranking-avatar">
                            {getInitial(
                              participantUsername
                            )}
                          </div>

                          <div>

                            <strong>
                              {participantUsername}
                            </strong>

                            {isCurrentUser && (
                              <span className="you-badge">
                                You
                              </span>
                            )}

                          </div>

                        </div>

                        {/* SOLVED */}

                        <div className="ranking-solved">
                          {participant?.solved ?? 0}
                        </div>

                        {/* SCORE */}

                        <div className="ranking-score">
                          {participant?.score ?? 0}
                        </div>

                        {/* TIME */}

                        <div className="ranking-time">
                          {participant?.time || '--:--:--'}
                        </div>

                        {/* PENALTY */}

                        <div className="ranking-penalty">
                          {participant?.penalty ?? 0}
                        </div>

                      </motion.div>
                    );
                  }
                )

              ) : (

                <div className="ranking-empty">

                  <div>⌕</div>

                  <h3>No participant found</h3>

                  <p>
                    Try another username.
                  </p>

                </div>

              )}

            </div>
          </div>
        </section>

        {/* =========================================
            BOTTOM ACTIONS
        ========================================= */}

        <section className="contest-ranking-actions">

          <button
            className="ranking-secondary-button"
            onClick={() =>
              navigate(
                `/contests/${contestId}/problems`
              )
            }
          >
            ← View Problems
          </button>

          <button
            className="ranking-primary-button"
            onClick={() =>
              navigate(`/contests/${contestId}`)
            }
          >
            Contest Overview →
          </button>

        </section>

      </main>
    </div>
  );
}