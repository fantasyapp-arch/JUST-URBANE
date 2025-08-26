import { useQuery } from 'react-query';
import { categoriesApi } from '../utils/api';

export const useCategories = () => {
  return useQuery(
    ['categories'],
    () => categoriesApi.getAll(),
    {
      select: (data) => data.data,
      staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
    }
  );
};