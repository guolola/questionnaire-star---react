import Title from 'antd/es/typography/Title';
import { componentConfGroup } from '../../../components/QuestionComponents';
import { useDispatch } from 'react-redux';
import { addComponent } from '../../../store/componentsReducer';
import styles from './styles/ComponentLib.module.scss';
import { nanoid } from '@reduxjs/toolkit';

// 改成组件
function ComponentLibItem({ c }) {
  const { title, type, Component, defaultProps } = c;
  const dispatch = useDispatch();
  function handleClick() {
    dispatch(addComponent({ fe_id: nanoid(), title, type, props: defaultProps }));
  }
  return (
    <div className={styles.wrapper} onClick={handleClick}>
      <div className={styles.component}>
        <Component />
      </div>
    </div>
  );
}

const Lib = () => {
  return (
    <>
      {componentConfGroup.map((group, index) => {
        const { groupId, groupName, components } = group;
        return (
          <div key={groupId}>
            <Title level={3} style={{ fontSize: '16px', marginTop: index > 0 ? '20px' : '0px' }}>
              {groupName}
            </Title>
            <div>
              {components.map(c => (
                <ComponentLibItem key={c.type} c={c} />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Lib;
