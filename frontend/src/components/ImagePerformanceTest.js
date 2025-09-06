import React, { useState, useEffect } from 'react';
import { Zap, Clock, CheckCircle, XCircle, BarChart3 } from 'lucide-react';

/**
 * ImagePerformanceTest Component
 * Tests and displays image loading performance improvements
 */
const ImagePerformanceTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [averageImprovement, setAverageImprovement] = useState(0);

  // Sample images for testing (original vs optimized)
  const testImages = [
    {
      name: 'Hero Image',
      original: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      optimized: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop&crop=faces,center&auto=format&q=90'
    },
    {
      name: 'Article Image',
      original: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      optimized: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop&crop=faces,center&auto=format&q=80'
    },
    {
      name: 'Card Image',
      original: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      optimized: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=300&fit=crop&crop=faces,center&auto=format&q=75'
    },
    {
      name: 'Thumbnail',
      original: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
      optimized: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=150&h=150&fit=crop&crop=faces,center&auto=format&q=70'
    }
  ];

  // Function to measure image load time
  const measureImageLoadTime = (src) => {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const img = new Image();
      
      img.onload = () => {
        const loadTime = performance.now() - startTime;
        resolve({
          success: true,
          loadTime: Math.round(loadTime),
          fileSize: null // We can't get exact file size from browser, but Unsplash provides this in headers
        });
      };
      
      img.onerror = () => {
        resolve({
          success: false,
          loadTime: null,
          fileSize: null
        });
      };
      
      img.src = src;
    });
  };

  // Run performance test
  const runPerformanceTest = async () => {
    setIsRunningTest(true);
    setTestResults([]);
    
    const results = [];
    
    for (const testImage of testImages) {
      // Test original image
      const originalResult = await measureImageLoadTime(testImage.original);
      
      // Test optimized image
      const optimizedResult = await measureImageLoadTime(testImage.optimized);
      
      const improvement = originalResult.success && optimizedResult.success
        ? ((originalResult.loadTime - optimizedResult.loadTime) / originalResult.loadTime) * 100
        : 0;
      
      const result = {
        name: testImage.name,
        original: {
          url: testImage.original,
          ...originalResult
        },
        optimized: {
          url: testImage.optimized,
          ...optimizedResult
        },
        improvement: Math.round(improvement)
      };
      
      results.push(result);
      setTestResults([...results]); // Update UI as we go
    }
    
    // Calculate average improvement
    const validResults = results.filter(r => r.improvement > 0);
    const avgImprovement = validResults.length > 0
      ? Math.round(validResults.reduce((sum, r) => sum + r.improvement, 0) / validResults.length)
      : 0;
    
    setAverageImprovement(avgImprovement);
    setIsRunningTest(false);
  };

  useEffect(() => {
    // Auto-run test on component mount
    runPerformanceTest();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Zap className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Image Performance Test</h3>
            <p className="text-gray-600">Measuring load time improvements with optimization</p>
          </div>
        </div>
        
        <button
          onClick={runPerformanceTest}
          disabled={isRunningTest}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <BarChart3 className="h-4 w-4" />
          <span>{isRunningTest ? 'Testing...' : 'Run Test'}</span>
        </button>
      </div>

      {/* Average Improvement Banner */}
      {averageImprovement > 0 && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-900">Performance Improvement</h4>
              <p className="text-green-700">
                Average load time improvement: <span className="font-bold">{averageImprovement}%</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Test Results */}
      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">{result.name}</h4>
              {result.improvement > 0 ? (
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-semibold">{result.improvement}% faster</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Testing...</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Image */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">Original</span>
                  {result.original.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                {result.original.loadTime && (
                  <div className="text-sm text-gray-500">
                    Load time: {result.original.loadTime}ms
                  </div>
                )}
                <div className="h-24 bg-gray-100 rounded overflow-hidden">
                  <img
                    src={result.original.url}
                    alt={`Original ${result.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Optimized Image */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">Optimized</span>
                  {result.optimized.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                {result.optimized.loadTime && (
                  <div className="text-sm text-gray-500">
                    Load time: {result.optimized.loadTime}ms
                  </div>
                )}
                <div className="h-24 bg-gray-100 rounded overflow-hidden">
                  <img
                    src={result.optimized.url}
                    alt={`Optimized ${result.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {isRunningTest && testResults.length === 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Running performance tests...</span>
          </div>
        </div>
      )}

      {/* Information */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h5 className="font-semibold text-gray-900 mb-2">Optimization Features</h5>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Automatic image resizing to optimal dimensions</li>
          <li>• Quality optimization based on use case</li>
          <li>• Modern format serving (WebP when supported)</li>
          <li>• Lazy loading for non-critical images</li>
          <li>• Responsive image serving with srcSet</li>
        </ul>
      </div>
    </div>
  );
};

export default ImagePerformanceTest;