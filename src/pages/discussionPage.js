import React from "react";
import { useState } from "react";
import QuestionsList from "../components/QuestionsList";
import SubmitAnswer from "../components/SubmitAnswer";
import Link from "next/link";
import { useRouter } from "next/router";
import InnerHeader from "../components/InnerHeader";
import { color } from "framer-motion";

function DiscussionPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const { questionId } = router.query;

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const question = { title, description };

    try {
      const response = await fetch("http://localhost:5001/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(question),
      });

      if (response.ok) {
        alert("Question submitted successfully!");
        setTitle("");
        setDescription("");
      } else {
        const errorData = await response.json();
        alert(`Failed to submit question: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error in submitting question", error);
      alert("Failed to submit question: Network error");
    }
    window.location.reload();
  };

  return (
    <>
      <InnerHeader />
        {!questionId && (
            <div className="discussion">
              <div className="card" style={{ marginBottom: "20px" }}>
                  <h2>
                    Submit a Question
                  </h2>
                  <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Enter title"/>
                  <textarea
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Enter description"></textarea>
                <button
                  onClick={handleSubmit}
                >
                  Submit Question
                </button>
              </div>
              <QuestionsList />
            </div>
        )}
        {questionId && <SubmitAnswer />}
    </>
  );
}

export default DiscussionPage;
