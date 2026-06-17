"use client";

import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`;

interface SyllabusPdfViewerProps {
  pdfUrl: string;
}

export function SyllabusPdfViewer({ pdfUrl }: SyllabusPdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setError(null);
  };

  const onDocumentLoadError = () => {
    setError("Silabus lengkap belum tersedia");
  };

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages));

  if (error) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-2xl border border-border">
        <p className="text-muted">{error}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={
          <div className="h-96 flex items-center justify-center bg-gray-50 rounded-2xl border border-border">
            <p className="text-muted">Memuat silabus...</p>
          </div>
        }
        className="flex flex-col items-center"
      >
        {numPages > 0 && (
          <>
            <Page
              pageNumber={pageNumber}
              width={Math.min(containerWidth, 800)}
              renderTextLayer
              renderAnnotationLayer
              className="shadow-lg rounded-lg overflow-hidden"
              loading={
                <div className="h-96 w-full flex items-center justify-center bg-gray-50 rounded-2xl border border-border">
                  <p className="text-muted">Memuat halaman...</p>
                </div>
              }
            />

            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeftIcon className="w-5 h-5 text-text" />
              </button>

              <span className="text-sm font-medium text-text min-w-[120px] text-center">
                Halaman {pageNumber} dari {numPages}
              </span>

              <button
                type="button"
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Halaman berikutnya"
              >
                <ChevronRightIcon className="w-5 h-5 text-text" />
              </button>
            </div>
          </>
        )}
      </Document>
    </div>
  );
}
