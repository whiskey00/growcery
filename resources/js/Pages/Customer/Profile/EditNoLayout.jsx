import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function EditNoLayout({ user }) {
  const { data, setData } = useForm({
    postal_code: user.postal_code || '',
    street_details: user.street_details || '',
  });

  const [localText, setLocalText] = useState('');

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', maxWidth: '600px' }}>
        <h1>Test Without CustomerLayout</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <label>Local State Input:</label>
          <br />
          <input
            type="text"
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            placeholder="Type here (local state)..."
            style={{ 
              padding: '10px', 
              width: '100%', 
              border: '1px solid #ccc',
              marginTop: '5px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Inertia Form - Postal Code:</label>
          <br />
          <input
            type="text"
            value={data.postal_code}
            onChange={(e) => setData('postal_code', e.target.value)}
            placeholder="Type here (Inertia form)..."
            style={{ 
              padding: '10px', 
              width: '100%', 
              border: '1px solid #ccc',
              marginTop: '5px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Inertia Form - Street Details:</label>
          <br />
          <textarea
            value={data.street_details}
            onChange={(e) => setData('street_details', e.target.value)}
            placeholder="Type here (Inertia form)..."
            rows="3"
            style={{ 
              padding: '10px', 
              width: '100%', 
              border: '1px solid #ccc',
              marginTop: '5px'
            }}
          />
        </div>

        <div>
          <p><strong>Local text:</strong> {localText}</p>
          <p><strong>Postal code:</strong> {data.postal_code}</p>
          <p><strong>Street details:</strong> {data.street_details}</p>
        </div>
      </div>
    </div>
  );
}
