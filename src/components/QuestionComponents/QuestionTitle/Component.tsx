import { type QuestionTitlePropsType, QuestionTitleDefaultProps } from './interface';
import { Typography } from 'antd';
const QuestionTitle = (props: QuestionTitlePropsType) => {
  const { text = '', level = 1, isCenter = false } = { ...QuestionTitleDefaultProps, ...props };

  const genFontSize = (level: number) => {
    switch (level) {
      case 1:
        return '24px';
      case 2:
        return '20px';
      case 3:
        return '16px';
    }
  };

  return (
    <Typography.Title
      level={level}
      style={{
        textAlign: isCenter ? 'center' : 'start',
        marginBottom: '0',
        fontSize: genFontSize(level),
      }}
    >
      {text}
    </Typography.Title>
  );
};

export default QuestionTitle;
