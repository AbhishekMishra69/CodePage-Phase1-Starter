
import axios from 'axios';

const JUDGE0_URL = 'https://ce.judge0.com';
const MAX_CONCURRENT_EXECUTIONS = 3;
const POLL_INTERVAL_MS = 1000;
const MAX_WAIT_MS = 30000;

const LANGUAGE_IDS = {
  java: 62,
  javascript: 63,
  cpp: 54,
  python: 71,
};

const client = axios.create({
  baseURL: JUDGE0_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function executeTestCase({
  languageId,
  sourceCode,
  testCase,
  index,
}) {
  try {
    const submission = await client.post(
      '/submissions?base64_encoded=false&wait=false',
      {
        source_code: sourceCode,
        language_id: languageId,
        stdin: testCase.input,
        expected_output: testCase.expectedOutput,
        cpu_time_limit: 2,
        memory_limit: 128000,
      }
    );

    const token = submission.data?.token;

    if (!token) {
      throw new Error('Judge0 did not return a submission token.');
    }

    const deadline = Date.now() + MAX_WAIT_MS;
    let result;

    while (Date.now() < deadline) {
      await sleep(POLL_INTERVAL_MS);

      const response = await client.get(
        `/submissions/${encodeURIComponent(token)}?base64_encoded=false`
      );

      result = response.data;

      const statusId = result.status?.id;

      // 1 = In Queue, 2 = Processing
      if (statusId !== 1 && statusId !== 2) {
        break;
      }
    }

    if (!result || [1, 2].includes(result.status?.id)) {
      return {
        testCase: index + 1,
        status: 'Execution Error',
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: result?.stdout || '',
        error: 'Judge0 execution timed out. Please try again.',
        time: result?.time || null,
        memory: result?.memory || null,
      };
    }

    let status = result.status?.description || 'Unknown';

    if (status === 'Accepted') {
      status = 'Passed';
    } else if (status === 'Wrong Answer') {
      status = 'Wrong Answer';
    }

    return {
      testCase: index + 1,
      status,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: result.stdout || '',
      error: result.stderr || result.compile_output || '',
      time: result.time || null,
      memory: result.memory || null,
    };
  } catch (error) {
    return {
      testCase: index + 1,
      status: 'Execution Error',
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: '',
      error:
        error.response?.data?.error ||
        error.message ||
        'Failed to execute test case.',
      time: null,
      memory: null,
    };
  }
}

export async function runCode({
  language,
  sourceCode,
  testCases,
}) {
  const languageId = LANGUAGE_IDS[language];

  if (!languageId) {
    throw new Error(`Unsupported language: ${language}`);
  }

  if (!Array.isArray(testCases) || testCases.length === 0) {
    throw new Error('At least one test case is required.');
  }

  const results = new Array(testCases.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const index = nextIndex++;

      if (index >= testCases.length) return;

      results[index] = await executeTestCase({
        languageId,
        sourceCode,
        testCase: testCases[index],
        index,
      });
    }
  }

  const workerCount = Math.min(
    MAX_CONCURRENT_EXECUTIONS,
    testCases.length
  );

  await Promise.all(
    Array.from({ length: workerCount }, () => worker())
  );

  const passedTests = results.filter(
    (item) => item.status === 'Passed'
  ).length;

  const failedResult = results.find(
    (item) => item.status !== 'Passed'
  );

  return {
    status:
      passedTests === testCases.length
        ? 'Accepted'
        : failedResult?.status || 'Unknown',
    passedTests,
    totalTests: testCases.length,
    results,
  };
}
