import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Crown } from 'lucide-react';
import { formatDateShort, formatReadingTime } from '../utils/formatters';

const ArticleCard = ({ article, size = 'medium', showCategory = true }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'article-card',
          image: 'h-48 article-card-image',
          title: 'text-lg font-semibold line-clamp-2',
          dek: 'text-sm line-clamp-2 mt-2',
          content: 'p-4'
        };
      case 'large':
        return {
          container: 'article-card lg:flex',
          image: 'h-64 lg:h-80 lg:w-1/2 article-card-image',
          title: 'text-2xl lg:text-3xl font-bold line-clamp-2',
          dek: 'text-base line-clamp-3 mt-3',
          content: 'p-6 lg:p-8 lg:w-1/2 flex flex-col justify-center'
        };
      default: // medium
        return {
          container: 'article-card',
          image: 'h-56 article-card-image',
          title: 'text-xl font-semibold line-clamp-2',
          dek: 'text-sm line-clamp-3 mt-2',
          content: 'p-5'
        };
    }
  };

  const classes = getSizeClasses();

  return (
    <Link to={`/article/${article.slug || article.id}`} className={classes.container}>
      <div className={`relative overflow-hidden ${size === 'large' ? 'lg:order-1' : ''}`}>
        <img
          src={article.hero_image || '/placeholder-image.jpg'}
          alt={article.title}
          className={classes.image}
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg';
          }}
        />
        
        {/* Overlay badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {showCategory && article.category && (
            <span className="category-chip">
              {article.category}
            </span>
          )}
          {article.is_premium && (
            <span className="premium-badge">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </span>
          )}
          {article.is_sponsored && (
            <span className="bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-full">
              Sponsored
            </span>
          )}
        </div>

        {article.is_trending && (
          <div className="absolute top-4 right-4">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
              Trending
            </span>
          </div>
        )}
      </div>

      <div className={`${classes.content} ${size === 'large' ? 'lg:order-2' : ''}`}>
        <h3 className={`article-title ${classes.title}`}>
          {article.title}
        </h3>
        
        {article.dek && (
          <p className={`article-dek ${classes.dek}`}>
            {article.dek}
          </p>
        )}

        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            {article.author_name && (
              <span className="font-medium text-gray-700">
                {article.author_name}
              </span>
            )}
            {article.published_at && (
              <span>
                {formatDateShort(article.published_at)}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {article.reading_time && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatReadingTime(article.reading_time)}</span>
              </div>
            )}
            {article.view_count > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{article.view_count}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && size !== 'small' && (
          <div className="flex flex-wrap gap-1 mt-3">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ArticleCard;