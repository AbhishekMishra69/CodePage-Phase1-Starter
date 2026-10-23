import { Link, useLocation } from 'react-router-dom';

export function Navbar({
  user,
  onLogin,
  onRegister,
  onLogout,
  darkMode,
  onToggleDarkMode,
}) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname.startsWith(path);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          <span>&gt;_</span> CodePage
        </Link>

        {/* NAVIGATION */}
        <nav className="navbar-links">

          <Link
            to="/explore"
            className={
              isActive('/explore')
                ? 'nav-link active'
                : 'nav-link'
            }
          >
            Explore
          </Link>
          <Link
  to="/dashboard"
  className={isActive('/dashboard') ? 'nav-link active' : 'nav-link'}
>
  Dashboard
</Link>

          <Link
            to="/problems"
            className={
              isActive('/problems')
                ? 'nav-link active'
                : 'nav-link'
            }
          >
            Problems
          </Link>

          <Link
            to="/contests"
            className={
              isActive('/contests')
                ? 'nav-link active'
                : 'nav-link'
            }
          >
            Contests
          </Link>

          <Link
            to="/discuss"
            className={
              isActive('/discuss')
                ? 'nav-link active'
                : 'nav-link'
            }
          >
            Discuss
          </Link>

          <Link
            to="/certifications"
            className={
              isActive('/certifications')
                ? 'nav-link active'
                : 'nav-link'
            }
          >
            Certifications
          </Link>

          <Link
            to="/leaderboard"
            className={
              isActive('/leaderboard')
                ? 'nav-link active'
                : 'nav-link'
            }
          >
            Leaderboard
          </Link>

        </nav>

        {/* RIGHT SIDE */}
        <div className="navbar-actions">

          <button
            className="theme-toggle"
            onClick={onToggleDarkMode}
            type="button"
            title="Toggle theme"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className="navbar-user">

              <Link
                to={`/profile/${user.name
                  ?.toLowerCase()
                  .replace(/\s+/g, '-')}`}
                className="navbar-profile"
              >
                <div className="navbar-avatar">
                  {user.name
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <span>
                  {user.name}
                </span>
              </Link>

              <button
                className="btn btn-secondary navbar-logout"
                onClick={onLogout}
                type="button"
              >
                Sign out
              </button>

            </div>
          ) : (
            <div className="navbar-auth">

              <button
                className="btn btn-secondary"
                onClick={onLogin}
                type="button"
              >
                Sign in
              </button>

              <button
                className="btn btn-primary"
                onClick={onRegister}
                type="button"
              >
                Sign up
              </button>

            </div>
          )}

        </div>

      </div>
    </header>
  );
}