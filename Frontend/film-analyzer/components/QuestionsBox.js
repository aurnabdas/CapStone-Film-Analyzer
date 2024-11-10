"use client"

const QuestionBox = ({ question, answer, setAnswer, placeholder, onSubmit, type = "text" }) => {
    return (
      <div className="p-6 bg-gray-800 bg-opacity-80 rounded-lg shadow-lg max-w-xs text-center">
        <label className="block text-lg mb-4">{question}</label>
        <input
          type={type}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={placeholder}
          className="w-full p-2 mb-4 rounded-md text-black"
          min={type === "number" ? 1 : undefined}
          max={type === "number" ? 10 : undefined}
        />
        <button
          onClick={onSubmit}
          className="px-4 py-2 rounded-md bg-[#D5A036] text-white hover:bg-yellow-600 transition"
        >
          Submit Answer
        </button>
      </div>
    );
  };

  export default QuestionBox