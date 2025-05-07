import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useContext } from "react"; 
import UserContext from "../context/userContext";

function QuestionsList() {
  const [questions, setQuestions] = useState([]);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/questions");
        const data = await response.json();
        setQuestions(data.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }; 

    fetchQuestions();
  }, []);

  return (
    <div className="discussion-list">
      <h2>
        All Discussions
      </h2>
      <ul>
        {questions.map((question) => (
          <li key={question._id}>
            <Link
              href={`/questions/${question._id}`}
            >
              {/* <div><label><label>Name:</label>{userData?.name ? userData.name : null} </label></div> */}
              <div><label>Title</label></div>
              <div><label>{question.title}</label></div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionsList;
