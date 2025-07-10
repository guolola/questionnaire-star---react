import React from 'react';
import { Outlet } from 'react-router-dom';

const QuestionLayout = () => {
  return (
    <div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default QuestionLayout;
