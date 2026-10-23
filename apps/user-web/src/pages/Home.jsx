import { Navbar } from '../components/Navbar.jsx';
import { Hero } from '../components/Hero.jsx';
import { Stats } from '../components/Stats.jsx';
import { PopularProblems } from '../components/PopularProblems.jsx';
import { Topics } from '../components/Topics.jsx';
import { Contests } from '../components/Contests.jsx';
import { Leaderboard } from '../components/Leaderboard.jsx';
import { Footer } from '../components/Footer.jsx';

export function Home({
  user,
  onLogin,
  onRegister,
  onLogout,
  onStartCoding,
  darkMode,
  onToggleDarkMode,
}) {
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

      <main>
        <Hero
          user={user}
          onStartCoding={onStartCoding}
        />

        <Stats />

        <PopularProblems />

        <Topics />

        <Contests />

        <Leaderboard />

        <Footer />
      </main>
    </div>
  );
}