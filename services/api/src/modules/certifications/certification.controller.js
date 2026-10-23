
import { randomUUID } from 'node:crypto';
import { Certificate } from './certificate.model.js';
import { certifications, PASSING_SCORE } from './certification.questions.js';

export async function getQuestions(req, res, next) {
  try {
    const { type } = req.params;
    const certification = certifications[type];

    if (!certification) {
      return res.status(404).json({ message: 'Certification not found.' });
    }

    const questions = certification.questions.map(({ question, options }, index) => ({
      id: index,
      question,
      options,
    }));

    res.json({
      name: certification.name,
      totalQuestions: questions.length,
      passingScore: PASSING_SCORE,
      questions,
    });
  } catch (error) {
    next(error);
  }
}

export async function submitTest(req, res, next) {
  try {
    const { type } = req.params;
    const certification = certifications[type];
    const { answers } = req.body;

    if (!certification) {
      return res.status(404).json({ message: 'Certification not found.' });
    }

    if (
      !Array.isArray(answers) ||
      answers.length !== certification.questions.length ||
      answers.some((answer) => !Number.isInteger(answer))
    ) {
      return res.status(400).json({ message: 'Submit one valid option for every question.' });
    }

    const correct = certification.questions.reduce(
      (total, question, index) => total + (question.answer === answers[index] ? 1 : 0),
      0
    );

    const totalQuestions = certification.questions.length;
    const score = Math.round((correct / totalQuestions) * 100);
    const passed = score >= PASSING_SCORE;

    if (!passed) {
      return res.json({
        passed,
        score,
        correct,
        totalQuestions,
        message: 'You did not pass. Please try again.',
      });
    }

    const certificate = await Certificate.create({
      certificateId: `CP-${randomUUID().toUpperCase()}`,
      userId: req.user._id,
      certificationName: certification.name,
      score,
      totalQuestions,
    });

    res.status(201).json({
      passed,
      score,
      correct,
      totalQuestions,
      certificate: {
        certificateId: certificate.certificateId,
        certificationName: certificate.certificationName,
        issueDate: certificate.issueDate,
      },
      message: 'Congratulations! Your certificate has been issued.',
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyCertificate(req, res, next) {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.certificateId,
      status: 'valid',
    }).populate('userId', 'name');

    if (!certificate) {
      return res.status(404).json({
        valid: false,
        message: 'Certificate not found or revoked.',
      });
    }

    res.json({
      valid: true,
      certificate: {
        certificateId: certificate.certificateId,
        recipient: certificate.userId?.name ?? 'CodePage learner',
        certificationName: certificate.certificationName,
        score: certificate.score,
        issueDate: certificate.issueDate,
        status: certificate.status,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyCertificates(req, res, next) {
  try {
    const certificates = await Certificate.find({ userId: req.user._id })
      .sort({ issueDate: -1 })
      .select('-_id certificateId certificationName score totalQuestions issueDate status');

    res.json({ certificates });
  } catch (error) {
    next(error);
  }
}
