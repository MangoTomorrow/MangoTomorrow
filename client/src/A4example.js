
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HelloWorld() {
  const [data, setData] = useState(null);

  useEffect(() => {
   
    const url = 'https://A4Example.com'; 

    
    axios.get(url)
      .then(response => {
      
        setData(response.data);
      })
      .catch(error => {
  
        console.error('Error:', error);
      });
  }, []);

  return (
    <div>
      <h1>Hello, World!</h1>
      {data && (
        <div>
          <h2>Response Data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default HelloWorld;
