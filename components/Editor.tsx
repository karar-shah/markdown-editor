import React, { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { convertMarkdownToHTML } from "../utils/convertMarkdown";

// Dynamically import react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  const quillRef = useRef<any>(null);

  useEffect(() => {
    if (!quillRef.current) return;
    const editor = quillRef.current.getEditor();

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const clipboardData = e.clipboardData || (window as any).clipboardData;
      const pastedText = clipboardData.getData("text/plain");

      // Convert the pasted markdown to HTML
      const html = convertMarkdownToHTML(pastedText);

      if (editor) {
        // Convert HTML to a Quill Delta
        const delta = editor.clipboard.convert(html);
        // Get the current cursor position
        const selection = editor.getSelection();
        const index = selection ? selection.index : editor.getLength();

        // Insert the converted Delta at the current cursor position
        editor.updateContents(
          { ops: [{ retain: index }, ...delta.ops] },
          "user"
        );
        // Optionally, move the cursor to the end of the inserted content
        editor.setSelection(
          index +
            delta.ops.reduce(
              (acc, op) =>
                acc + (typeof op.insert === "string" ? op.insert.length : 1),
              0
            ),
          0
        );
        // Update the editor's HTML state
        onChange(editor.root.innerHTML);
      }
    };

    // Attach the paste event listener to the Quill editor's root element
    editor.root.addEventListener("paste", handlePaste);
    return () => {
      editor.root.removeEventListener("paste", handlePaste);
    };
  }, [onChange]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={(content, delta, source, editor) => onChange(editor.getHTML())}
      modules={modules}
    />
  );
};

export default Editor;
