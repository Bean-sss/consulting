import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
export const loadDOCX = (path: string) => new DocxLoader(path).load();
