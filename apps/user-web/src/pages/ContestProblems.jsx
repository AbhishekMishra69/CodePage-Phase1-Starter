import { useMemo, useState } from "react";

import { motion } from "framer-motion";

import { Link, useNavigate, useParams } from "react-router-dom";

/* =========================================
   CONTEST DATA
========================================= */

const contestData = {
  "codepage-weekly-01": {
    title: "CodePage Weekly Contest #01",
    shortTitle: "Weekly Contest #01",
    status: "Upcoming",

    problems: [
      {
        id: "cp-w1-a",
        number: "A",
        title: "Two Sum",
        difficulty: "Easy",
        points: 100,
        solved: false,
        acceptance: "72.4%",
      },

      {
        id: "cp-w1-b",
        number: "B",
        title: "Valid Parentheses",
        difficulty: "Easy",
        points: 150,
        solved: false,
        acceptance: "68.1%",
      },

      {
        id: "cp-w1-c",
        number: "C",
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        points: 250,
        solved: false,
        acceptance: "54.7%",
      },

      {
        id: "cp-w1-d",
        number: "D",
        title: "Merge Intervals",
        difficulty: "Medium",
        points: 300,
        solved: false,
        acceptance: "48.3%",
      },

      {
        id: "cp-w1-e",
        number: "E",
        title: "Minimum Window Substring",
        difficulty: "Hard",
        points: 500,
        solved: false,
        acceptance: "36.8%",
      },
    ],
  },

  "codepage-biweekly-01": {
    title: "CodePage Biweekly Contest #01",
    shortTitle: "Biweekly Contest #01",
    status: "Upcoming",

    problems: [
      {
        id: "cp-b1-a",
        number: "A",
        title: "Palindrome Number",
        difficulty: "Easy",
        points: 100,
        solved: false,
        acceptance: "81.2%",
      },

      {
        id: "cp-b1-b",
        number: "B",
        title: "Group Anagrams",
        difficulty: "Medium",
        points: 200,
        solved: false,
        acceptance: "63.4%",
      },

      {
        id: "cp-b1-c",
        number: "C",
        title: "Maximum Product Subarray",
        difficulty: "Medium",
        points: 300,
        solved: false,
        acceptance: "44.9%",
      },
    ],
  },
};

/* =========================================
   DEFAULT CONTEST
========================================= */

const defaultContest = {
  title: "CodePage Contest",
  shortTitle: "CodePage Contest",
  status: "Upcoming",

  problems: [
    {
      id: "default-a",
      number: "A",
      title: "Two Sum",
      difficulty: "Easy",
      points: 100,
      solved: false,
      acceptance: "72.4%",
    },

    {
      id: "default-b",
      number: "B",
      title: "Valid Parentheses",
      difficulty: "Easy",
      points: 150,
      solved: false,
      acceptance: "68.1%",
    },

    {
      id: "default-c",
      number: "C",
      title: "Longest Substring",
      difficulty: "Medium",
      points: 250,
      solved: false,
      acceptance: "54.7%",
    },
  ],
};

/* =========================================
   DIFFICULTY BADGE
========================================= */

function DifficultyBadge({ difficulty }) {
  const safeDifficulty = String(difficulty || "Unknown");
  const difficultyClass = safeDifficulty.toLowerCase();

  return (
    <span
      className={`contest-problem-difficulty ${difficultyClass}`}
    >
      {safeDifficulty}
    </span>
  );
}

/* =========================================
   CONTEST PROBLEMS
========================================= */

