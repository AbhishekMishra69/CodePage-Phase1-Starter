import { Submission } from './submission.model.js';

export async function getMySubmissions(req, res, next) {
  try {
    const submissions = await Submission.find({
      user: req.user._id,
    })
      .populate('problem', 'title slug difficulty')
      .select(
        'problem problemSlug language status passedTests totalTests runtime memory createdAt'
      )
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json({
      submissions,
    });
  } catch (error) {
    next(error);
  }
}