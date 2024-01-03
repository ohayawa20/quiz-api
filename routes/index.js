const express = require('express');
const router = express.Router();
const Question = require('../models/question');

router.get('/', (req, res) => {
  res.render('index');
});
router.get('/uploadQuiz', async (req, res) => {
  try {
    res.render('questions/uploadQuestion'); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/attemptQuiz', async (req, res) => {
  try {
    const questions = await Question.find();
    res.render('questions/attemptQuiz', { questions }); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/showQuestions',async (req, res) => {
  const questions = await Question.find();
  res.render('questions/showQuestions',{questions});
});

router.get('/quizResult', async (req, res) => {
  try {
    const questions = await Question.find();
    const totalQuestions = questions.length;
    const submittedAnswers = {
      questionId1: 'selectedAnswer1',
      questionId2: 'selectedAnswer2',
    };

    let score = 0;
    for (const questionId in submittedAnswers) {
      const selectedAnswer = submittedAnswers[questionId];
      const question = questions.find(q => q.id === questionId); 
      if (question && question.correctAnswer === selectedAnswer) {
        score++;
      }
    }

    res.render('questions/quizResult', { score, totalQuestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/submitQuiz', async (req, res) => {
  try {
    const submittedAnswers = req.body; 
    let score = 0;
    for (const questionId in submittedAnswers) {
      const selectedAnswer = submittedAnswers[questionId];
      const question = await Question.findById(questionId);
      if (question && question.correctAnswer === parseInt(selectedAnswer)) {
        score++;
      }
    }
    res.render('questions/quizResult', { score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/createQuestion', (req, res) => {
  res.render('questions/createQuestion'); 
});

router.post('/createQuestion', async (req, res) => {
  try {
    const { question, answers, correctAnswer } = req.body;
    const newQuestion = new Question({ question, answers, correctAnswer });
    await newQuestion.save(); 
        res.redirect('/attemptQuiz'); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;