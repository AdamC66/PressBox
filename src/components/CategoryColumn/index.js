import React from "react";
import QuestionCard from "components/QuestionCard";

function CategoryColumn({ category }) {
  console.log(category);
  const questions = category?.questions?.map((question) => (
    <QuestionCard question={question} key={question.code} />
  ));
  return (
    <div>
      <h3>{category.name || "Create New"}</h3>
      {questions}
    </div>
  );
}

export default CategoryColumn;
