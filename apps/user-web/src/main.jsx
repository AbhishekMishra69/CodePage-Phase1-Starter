import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.jsx';
import './styles/platform-pages.css';
import './styles/global.css';
import './styles/themes.css';
import './styles/loading.css';
import './styles/auth.css';
import './styles/navbar.css';
import './styles/hero.css';
import './styles/stats.css';
import './styles/popular-problems.css';
import './styles/topics.css';
import './styles/contests.css';
import './styles/leaderboard.css';
import './styles/footer.css';
import './styles/problems.css';
import './styles/problem-details.css';
import './styles/contest-details.css';
import './styles/contest-problems.css';
import './styles/contest-ranking.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);