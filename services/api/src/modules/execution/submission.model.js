import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },

    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },

    problemSlug: {
      type: String,
      required: true,
      trim: true,
    },

    language: {
      type: String,
      required: true,
      enum: ['java', 'python', 'javascript', 'cpp'],
    },

    sourceCode: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: [
        'Accepted',
        'Wrong Answer',
        'Compilation Error',
        'Runtime Error',
        'Time Limit Exceeded',
        'Memory Limit Exceeded',
        'Unknown',
      ],
    },

    passedTests: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalTests: {
      type: Number,
      default: 0,
      min: 0,
    },

    runtime: {
      type: Number,
      default: null,
    },

    memory: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index({ user: 1, createdAt: -1 });
submissionSchema.index({ problem: 1, createdAt: -1 });
submissionSchema.index({ problemSlug: 1, createdAt: -1 });

export const Submission = mongoose.model(
  'Submission',
  submissionSchema
);