import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

interface Props {

  uploadedFile: Blob | null;
}

function PDFUploader({ uploadedFile }: Props) {

  const [numberOfPages, setNumberOfPages] = useState<number>();

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumberOfPages(numPages);
  };

  const convertBlobToFile = (blob: Blob): string => {
    let temp = new Blob([blob], { type: 'application/pdf' })
    let url = window.URL.createObjectURL(temp);
    // const file = new File([blob], fileName, { type: blob.type });
    return url;
  };

  return (
    <div>
      {uploadedFile && (
        <Document file={convertBlobToFile(uploadedFile)} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.apply(null, Array(numberOfPages))
            .map((x, i) => i + 1)
            .map((page) => {
              return (
                <Page
                  key={page}
                  pageNumber={page}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              );
            })}
        </Document>
      )}
    </div>
  );
}

export default PDFUploader;
