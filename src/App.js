import { useEffect, useReducer } from "react";

import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";
import { LOADING, ERROR, READY, ACTIVE, FINISHED } from "./constants/states";
import {
  DATA_RECEIVED,
  DATA_FAILED,
  START,
  NEW_ANSWER,
  NEXT_QUESTION,
  FINISH_GAME,
  RESTART_GAME,
  TICK,
  SECONDS_PER_QUESTION
} from "./constants/questions";

const initialState = {
  questions: [],
  status: LOADING,
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case DATA_RECEIVED:
      return { ...state, questions: action.payload, status: READY };

    case DATA_FAILED:
      return { ...state, status: ERROR };

    case START:
      return {
        ...state,
        status: ACTIVE,
        secondsRemaining: state.questions.length * SECONDS_PER_QUESTION
      };

    case NEW_ANSWER:
      const question = state.questions[state.index];
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points
      };

    case NEXT_QUESTION:
      return { ...state, index: state.index + 1, answer: null };

    case FINISH_GAME:
      return {
        ...state,
        status: FINISHED,
        highscore:
          state.points > state.highscore ? state.points : state.highscore
      };

    case RESTART_GAME:
      return {
        ...initialState,
        status: READY,
        highscore:
          state.points > state.highscore ? state.points : state.highscore
      };

    case TICK:
      return {
        ...state,
        secondsRemaining:
          state.secondsRemaining > 0 ? state.secondsRemaining - 1 : null,
        status: state.secondsRemaining === 0 ? FINISHED : state.status
      };

    default:
      throw new Error("Action unknown");
  }
};

export default function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch
  ] = useReducer(reducer, initialState);

  const numOfQuestions = questions?.length;
  const maxPossiblePoints = questions.reduce(
    (acc, curr) => acc + curr.points,
    0
  );

  useEffect(() => {
    fetch("http://localhost:9000/questions")
      .then(res => res.json())
      .then(data => dispatch({ type: DATA_RECEIVED, payload: data }))
      .catch(error => dispatch({ type: DATA_FAILED }));
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === LOADING && <Loader />}
        {status === ERROR && <Error />}
        {status === READY && (
          <StartScreen numOfQuestions={numOfQuestions} dispatch={dispatch} />
        )}
        {status === ACTIVE && (
          <>
            <Progress
              index={index}
              numOfQuestions={numOfQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />

            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                numOfQuestions={numOfQuestions}
                index={index}
              />
            </Footer>
          </>
        )}
        {status === FINISHED && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
