"use client";

import ReactMarkdown from "react-markdown";

interface ArticleContentProps {
  content: string;
  className?: string;
}

function isHtmlContent(content: string): boolean {
  return /<(p|h[1-6]|ul|ol|li|blockquote|div|img|a|strong|em)\b[^>]*>/i.test(content);
}

export function ArticleContent({ content, className }: ArticleContentProps) {
  if (isHtmlContent(content)) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-text mt-8 mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-text mt-8 mb-4">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-bold text-text mt-6 mb-3">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-text-secondary leading-relaxed mb-4">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="text-primary font-bold">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-text-secondary mb-4 space-y-2 ml-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-text-secondary mb-4 space-y-2 ml-4">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-text-secondary">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary bg-primary/5 py-2 px-6 rounded-r-xl text-text-secondary my-4">{children}</blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-gray-100 text-primary px-2 py-0.5 rounded text-sm font-mono">{children}</code>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-primary font-bold hover:text-primary-dark" target="_blank" rel="noopener noreferrer">{children}</a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
