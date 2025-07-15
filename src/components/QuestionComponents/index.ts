import type { FC } from 'react';
import QuestionInputConf, { type QuestionInputPropsType } from './QuestionInput/index';
import QuestionTitleConf, { type QuestionTitlePropsType } from './QuestionTitle';
import QuestionParagraphConf, { type QuestionParagraphPropsType } from './QuestionParagraph';
import QuestionInfoConf, { type QuestionInfoPropsType } from './QuestionInfo';
import QuestionTextareaConf, { type QuestionTextareaPropsType } from './QuestionTextarea';
import QuestionRadioConf, {
  type QuestionRadioPropsType,
  type QuestionRadioStatPropsType,
} from './QuestionRadio';
import QuestionCheckboxConf, {
  type QuestionCheckboxPropsType,
  type QuestionCheckboxStatPropsType,
} from './QuestionCheckbox';
import QuestionDatePickerConf, { type QuestionDatePickerPropsType } from './QuestionDatePicker/index';
import QuestionRatingConf, { type QuestionRatingPropsType } from './QuestionRating/index';
import QuestionSelectConf, { type QuestionSelectPropsType } from './QuestionSelect/index';
import QuestionNumberConf, { type QuestionNumberPropsType } from './QuestionNumber/index';
import QuestionMatrixConf, { type QuestionMatrixPropsType } from './QuestionMatrix/index';
import QuestionFileUploadConf, { type QuestionFileUploadPropsType } from './QuestionFileUpload/index';
import QuestionSliderConf, { type QuestionSliderPropsType } from './QuestionSlider/index';
import QuestionRankingConf, { type QuestionRankingPropsType } from './QuestionRanking/index';
import QuestionImageChoiceConf, { type QuestionImageChoicePropsType } from './QuestionImageChoice/index';
import QuestionContactInfoConf, { type QuestionContactInfoPropsType } from './QuestionContactInfo/index';
import QuestionPaymentConf, { type QuestionPaymentPropsType } from './QuestionPayment/index';
import QuestionSignatureConf, { type QuestionSignaturePropsType } from './QuestionSignature/index';

// 统一，各个组件的 prop type
export type ComponentPropsType = QuestionInputPropsType |
  QuestionTitlePropsType |
  QuestionParagraphPropsType |
  QuestionInfoPropsType |
  QuestionTextareaPropsType |
  QuestionRadioPropsType |
  QuestionCheckboxPropsType |
  QuestionDatePickerPropsType |
  QuestionRatingPropsType |
  QuestionSelectPropsType |
  QuestionNumberPropsType |
  QuestionMatrixPropsType |
  QuestionFileUploadPropsType |
  QuestionSliderPropsType |
  QuestionRankingPropsType |
  QuestionImageChoicePropsType |
  QuestionContactInfoPropsType |
  QuestionPaymentPropsType |
  QuestionSignaturePropsType;

// 统一，各个组件的统计属性类型
type ComponentStatPropsType = QuestionRadioStatPropsType & QuestionCheckboxStatPropsType;

// 统一，组件的配置 type
export type ComponentConfType = {
  title: string;
  type: string;
  Component: FC<ComponentPropsType>;
  PropComponent: FC<ComponentPropsType>;
  defaultProps: ComponentPropsType;
  StatComponent?: FC<ComponentStatPropsType>;
};

// 全部的组件配置的列表
const componentConfList: ComponentConfType[] = [
  QuestionInputConf,
  QuestionTitleConf,
  QuestionParagraphConf,
  QuestionInfoConf,
  QuestionTextareaConf,
  QuestionRadioConf,
  QuestionCheckboxConf,
  QuestionDatePickerConf,
  QuestionRatingConf,
  QuestionSelectConf,
  QuestionNumberConf,
  QuestionMatrixConf,
  QuestionFileUploadConf,
  QuestionSliderConf,
  QuestionRankingConf,
  QuestionImageChoiceConf,
  QuestionContactInfoConf,
  QuestionPaymentConf,
  QuestionSignatureConf,
];

// 组件分组
export const componentConfGroup = [
  {
    groupId: 'textGroup',
    groupName: '文本显示',
    components: [QuestionInfoConf, QuestionTitleConf, QuestionParagraphConf],
  },
  {
    groupId: 'inputGroup',
    groupName: '用户输入',
    components: [QuestionInputConf, QuestionTextareaConf, QuestionNumberConf, QuestionDatePickerConf, QuestionFileUploadConf, QuestionSliderConf, QuestionSignatureConf],
  },
  {
    groupId: 'chooseGroup',
    groupName: '用户选择',
    components: [QuestionRadioConf, QuestionCheckboxConf, QuestionSelectConf, QuestionRatingConf, QuestionMatrixConf, QuestionRankingConf, QuestionImageChoiceConf],
  },
  {
    groupId: 'businessGroup',
    groupName: '商业应用',
    components: [QuestionContactInfoConf, QuestionPaymentConf],
  },
];

export function getComponentConfByType(type: string) {
  return componentConfList.find(c => c.type === type);
}
