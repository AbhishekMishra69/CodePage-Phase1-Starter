import { useState } from 'react';
import { Navbar } from '../components/Navbar.jsx';
import '../styles/Leaderboard.css';

const rankings = {
  'All Time': [
    { name: 'Aarav Sharma', username: '@aarav_dev', points: 2450, solved: 186, badge: '🥇', initials: 'AS' },
    { name: 'Priya Verma', username: '@priya_codes', points: 2210, solved: 172, badge: '🥈', initials: 'PV' },
    { name: 'Rahul Singh', username: '@rahul_tech', points: 1980, solved: 154, badge: '🥉', initials: 'RS' },
    { name: 'Neha Gupta', username: '@neha_builds', points: 1750, solved: 139, badge: '', initials: 'NG' },
    { name: 'Arjun Patel', username: '@arjun_dev', points: 1610, solved: 126, badge: '', initials: 'AP' },
    { name: 'CodeMaster', username: '@code_master', points: 1490, solved: 118, badge: '', initials: 'CM' },
    { name: 'You', username: '@your_username', points: 1320, solved: 104, badge: '', initials: 'YO' },
  ],
  Weekly: [
    { name: 'Priya Verma', username: '@priya_codes', points: 520, solved: 24, badge: '🥇', initials: 'PV' },
    { name: 'You', username: '@your_username', points: 460, solved: 21, badge: '🥈', initials: 'YO' },
    { name: 'Aarav Sharma', username: '@aarav_dev', points: 420, solved: 19, badge: '🥉', initials: 'AS' },
    { name: 'Neha Gupta', username: '@neha_builds', points: 380, solved: 17, badge: '', initials: 'NG' },
    { name: 'Rahul Singh', username: '@rahul_tech', points: 330, solved: 15, badge: '', initials: 'RS' },
  ],
  Monthly: [
    { name: 'Aarav Sharma', username: '@aarav_dev', points: 1120, solved: 65, badge: '🥇', initials: 'AS' },
    { name: 'You', username: '@your_username', points: 980, solved: 58, badge: '🥈', initials: 'YO' },
    { name: 'Priya Verma', username: '@priya_codes', points: 920, solved: 54, badge: '🥉', initials: 'PV' },
    { name: 'Rahul Singh', username: '@rahul_tech', points: 850, solved: 49, badge: '', initials: 'RS' },
    { name: 'Neha Gupta', username: '@neha_builds', points: 790, solved: 45, badge: '', initials: 'NG' },
  ],
};

const filters = ['All Time', 'Weekly', 'Monthly'];

export function Leaderboard({
  user,
  onLogout,
  darkMode,
  onToggleDarkMode,
}) {
  const [period, setPeriod] = useState('All Time');
  const [search, setSearch] = useState('');

  const currentRankings = rankings[period] || [];
  const filteredRankings = currentRankings.filter((player) =>
    `${player.name} ${player.username}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const currentUserName = user?.name || user?.username || 'You';
  const currentUser = currentRankings.find(
    (player) =>
      player.name === 'You' ||
      player.username === user?.username
  );

  return (
    <div className="page-content leaderboard-page">
      <Navbar
        user={user}
        onLogin={() => {}}
        onRegister={() => {}}
        onLogout={onLogout}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />

      <main className="platform-page leaderboard-main">
        <section className="leaderboard-hero">
          <div>
            <span className="section-badge">CODEPAGE RANKINGS</span>
            <h1>Leaderboard</h1>
            <p>
              Every problem solved brings you closer to the top.
              Compete, improve, and celebrate your progress.
            </p>
          </div>

          <div className="leaderboard-hero-icon" aria-hidden="true">
            🏆
          </div>
        </section>

        <section className="leaderboard-stats">
          <article className="leaderboard-stat">
            <span className="stat-icon">👨‍💻</span>
            <div>
              <span className="stat-label">Developers ranked</span>
              <strong>{currentRankings.length}</strong>
            </div>
          </article>

          <article className="leaderboard-stat">
            <span className="stat-icon">⚡</span>
            <div>
              <span className="stat-label">Your points</span>
              <strong>{currentUser?.points?.toLocaleString() || '—'}</strong>
            </div>
          </article>

          <article className="leaderboard-stat">
            <span className="stat-icon">🎯</span>
            <div>
              <span className="stat-label">Problems solved</span>
              <strong>{currentUser?.solved ?? '—'}</strong>
            </div>
          </article>
        </section>

        <section className="leaderboard-content">
          <div className="leaderboard-heading">
            <div>
              <h2>Top developers</h2>
              <p>Rankings by points earned</p>
            </div>

            <div className="leaderboard-filters">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={period === filter ? 'active' : ''}
                  onClick={() => setPeriod(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="leaderboard-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search developers..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search developers"
            />
          </div>

          <div className="leaderboard-table-wrap">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Developer</th>
                  <th>Problems solved</th>
                  <th>Points</th>
                </tr>
              </thead>

              <tbody>
                {filteredRankings.map((player) => {
                  const rank = currentRankings.indexOf(player) + 1;
                  const isCurrentUser =
                    player.name === 'You' ||
                    player.username === user?.username;

                  return (
                    <tr
                      key={player.username}
                      className={isCurrentUser ? 'current-user-row' : ''}
                    >
                      <td>
                        <span className={`leaderboard-rank rank-${rank}`}>
                          {player.badge || `#${rank}`}
                        </span>
                      </td>

                      <td>
                        <div className="developer-cell">
                          <div className={`developer-avatar avatar-${rank}`}>
                            {player.initials}
                          </div>
                          <div className="developer-info">
                            <strong>
                              {isCurrentUser ? currentUserName : player.name}
                              {isCurrentUser && (
                                <span className="you-tag">YOU</span>
                              )}
                            </strong>
                            <span>{player.username}</span>
                          </div>
                        </div>
                      </td>

                      <td>{player.solved}</td>
                      <td>
                        <strong className="points-value">
                          {player.points.toLocaleString()}
                          <span> pts</span>
                        </strong>
                      </td>
                    </tr>
                  );
                })}

                {filteredRankings.length === 0 && (
                  <tr>
                    <td colSpan="4" className="leaderboard-empty">
                      No developers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="leaderboard-note">
            Demo rankings are displayed for UI preview. Real user rankings
            will be connected to the CodePage backend next.
          </p>
        </section>

        <section className="leaderboard-bottom">
          <span>🚀</span>
          <div>
            <h3>Ready to climb the ranks?</h3>
            <p>Keep practicing, solve more problems, and improve your score.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
