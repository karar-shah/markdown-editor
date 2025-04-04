"use client";
import React, { useState } from "react";
import Editor from "../../components/Editor";
import MarkdownRenderer from "../../components/MarkdownRenderer";

const Home: React.FC = () => {
  const [content, setContent] = useState("");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 1, padding: "1rem", borderRight: "1px solid #ccc" }}>
        <h2>Editor</h2>
        <Editor value={content} onChange={setContent} />
      </div>
      <div style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
        <h2>Preview</h2>
        <MarkdownRenderer markdown={content} />
      </div>
    </div>
  );
};

export default Home;
