import React, { useState, useEffect } from 'react';
import { Activity, Zap, Image as ImageIcon, TrendingUp, Clock, HardDrive } from 'lucide-react';

/**
 * ImagePerformanceMonitor Component
 * Real-time monitoring of image optimization performance
 */
const ImagePerformanceMonitor = () => {
  const [performanceData, setPerformanceData] = useState({
    totalImages: 0,
    optimizedImages: 0,
    webpImages: 0,
    avgLoadTime: 0,
    totalSizeSaved: 0,
    optimizationRate: 0,
    webpSupport: false,
    pageLoadTime: 0
  });

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [realTimeStats, setRealTimeStats] = useState([]);

  // Detect browser support for modern formats
  const detectFormatSupport = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    const webpSupport = canvas.toDataURL('image/webp').startsWith('data:image/webp');
    const avifSupport = canvas.toDataURL('image/avif').startsWith('data:image/avif');
    
    return { webpSupport, avifSupport };
  };

  // Monitor image loading performance
  const monitorImagePerformance = () => {
    const images = Array.from(document.querySelectorAll('img'));
    const unsplashImages = images.filter(img => img.src.includes('unsplash.com'));
    
    let optimizedCount = 0;
    let webpCount = 0;
    let totalLoadTime = 0;
    let estimatedSizeSaved = 0;

    const imageStats = unsplashImages.map(img => {
      const url = new URL(img.src);
      const params = url.searchParams;
      
      // Check optimization parameters
      const isOptimized = params.has('w') && params.has('h') && params.has('q');
      const isWebP = params.get('fm') === 'webp' || url.href.includes('fm=webp');
      const quality = parseInt(params.get('q')) || 80;
      const width = parseInt(params.get('w')) || 800;
      const height = parseInt(params.get('h')) || 600;
      
      if (isOptimized) optimizedCount++;
      if (isWebP) webpCount++;
      
      // Estimate file size savings
      const estimatedOriginalSize = (width * height * 3) / 1024; // KB estimate
      const compressionRatio = quality / 100;
      const webpSavings = isWebP ? 0.3 : 0; // WebP typically 30% smaller
      const totalSavings = estimatedOriginalSize * (1 - compressionRatio + webpSavings);
      estimatedSizeSaved += totalSavings;
      
      return {
        src: img.src,
        width: img.naturalWidth,
        height: img.naturalHeight,
        isOptimized,
        isWebP,
        quality,
        estimatedSavings: totalSavings
      };
    });

    // Get page performance metrics
    const navigation = performance.getEntriesByType('navigation')[0];
    const pageLoadTime = navigation ? navigation.loadEventEnd - navigation.navigationStart : 0;
    
    // Get resource timing for images
    const imageResources = performance.getEntriesByType('resource').filter(r => 
      r.name.includes('unsplash') || r.name.includes('images')
    );
    
    const avgImageLoadTime = imageResources.length > 0 
      ? imageResources.reduce((sum, r) => sum + r.duration, 0) / imageResources.length
      : 0;

    const optimizationRate = unsplashImages.length > 0 
      ? (optimizedCount / unsplashImages.length) * 100 
      : 0;

    const { webpSupport, avifSupport } = detectFormatSupport();

    return {
      totalImages: images.length,
      unsplashImages: unsplashImages.length,
      optimizedImages: optimizedCount,
      webpImages: webpCount,
      avgLoadTime: Math.round(avgImageLoadTime),
      totalSizeSaved: Math.round(estimatedSizeSaved),
      optimizationRate: Math.round(optimizationRate),
      webpSupport,
      avifSupport,
      pageLoadTime: Math.round(pageLoadTime),
      imageStats
    };
  };

  // Start real-time monitoring
  const startMonitoring = () => {
    setIsMonitoring(true);
    
    const monitorInterval = setInterval(() => {
      const stats = monitorImagePerformance();
      setPerformanceData(stats);
      
      // Add to real-time stats history
      setRealTimeStats(prev => [
        ...prev.slice(-19), // Keep last 20 entries
        {
          timestamp: new Date().toLocaleTimeString(),
          loadTime: stats.avgLoadTime,
          optimizationRate: stats.optimizationRate,
          sizeSaved: stats.totalSizeSaved
        }
      ]);
    }, 2000);

    // Initial measurement
    const initialStats = monitorImagePerformance();
    setPerformanceData(initialStats);

    return () => clearInterval(monitorInterval);
  };

  // Stop monitoring
  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  useEffect(() => {
    // Auto-start monitoring on component mount
    const cleanup = startMonitoring();
    return cleanup;
  }, []);

  const getOptimizationGrade = (rate) => {
    if (rate >= 95) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
    if (rate >= 85) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (rate >= 75) return { grade: 'B+', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (rate >= 65) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (rate >= 55) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const optimizationGrade = getOptimizationGrade(performanceData.optimizationRate);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Activity className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Image Performance Monitor</h3>
            <p className="text-gray-600">Real-time optimization tracking</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${optimizationGrade.bg} ${optimizationGrade.color}`}>
            Grade: {optimizationGrade.grade}
          </div>
          <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Images</p>
              <p className="text-2xl font-bold text-blue-900">{performanceData.totalImages}</p>
            </div>
            <ImageIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Optimized</p>
              <p className="text-2xl font-bold text-green-900">{performanceData.optimizationRate}%</p>
            </div>
            <Zap className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Avg Load Time</p>
              <p className="text-2xl font-bold text-purple-900">{performanceData.avgLoadTime}ms</p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Size Saved</p>
              <p className="text-2xl font-bold text-orange-900">{Math.round(performanceData.totalSizeSaved)}KB</p>
            </div>
            <HardDrive className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Format Support */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Browser Format Support & Usage</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${performanceData.webpSupport ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-700">WebP Support</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${performanceData.avifSupport ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-700">AVIF Support</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">WebP Images: {performanceData.webpImages}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Page Load: {performanceData.pageLoadTime}ms</span>
          </div>
        </div>
      </div>

      {/* Real-time Chart */}
      {realTimeStats.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Real-time Performance Trend</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-end space-x-1 h-32">
              {realTimeStats.map((stat, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="bg-blue-500 rounded-t w-full transition-all duration-300"
                    style={{ 
                      height: `${Math.max(4, (stat.optimizationRate / 100) * 100)}px`,
                      minHeight: '4px'
                    }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1 rotate-45 origin-bottom-left">
                    {stat.timestamp.split(':').slice(0, 2).join(':')}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">
              Optimization Rate Over Time
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
          Performance Recommendations
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          {performanceData.optimizationRate < 90 && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Consider optimizing more images for better performance</span>
            </div>
          )}
          {performanceData.webpSupport && performanceData.webpImages === 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Browser supports WebP - enable WebP format for better compression</span>
            </div>
          )}
          {performanceData.avgLoadTime > 100 && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>High image load time - consider smaller dimensions or lower quality</span>
            </div>
          )}
          {performanceData.optimizationRate >= 95 && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Excellent optimization! Your images are performing great 🎉</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePerformanceMonitor;