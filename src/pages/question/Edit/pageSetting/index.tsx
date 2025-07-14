import { Form, Input } from 'antd';
import useGetComponentInfo from '../../../../hooks/useGetComponentInfo';
import { useEffect } from 'react';
import { resetPageInfo } from '../../../../store/pageInfoReducer';
import { useDispatch } from 'react-redux';
const PageSetting = () => {
  const pageInfo = useGetComponentInfo();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // 实时更新表单内容
  useEffect(() => {
    form.setFieldsValue(pageInfo);
  }, [pageInfo]);

  function handleValuesChange() {
    dispatch(resetPageInfo(form.getFieldsValue()));
  }
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={pageInfo}
      onValuesChange={handleValuesChange}
    >
      <Form.Item label="问卷标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
        <Input placeholder="请输入标题" />
      </Form.Item>
      <Form.Item label="问卷描述" name="desc">
        <Input.TextArea placeholder="请输入描述" />
      </Form.Item>
      <Form.Item label="JS" name="js">
        <Input.TextArea placeholder="请输入JS" />
      </Form.Item>
      <Form.Item label="CSS" name="css">
        <Input.TextArea placeholder="请输入CSS" />
      </Form.Item>
    </Form>
  );
};

export default PageSetting;
