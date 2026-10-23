import { useEffect, useState } from 'react';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

function createEmptyExample() {
  return {
    input: '',
    output: '',
    explanation: '',
  };
}

function createEmptyTestCase() {
  return {
    input: '',
    expectedOutput: '',
    isHidden: false,
  };
}

function createStarterCode() {
  return [
    {
      language: 'java',
      code: '',
    },
    {
      language: 'python',
      code: '',
    },
    {
      language: 'cpp',
      code: '',
    },
    {
      language: 'javascript',
      code: '',
    },
  ];
}

function createEmptyProblem() {
  return {
    title: '',
    slug: '',
    description: '',
    difficulty: 'Easy',
    topics: '',
    constraints: '',
    examples: [createEmptyExample()],
    testCases: [createEmptyTestCase()],
    starterCode: createStarterCode(),
  };
}

function normalizeProblem(problem) {
  const languages = [
    'java',
    'python',
    'cpp',
    'javascript',
  ];

  const starterCode = languages.map((language) => {
    const existing = problem.starterCode?.find(
      (starter) => starter.language === language
    );

    return {
      language,
      code: existing?.code || '',
    };
  });

  return {
    title: problem.title || '',
    slug: problem.slug || '',
    description: problem.description || '',
    difficulty: problem.difficulty || 'Easy',

    topics: Array.isArray(problem.topics)
      ? problem.topics.join(', ')
      : '',

    constraints: Array.isArray(problem.constraints)
      ? problem.constraints.join('\n')
      : '',

    examples:
      problem.examples?.length > 0
        ? problem.examples.map((example) => ({
            input: example.input || '',
            output: example.output || '',
            explanation: example.explanation || '',
          }))
        : [createEmptyExample()],

    testCases:
      problem.testCases?.length > 0
        ? problem.testCases.map((testCase) => ({
            input: testCase.input || '',
            expectedOutput:
              testCase.expectedOutput || '',
            isHidden:
              testCase.isHidden ?? true,
          }))
        : [createEmptyTestCase()],

    starterCode,
  };
}

