import { Typography, Input } from 'antd';
import { type QuestionInputPropsType, QuestionInputDefaultProps } from './interface';

const { Paragraph } = Typography;

const QuestionInput = (props: QuestionInputPropsType) => {
  const { title, placeholder } = { ...QuestionInputDefaultProps, ...props };

  return (
    <div>
      <Paragraph strong>{title}</Paragraph>
      <div>
        <Input placeholder={placeholder}></Input>
      </div>
    </div>
  );
};

export default QuestionInput;
