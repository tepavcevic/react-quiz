import { FINISH_GAME, NEXT_QUESTION } from "../constants/questions";

export default function NextButton({
  dispatch,
  answer,
  numOfQuestions,
  index
}) {
  if (answer === null) return null;
  if (index < numOfQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: NEXT_QUESTION })}
      >
        Next
      </button>
    );
  if (index === numOfQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: FINISH_GAME })}
      >
        Next
      </button>
    );
}
