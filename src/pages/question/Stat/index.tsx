import useLoadQuestionData from '../../../hooks/useLoadQuestionData';

const Stat = () => {
  const { loading, data } = useLoadQuestionData();
  return (
    <div>
      <p>Stat page</p>
      {loading ? <p>loading</p> : <p>{JSON.stringify(data)}</p>}
    </div>
  );
};

export default Stat;
