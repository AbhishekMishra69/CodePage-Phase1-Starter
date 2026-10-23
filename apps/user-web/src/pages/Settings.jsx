import { Navbar } from '../components/Navbar.jsx';

export function Settings({
  user,
  onLogout,
  darkMode,
  onToggleDarkMode,
}) {
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

      <main className="settings-page">

        <span className="section-badge">
          ACCOUNT
        </span>

        <h1>Settings</h1>

        <div className="settings-layout">

          <aside>
            <button>Account</button>
            <button>Profile</button>
            <button>Password</button>
            <button>Notifications</button>
            <button>Appearance</button>
            <button>Privacy</button>
          </aside>

          <section className="settings-card">
            <h2>Account Settings</h2>

            <label>
              Name
              <input
                value={user?.name || ''}
                readOnly
              />
            </label>

            <label>
              Email
              <input
                value={user?.email || ''}
                readOnly
              />
            </label>

            <button className="btn btn-primary">
              Save Changes
            </button>
          </section>

        </div>

      </main>
    </div>
  );
}