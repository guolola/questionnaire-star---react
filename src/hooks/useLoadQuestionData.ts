import { useParams } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { getQuestionService } from '../services/question';
import { useEffect } from 'react';
import { resetComponents } from '../store/componentsReducer';
import { useDispatch } from 'react-redux';

function useLoadQuestionData() {
  const { id = '' } = useParams();
  const dispatch = useDispatch();
  const { data, loading, error, run } = useRequest(
    async id => {
      if (!id) throw new Error('没有问卷 id');
      const data = await getQuestionService(id);
      return data;
    },
    {
      manual: true,
    },
  );
  // 根据获取的 data 设置 redux store
  useEffect(() => {
    if (data) {
      const { title = '', componentList = [] } = data;
      // 获取默认的selectedId
      let selectedId = '';
      if (componentList.length > 0) {
        selectedId = componentList[0].fe_id;
      }
      // 把 componentList 设置到 redux store 中
      dispatch(resetComponents({ componentList, selectedId, copiedComponent: null }));
    }
  }, [data]);
  // 判断 id 变化，执行 ajax 加载问卷数据
  useEffect(() => {
    run(id);
  }, [id]);

  return { loading, error };
}

export default useLoadQuestionData;
