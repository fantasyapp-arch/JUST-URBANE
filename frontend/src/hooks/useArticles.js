import { useQuery, useMutation, useQueryClient } from 'react-query';
import { articlesApi } from '../utils/api';

export const useArticles = (params = {}) => {
  return useQuery(
    ['articles', params],
    () => articlesApi.getAll(params),
    {
      select: (data) => data.data,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

export const useArticle = (id) => {
  return useQuery(
    ['article', id],
    () => articlesApi.getById(id),
    {
      select: (data) => data.data,
      enabled: !!id,
    }
  );
};

export const useFeaturedArticles = () => {
  return useQuery(
    ['articles', 'featured'],
    () => articlesApi.getFeatured(),
    {
      select: (data) => data.data,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};

export const useTrendingArticles = () => {
  return useQuery(
    ['articles', 'trending'],
    () => articlesApi.getTrending(),
    {
      select: (data) => data.data,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};

export const useCategoryArticles = (category, params = {}) => {
  return useQuery(
    ['articles', 'category', category, params],
    () => articlesApi.getByCategory(category, params),
    {
      select: (data) => data.data,
      enabled: !!category,
    }
  );
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (articleData) => articlesApi.create(articleData),
    {
      onSuccess: () => {
        // Invalidate and refetch articles
        queryClient.invalidateQueries(['articles']);
      },
    }
  );
};