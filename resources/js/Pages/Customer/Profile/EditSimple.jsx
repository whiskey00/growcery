import React, { useState } from 'react';

export default function EditSimple({ user }) {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');

  return (
    <div style={{ padding: '20px', backgroundColor: 'white' }}>
      <h1>Super Simple Test - No Layout, No Inertia</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Test Input 1:</label>
        <br />
        <input
          type="text"
          value={text1}
          onChange={(e) => setText1(e.target.value)}
          placeholder="Type here..."
          style={{ 
            padding: '10px', 
            width: '300px', 
            border: '1px solid #ccc',
            marginTop: '5px'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Test Input 2:</label>
        <br />
        <textarea
          value={text2}
          onChange={(e) => setText2(e.target.value)}
          placeholder="Type here..."
          rows="3"
          style={{ 
            padding: '10px', 
            width: '300px', 
            border: '1px solid #ccc',
            marginTop: '5px'
          }}
        />
      </div>

      <div>
        <p>Text 1: {text1}</p>
        <p>Text 2: {text2}</p>
      </div>
    </div>
  );
}
