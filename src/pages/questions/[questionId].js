import React from "react";
import { useRouter } from "next/router";
import SubmitAnswer from "../../components/SubmitAnswer";
import Link from "next/link";
import InnerHeader from "../../components/InnerHeader";

const QuestionPage = () => {
  const router = useRouter();
  const { questionId } = router.query;

  return (
    <>
      <InnerHeader />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "200px" }}>
        {questionId && <SubmitAnswer />}
      </div>
    </>
  );
};

export default QuestionPage;
