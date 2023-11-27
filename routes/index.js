// index.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Question = require('../models/question');

// Variables to track performance metrics in memory
let questionsAnswered = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;

// Connect to MongoDB
mongoose.connect('mongodb+srv://user:user@final-cluster0.waszbq8.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to database!');
}).catch((err) => {
  console.log('Error connecting to database:', err);
});

// GET Question page
router.get('/question', async (req, res) => {
  try {
    const count = await Question.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const question = await Question.findOne().skip(randomIndex);

    if (question) {
      res.render('question', { question });
      console.log(randomIndex);
    } else {
      res.status(404).send('No question found in database!');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

router.post('/question', async (req, res, next) => {
  console.log('Form submitted!');
  console.log(req.body);

  const { questionId, answer } = req.body;

  console.log('Question ID:', questionId);
  console.log('Answer:', answer);

  try {
    // Retrieve the question from the database
    const question = await Question.findById(questionId);

    if (!question) {
      console.log('No question found in database!');
      res.status(404).send('No question found in database!');
      return;
    }

    console.log('Question:', question);

    console.log('User answer:', answer);

    // Check if the answer is correct
    const isCorrect = answer === question.answer;
    console.log('Is answer correct?', isCorrect);

    // Update performance tracking variables
    questionsAnswered += 1;
    correctAnswers += isCorrect ? 1 : 0;
    incorrectAnswers += isCorrect ? 0 : 1;

    const message = isCorrect ? 'Correct!' : 'Incorrect!';

    // Return the message and performance data as JSON
    res.json({
      message,
      performance: {
        questionsAnswered,
        correctAnswers,
        incorrectAnswers,
      },
    });
  } catch (error) {
    console.log('Error retrieving question:', error);
    res.status(500).send('Internal server error');
  }
});

// Additional route to display performance
router.get('/performance', (req, res) => {
  res.render('performance', {
    performance: {
      questionsAnswered,
      correctAnswers,
      incorrectAnswers,
    },
  });
});

router.post('/performance', (req, res) => {
  // Reset counters
  questionsAnswered = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;
  
  res.json({
    performance: {
      questionsAnswered,
      correctAnswers,
      incorrectAnswers,
    },
    message: 'Performance metrics reset successfully',
  });
});



// Export the router
module.exports = router;