export function ContestProblems({
  user,
  onLogout,
  darkMode,
  onToggleDarkMode,
}) {
  const { contestId } = useParams();

  const navigate = useNavigate();

  /* =========================================
     CURRENT CONTEST
  ========================================= */

  const contest = useMemo(
    () => contestData[contestId] || defaultContest,
    [contestId]
  );

  /* =========================================
     SEARCH / FILTER
  ========================================= */

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  /* =========================================
     FILTERED PROBLEMS
  ========================================= */

  const filteredProblems = useMemo(() => {
    const safeProblems = Array.isArray(contest.problems)
      ? contest.problems
      : [];

    const searchValue = String(search || "")
      .trim()
      .toLowerCase();

    return safeProblems.filter((problem) => {
      const title = String(problem?.title || "").toLowerCase();

      const difficulty = String(
        problem?.difficulty || ""
      ).toLowerCase();

      const solved = Boolean(problem?.solved);

      const matchesSearch =
        !searchValue ||
        title.includes(searchValue) ||
        difficulty.includes(searchValue);

      const matchesFilter =
        filter === "All" ||
        difficulty === String(filter || "").toLowerCase() ||
        (filter === "Solved" && solved) ||
        (filter === "Unsolved" && !solved);

      return matchesSearch && matchesFilter;
    });
  }, [contest.problems, search, filter]);

  /* =========================================
     SOLVED COUNT
  ========================================= */

  const solvedCount = Array.isArray(contest.problems)
    ? contest.problems.filter(
        (problem) => Boolean(problem?.solved)
      ).length
    : 0;

  /* =========================================
     OPEN PROBLEM
  ========================================= */

  function openProblem(problem) {
    if (!problem?.id) {
      return;
    }

    navigate(`/problems/${problem.id}`);
  }

  /* =========================================
     SAFE USER INITIAL
  ========================================= */

  const userInitial =
    String(user?.username || user?.name || "U")
      .trim()
      .charAt(0)
      .toUpperCase() || "U";

  /* =========================================
     TOTAL POINTS
  ========================================= */

  const totalPoints = Array.isArray(contest.problems)
    ? contest.problems.reduce(
        (total, problem) =>
          total + Number(problem?.points || 0),
        0
      )
    : 0;

  /* =========================================
     PROGRESS
  ========================================= */

  const progressPercentage =
    contest.problems.length > 0
      ? (solvedCount / contest.problems.length) * 100
      : 0;

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="contest-problems-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="contest-problems-header">
        <div className="contest-problems-header-inner">

          <button
            className="contest-back-button"
            onClick={() =>
              navigate(`/contests/${contestId}`)
            }
          >
            ← Back to Contest
          </button>

          <div className="contest-problems-brand">
            <Link to="/">CodePage</Link>
          </div>

          <div className="contest-problems-header-actions">

            <button
              className="contest-theme-button"
              onClick={onToggleDarkMode}
            >
              {darkMode ? "☀" : "☾"}
            </button>

            {user ? (
              <button
                className="contest-profile-button"
                onClick={() =>
                  navigate(
                    `/profile/${user.username || user.name || "user"}`
                  )
                }
              >
                {userInitial}
              </button>
            ) : (
              <Link
                to="/"
                className="contest-login-link"
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

      <main className="contest-problems-container">

        {/* =========================================
            HERO
        ========================================= */}

        <motion.section
          className="contest-problems-hero"
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
        >

          <div>

            <div className="contest-problems-eyebrow">
              {contest.status} · Coding Contest
            </div>

            <h1>
              {contest.title}
            </h1>

            <p>
              Solve the problems, earn points and improve
              your contest ranking.
            </p>

          </div>

          {/* PROGRESS */}

          <div className="contest-progress-card">

            <span>Your Progress</span>

            <strong>
              {solvedCount}/{contest.problems.length}
            </strong>

            <div className="contest-progress-bar">

              <span
                style={{
                  width: `${progressPercentage}%`,
                }}
              />

            </div>

          </div>

        </motion.section>

        {/* =========================================
            TOOLBAR
        ========================================= */}

        <section className="contest-problems-toolbar">

          {/* SEARCH */}

          <div className="contest-problems-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>

          {/* FILTERS */}

          <div className="contest-problem-filters">

            {[
              "All",
              "Easy",
              "Medium",
              "Hard",
              "Solved",
              "Unsolved",
            ].map((item) => (

              <button
                type="button"
                key={item}
                className={
                  filter === item ? "active" : ""
                }
                onClick={() => setFilter(item)}
              >
                {item}
              </button>

            ))}

          </div>

        </section>

        {/* =========================================
            PROBLEMS CARD
        ========================================= */}

        <motion.section
          className="contest-problems-card"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
        >

          {/* CARD HEADER */}

          <div className="contest-problems-card-header">

            <div>

              <h2>
                Contest Problems
              </h2>

              <p>
                {filteredProblems.length} problems available
              </p>

            </div>

            <div className="contest-total-points">

              Total Points

              <strong>
                {totalPoints}
              </strong>

            </div>

          </div>

          {/* PROBLEM LIST */}

          <div className="contest-problem-list">

            {filteredProblems.length > 0 ? (

              filteredProblems.map(
                (problem, index) => (

                  <motion.article
                    key={
                      problem?.id ||
                      `problem-${index}`
                    }
                    className="contest-problem-row"
                    initial={{
                      opacity: 0,
                      x: -10,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                    }}
                    onClick={() =>
                      openProblem(problem)
                    }
                  >

                    {/* NUMBER */}

                    <div className="contest-problem-number">

                      {problem?.solved
                        ? "✓"
                        : problem?.number || index + 1}

                    </div>

                    {/* MAIN */}

                    <div className="contest-problem-main">

                      <div className="contest-problem-title">

                        {problem?.title ||
                          "Untitled Problem"}

                      </div>

                      <div className="contest-problem-meta">

                        <DifficultyBadge
                          difficulty={
                            problem?.difficulty
                          }
                        />

                        <span>
                          {problem?.acceptance ||
                            "N/A"}{" "}
                          acceptance
                        </span>

                      </div>

                    </div>

                    {/* POINTS */}

                    <div className="contest-problem-points">

                      <span>
                        Points
                      </span>

                      <strong>
                        {Number(
                          problem?.points || 0
                        )}
                      </strong>

                    </div>

                    {/* SOLVE */}

                    <button
                      type="button"
                      className="contest-solve-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        openProblem(problem);
                      }}
                    >
                      Solve →
                    </button>

                  </motion.article>

                )
              )

            ) : (

              <div className="contest-problems-empty">

                <div>⌕</div>

                <h3>
                  No problems found
                </h3>

                <p>
                  Try changing your search or filter.
                </p>

              </div>

            )}

          </div>

        </motion.section>

        {/* =========================================
            BOTTOM NAVIGATION
        ========================================= */}

        <section className="contest-problems-bottom">

          <button
            type="button"
            className="contest-secondary-button"
            onClick={() =>
              navigate(`/contests/${contestId}`)
            }
          >
            ← Contest Overview
          </button>

          <button
            type="button"
            className="contest-ranking-button"
            onClick={() =>
              navigate(
                `/contests/${contestId}/ranking`
              )
            }
          >
            View Ranking →
          </button>

        </section>

      </main>

    </div>
  );
}