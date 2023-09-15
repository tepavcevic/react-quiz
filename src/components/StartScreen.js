import { START } from "../constants/questions";

export default function StartScreen({ numOfQuestions, dispatch }) {
  return (
    <div className="start">
      <h2>Welcome to the React quiz</h2>
      <h3>{numOfQuestions} questions to test Your React mastery</h3>
      <button className="btn btn-ui" onClick={() => dispatch({ type: START })}>
        Let's start
      </button>
    </div>
  );
}
