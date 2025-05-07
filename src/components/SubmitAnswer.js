import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useContext } from "react"; 
import UserContext from "../context/userContext";

function SubmitAnswer() {
  const router = useRouter();
  const { questionId } = router.query;
  const [question, setQuestion] = useState(null);
  const [content, setContent] = useState("");
  const { userData } = useContext(UserContext);


  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/questions/${questionId}`
        );
        const data = await response.json();
        setQuestion(data.data);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    if (questionId) {
      fetchQuestion();
    }
  }, [questionId]);

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5001/api/answers/${questionId}/answers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );

      if (response.ok) {
        alert("Answer submitted successfully!");
        setContent("");
      } else {
        const errorData = await response.json();
        alert(`Failed to submit answer: ${errorData.message}`);
      }
      window.location.reload();
    } catch (error) {
      console.error("Error in submitting answer:", error);
      alert("Failed to submit answer: Network error");
    }
  };

  return (
    <div className="subanspage">
      <div className="subpage">
      {question && (
        <div className="anstitle">
          <h3>
            Title: {question.title}
          </h3>
          <p>
            Description: {question.description}
          </p>
          <h4>
            Discussion for {question.title}:
          </h4>
          <ul>
            {question.answers.map((answer) => (
              <li
                key={answer._id}
              >
                {/* <div><label><label>Name: </label>{userData?.name ? userData.name : null}</label></div> */}
                <div><label>Title</label></div> 
                <div><label>{answer.content}</label></div> 
              </li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Enter your answer"
          required
        ></textarea>
        <button
          type="submit"
        >
          Submit Answer
        </button>
      </form>
      </div>
    </div>
  );
}

export default SubmitAnswer;
