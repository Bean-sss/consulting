import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
export const loadPDF = (path: string) => new PDFLoader(path).load();
