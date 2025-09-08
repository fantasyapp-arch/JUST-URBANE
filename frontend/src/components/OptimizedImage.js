import React, { useState } from 'react';

/**
 * OptimizedImage Component
 * Handles responsive image loading with WebP support, fallbacks, and performance optimization
 * Includes lazy loading, error handling, and next-generation format support
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
  enableWebP = true,
  enableAVIF = false,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFormat, setCurrentFormat] = useState('jpeg');

  // Check browser support for modern formats
  const supportsWebP = () => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  };

  const supportsAVIF = () => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/avif').startsWith('data:image/avif');
  };

  // Generate optimized Unsplash URLs with next-gen format support
  const getOptimizedUnsplashUrl = (url, targetWidth = 800, targetHeight = 600, quality = 80, format = 'jpeg') => {
    if (!url || !url.includes('unsplash.com')) {
      return url;
    }

    // Remove existing parameters
    const baseUrl = url.split('?')[0];
    
    // Add optimized parameters with format support
    const formatParam = format === 'webp' ? '&fm=webp' : format === 'avif' ? '&fm=avif' : '';
    const qualityAdjustment = format === 'webp' ? quality - 10 : format === 'avif' ? quality - 15 : quality;
    
    return `${baseUrl}?w=${targetWidth}&h=${targetHeight}&fit=crop&crop=faces,center&auto=format&q=${qualityAdjustment}${formatParam}`;
  };

  // Generate picture element sources for next-gen formats
  const generatePictureSources = (baseSrc) => {
    if (!baseSrc || !baseSrc.includes('unsplash.com')) {
      return null;
    }

    const sources = [];
    const targetWidth = width || 800;
    const targetHeight = height || 600;

    // AVIF source (if enabled and supported)
    if (enableAVIF && supportsAVIF()) {
      const avifSrcSet = [
        `${getOptimizedUnsplashUrl(baseSrc, Math.round(targetWidth * 0.5), Math.round(targetHeight * 0.5), quality, 'avif')} 1x`,
        `${getOptimizedUnsplashUrl(baseSrc, targetWidth, targetHeight, quality, 'avif')} 2x`
      ].join(', ');
      
      sources.push({ type: 'image/avif', srcSet: avifSrcSet });
    }

    // WebP source (if enabled and supported)
    if (enableWebP && supportsWebP()) {
      const webpSrcSet = [
        `${getOptimizedUnsplashUrl(baseSrc, Math.round(targetWidth * 0.5), Math.round(targetHeight * 0.5), quality, 'webp')} 1x`,
        `${getOptimizedUnsplashUrl(baseSrc, targetWidth, targetHeight, quality, 'webp')} 2x`
      ].join(', ');
      
      sources.push({ type: 'image/webp', srcSet: webpSrcSet });
    }

    return sources;
  };

  // Generate responsive srcSet for JPEG fallback
  const generateResponsiveSrcSet = (baseSrc) => {
    if (!baseSrc || !baseSrc.includes('unsplash.com')) {
      return baseSrc;
    }

    const baseUrl = baseSrc.split('?')[0];
    
    const srcSet = [
      `${baseUrl}?w=300&h=200&fit=crop&crop=faces,center&auto=format&q=${quality - 5} 300w`,
      `${baseUrl}?w=600&h=400&fit=crop&crop=faces,center&auto=format&q=${quality} 600w`,
      `${baseUrl}?w=900&h=600&fit=crop&crop=faces,center&auto=format&q=${quality} 900w`,
      `${baseUrl}?w=1200&h=800&fit=crop&crop=faces,center&auto=format&q=${quality + 5} 1200w`,
      `${baseUrl}?w=1800&h=1200&fit=crop&crop=faces,center&auto=format&q=${quality + 5} 1800w`
    ].join(', ');

    return srcSet;
  };

  // Get the fallback source URL
  const fallbackSrc = imageError ? fallback : getOptimizedUnsplashUrl(src, width || 800, height || 600, quality);
  const srcSet = generateResponsiveSrcSet(src);
  const pictureSources = generatePictureSources(src);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
    }
    setIsLoading(false);
  };

  // If we have picture sources, use picture element for next-gen format support
  if (pictureSources && pictureSources.length > 0) {
    return (
      <div className={`relative ${className}`} {...props}>
        {/* Loading placeholder */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
        )}
        
        {/* Picture element with next-gen format support */}
        <picture>
          {pictureSources.map((source, index) => (
            <source
              key={index}
              type={source.type}
              srcSet={source.srcSet}
              sizes={sizes}
            />
          ))}
          <img
            src={fallbackSrc}
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
          />
        </picture>
      </div>
    );
  }

  // Fallback to regular img element
  return (
    <div className={`relative ${className}`} {...props}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      
      {/* Optimized image */}
      <img
        src={fallbackSrc}
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
 * NextGenImage Component
 * Maximum optimization with WebP and AVIF support
 */
export const NextGenImage = ({ src, alt, className = '', ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    className={className}
    enableWebP={true}
    enableAVIF={true}
    priority={false}
    {...props}
  />
);

/**
 * HeroImage Component
 * Optimized for hero sections with WebP support
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
    enableWebP={true}
    {...props}
  />
);

/**
 * ThumbnailImage Component
 * Optimized for small thumbnails with aggressive compression
 */
export const ThumbnailImage = ({ src, alt, className = '', ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    className={className}
    width={150}
    height={150}
    quality={70}
    sizes="150px"
    enableWebP={true}
    {...props}
  />
);

/**
 * ArticleImage Component
 * Optimized for article content with WebP support
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
    enableWebP={true}
    {...props}
  />
);

/**
 * CardImage Component
 * Optimized for card-based layouts with responsive sizing
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
    enableWebP={true}
    {...props}
  />
);

export default OptimizedImage;