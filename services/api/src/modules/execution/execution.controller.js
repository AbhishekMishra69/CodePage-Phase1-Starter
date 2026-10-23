import { Problem } from '../problems/problem.model.js';
import { Submission } from './submission.model.js';
import { runCode } from './execution.service.js';

export async function executeCode(req, res, next) {
  try {
    const {
      problemSlug,
      language,
      sourceCode,
    } = req.body;

    if (!problemSlug) {
      return res.status(400).json({
        message: 'Problem slug is required.',
      });
    }

    if (!language) {
      return res.status(400).json({
        message: 'Programming language is required.',
      });
    }

    if (!sourceCode?.trim()) {
      return res.status(400).json({
        message: 'Source code is required.',
      });
    }

    const problem = await Problem.findOne({
      slug: problemSlug,
      status: 'ACTIVE',
    }).lean();

    if (!problem) {
      return res.status(404).json({
        message: 'Problem not found.',
      });
    }

    const visibleTestCases = problem.testCases.filter(
      (testCase) => testCase.isHidden === false
    );

    if (visibleTestCases.length === 0) {
      return res.status(400).json({
        message: 'No visible test cases are available for this problem.',
      });
    }

    const result = await runCode({
      language,
      sourceCode,
      testCases: visibleTestCases,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function submitCode(req, res, next) {
  try {
    const {
      problemSlug,
      language,
      sourceCode,
    } = req.body;

    if (!problemSlug) {
      return res.status(400).json({
        message: 'Problem slug is required.',
      });
    }

    if (!language) {
      return res.status(400).json({
        message: 'Programming language is required.',
      });
    }

    if (!sourceCode?.trim()) {
      return res.status(400).json({
        message: 'Source code is required.',
      });
    }

    const problem = await Problem.findOne({
      slug: problemSlug,
      status: 'ACTIVE',
    }).lean();

    if (!problem) {
      return res.status(404).json({
        message: 'Problem not found.',
      });
    }

    const testCases = problem.testCases || [];

    if (testCases.length === 0) {
      return res.status(400).json({
        message: 'No test cases are available for this problem.',
      });
    }

    const result = await runCode({
      language,
      sourceCode,
      testCases,
    });

    const runtimes = result.results
      .map((item) => Number(item.time))
      .filter((value) => Number.isFinite(value));

    const memories = result.results
      .map((item) => Number(item.memory))
      .filter((value) => Number.isFinite(value));

    const totalRuntime =
      runtimes.length > 0
        ? runtimes.reduce((sum, value) => sum + value, 0)
        : null;

    const maxMemory =
      memories.length > 0
        ? Math.max(...memories)
        : null;

    const submission = await Submission.create({
      user: req.user?._id || null,
      problem: problem._id,
      problemSlug: problem.slug,
      language,
      sourceCode,
      status: result.status,
      passedTests: result.passedTests,
      totalTests: result.totalTests,
      runtime: totalRuntime,
      memory: maxMemory,
    });

    res.json({
      ...result,
      submissionId: submission._id,
    });
  } catch (error) {
    next(error);
  }
}