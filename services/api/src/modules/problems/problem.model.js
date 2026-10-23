import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
      trim: true,
    },
    output: {
      type: String,
      required: true,
      trim: true,
    },
    explanation: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { _id: false }
);

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
      trim: true,
    },
    expectedOutput: {
      type: String,
      required: true,
      trim: true,
    },
    isHidden: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const starterCodeSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      required: true,
      enum: ['javascript', 'python', 'java', 'cpp'],
    },
    code: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
    },

    topics: [
      {
        type: String,
        trim: true,
      },
    ],

    examples: {
      type: [exampleSchema],
      default: [],
    },

    constraints: [
      {
        type: String,
        trim: true,
      },
    ],

    testCases: {
      type: [testCaseSchema],
      default: [],
    },

    starterCode: {
      type: [starterCodeSchema],
      default: [],
    },

    functionSignature: {
      type: String,
      default: '',
      trim: true,
    },

    acceptanceRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    totalSubmissions: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalAccepted: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ['ACTIVE', 'DRAFT', 'ARCHIVED'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);

problemSchema.index({ difficulty: 1 });
problemSchema.index({ topics: 1 });
problemSchema.index({ status: 1 });
problemSchema.index({ title: 'text', description: 'text' });

export const Problem = mongoose.model('Problem', problemSchema);