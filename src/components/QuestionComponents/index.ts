import QuestionInputConf, { type QuestionInputPropsType } from './QuestionInput';
import QuestionTitleConf, { type QuestionTitlePropsType } from './QuestionTitle';

export type ComponentPropsType = QuestionInputPropsType | QuestionTitlePropsType;

export type ComponentConfType = {
  title: string;
  type: string;
  Component: React.FC<ComponentPropsType>;
  defaultProps: ComponentPropsType;
};

const componentConfList: ComponentConfType[] = [QuestionInputConf, QuestionTitleConf];

// 全部组件的配置
export function getComponentConfByType(type: string) {
  return componentConfList.find(c => c.type === type);
}
