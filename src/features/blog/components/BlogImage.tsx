"use client";

import { useState } from "react";

interface BlogImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
}

const PLACEHOLDER_IMAGE = "/placeholder-blog.svg";

export function BlogImage({ src, alt, className }: BlogImageProps) {
  const getValidSrc = (url: string | null | undefined): string => {
    if (!url || !url.trim()) return PLACEHOLDER_IMAGE;
    return url.trim();
  };

  const [imgSrc, setImgSrc] = useState(getValidSrc(src));

  const handleError = () => {
    setImgSrc(PLACEHOLDER_IMAGE);
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
    />
  );
}