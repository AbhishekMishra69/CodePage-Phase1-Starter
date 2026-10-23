import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';


import '../styles/Discuss.css';
export function Discuss({
  user,
  onLogout,
  darkMode,
  onToggleDarkMode,
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState('Latest');
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'How should I start preparing for DSA interviews?',
      body: 'I know basic programming and arrays. Which topics should I cover next to build strong problem-solving skills?',
      category: 'Interview Prep',
      author: 'CodeLearner',
      date: 'Today',
      votes: 24,
      comments: 8,
      tag: 'DSA',
    },
    {
      id: 2,
      title: 'When should I use HashMap instead of an array?',
      body: 'I often get confused between using an array and a HashMap. Can someone explain with a simple example?',
      category: 'DSA',
      author: 'JavaDev',
      date: 'Today',
      votes: 18,
      comments: 5,
      tag: 'Java',
    },
    {
      id: 3,
      title: 'Understanding SQL JOINs with practical examples',
      body: 'Looking for a simple explanation of INNER JOIN, LEFT JOIN and when each one is useful.',
      category: 'Database',
      author: 'QueryMaster',
      date: 'Yesterday',
      votes: 15,
      comments: 4,
      tag: 'SQL',
    },
    {
      id: 4,
      title: 'Share your approach to solving Two Sum',
      body: 'Brute force is easy to understand, but how do we optimize it using a HashMap?',
      category: 'DSA',
      author: 'ProblemSolver',
      date: 'Yesterday',
      votes: 12,
      comments: 7,
      tag: 'Algorithms',
    },
    {
      id: 5,
      title: 'Java or Python for coding interviews?',
      body: 'I am comfortable with Java but want to know how to choose a language for interview preparation.',
      category: 'Programming',
      author: 'DevJourney',
      date: '2 days ago',
      votes: 9,
      comments: 11,
      tag: 'Career',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newCategory, setNewCategory] = useState('DSA');

  const categories = [
    'All',
    'DSA',
    'Programming',
    'Database',
    'Interview Prep',
  ];

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = posts.filter((post) => {
      const matchesCategory =
        activeCategory === 'All' ||
        post.category === activeCategory;

      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.body.toLowerCase().includes(query) ||
        post.tag.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'Most Votes') {
      return [...result].sort((a, b) => b.votes - a.votes);
    }

    if (sortBy === 'Most Discussed') {
      return [...result].sort((a, b) => b.comments - a.comments);
    }

    return [...result].reverse();
  }, [posts, activeCategory, search, sortBy]);

  function handleCreatePost(event) {
    event.preventDefault();

    if (!newTitle.trim() || !newBody.trim()) {
      return;
    }

    const post = {
      id: Date.now(),
      title: newTitle.trim(),
      body: newBody.trim(),
      category: newCategory,
      author: user?.name || user?.username || user?.email || 'You',
      date: 'Just now',
      votes: 0,
      comments: 0,
      tag: newCategory,
    };

    setPosts((currentPosts) => [post, ...currentPosts]);
    setActiveCategory('All');
    setSearch('');
    setSortBy('Latest');
    setNewTitle('');
    setNewBody('');
    setNewCategory('DSA');
    setShowForm(false);
  }

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

      <main className="discuss-page">
        <section className="discuss-header">
          <div>
            <span className="section-badge">CODEPAGE COMMUNITY</span>
            <h1>Discuss</h1>
            <p>
              Share knowledge, ask questions, and learn from
              other developers.
            </p>
          </div>

          <button
            className="discuss-create-btn"
            onClick={() => setShowForm((value) => !value)}
          >
            <span>＋</span> Start a discussion
          </button>
        </section>

        {showForm && (
          <section className="discuss-form-card">
            <div className="discuss-form-heading">
              <div>
                <h2>Create a discussion</h2>
                <p>Ask a question or share something useful.</p>
              </div>
              <button
                type="button"
                className="discuss-close-btn"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreatePost}>
              <label htmlFor="discuss-title">Title</label>
              <input
                id="discuss-title"
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                placeholder="What would you like to discuss?"
                maxLength={140}
                required
              />

              <label htmlFor="discuss-category">Category</label>
              <select
                id="discuss-category"
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
              >
                {categories
                  .filter((category) => category !== 'All')
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>

              <label htmlFor="discuss-body">Details</label>
              <textarea
                id="discuss-body"
                value={newBody}
                onChange={(event) => setNewBody(event.target.value)}
                placeholder="Explain your question or share your approach..."
                rows={5}
                required
              />

              <div className="discuss-form-actions">
                <button
                  type="button"
                  className="discuss-cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="discuss-create-btn">
                  Publish discussion
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="discuss-layout">
          <div className="discuss-main">
            <div className="discuss-toolbar">
              <div className="discuss-search">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search discussions..."
                  aria-label="Search discussions"
                />
              </div>

              <select
                className="discuss-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort discussions"
              >
                <option>Latest</option>
                <option>Most Votes</option>
                <option>Most Discussed</option>
              </select>
            </div>

            <div className="discuss-category-tabs">
              {categories.map((category) => (
                <button
                  key={category}
                  className={
                    activeCategory === category ? 'active' : ''
                  }
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="discuss-feed-heading">
              <h2>Community discussions</h2>
              <span>{filteredPosts.length} posts</span>
            </div>

            <div className="discuss-feed">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <article className="discuss-post" key={post.id}>
                    <div className="discuss-post-votes">
                      <span>↑</span>
                      <strong>{post.votes}</strong>
                      <small>votes</small>
                    </div>

                    <div className="discuss-post-content">
                      <div className="discuss-post-meta">
                        <span className="discuss-post-tag">
                          {post.tag}
                        </span>
                        <span>{post.date}</span>
                      </div>

                      <h3>{post.title}</h3>
                      <p>{post.body}</p>

                      <div className="discuss-post-footer">
                        <span>
                          By <strong>{post.author}</strong>
                        </span>
                        <span>▤ {post.comments} comments</span>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="discuss-empty">
                  <span>⌕</span>
                  <h3>No discussions found</h3>
                  <p>
                    Try another search or start a new discussion.
                  </p>
                  <button
                    className="discuss-create-btn"
                    onClick={() => setShowForm(true)}
                  >
                    Create a discussion
                  </button>
                </div>
              )}
            </div>
          </div>

          <aside className="discuss-sidebar">
            <section className="discuss-side-card">
              <h3>About the community</h3>
              <p>
                A place for developers to exchange ideas, discuss
                coding problems, and prepare for technical interviews.
              </p>
              <div className="discuss-side-stat">
                <span>Topics</span>
                <strong>{categories.length - 1}</strong>
              </div>
              <div className="discuss-side-stat">
                <span>Discussions shown</span>
                <strong>{posts.length}</strong>
              </div>
            </section>

            <section className="discuss-side-card">
              <h3>Popular topics</h3>
              {['Data Structures', 'Algorithms', 'Java', 'SQL', 'Interviews'].map(
                (topic) => (
                  <button
                    className="discuss-topic-link"
                    key={topic}
                    onClick={() => {
                      setSearch(topic === 'Data Structures' ? 'DSA' : topic);
                      setActiveCategory('All');
                    }}
                  >
                    <span>{topic}</span>
                    <span>→</span>
                  </button>
                ),
              )}
            </section>

            <section className="discuss-side-card discuss-help-card">
              <h3>Ready to contribute?</h3>
              <p>One useful explanation can help another developer.</p>
              <button
                className="discuss-side-action"
                onClick={() => setShowForm(true)}
              >
                Write a post →
              </button>
              <Link to="/problems" className="discuss-problems-link">
                Practice coding problems
              </Link>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}
