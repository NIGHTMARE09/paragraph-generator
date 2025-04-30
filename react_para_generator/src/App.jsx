import { useState, useCallback } from 'react'

function App() {
  const [numWords, setNumWords] = useState('');
  const [para, setPara] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = useCallback((e) => {
    setNumWords(e.target.value.replace(/\D/g, ''));
  }, []);

  const ParaGenerator = useCallback(async() => {
    setError(null);
    setPara('');
    const num = parseInt(numWords);
    
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid number');
      return;
    }
    
    // Add a reasonable limit to prevent UI issues
    if (num > 10000) {
      setError('Please enter a number less than 10000 for better performance');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${num}`);
      
      if(!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const words = await response.json();
      
      // Fisher-Yates shuffle
      for(let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
      }
      
      if(words.length > 0) {
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        setPara(words.join(' ') + '.');
      }
    }
    catch(error) {
      setError(`Error fetching data: ${error.message}`);
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  }, [numWords]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* Header section always visible */}
      <div style={{
        position: 'sticky',
        top: 0,
        backgroundColor: '#fff',
        padding: '15px',
        width: '100%',
        zIndex: 10,
        boxShadow: para ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
        marginBottom: '20px'
      }}>
        <h1 style={{ textAlign: 'center', margin: '0 0 20px 0' }}>Para Generator</h1>
        
        <div style={{ 
          display: 'flex', 
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto' 
        }}>
          <input
            type="text"
            value={numWords}
            onChange={handleInputChange}
            placeholder="Enter Number of Words"
            disabled={isLoading}
            style={{ 
              flex: '1',
              padding: '10px', 
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
          <button
            onClick={ParaGenerator}
            disabled={isLoading}
            style={{
              padding: '10px 15px',
              fontSize: '16px',
              marginLeft: '10px',
              backgroundColor: isLoading ? '#888' : 'black',
              color: 'white',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              border: 'none'
            }}
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
        
        {error && <p style={{ 
          color: '#d32f2f', 
          textAlign: 'center',
          margin: '10px 0 0 0' 
        }}>{error}</p>}
      </div>

      {/* Content section */}
      {para && (
        <div style={{ 
          width: '100%', 
          maxWidth: '800px',
          margin: '0 auto',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '5px',
          boxSizing: 'border-box'
        }}>
          <h2 style={{ marginTop: 0 }}>Generated Paragraph:</h2>
          <p style={{ 
            lineHeight: '1.6',
            textAlign: 'justify',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>{para}</p>
        </div>
      )}
      
      {/* Scroll to top button - appears when paragraph is generated */}
      {para && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'black',
            color: 'white',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            fontSize: '24px'
          }}
        >
          ↑
        </button>
      )}
    </div>
  )
}

export default App
