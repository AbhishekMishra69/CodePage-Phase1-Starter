
export const certifications = {
  java: {
    name: 'Java Certification',
    questions: [
      {
        question: 'Which keyword is used to inherit a class in Java?',
        options: ['implements', 'extends', 'inherits', 'super'],
        answer: 1,
      },
      {
        question: 'Which method is the entry point of a Java application?',
        options: ['start()', 'run()', 'main()', 'init()'],
        answer: 2,
      },
      {
        question: 'Which type stores true or false?',
        options: ['int', 'String', 'boolean', 'char'],
        answer: 2,
      },
      {
        question: 'Which collection does not allow duplicate elements?',
        options: ['List', 'Set', 'ArrayList', 'LinkedList'],
        answer: 1,
      },
      {
        question: 'Which keyword creates an object?',
        options: ['class', 'this', 'new', 'void'],
        answer: 2,
      },
    ],
  },

  python: {
    name: 'Python Certification',
    questions: [
      {
        question: 'Which symbol starts a comment in Python?',
        options: ['//', '#', '/*', '--'],
        answer: 1,
      },
      {
        question: 'Which data type stores key-value pairs?',
        options: ['List', 'Tuple', 'Dictionary', 'Set'],
        answer: 2,
      },
      {
        question: 'Which keyword defines a function?',
        options: ['function', 'func', 'def', 'method'],
        answer: 2,
      },
      {
        question: 'What does len([1, 2, 3]) return?',
        options: ['2', '3', '4', 'Error'],
        answer: 1,
      },
      {
        question: 'Which value represents no value in Python?',
        options: ['null', 'undefined', 'None', 'void'],
        answer: 2,
      },
    ],
  },

  html: {
    name: 'HTML & CSS Certification',
    questions: [
      {
        question: 'Which HTML tag creates a hyperlink?',
        options: ['<link>', '<a>', '<href>', '<url>'],
        answer: 1,
      },
      {
        question: 'Which CSS property changes text color?',
        options: ['font-style', 'background', 'color', 'text-size'],
        answer: 2,
      },
      {
        question: 'Which HTML tag displays an image?',
        options: ['<image>', '<picture-src>', '<img>', '<src>'],
        answer: 2,
      },
      {
        question: 'Which CSS layout is one-dimensional?',
        options: ['Flexbox', 'Grid', 'Table', 'Float'],
        answer: 0,
      },
      {
        question: 'Which attribute provides alternative image text?',
        options: ['title', 'src', 'alt', 'href'],
        answer: 2,
      },
    ],
  },

  sql: {
    name: 'SQL Certification',
    questions: [
      {
        question: 'Which SQL command retrieves data?',
        options: ['GET', 'SELECT', 'FETCH ALL', 'OPEN'],
        answer: 1,
      },
      {
        question: 'Which clause filters rows?',
        options: ['ORDER BY', 'GROUP BY', 'WHERE', 'JOIN'],
        answer: 2,
      },
      {
        question: 'Which command adds a new row?',
        options: ['ADD', 'INSERT INTO', 'UPDATE', 'ALTER'],
        answer: 1,
      },
      {
        question: 'Which function counts rows?',
        options: ['SUM()', 'TOTAL()', 'COUNT()', 'NUMBER()'],
        answer: 2,
      },
      {
        question: 'Which key uniquely identifies a row?',
        options: ['Foreign key', 'Primary key', 'Duplicate key', 'Index only'],
        answer: 1,
      },
    ],
  },
};

export const PASSING_SCORE = 70;
