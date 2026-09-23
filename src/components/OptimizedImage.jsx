import React, { useState } from 'react';

export default function OptimizedImage({
  src,
  alt,
  className = '',
  aspectRatio = 'square',
  priority = false,
}) {
  const [status, setStatus] = useState('loading');
  const [imgSrc, setImgSrc] = useState(src);

  const aspectMap = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[4/3]',
    portrait: 'aspect-[3/4]',
  };

  const handleError = () => {
    setStatus('error');
    setImgSrc(`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3Ctext x='50' y='55' font-size='14' text-anchor='middle' fill='%239ca3af'%3Eصورة%3C/text%3E%3C/svg%3E`);
  };

  return (
    <div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-700 ${aspectMap[aspectRatio] || aspectMap.square} ${className}`}>
      {status === 'loading' && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setStatus('loaded')}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${status === 'loading' ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
}
