"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import {
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Finny } from "@/components/mascot/Finny";

// react-pageflip ships its own types (build/index.d.ts) but they are weak:
// IFlipSetting marks every field required and the ref is typed as `any`.
// We define a narrow instance type for the ref so call sites stay type-safe.
// The shipped types are relied upon as-is (no ambient module declaration).

// Same worker config as SyllabusPdfViewer.tsx (Scenario B: copy existing config).
// NOTE: extension is `.mjs` for pdfjs-dist v10+ — matches the legacy viewer.
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`;

const A4_RATIO = 297 / 210; // ≈ 1.414 — A4 portrait aspect ratio
const MOBILE_BREAKPOINT_PX = 768;
const PDF_MAX_WIDTH_PX = 800;
const PDF_MIN_WIDTH_PX = 280;
const PDF_MIN_HEIGHT_PX = 400;
const PDF_MAX_HEIGHT_PX = 1200;
const FLIP_ANIMATION_MS = 600;
const RESIZE_DEBOUNCE_MS = 200;
const LOADING_SKELETON_HEIGHT_PX = 384; // h-96
const SWIPE_DISTANCE_PX = 30;
const START_Z_INDEX = 0;
const START_PAGE_INDEX = 0;

interface PageFlipApi {
  getPageCount(): number;
  getCurrentPageIndex(): number;
  getOrientation(): "portrait" | "landscape";
  turnToPage(pageNum: number): void;
  turnToNextPage(): void;
  turnToPrevPage(): void;
  flipNext(corner?: "top" | "bottom"): void;
  flipPrev(corner?: "top" | "bottom"): void;
  flip(pageNum: number, corner?: "top" | "bottom"): void;
  destroy(): void;
}

interface HTMLFlipBookInstance {
  pageFlip(): PageFlipApi;
}

interface SyllabusPdfBookViewerProps {
  pdfUrl: string;
  title?: string;
}

interface BookPageProps {
  pageNumber: number;
  width: number;
  height: number;
}

const BookPage = React.forwardRef<HTMLDivElement, BookPageProps>(
  ({ pageNumber, width, height }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white overflow-hidden"
        style={{ width, height }}
      >
        <Page
          pageNumber={pageNumber}
          width={width}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          loading={null}
        />
      </div>
    );
  }
);
BookPage.displayName = "BookPage";

export function SyllabusPdfBookViewer({ pdfUrl, title }: SyllabusPdfBookViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0); // 0-based index from HTMLFlipBook
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(PDF_MAX_WIDTH_PX);
  const [pageHeight, setPageHeight] = useState<number>(
    Math.round(PDF_MAX_WIDTH_PX * A4_RATIO)
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLFlipBookInstance>(null);

  // Responsive sizing — debounced to avoid spamming StPageFlip re-inits.
  useEffect(() => {
    const updateSize = () => {
      const containerWidth = containerRef.current?.clientWidth ?? PDF_MAX_WIDTH_PX;
      const isMobile = containerWidth < MOBILE_BREAKPOINT_PX;
      const computedWidth = Math.min(
        isMobile ? containerWidth : Math.floor(containerWidth / 2),
        PDF_MAX_WIDTH_PX
      );
      const safeWidth = Math.max(computedWidth, PDF_MIN_WIDTH_PX);
      setPageWidth(safeWidth);
      setPageHeight(Math.round(safeWidth * A4_RATIO));
    };

    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateSize, RESIZE_DEBOUNCE_MS);
    };

    updateSize();
    window.addEventListener("resize", debouncedUpdate);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", debouncedUpdate);
    };
  }, []);

  // Restore current page after the book re-mounts on size change (key = pageWidth).
  useEffect(() => {
    if (currentPage > 0) {
      bookRef.current?.pageFlip()?.turnToPage(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageWidth]);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages: total }: { numPages: number }) => {
      setNumPages(total);
      setCurrentPage(0);
      setError(null);
    },
    []
  );

  const onDocumentLoadError = useCallback(() => {
    setError("Silabus lengkap belum tersedia. Coba muat ulang sebentar lagi.");
  }, []);

  const onFlip = useCallback((flipEvent: { data: number }) => {
    setCurrentPage(flipEvent.data);
  }, []);

  const handleRetry = () => {
    setError(null);
    setNumPages(0);
    setCurrentPage(0);
    setRetryKey((prev) => prev + 1);
  };

  const goToPrevPage = () => bookRef.current?.pageFlip()?.flipPrev();
  const goToNextPage = () => bookRef.current?.pageFlip()?.flipNext();

  if (error) {
    return (
      <div
        role="alert"
        className="p-8 flex flex-col items-center gap-4 bg-bg rounded-2xl border border-border text-center"
      >
        <Finny pose="sad" size={80} />
        <p className="text-muted">{error}</p>
        <button
          type="button"
          onClick={handleRetry}
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-2xl border-b-4 border-primary-dark active:translate-y-1 active:border-b-0 transition-all font-semibold text-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full max-w-full overflow-hidden"
      aria-label={title}
    >
      <div className="flex justify-center">
        <Document
          key={retryKey}
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div
              className="flex flex-col items-center justify-center gap-4 bg-bg rounded-2xl border border-border"
              style={{ height: LOADING_SKELETON_HEIGHT_PX, width: pageWidth }}
            >
              <Finny pose="thinking" size={80} />
              <p className="text-muted">Memuat silabus...</p>
            </div>
          }
        >
          {numPages > 0 && (
            <HTMLFlipBook
              key={pageWidth}
              ref={bookRef}
              width={pageWidth}
              height={pageHeight}
              size="fixed"
              minWidth={PDF_MIN_WIDTH_PX}
              maxWidth={PDF_MAX_WIDTH_PX}
              minHeight={PDF_MIN_HEIGHT_PX}
              maxHeight={PDF_MAX_HEIGHT_PX}
              drawShadow
              flippingTime={FLIP_ANIMATION_MS}
              usePortrait
              startZIndex={START_Z_INDEX}
              startPage={START_PAGE_INDEX}
              autoSize
              maxShadowOpacity={0.5}
              showCover
              mobileScrollSupport
              clickEventForward
              useMouseEvents
              swipeDistance={SWIPE_DISTANCE_PX}
              showPageCorners
              disableFlipByClick={false}
              onFlip={onFlip}
              className="shadow-2xl rounded-2xl overflow-hidden"
              style={{}}
            >
              {Array.from({ length: numPages }, (_, index) => (
                <BookPage
                  key={index}
                  pageNumber={index + 1}
                  width={pageWidth}
                  height={pageHeight}
                />
              ))}
            </HTMLFlipBook>
          )}
        </Document>
      </div>

      {numPages > 0 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={goToPrevPage}
            disabled={currentPage <= 0}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeftIcon className="w-5 h-5 text-text" />
          </button>

          <span className="text-sm font-medium text-text min-w-[120px] text-center">
            Halaman {currentPage + 1} dari {numPages}
          </span>

          <button
            type="button"
            onClick={goToNextPage}
            disabled={currentPage >= numPages - 1}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Halaman berikutnya"
          >
            <ChevronRightIcon className="w-5 h-5 text-text" />
          </button>
        </div>
      )}
    </div>
  );
}
