import QuestionInputConf, { type QuestionInputPropsType } from './QuestionInput';
import QuestionTitleConf, { type QuestionTitlePropsType } from './QuestionTitle';

export type ComponentPropsType = QuestionInputPropsType | QuestionTitlePropsType;

export type ComponentConfType = {
  title: string;
  type: string;
  Component: React.FC<ComponentPropsType>;
  PropComponent: React.FC<ComponentPropsType>;
  defaultProps: ComponentPropsType;
};

const componentConfList: ComponentConfType[] = [QuestionInputConf, QuestionTitleConf];

// 组件分组
export const componentConfGroup = [
  {
    groupId: 'text',
    groupName: '文本显示',
    components: [QuestionTitleConf],
  },
  {
    groupId: 'input',
    groupName: '用户输入',
    components: [QuestionInputConf],
  },
];

// 全部组件的配置
export function getComponentConfByType(type: string) {
  return componentConfList.find(c => c.type === type);
}
