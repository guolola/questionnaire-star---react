import { Input } from 'antd';
import { use, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { LIST_SEARCH_PARAM_KEY } from '../constant';

const { Search } = Input;
const ListSearch = () => {
  const [value, setValue] = useState('');
  const { pathname } = useLocation();
  const nav = useNavigate();
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  //获取url参数，并设置到input value
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const search = searchParams.get(LIST_SEARCH_PARAM_KEY);
    if (search) {
      setValue(search);
    }
  }, [searchParams]);
  function handleSearch(value: string) {
    nav({
      pathname,
      search: `?${LIST_SEARCH_PARAM_KEY}=${value}`,
    });
  }
  return (
    <Search
      placeholder="输入关键字"
      allowClear
      size="large"
      enterButton="搜索"
      style={{ width: 260 }}
      value={value}
      onChange={handleChange}
      onSearch={handleSearch}
    />
  );
};

export default ListSearch;