export function App() {
  const [admin, setAdmin] = useState(() =>
    JSON.parse(
      localStorage.getItem('codepage_admin') || 'null'
    )
  );

  const [message, setMessage] = useState('');
  const [problemMessage, setProblemMessage] =
    useState('');

  const [problem, setProblem] = useState(() =>
    createEmptyProblem()
  );

  const [saving, setSaving] = useState(false);

  const [problems, setProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] =
    useState(false);

  const [editing, setEditing] = useState(false);
  const [editingProblemId, setEditingProblemId] =
    useState(null);

  async function login(event) {
    event.preventDefault();

    setMessage('');

    const body = Object.fromEntries(
      new FormData(event.currentTarget)
    );

    try {
      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to sign in.'
        );
      }

      if (data.user.role !== 'ADMIN') {
        throw new Error(
          'This portal is only for administrator accounts.'
        );
      }

      localStorage.setItem(
        'codepage_admin_token',
        data.token
      );

      localStorage.setItem(
        'codepage_admin',
        JSON.stringify(data.user)
      );

      setAdmin(data.user);
    } catch (error) {
      setMessage(error.message);
    }
  }

  function logout() {
    localStorage.removeItem('codepage_admin');
    localStorage.removeItem(
      'codepage_admin_token'
    );

    setAdmin(null);
  }

  async function loadProblems() {
    setLoadingProblems(true);

    try {
      const response = await fetch(
        `${API_URL}/problems?limit=100`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Unable to load problems.'
        );
      }

      setProblems(data.problems || []);
    } catch (error) {
      setProblemMessage(error.message);
    } finally {
      setLoadingProblems(false);
    }
  }

  useEffect(() => {
    if (admin) {
      loadProblems();
    }
  }, [admin]);

  function handleProblemChange(event) {
    const { name, value } = event.target;

    setProblem((previous) => ({
      ...previous,
      [name]: value,
    }));

    setProblemMessage('');
  }

  function generateSlug() {
    const slug = problem.title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setProblem((previous) => ({
      ...previous,
      slug,
    }));
  }

  function updateExample(index, field, value) {
    setProblem((previous) => {
      const examples =
        previous.examples.map(
          (example, exampleIndex) =>
            exampleIndex === index
              ? {
                  ...example,
                  [field]: value,
                }
              : example
        );

      return {
        ...previous,
        examples,
      };
    });

    setProblemMessage('');
  }

  function addExample() {
    setProblem((previous) => ({
      ...previous,
      examples: [
        ...previous.examples,
        createEmptyExample(),
      ],
    }));
  }

  function removeExample(index) {
    setProblem((previous) => {
      if (previous.examples.length === 1) {
        return previous;
      }

      return {
        ...previous,
        examples: previous.examples.filter(
          (_, exampleIndex) =>
            exampleIndex !== index
        ),
      };
    });
  }

  function updateTestCase(index, field, value) {
    setProblem((previous) => {
      const testCases =
        previous.testCases.map(
          (testCase, testCaseIndex) =>
            testCaseIndex === index
              ? {
                  ...testCase,
                  [field]: value,
                }
              : testCase
        );

      return {
        ...previous,
        testCases,
      };
    });

    setProblemMessage('');
  }

  function addTestCase() {
    setProblem((previous) => ({
      ...previous,
      testCases: [
        ...previous.testCases,
        {
          input: '',
          expectedOutput: '',
          isHidden: true,
        },
      ],
    }));
  }

  function removeTestCase(index) {
    setProblem((previous) => {
      if (previous.testCases.length === 1) {
        return previous;
      }

      return {
        ...previous,
        testCases: previous.testCases.filter(
          (_, testCaseIndex) =>
            testCaseIndex !== index
        ),
      };
    });
  }

  function updateStarterCode(index, value) {
    setProblem((previous) => ({
      ...previous,
      starterCode:
        previous.starterCode.map(
          (starter, starterIndex) =>
            starterIndex === index
              ? {
                  ...starter,
                  code: value,
                }
              : starter
        ),
    }));

    setProblemMessage('');
  }

  function buildProblemBody() {
    const validExamples =
      problem.examples
        .filter(
          (example) =>
            example.input.trim() &&
            example.output.trim()
        )
        .map((example) => ({
          input: example.input.trim(),
          output: example.output.trim(),
          explanation:
            example.explanation.trim(),
        }));

    const validTestCases =
      problem.testCases
        .filter(
          (testCase) =>
            testCase.input.trim() &&
            testCase.expectedOutput.trim()
        )
        .map((testCase) => ({
          input: testCase.input.trim(),
          expectedOutput:
            testCase.expectedOutput.trim(),
          isHidden: testCase.isHidden,
        }));

    const validStarterCode =
      problem.starterCode
        .filter((starter) =>
          starter.code.trim()
        )
        .map((starter) => ({
          language: starter.language,
          code: starter.code,
        }));

    return {
      body: {
        title: problem.title.trim(),

        slug: problem.slug
          .trim()
          .toLowerCase(),

        description:
          problem.description.trim(),

        difficulty: problem.difficulty,

        topics: problem.topics
          .split(',')
          .map((topic) => topic.trim())
          .filter(Boolean),

        constraints:
          problem.constraints
            .split('\n')
            .map((constraint) =>
              constraint.trim()
            )
            .filter(Boolean),

        examples: validExamples,

        testCases: validTestCases,

        starterCode: validStarterCode,
      },

      validExamples,
      validTestCases,
      validStarterCode,
    };
  }

  function validateProblemData(
    validExamples,
    validTestCases,
    validStarterCode
  ) {
    if (!problem.title.trim()) {
      setProblemMessage(
        'Problem title is required.'
      );
      return false;
    }

    if (!problem.slug.trim()) {
      setProblemMessage(
        'Problem slug is required.'
      );
      return false;
    }

    if (!problem.description.trim()) {
      setProblemMessage(
        'Problem description is required.'
      );
      return false;
    }

    if (validExamples.length === 0) {
      setProblemMessage(
        'Please add at least one valid example.'
      );
      return false;
    }

    if (validTestCases.length === 0) {
      setProblemMessage(
        'Please add at least one valid test case.'
      );
      return false;
    }

    if (validStarterCode.length === 0) {
      setProblemMessage(
        'Please add starter code for at least one language.'
      );
      return false;
    }

    return true;
  }

  async function createProblem(event) {
    event.preventDefault();

    setProblemMessage('');

    const {
      body,
      validExamples,
      validTestCases,
      validStarterCode,
    } = buildProblemBody();

    if (
      !validateProblemData(
        validExamples,
        validTestCases,
        validStarterCode
      )
    ) {
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem(
        'codepage_admin_token'
      );

      const response = await fetch(
        `${API_URL}/problems`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Unable to create problem.'
        );
      }

      setProblemMessage(
        'Problem created successfully.'
      );

      setProblem(createEmptyProblem());

      await loadProblems();
    } catch (error) {
      setProblemMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function startEditingProblem(slug) {
    setProblemMessage('');

    try {
      const response = await fetch(
        `${API_URL}/problems/${slug}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Unable to load problem.'
        );
      }

      setProblem(
        normalizeProblem(data.problem)
      );

      setEditingProblemId(
        data.problem._id
      );

      setEditing(true);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (error) {
      setProblemMessage(error.message);
    }
  }

  async function updateProblem(event) {
    event.preventDefault();

    setProblemMessage('');

    if (!editingProblemId) {
      setProblemMessage(
        'No problem selected for editing.'
      );
      return;
    }

    const {
      body,
      validExamples,
      validTestCases,
      validStarterCode,
    } = buildProblemBody();

    if (
      !validateProblemData(
        validExamples,
        validTestCases,
        validStarterCode
      )
    ) {
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem(
        'codepage_admin_token'
      );

      const response = await fetch(
        `${API_URL}/problems/${editingProblemId}`,
        {
          method: 'PATCH',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Unable to update problem.'
        );
      }

      setProblemMessage(
        'Problem updated successfully.'
      );

      setEditing(false);
      setEditingProblemId(null);
      setProblem(createEmptyProblem());

      await loadProblems();
    } catch (error) {
      setProblemMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  function cancelEditing() {
    setEditing(false);
    setEditingProblemId(null);
    setProblemMessage('');
    setProblem(createEmptyProblem());
  }

  if (!admin) {
    return (
      <main className="login">
        <form onSubmit={login}>
          <p>CODEPAGE</p>

          <h1>
            Administrator sign-in
          </h1>

          <input
            name="email"
            type="email"
            placeholder="Administrator email"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
          />

          {message && (
            <small>{message}</small>
          )}

          <button type="submit">
            Sign in securely
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="shell">
      <header>
        <div>
          <p>CODEPAGE</p>

          <h1>Admin console</h1>
        </div>

        <button
          type="button"
          onClick={logout}
        >
          Sign out
        </button>
      </header>

      <section className="grid">
        <article>
          <h2>
            {editing
              ? 'Edit Problem'
              : 'Problem management'}
          </h2>

          <p>
            {editing
              ? 'Update the selected CodePage problem.'
              : 'Create and manage coding problems for CodePage.'}
          </p>

          <form
            onSubmit={
              editing
                ? updateProblem
                : createProblem
            }
          >
            <label>
              Problem Title

              <input
                name="title"
                type="text"
                value={problem.title}
                onChange={
                  handleProblemChange
                }
                placeholder="Two Sum"
                maxLength={150}
                required
              />
            </label>

            <label>
              Slug

              <div>
                <input
                  name="slug"
                  type="text"
                  value={problem.slug}
                  onChange={
                    handleProblemChange
                  }
                  placeholder="two-sum"
                  required
                />

                <button
                  type="button"
                  onClick={generateSlug}
                >
                  Generate
                </button>
              </div>
            </label>

            <label>
              Description

              <textarea
                name="description"
                value={
                  problem.description
                }
                onChange={
                  handleProblemChange
                }
                placeholder="Describe the problem..."
                rows={8}
                required
              />
            </label>

            <label>
              Difficulty

              <select
                name="difficulty"
                value={
                  problem.difficulty
                }
                onChange={
                  handleProblemChange
                }
              >
                <option value="Easy">
                  Easy
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Hard">
                  Hard
                </option>
              </select>
            </label>

            <label>
              Topics

              <input
                name="topics"
                type="text"
                value={problem.topics}
                onChange={
                  handleProblemChange
                }
                placeholder="Array, Hash Table, Two Pointers"
              />

              <small>
                Separate topics using commas.
              </small>
            </label>

            <label>
              Constraints

              <textarea
                name="constraints"
                value={
                  problem.constraints
                }
                onChange={
                  handleProblemChange
                }
                placeholder={
                  '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9'
                }
                rows={5}
              />

              <small>
                Write one constraint per line.
              </small>
            </label>

            <hr />

            <h3>Examples</h3>

            {problem.examples.map(
              (example, index) => (
                <div
                  key={index}
                  className="admin-block"
                >
                  <h4>
                    Example {index + 1}
                  </h4>

                  <label>
                    Example Input

                    <textarea
                      value={
                        example.input
                      }
                      onChange={(event) =>
                        updateExample(
                          index,
                          'input',
                          event.target.value
                        )
                      }
                      placeholder="nums = [2,7,11,15], target = 9"
                      rows={3}
                    />
                  </label>

                  <label>
                    Example Output

                    <input
                      type="text"
                      value={
                        example.output
                      }
                      onChange={(event) =>
                        updateExample(
                          index,
                          'output',
                          event.target.value
                        )
                      }
                      placeholder="[0,1]"
                    />
                  </label>

                  <label>
                    Explanation

                    <textarea
                      value={
                        example.explanation
                      }
                      onChange={(event) =>
                        updateExample(
                          index,
                          'explanation',
                          event.target.value
                        )
                      }
                      placeholder="nums[0] + nums[1] = 2 + 7 = 9"
                      rows={3}
                    />
                  </label>

                  {problem.examples
                    .length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeExample(
                          index
                        )
                      }
                    >
                      Remove Example
                    </button>
                  )}
                </div>
              )
            )}

            <button
              type="button"
              onClick={addExample}
            >
              + Add Example
            </button>

            <hr />

            <h3>Test Cases</h3>

            {problem.testCases.map(
              (testCase, index) => (
                <div
                  key={index}
                  className="admin-block"
                >
                  <h4>
                    Test Case {index + 1}
                  </h4>

                  <label>
                    Test Case Input

                    <textarea
                      value={
                        testCase.input
                      }
                      onChange={(event) =>
                        updateTestCase(
                          index,
                          'input',
                          event.target.value
                        )
                      }
                      placeholder="[2,7,11,15], 9"
                      rows={3}
                    />
                  </label>

                  <label>
                    Expected Output

                    <input
                      type="text"
                      value={
                        testCase.expectedOutput
                      }
                      onChange={(event) =>
                        updateTestCase(
                          index,
                          'expectedOutput',
                          event.target.value
                        )
                      }
                      placeholder="[0,1]"
                    />
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={
                        testCase.isHidden
                      }
                      onChange={(event) =>
                        updateTestCase(
                          index,
                          'isHidden',
                          event.target.checked
                        )
                      }
                    />

                    Hidden test case
                  </label>

                  {problem.testCases
                    .length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeTestCase(
                          index
                        )
                      }
                    >
                      Remove Test Case
                    </button>
                  )}
                </div>
              )
            )}

            <button
              type="button"
              onClick={addTestCase}
            >
              + Add Test Case
            </button>

            <hr />

            <h3>Starter Code</h3>

            <p>
              Add the initial code that users
              will see when they open this
              problem.
            </p>

            {problem.starterCode.map(
              (starter, index) => (
                <div
                  key={starter.language}
                  className="admin-block"
                >
                  <h4>
                    {starter.language === 'java'
                      ? 'Java'
                      : starter.language ===
                        'python'
                      ? 'Python'
                      : starter.language ===
                        'cpp'
                      ? 'C++'
                      : 'JavaScript'}
                  </h4>

                  <textarea
                    value={starter.code}
                    onChange={(event) =>
                      updateStarterCode(
                        index,
                        event.target.value
                      )
                    }
                    placeholder={
                      starter.language === 'java'
                        ? 'Enter Java starter code...'
                        : starter.language ===
                          'python'
                        ? 'Enter Python starter code...'
                        : starter.language ===
                          'cpp'
                        ? 'Enter C++ starter code...'
                        : 'Enter JavaScript starter code...'
                    }
                    rows={12}
                  />
                </div>
              )
            )}

            {problemMessage && (
              <p>{problemMessage}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? editing
                    ? 'Updating...'
                    : 'Creating...'
                  : editing
                  ? 'Update Problem'
                  : 'Create Problem'}
              </button>

              {editing && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </article>

        <article>
          <h2>Existing Problems</h2>

          <p>
            View and edit problems already
            created in CodePage.
          </p>

          <button
            type="button"
            onClick={loadProblems}
            disabled={loadingProblems}
          >
            {loadingProblems
              ? 'Loading...'
              : 'Refresh Problems'}
          </button>

          {problems.length === 0 &&
            !loadingProblems && (
              <p>
                No problems found.
              </p>
            )}

          {problems.map((item) => (
            <div
              key={item._id}
              className="admin-block"
            >
              <h3>{item.title}</h3>

              <p>
                Difficulty: {item.difficulty}
              </p>

              <p>
                Slug: {item.slug}
              </p>

              <p>
                Topics:{' '}
                {item.topics?.length
                  ? item.topics.join(', ')
                  : 'No topics'}
              </p>

              <button
                type="button"
                onClick={() =>
                  startEditingProblem(
                    item.slug
                  )
                }
              >
                Edit
              </button>
            </div>
          ))}
        </article>

        <article>
          <h2>
            Contest management
          </h2>

          <p>
            Schedule contests and publish
            rankings here later.
          </p>
        </article>

        <article>
          <h2>
            User moderation
          </h2>

          <p>
            Role-aware administration is
            ready to extend.
          </p>
        </article>
      </section>
    </main>
  );
}