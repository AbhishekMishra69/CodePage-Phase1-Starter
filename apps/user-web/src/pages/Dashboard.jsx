import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar.jsx";
import "../styles/Dashboard.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export function Dashboard({
  user,
  onLogin,
  onRegister,
  onLogout,
  darkMode,
  onToggleDarkMode,
}) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSubmissions() {
      const token = localStorage.getItem("codepage_token");

      if (!token) {
        setError("Please sign in to view your dashboard.");
        setLoading(false);
        return;
      }

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
            data.message || "Unable to load submissions."
          );
        }

        setSubmissions(data.submissions || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadSubmissions();
  }, []);

  const acceptedSubmissions = submissions.filter(
    (submission) => submission.status === "Accepted"
  );

  const solvedProblems = new Map();

  acceptedSubmissions.forEach((submission) => {
    const slug =
      submission.problem?.slug || submission.problemSlug;

    if (slug) solvedProblems.set(slug, submission);
  });

  const solved = [...solvedProblems.values()];

  const difficultyCounts = {
    Easy: 0,
    Medium: 0,
    Hard: 0,
  };

  solved.forEach((submission) => {
    const difficulty = submission.problem?.difficulty;

    if (difficultyCounts[difficulty] !== undefined) {
      difficultyCounts[difficulty] += 1;
    }
  });

  const acceptanceRate = submissions.length
    ? Math.round(
        (acceptedSubmissions.length / submissions.length) * 100
      )
    : 0;

  const easyPercent = solved.length
    ? (difficultyCounts.Easy / solved.length) * 100
    : 0;

  const mediumPercent = solved.length
    ? (difficultyCounts.Medium / solved.length) * 100
    : 0;

  const hardPercent = solved.length
    ? (difficultyCounts.Hard / solved.length) * 100
    : 0;

  // Build daily activity from available submissions.
  const activity = useMemo(() => {
    const counts = {};

    submissions.forEach((submission) => {
      if (!submission.createdAt) return;

      const date = new Date(submission.createdAt);

      if (Number.isNaN(date.getTime())) return;

      const key = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

      counts[key] = (counts[key] || 0) + 1;
    });

    return counts;
  }, [submissions]);

  const heatmap = useMemo(() => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const start = new Date(today);
    start.setDate(start.getDate() - 363);
    start.setDate(start.getDate() - start.getDay());

    const days = [];
    const cursor = new Date(start);

    while (cursor <= today) {
      const key = [
        cursor.getFullYear(),
        String(cursor.getMonth() + 1).padStart(2, "0"),
        String(cursor.getDate()).padStart(2, "0"),
      ].join("-");

      const count = activity[key] || 0;

      days.push({
        key,
        count,
        date: new Date(cursor),
        future: cursor > today,
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    return days;
  }, [activity]);

  const activeDays = heatmap.filter(
    (day) => day.count > 0
  ).length;

  const activityTotal = heatmap.reduce(
    (total, day) => total + day.count,
    0
  );

  // Current streak calculation.
  const todayKey = (() => {
    const today = new Date();

    return [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");
  })();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayKey = [
    yesterday.getFullYear(),
    String(yesterday.getMonth() + 1).padStart(2, "0"),
    String(yesterday.getDate()).padStart(2, "0"),
  ].join("-");

  const currentStreak = (() => {
    let streak = 0;
    const cursor = new Date();
    cursor.setHours(12, 0, 0, 0);

    const keyForDate = (date) =>
      [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

    if (!activity[todayKey] && !activity[yesterdayKey]) {
      return 0;
    }

    if (!activity[todayKey]) {
      cursor.setDate(cursor.getDate() - 1);
    }

    while (activity[keyForDate(cursor)]) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
  })();

  // Longest consecutive activity streak in the displayed heatmap.
  const longestStreak = (() => {
    let longest = 0;
    let streak = 0;

    heatmap.forEach((day) => {
      if (day.count > 0) {
        streak++;
        longest = Math.max(longest, streak);
      } else {
        streak = 0;
      }
    });

    return longest;
  })();

  function getHeatLevel(count) {
    if (count === 0) return "level-0";
    if (count === 1) return "level-1";
    if (count <= 3) return "level-2";
    if (count <= 5) return "level-3";
    return "level-4";
  }

  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = "";

    heatmap.forEach((day) => {
      const monthKey =
        `${day.date.getFullYear()}-${day.date.getMonth()}`;

      if (monthKey !== lastMonth) {
        labels.push({
          label: day.date.toLocaleDateString("en-US", {
            month: "short",
          }),
          key: monthKey,
          week: Math.floor(
            (day.date - heatmap[0].date) /
              (7 * 24 * 60 * 60 * 1000)
          ),
        });

        lastMonth = monthKey;
      }
    });

    return labels;
  }, [heatmap]);

  return (
    <div className="page-content">
      <Navbar
        user={user}
        onLogin={onLogin}
        onRegister={onRegister}
        onLogout={onLogout}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />

      <main className="dashboard-page">
        <section className="dashboard-heading">
          <div>
            <p className="dashboard-eyebrow">
              CODEPAGE DASHBOARD
            </p>

            <h1>Welcome back, {user?.name || "Coder"}!</h1>

            <p>
              Track your coding practice and keep improving every day.
            </p>
          </div>

          <Link to="/problems" className="dashboard-solve-btn">
            Solve Problems <span>→</span>
          </Link>
        </section>

        {loading ? (
          <div className="dashboard-message">
            Loading your coding statistics...
          </div>
        ) : error ? (
          <div className="dashboard-message dashboard-error">
            {error}
          </div>
        ) : (
          <>
            <section className="dashboard-stats">
              <article className="dashboard-stat-card">
                <div className="dashboard-stat-icon purple">⌘</div>
                <p>Total Submissions</p>
                <strong>{submissions.length}</strong>
                <span className="dashboard-stat-caption">
                  All attempts
                </span>
              </article>

              <article className="dashboard-stat-card">
                <div className="dashboard-stat-icon green">✓</div>
                <p>Problems Solved</p>
                <strong>{solved.length}</strong>
                <span className="dashboard-stat-caption">
                  Unique accepted problems
                </span>
              </article>

              <article className="dashboard-stat-card">
                <div className="dashboard-stat-icon blue">↗</div>
                <p>Accepted Submissions</p>
                <strong>{acceptedSubmissions.length}</strong>
                <span className="dashboard-stat-caption">
                  Successful attempts
                </span>
              </article>

              <article className="dashboard-stat-card">
                <div className="dashboard-stat-icon orange">%</div>
                <p>Acceptance Rate</p>
                <strong>{acceptanceRate}%</strong>
                <span className="dashboard-stat-caption">
                  Accepted / total attempts
                </span>
              </article>
            </section>

            {/* Coding Activity Heatmap */}
            <section className="dashboard-panel dashboard-heatmap-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <h2>Coding Activity</h2>
                  <p>Your coding consistency over the past year</p>
                </div>

                <span className="dashboard-heatmap-total">
                  {activityTotal} submissions
                </span>
              </div>

              <div className="dashboard-heatmap-summary">
                <strong>{activeDays} active days</strong>
                <span>in the displayed period</span>
              </div>

              {/* Streak statistics */}
              <div className="dashboard-streak-stats">
                <div className="dashboard-streak-card">
                  <span className="dashboard-streak-icon">🔥</span>
                  <div>
                    <strong>{currentStreak} days</strong>
                    <span>Current streak</span>
                  </div>
                </div>

                <div className="dashboard-streak-card">
                  <span className="dashboard-streak-icon">🏆</span>
                  <div>
                    <strong>{longestStreak} days</strong>
                    <span>Longest streak</span>
                  </div>
                </div>

                <div className="dashboard-streak-card">
                  <span className="dashboard-streak-icon">📅</span>
                  <div>
                    <strong>{activeDays} days</strong>
                    <span>Active days</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-heatmap-scroll">
                <div className="dashboard-heatmap-months">
                  {monthLabels.map((month) => (
                    <span
                      key={month.key}
                      style={{
                        left: `${month.week * 16}px`,
                      }}
                    >
                      {month.label}
                    </span>
                  ))}
                </div>

                <div className="dashboard-heatmap-body">
                  <div className="dashboard-heatmap-weekdays">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                  </div>

                  <div className="dashboard-heatmap-grid">
                    {heatmap.map((day) => (
                      <div
                        key={day.key}
                        className={`dashboard-heatmap-cell ${getHeatLevel(
                          day.count
                        )}`}
                        title={`${day.count} submission${
                          day.count === 1 ? "" : "s"
                        } on ${day.date.toLocaleDateString()}`}
                        aria-label={`${day.count} submissions on ${day.key}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="dashboard-heatmap-legend">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <span
                    key={level}
                    className={`dashboard-heatmap-cell level-${level}`}
                  />
                ))}
                <span>More</span>
              </div>

              <p className="dashboard-note">
                Activity is based on the submission records currently
                returned by the server. The heatmap may not represent
                your entire year until historical submissions are
                available from the API.
              </p>
            </section>

            <section className="dashboard-main-grid">
              <article className="dashboard-panel dashboard-progress">
                <div className="dashboard-panel-heading">
                  <div>
                    <h2>Problems Solved</h2>
                    <p>Your problem-solving progress</p>
                  </div>

                  <Link to="/problems" className="dashboard-text-link">
                    Practice →
                  </Link>
                </div>

                <div className="dashboard-circle-section">
                  <div
                    className="dashboard-circle"
                    style={{
                      "--easy": `${easyPercent}%`,
                      "--medium": `${mediumPercent}%`,
                      "--hard": `${hardPercent}%`,
                    }}
                    role="img"
                    aria-label={`${solved.length} problems solved`}
                  >
                    <div className="dashboard-circle-content">
                      <strong className="dashboard-circle-number">
                        {solved.length}
                      </strong>
                      <span className="dashboard-circle-label">
                        Solved
                      </span>
                    </div>
                  </div>

                  <div className="dashboard-difficulty-list">
                    <div className="dashboard-difficulty-item">
                      <span>
                        <i className="dashboard-difficulty-dot easy" />
                        Easy
                      </span>
                      <strong>{difficultyCounts.Easy}</strong>
                    </div>

                    <div className="dashboard-difficulty-item">
                      <span>
                        <i className="dashboard-difficulty-dot medium" />
                        Medium
                      </span>
                      <strong>{difficultyCounts.Medium}</strong>
                    </div>

                    <div className="dashboard-difficulty-item">
                      <span>
                        <i className="dashboard-difficulty-dot hard" />
                        Hard
                      </span>
                      <strong>{difficultyCounts.Hard}</strong>
                    </div>
                  </div>
                </div>

                <p className="dashboard-note">
                  Based on accepted submissions in your latest 100
                  submission records.
                </p>
              </article>

              <article className="dashboard-panel dashboard-activity">
                <div className="dashboard-panel-heading">
                  <div>
                    <h2>Activity Summary</h2>
                    <p>Your coding activity at a glance</p>
                  </div>
                </div>

                <div className="dashboard-activity-row">
                  <span>Total attempts</span>
                  <strong>{submissions.length}</strong>
                </div>

                <div className="dashboard-activity-row">
                  <span>Successful attempts</span>
                  <strong className="dashboard-green-text">
                    {acceptedSubmissions.length}
                  </strong>
                </div>

                <div className="dashboard-activity-row">
                  <span>Unaccepted attempts</span>
                  <strong>
                    {submissions.length - acceptedSubmissions.length}
                  </strong>
                </div>

                <div className="dashboard-activity-divider" />

                <div className="dashboard-activity-tip">
                  <span className="dashboard-tip-icon">💡</span>
                  <div>
                    <strong>Keep practising!</strong>
                    <p>
                      Consistent practice helps you improve your
                      problem-solving skills.
                    </p>
                  </div>
                </div>
              </article>
            </section>

            <section className="dashboard-panel dashboard-recent">
              <div className="dashboard-panel-heading">
                <div>
                  <h2>Recent Submissions</h2>
                  <p>Your latest coding attempts</p>
                </div>

                <Link to="/problems" className="dashboard-text-link">
                  View Problems →
                </Link>
              </div>

              {submissions.length === 0 ? (
                <div className="dashboard-empty">
                  <div className="dashboard-empty-icon">⌨</div>
                  <h3>No submissions yet</h3>
                  <p>
                    Solve your first problem and your activity will
                    appear here.
                  </p>
                  <Link to="/problems" className="dashboard-solve-btn">
                    Start Practising
                  </Link>
                </div>
              ) : (
                <div className="dashboard-table-wrap">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Problem</th>
                        <th>Difficulty</th>
                        <th>Language</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {submissions.slice(0, 10).map((submission) => {
                        const difficulty =
                          submission.problem?.difficulty || "";

                        const statusClass =
                          submission.status === "Accepted"
                            ? "accepted"
                            : "other";

                        return (
                          <tr key={submission._id}>
                            <td>
                              <Link
                                className="dashboard-problem-link"
                                to={`/problems/${
                                  submission.problem?.slug ||
                                  submission.problemSlug
                                }`}
                              >
                                {submission.problem?.title ||
                                  submission.problemSlug ||
                                  "Problem"}
                              </Link>
                            </td>

                            <td>
                              <span
                                className={`dashboard-difficulty-badge ${difficulty.toLowerCase()}`}
                              >
                                {difficulty || "—"}
                              </span>
                            </td>

                            <td>
                              <span className="dashboard-language">
                                {submission.language || "—"}
                              </span>
                            </td>

                            <td>
                              <span
                                className={`dashboard-status ${statusClass}`}
                              >
                                {submission.status}
                              </span>
                            </td>

                            <td className="dashboard-date">
                              {submission.createdAt
                                ? new Date(
                                    submission.createdAt
                                  ).toLocaleDateString()
                                : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}