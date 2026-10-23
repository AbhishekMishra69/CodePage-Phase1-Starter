
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar.jsx";
import "../styles/profile.css";
export function Profile({
  user,
  onLogout,
  darkMode,
  onToggleDarkMode,
  onUpdateUser,
}) {
  const { username } = useParams();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
    github: user?.github || "",
    linkedin: user?.linkedin || "",
  });

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || "",
      github: user?.github || "",
      linkedin: user?.linkedin || "",
    });
  }, [user]);

  const profileName = user?.name || username || "CodePage User";

  const isOwnProfile =
    user?.username === username ||
    (!username && Boolean(user));

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  function handleCancel() {
    setFormData({
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || "",
      github: user?.github || "",
      linkedin: user?.linkedin || "",
    });

    setError("");
    setSuccess("");
    setIsEditing(false);
  }

  async function handleSave(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    const normalizedUsername = formData.username
      .trim()
      .toLowerCase();

    if (
      normalizedUsername.length < 3 ||
      normalizedUsername.length > 30 ||
      !/^[a-z0-9_]+$/.test(normalizedUsername)
    ) {
      setError(
        "Username must be 3–30 characters and contain only lowercase letters, numbers, and underscores."
      );
      return;
    }

    setSaving(true);

    try {
      const updatedUser = await onUpdateUser({
        name: formData.name.trim(),
        username: normalizedUsername,
        avatar: formData.avatar.trim(),
        bio: formData.bio.trim(),
        location: formData.location.trim(),
        website: formData.website.trim(),
        github: formData.github.trim(),
        linkedin: formData.linkedin.trim(),
      });

      setFormData({
        name: updatedUser?.name || formData.name,
        username: updatedUser?.username || normalizedUsername,
        email: updatedUser?.email || formData.email,
        avatar: updatedUser?.avatar || "",
        bio: updatedUser?.bio || "",
        location: updatedUser?.location || "",
        website: updatedUser?.website || "",
        github: updatedUser?.github || "",
        linkedin: updatedUser?.linkedin || "",
      });

      setIsEditing(false);
      setSuccess("Profile updated successfully!");

      if (
        updatedUser?.username &&
        updatedUser.username !== username
      ) {
        navigate(`/profile/${updatedUser.username}`, {
          replace: true,
        });
      }
    } catch (err) {
      setError(err.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
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

      <main className="profile-page">
        <section className="profile-header">
          <div className="profile-avatar">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={`${profileName}'s profile`}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              profileName.charAt(0).toUpperCase()
            )}
          </div>

          <div className="profile-info">
            <h1>{profileName}</h1>

            <p>
              @{user?.username || username || "user"}
            </p>

            <span>
              {user?.bio || "Java • Spring Boot • DevOps"}
            </span>

            {user?.email && <p>{user.email}</p>}

            {user?.location && <p>{user.location}</p>}

            {user?.website && (
              <p>
                <a
                  href={user.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Website
                </a>
              </p>
            )}

            {user?.github && (
              <p>
                <a
                  href={user.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </p>
            )}

            {user?.linkedin && (
              <p>
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </p>
            )}
          </div>

          <div className="profile-actions">
  {!isEditing ? (
    <button
      type="button"
      className="btn btn-primary"
      onClick={() => {
        setError("");
        setSuccess("");
        setIsEditing(true);
      }}
    >
      Edit Profile
    </button>
  ) : (
    <button
      type="button"
      className="btn btn-primary"
      onClick={handleCancel}
      disabled={saving}
    >
      Cancel
    </button>
  )}
</div>
        </section>

        {success && (
          <p className="form-success" role="status">
            {success}
          </p>
        )}

        {isEditing && (
          <section className="profile-card">
            <h2>Edit Profile</h2>

            <form onSubmit={handleSave}>
              <label>
                Full Name

                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={80}
                  required
                />
              </label>

              <label>
                Username

                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  minLength={3}
                  maxLength={30}
                  pattern="[a-zA-Z0-9_]+"
                  title="Only letters, numbers, and underscores are allowed."
                  required
                />
              </label>

              <label>
                Email Address

                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  readOnly
                  disabled
                />
              </label>

              <label>
                Profile Image URL

                <input
                  name="avatar"
                  type="url"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://example.com/profile.jpg"
                />
              </label>

              {formData.avatar && (
                <div className="profile-image-preview">
                  <img
                    src={formData.avatar}
                    alt="Profile preview"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              <label>
                Bio

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  maxLength={250}
                  placeholder="Tell something about yourself"
                />
              </label>

              <label>
                Location

                <input
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  maxLength={100}
                />
              </label>

              <label>
                Website

                <input
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </label>

              <label>
                GitHub

                <input
                  name="github"
                  type="url"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                />
              </label>

              <label>
                LinkedIn

                <input
                  name="linkedin"
                  type="url"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </label>

              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}

              <div className="profile-form-actions">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  className="btn"
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="profile-stats">
          <div>
            <strong>
              {user?.stats?.solved ?? user?.solvedProblemsCount ?? 0}
            </strong>
            <span>Problems Solved</span>
          </div>

          <div>
            <strong>
              {user?.followerCount ?? user?.followersCount ?? 0}
            </strong>
            <span>Followers</span>
          </div>

          <div>
            <strong>
              {user?.followingCount ?? user?.followingCount ?? 0}
            </strong>
            <span>Following</span>
          </div>

          <div>
            <strong>
              {user?.rating ?? user?.contestRating ?? 1200}
            </strong>
            <span>Rating</span>
          </div>
        </section>

        <nav className="profile-tabs">
          <Link to="#">Overview</Link>
          <Link to="#">Problems</Link>
          <Link to="#">Submissions</Link>
          <Link to="#">Solutions</Link>
          <Link to="#">Contests</Link>
          <Link to="#">Badges</Link>
          <Link to="#">Certifications</Link>
          <Link to="#">Activity</Link>
        </nav>

        <section className="profile-content">
          <div className="profile-card">
            <h2>Problem Solving Progress</h2>

            <div className="difficulty-row">
              <span>Easy</span>
              <strong>0</strong>
            </div>

            <div className="difficulty-row">
              <span>Medium</span>
              <strong>0</strong>
            </div>

            <div className="difficulty-row">
              <span>Hard</span>
              <strong>0</strong>
            </div>
          </div>

          <div className="profile-card">
            <h2>Contribution Activity</h2>

            <div className="activity-grid">
              {Array.from({ length: 70 }, (_, index) => (
                <span key={index} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
