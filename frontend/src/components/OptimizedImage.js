import React, { useState } from 'react';

/**
 * OptimizedImage Component
 * Handles responsive image loading with optimized sizes and formats
 * Includes lazy loading, error handling, and performance optimization
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  quality = 80,
  fallback = '/placeholder-image.jpg',
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate optimized Unsplash URLs if the source is from Unsplash
  const getOptimizedUnsplashUrl = (url, targetWidth = 800, targetHeight = 600, quality = 80) => {
    if (!url || !url.includes('unsplash.com')) {
      return url;
    }

    // Remove existing parameters
    const baseUrl = url.split('?')[0];
    
    // Add optimized parameters
    return `${baseUrl}?w=${targetWidth}&h=${targetHeight}&fit=crop&crop=faces,center&auto=format&q=${quality}`;
  };

  // Generate srcSet for responsive images
  const generateSrcSet = (baseSrc) => {
    if (!baseSrc || !baseSrc.includes('unsplash.com')) {
      return baseSrc;
    }

    const baseUrl = baseSrc.split('?')[0];
    
    const srcSet = [
      `${baseUrl}?w=300&h=200&fit=crop&crop=faces,center&auto=format&q=70 300w`,
      `${baseUrl}?w=600&h=400&fit=crop&crop=faces,center&auto=format&q=75 600w`,
      `${baseUrl}?w=900&h=600&fit=crop&crop=faces,center&auto=format&q=80 900w`,
      `${baseUrl}?w=1200&h=800&fit=crop&crop=faces,center&auto=format&q=85 1200w`,
      `${baseUrl}?w=1800&h=1200&fit=crop&crop=faces,center&auto=format&q=90 1800w`
    ].join(', ');

    return srcSet;
  };

  // Get the optimized source URL
  const optimizedSrc = imageError ? fallback : getOptimizedUnsplashUrl(src, width || 800, height || 600, quality);
  const srcSet = generateSrcSet(src);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
    }
    setIsLoading(false);
  };

  return (
    <div className={`relative ${className}`} {...props}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      
      {/* Optimized image */}
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        style={{
          width: width ? `${width}px` : 'auto',
          height: height ? `${height}px` : 'auto',
        }}
        {...props}
      />
    </div>
  );
};

/**
 * HeroImage Component
 * Optimized for hero sections with specific dimensions and quality
 */
export const HeroImage = ({ src, alt, className = '', ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    className={className}
    width={1920}
    height={1080}
    priority={true}
    quality={90}
    sizes="100vw"
    {...props}
  />
);

/**
 * ThumbnailImage Component
 * Optimized for small thumbnails and card images
 */
export const ThumbnailImage = ({ src, alt, className = '', ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    className={className}
    width={300}
    height={200}
    quality={70}
    sizes="(max-width: 768px) 50vw, 300px"
    {...props}
  />
);

/**
 * ArticleImage Component
 * Optimized for article content images
 */
export const ArticleImage = ({ src, alt, className = '', ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    className={className}
    width={800}
    height={600}
    quality={85}
    sizes="(max-width: 768px) 100vw, 800px"
    {...props}
  />
);

/**
 * CardImage Component
 * Optimized for card-based layouts
 */
export const CardImage = ({ src, alt, className = '', ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    className={className}
    width={400}
    height={300}
    quality={80}
    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 400px"
    {...props}
  />
);

export default OptimizedImage;