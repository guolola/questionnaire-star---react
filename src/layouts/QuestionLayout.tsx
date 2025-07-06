import React from 'react';
import { Outlet } from 'react-router-dom';

const QuestionLayout = () => {
  return (
    <div>
      <h2>Question layout</h2>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default QuestionLayout;
