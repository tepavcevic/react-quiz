import { NEW_ANSWER } from "../constants/questions";

export default function Options({ question, dispatch, answer }) {
  const isAnswered = answer !== null;
  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option ${index === answer ? "answer" : ""} ${
            isAnswered
              ? index === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          disabled={isAnswered}
          key={option}
          onClick={() => dispatch({ type: NEW_ANSWER, payload: index })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
