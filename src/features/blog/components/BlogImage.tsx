"use client";

import Image from "next/image";
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
    <Image
      src={imgSrc}
      alt={alt}
      width={1200}
      height={630}
      unoptimized
      onError={handleError}
      className={className}
    />
  );
}
