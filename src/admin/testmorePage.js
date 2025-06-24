import React, { useState, useEffect } from 'react';
import axios from 'axios';

function testmorePage() {
  const [codes, setCodes] = useState([]);
  const [newCode, setNewCode] = useState(null);

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/coder/getList');
      setCodes(response.data);
    } catch (error) {
      console.error('Failed to fetch codes:', error);
    }
  };

  const generateCode = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/coder/create');
      setNewCode(response.data);
      fetchCodes(); // Refresh the list of codes
    } catch (error) {
      console.error('Failed to generate code:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Code Generator</h1>
        <button onClick={generateCode}>Generate Code</button>
        {newCode && (
          <div>
            <h2>New Code: {newCode.code}</h2>
          </div>
        )}
        <h2>Generated Codes</h2>
        <ul>
          {codes.map(code => (
            <li key={code.id}>
              {code.code} - {new Date(code.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default testmorePage;
