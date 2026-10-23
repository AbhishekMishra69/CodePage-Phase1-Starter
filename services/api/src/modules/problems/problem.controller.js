import { Problem } from './problem.model.js';

export async function getProblems(req, res, next) {
  try {
    const {
      search = '',
      difficulty,
      topic,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {
      status: 'ACTIVE',
    };

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (topic) {
      filter.topics = topic;
    }

    if (search.trim()) {
      filter.$text = {
        $search: search.trim(),
      };
    }

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (pageNumber - 1) * limitNumber;

    const [problems, total] = await Promise.all([
      Problem.find(filter)
        .select(
          'title slug difficulty topics acceptanceRate totalSubmissions totalAccepted createdAt'
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      Problem.countDocuments(filter),
    ]);

    res.json({
      problems,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getProblemBySlug(req, res, next) {
  try {
    const problem = await Problem.findOne({
      slug: req.params.slug,
      status: 'ACTIVE',
    }).lean();

    if (!problem) {
      return res.status(404).json({
        message: 'Problem not found.',
      });
    }

    res.json({
      problem,
    });
  } catch (error) {
    next(error);
  }
}

export async function createProblem(req, res, next) {
  try {
    const problem = await Problem.create(req.body);

    res.status(201).json({
      message: 'Problem created successfully.',
      problem,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProblem(req, res, next) {
  try {
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!problem) {
      return res.status(404).json({
        message: 'Problem not found.',
      });
    }

    res.json({
      message: 'Problem updated successfully.',
      problem,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProblem(req, res, next) {
  try {
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      {
        status: 'ARCHIVED',
      },
      {
        new: true,
      }
    );

    if (!problem) {
      return res.status(404).json({
        message: 'Problem not found.',
      });
    }

    res.json({
      message: 'Problem archived successfully.',
    });
  } catch (error) {
    next(error);
  }
}