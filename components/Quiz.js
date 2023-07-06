import React, { useState } from 'react';
import { Card, CardContent, Typography, FormControl, FormControlLabel, Radio, RadioGroup, Button } from '@mui/material';
import { doc, setDoc, getFirestore, addDoc, getDoc, collection, getDocs } from "firebase/firestore";
import {
    onAuthStateChanged,
} from 'firebase/auth'
import { app } from '..//firebase';
import { auth } from '..//firebase'

const QuizComponent = ({ quizData, teacheremail, useremail, id}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState('');
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleChoiceChange = (event) => {
    setSelectedChoice(event.target.value);
  };

  const handleNextQuestion = () => {
    checkAnswer();
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedChoice('');
    } else {
        const db = getFirestore(app);
      setQuizCompleted(true);
      
        const quizResults = {
          score,
          totalQuestions: questions.length,
          timestamp: new Date().toISOString(),
           title: quizData['title'],
           ids: id,
           useremail
        };

        const timestamp = new Date().toISOString()
        console.log('->', quizData['title'])
         addDoc(collection(db, "users", teacheremail, 'results' ,useremail, 'rezultate' ), {
          timestamp :quizResults
          });
          addDoc(collection(db, "users", teacheremail, 'rezultateprof' ), {
            timestamp :quizResults
            });
      
    }
  };

  const checkAnswer = () => {
    const currentQuestion = quizData.questions[currentQuestionIndex];
    if (selectedChoice === currentQuestion.correctInd) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const { questions } = quizData;
  const currentQuestion = questions[currentQuestionIndex];

  if (quizCompleted) {
    return (
      <Card variant="outlined" sx={{ maxWidth: 400, m: 'auto', mt: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Completed
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Your Score: {score}/{questions.length}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ maxWidth: 400, m: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
         {quizData['title']}
        </Typography>
        <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
          {currentQuestion.question}
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup name="choice" value={selectedChoice} onChange={handleChoiceChange}>
            {currentQuestion.choices.map((choice, index) => (
              <FormControlLabel
                key={index}
                value={choice}
                control={<Radio />}
                label={choice}
                sx={{ mb: 1 }}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleNextQuestion}
          disabled={!selectedChoice}
        >
          {currentQuestionIndex === quizData.questions.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuizComponent;
