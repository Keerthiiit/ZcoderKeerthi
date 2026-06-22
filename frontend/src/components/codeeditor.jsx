import { useState, useEffect, useCallback } from 'react';
import '../styles/codeeditor.css';
import { handleSuccess } from '../../util';

const CodeEditor = ({ problemId, initialCode = '', onCodeChange, onLanguageChange }) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState('C++');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);



  const getDefaultStarterCode = useCallback((lang) => {
    const starters = {
      "C++": `// Problem ${problemId} - C++ Solution
                    \n#include <bits/stdc++.h>
                    \nusing namespace std;
                    \nint main() {
	                  \n// your code goes here
                    \n}`,
      "JavaScript": `// Problem ${problemId} - JavaScript Solution
                    \nfunction solveProblem(input) {
                    \n  // Your code here
                    \n  return input;
                    \n}
                    \n// Test case
                    \nconsole.log(solveProblem("test"));`,
      "Python": `# Problem ${problemId} - Python Solution
                    \ndef solve_problem(input):
                    \n  # Your code here
                    \n  return input
                    \n# Test case
                    \nprint(solve_problem("test"))`,
       "Java": `// Problem ${problemId} - Java Solution
                    \npublic class Solution {
                    \n   public static void main(String[] args) {
                    \n      // Your code here
                    \n      System.out.println("Test");
                    \n  }
                    \n}`
        };
        return starters[lang] || `// Starter code for problem ${problemId}`;
  }, [problemId]);

useEffect(() => {
  const savedCode = localStorage.getItem(`code_${problemId}`);
  const codeToSet = savedCode || getDefaultStarterCode(language);
  setCode(codeToSet);
  if (onCodeChange) onCodeChange(codeToSet); // ✅ this line is essential!
}, [problemId, language, getDefaultStarterCode, onCodeChange]);


  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    localStorage.setItem(`code_${problemId}`, newCode);
    if (onCodeChange) onCodeChange(newCode);
  };

  useEffect(() => {
    if (onLanguageChange) onLanguageChange(language);
  }, [language, onLanguageChange]);

  const handleRun = () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    setTimeout(() => {
      try {
        // sample fake result
        const mockResults = {
          "C++": 'Test cases passed: 3/3\nExecution time: 100ms',
          "Javascript": 'Test cases passed: 3/3\nExecution time: 120ms',
          "Python": 'Test cases passed: 3/3\nExecution time: 150ms',
          "Java": 'Test cases passed: 3/3\nExecution time: 200ms'
        };
        setOutput(mockResults[language] + "\nThis is just a demo this feature is yet to be added" || 'Code executed successfully');
      } catch (err) {
        setOutput(`Error: ${err.message}`);
      }
      setIsRunning(false);
    }, 1500);
  };

  const handleSubmit = () => {
    // fake submit
    handleSuccess(`Code submitted for problem ${problemId} ! This is just a demo this feature is yet to be added`);
    console.log('Submitted code:', code);
  };

  

  return (
    <div className="code-editor-container">
      <div className="editor-header">
        <select 
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              if (onLanguageChange) onLanguageChange(e.target.value);
            }}
          >
          <option value="C++">C++</option>
          <option value="Java">Java</option>
          <option value="Python">Python</option>
          <option value="Javascript">JavaScript</option>
        </select>
        
        <div className="editor-actions">
          <button 
            onClick={handleRun}
            disabled={isRunning}
            className="run-button"
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
          <button 
            onClick={handleSubmit}
            className="submit-button"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="code-area">
        <textarea
          value={code}
          onChange={handleCodeChange}
          className="code-input"
          spellCheck="false"
        />
      </div>

      <div className="output-container">
        <h3>Output</h3>
        <pre className="output-content">{output || 'Run your code to see output here'}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;