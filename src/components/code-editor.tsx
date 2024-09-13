import "./code-editor.css";
import "./syntax.css";

import MonacoEditor, { OnMount } from "@monaco-editor/react";
import * as prettier from "prettier";
import parserBabel from "prettier/plugins/babel"; // for parsing advanced JS syntax
import * as prettierPluginEstree from "prettier/plugins/estree";
import { useRef } from "react";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import MonacoJSXHighlighter, { makeBabelParse } from "monaco-jsx-highlighter";

interface CodeEditorProps {
  initialValue: string;
  //   onChange: (value: string) => void; OR
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.updateOptions({ tabSize: 2 });

    // Following lines of code taken and adjusted from https://www.npmjs.com/package/monaco-jsx-highlighter
    // Had to add `define: { process: { env: {} }, Buffer: {} }` inside `vite.config.ts` otherwise error is thrown in console as traverse npm module is looking for node.js environment but we have browser environment
    // Minimal Babel setup for React JSX parsing:
    const babelParse = (code: string) =>
      parse(code, {
        sourceType: "module",
        plugins: ["jsx"],
      });
    // Instantiate the highlighter
    const monacoJSXHighlighter = new MonacoJSXHighlighter(
      monaco,
      babelParse,
      traverse,
      editor
    );
    // Activate highlighting (debounceTime default: 100ms)
    monacoJSXHighlighter.highlightOnDidChangeModelContent(100);
    // // Activate JSX commenting
    // monacoJSXHighlighter.addJSXCommentCommand();
  };

  const onFormatClick = async () => {
    // get current value from editor
    const unformatted = editorRef.current.getValue();
    // format that value
    const formatted = await prettier.format(unformatted, {
      parser: "babel",
      plugins: [parserBabel, prettierPluginEstree],
      useTabs: false,
      semi: true,
      singleQuote: true,
    });
    // set the formatted value back in the editor
    // remove the extra new line char which the editor adds by default
    editorRef.current.setValue(formatted.replace(/\n$/, ""));
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        value={initialValue}
        onMount={handleEditorDidMount}
        onChange={(value) => onChange(value || "")}
        theme="vs-dark"
        language="javascript"
        height="500px"
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
