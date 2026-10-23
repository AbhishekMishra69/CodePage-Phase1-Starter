import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  authenticate,
  getCurrentUser,
  updateUserProfile,
} from "./api.js";

import { Home } from "./pages/Home.jsx";
import { Problems } from "./pages/Problems.jsx";
import { ProblemDetails } from "./pages/ProblemDetails.jsx";
import { Explore } from "./pages/Explore.jsx";
import { Programming } from "./pages/Programming.jsx";
import { Contests } from "./pages/Contests.jsx";
import { Discuss } from "./pages/Discuss.jsx";
import { Certifications } from "./pages/Certifications.jsx";
import { Leaderboard } from "./pages/Leaderboard.jsx";
import { Profile } from "./pages/Profile.jsx";
import { Settings } from "./pages/Settings.jsx";
import { ContestDetails } from "./pages/ContestDetails.jsx";
import { LoadingScreen } from "./components/LoadingScreen.jsx";
import { ContestProblems } from "./pages/ContestProblems.jsx";
import { ContestRanking } from "./pages/ContestRanking.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";

const themes = [
  "theme-purple",
  "theme-blue",
  "theme-green",
  "theme-pink",
];

/* =========================================
   GLOBAL PAGE TRANSITION LOADER
========================================= */

function RouteLoader({ children }) {
  const location = useLocation();

  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    setRouteLoading(true);

    const timer = setTimeout(() => {
      setRouteLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {routeLoading && <LoadingScreen />}
      {children}
    </>
  );
}

/* =========================================
   APP
========================================= */

function App() {
  const [loading, setLoading] = useState(true);

  const [authMode, setAuthMode] = useState(null);

  const [message, setMessage] = useState("");

  const [user, setUser] = useState(null);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("codepage_theme") || "theme-purple"
  );

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("codepage_dark") !== "false"
  );

  /* =========================================
     INITIAL WEBSITE LOADING
  ========================================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  /* =========================================
     RESTORE AUTHENTICATED SESSION
  ========================================= */

  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem("codepage_token");

      if (!token) {
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        if (!currentUser || currentUser.role !== "USER") {
          localStorage.removeItem("codepage_token");
          localStorage.removeItem("codepage_user");
          setUser(null);
          return;
        }

        localStorage.setItem(
          "codepage_user",
          JSON.stringify(currentUser)
        );

        setUser(currentUser);
      } catch (error) {
        localStorage.removeItem("codepage_token");
        localStorage.removeItem("codepage_user");
        setUser(null);
      }
    }

    restoreSession();
  }, []);

  /* =========================================
     LOGIN / REGISTER SUBMIT
  ========================================= */

  async function submit(event) {
    event.preventDefault();

    const currentAuthMode = authMode;

    setMessage("");
    setLoading(true);
    setAuthMode(null);

    const form = Object.fromEntries(
      new FormData(event.currentTarget)
    );

    try {
      const result = await authenticate(
        currentAuthMode === "login" ? "login" : "register",
        form
      );

      if (result.user.role !== "USER") {
        throw new Error(
          "This is an administrator account. Please use the admin portal."
        );
      }

      localStorage.setItem(
        "codepage_token",
        result.token
      );

      localStorage.setItem(
        "codepage_user",
        JSON.stringify(result.user)
      );

      const currentIndex = themes.indexOf(theme);

      const nextTheme =
        themes[(currentIndex + 1) % themes.length];

      setTheme(nextTheme);

      localStorage.setItem(
        "codepage_theme",
        nextTheme
      );

      setUser(result.user);

      setTimeout(() => {
        setLoading(false);
        setAuthMode(null);
      }, 700);
    } catch (error) {
      setLoading(false);
      setAuthMode(currentAuthMode);
      setMessage(error.message);
    }
  }

  /* =========================================
     LOGOUT
  ========================================= */

  function logout() {
    localStorage.removeItem("codepage_token");
    localStorage.removeItem("codepage_user");

    setUser(null);
  }

  /* =========================================
     UPDATE USER PROFILE
  ========================================= */

  async function handleUpdateUser(profileData) {
    const updatedUser = await updateUserProfile(profileData);

    setUser(updatedUser);

    localStorage.setItem(
      "codepage_user",
      JSON.stringify(updatedUser)
    );

    return updatedUser;
  }

  /* =========================================
     OPEN LOGIN
  ========================================= */

  function openLogin() {
    setLoading(true);
    setAuthMode(null);
    setMessage("");

    setTimeout(() => {
      setLoading(false);
      setAuthMode("login");
    }, 650);
  }

  /* =========================================
     OPEN REGISTER
  ========================================= */

  function openRegister() {
    setLoading(true);
    setAuthMode(null);
    setMessage("");

    setTimeout(() => {
      setLoading(false);
      setAuthMode("register");
    }, 650);
  }

  /* =========================================
     SWITCH LOGIN / REGISTER
  ========================================= */

  function switchAuthMode() {
    const nextMode =
      authMode === "login" ? "register" : "login";

    setLoading(true);
    setAuthMode(null);
    setMessage("");

    setTimeout(() => {
      setLoading(false);
      setAuthMode(nextMode);
    }, 650);
  }

  /* =========================================
     START CODING
  ========================================= */

  function startCoding() {
    if (user) {
      window.location.href = "/problems";
    } else {
      openRegister();
    }
  }

  /* =========================================
     DARK MODE
  ========================================= */

  function toggleDarkMode() {
    const nextMode = !darkMode;

    setDarkMode(nextMode);

    localStorage.setItem(
      "codepage_dark",
      String(nextMode)
    );
  }

  /* =========================================
     APP
  ========================================= */

  return (
    <BrowserRouter>
      {/* INITIAL WEBSITE LOADER */}

      {loading && <LoadingScreen />}

      <main
        className={`page ${theme} ${
          darkMode ? "dark-mode" : "light-mode"
        }`}
      >
        {/* =================================
            ROUTES
        ================================= */}

        <RouteLoader>
          <Routes>
            {/* HOME */}

            <Route
              path="/"
              element={
                <Home
                  user={user}
                  onLogin={openLogin}
                  onRegister={openRegister}
                  onLogout={logout}
                  onStartCoding={startCoding}
                  darkMode={darkMode}
                  onToggleDarkMode={toggleDarkMode}
                />
              }
            />

            {/* EXPLORE */}

            <Route
              path="/explore"
              element={
                <Explore
                  user={user}
                  onLogout={logout}
                  darkMode={darkMode}
                  onToggleDarkMode={toggleDarkMode}
                />
              }
            />

            {/* PROGRAMMING */}

            <Route
              path="/explore/programming"
              element={
                <Programming
                  user={user}
                  onLogout={logout}
                  darkMode={darkMode}
                  onToggleDarkMode={toggleDarkMode}
                />
              }
            />

            {/* PROBLEMS */}

            <Route
              path="/problems"
              element={
                <Problems
                  user={user}
                  onLogout={logout}
                  darkMode={darkMode}
                  onToggleDarkMode={toggleDarkMode}
                />
              }
            />


{/* DASHBOARD */}
<Route
  path="/dashboard"
  element={
    <Dashboard
      user={user}
      onLogin={openLogin}
      onRegister={openRegister}
      onLogout={logout}
      darkMode={darkMode}
      onToggleDarkMode={toggleDarkMode}
    />
  }
/>


            {/* PROBLEM DETAILS */}

            <Route
              path="/problems/:problemId"
              element={
                <ProblemDetails
                  darkMode={darkMode}
                  onToggleDarkMode={toggleDarkMode}
                />
              }
            />

            {/* CONTEST RANKING */}

            <Route
              path="/contests/:contestId/ranking"
              element={
                <ContestRanking
                  user={user}
                  onLogout={logout}
                  darkMode={darkMode}
                  onToggleDarkMode={toggleDarkMode}
                />
              }
            />

            {/* CONTEST PROBLEMS */}

            <Route
              path="/contests/:contestId/problems"
              element={
                <ContestProblems
                  user={user}
                  onLogout={logout}
                  darkMode={darkMode}
                  onToggleDarkMode={toggleDarkMode}
                />
              }
            />

            {/* CONTEST DETAILS */}

            <Route
              path="/contests/:contestId"
              element={
                <ContestDetails
                  user={user}
                  onLogout={logout}
                  darkMode={darkMode}
                  onToggleDarkMode={toggleDarkMode}
                />
              }
            />

            {/* CONTESTS */}

            <Route
              path="/contests"
              element={
                <Contests
                  user={user}
                  onLogout={logout}
                  darkMode={darkMode}
                  onToggleDarkMode={toggleDarkMode}
                />
              }
            />

            {/* DISCUSS */}

            <Route
              path="/discuss"
              element={
                <Discuss
                  user={user}
                  onLogout={logout}
                  darkMode={darkMode}
                  onToggleDarkMode={toggleDarkMode}
                />
              }
            />

            {/* CERTIFICATIONS */}

            <Route
              path="/certifications"
              element={
                <Certifications
                  user={user}
                  onLogout={logout}
                  darkMode={darkMode}
                  onToggleDarkMode={toggleDarkMode}
                />
              }
            />

            {/* LEADERBOARD */}

            <Route
              path="/leaderboard"
              element={
                <Leaderboard
                  user={user}
                  onLogout={logout}
                  darkMode={darkMode}
                  onToggleDarkMode={toggleDarkMode}
                />
              }
            />

            {/* PROFILE */}

            <Route
              path="/profile/:username"
              element={
                <Profile
                  user={user}
                  onLogout={logout}
                  darkMode={darkMode}
                  onToggleDarkMode={toggleDarkMode}
                  onUpdateUser={handleUpdateUser}
                />
              }
            />

            {/* SETTINGS */}

            <Route
              path="/settings"
              element={
                <Settings
                  user={user}
                  onLogout={logout}
                  darkMode={darkMode}
                  onToggleDarkMode={toggleDarkMode}
                />
              }
            />

            {/* UNKNOWN URL */}

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </RouteLoader>

        {/* =================================
            LOGIN / REGISTER MODAL
        ================================= */}

        {authMode && (
          <div
            className="modal-overlay"
            onClick={() => setAuthMode(null)}
          >
            <form
              className="auth-modal"
              onSubmit={submit}
              onClick={(event) => event.stopPropagation()}
            >
              {/* CLOSE */}

              <button
                type="button"
                className="modal-close"
                onClick={() => setAuthMode(null)}
              >
                ×
              </button>

              {/* LOGO */}

              <div className="modal-logo">
                &gt;_ CodePage
              </div>

              {/* TITLE */}

              <h2>
                {authMode === "login"
                  ? "Welcome back"
                  : "Create your account"}
              </h2>

              {/* DESCRIPTION */}

              <p className="modal-description">
                {authMode === "login"
                  ? "Continue your coding journey."
                  : "Start solving problems and improve your skills."}
              </p>

              {/* NAME AND USERNAME */}

              {authMode === "register" && (
                <>
                  <input
                    name="name"
                    type="text"
                    placeholder="Full name"
                    maxLength={80}
                    required
                  />

                  <input
                    name="username"
                    type="text"
                    placeholder="Choose a username"
                    minLength={3}
                    maxLength={30}
                    pattern="[a-zA-Z0-9_]+"
                    title="Only letters, numbers, and underscores are allowed."
                    required
                  />
                </>
              )}

              {/* EMAIL */}

              <input
                name="email"
                type="email"
                placeholder="Email address"
                required
              />

              {/* PASSWORD */}

              <input
                name="password"
                type="password"
                placeholder="Password (8+ characters)"
                minLength="8"
                required
              />

              {/* ERROR */}

              {message && (
                <p className="error">
                  {message}
                </p>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                className="btn btn-primary auth-submit"
              >
                {authMode === "login"
                  ? "Sign in"
                  : "Create account"}
              </button>

              {/* SWITCH */}

              <p className="auth-switch">
                {authMode === "login"
                  ? "New to CodePage?"
                  : "Already have an account?"}

                <button
                  type="button"
                  className="link"
                  onClick={switchAuthMode}
                >
                  {authMode === "login"
                    ? "Register"
                    : "Sign in"}
                </button>
              </p>
            </form>
          </div>
        )}
      </main>
    </BrowserRouter>
  );
}

export default App;