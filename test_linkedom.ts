import { parseHTML } from "linkedom";
import { Readability } from "@mozilla/readability";

const html = `<html><head><title>Test</title></head><body><h1>Hello World</h1><p>This is a test article.</p></body></html>`;

const { document } = parseHTML(html);

const reader = new Readability(document as any);
const article = reader.parse();

console.log(article);
