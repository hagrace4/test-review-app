var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Question = require('../models/question');


/* GET Question page. */
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

// POST the user's answer and check if it's correct
router.post('/question', async (req, res, next) => {
  console.log('Form submitted!');
  console.log(req.body);

  const { questionId, answer } = req.body;

  console.log('Question ID:', questionId);
  console.log('Answer:', answer);

    // Log all question IDs
    // const allQuestionIds = await getAllQuestionIds();
    // console.log('All question IDs:', allQuestionIds);

    console.log('Selected question ID:', questionId);


  Question.findById(questionId)
    .then(question => {
      if (!question) {
        console.log('No question found in database!');
        res.status(404).send('No question found in database!');
      } else {
        console.log('Question:', question);

        console.log('User answer:', answer);

        const isCorrect = answer === question.answer;
        console.log('Is answer correct?', isCorrect);

        const message = isCorrect ? 'Correct!' : 'Incorrect!';

        // Return the message as JSON
        res.json({ message });
      }
    })
    .catch(err => {
      console.log('Error retrieving question:', err);
      res.status(500).send(err);
    });
});

//helper function to fetch all question IDs
async function getAllQuestionIds() {
  try {
    const allQuestions = await Question.find({}, '_id');
    return allQuestions.map(q => q._id);
  } catch (err) {
    console.log('Error fetching all question IDs:', err);
    return [];
  }
}


module.exports = router;


mongoose.connect('mongodb+srv://user:user@final-cluster0.waszbq8.mongodb.net/?retryWrites=true&w=majority', {
}).then(() => {
  console.log('Connected to database!');
}).catch((err) => {
  console.log('Error connecting to database:', err);
});

