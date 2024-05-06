import { useCallback, useState } from 'react';
import './App.css';
import { CppEditor } from './components/CppEditor';
import { useWebsocket } from './hooks/useWebsocket';
import { BsPlay, BsArrowRepeat } from "react-icons/bs";
import Split from 'react-split';


const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

function App() {
  const [code, setCode] = useState('#include<iostream>\n\nusing namespace std;\n\nint main() {\n\tcout << "Hello, World!";\n\treturn 0;\n}')
  const [input, setInput] = useState('');

  const {
    output,
    error,
    submit,
    loading,
  } = useWebsocket(WEBSOCKET_URL);

  const handleClick = useCallback(() => {
    submit(code, input);
  }, [submit, code, input]);

  return (
    <main>
      <div className='header'>
        <button onClick={handleClick} disabled={loading}>
          {loading ? <BsArrowRepeat className='loading' /> : <BsPlay />}
          Run
        </button>
      </div>
      <Split 
        sizes={[75, 25]} 
        minSize={300} 
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
        }}
      >
        <CppEditor code={code} setCode={setCode} />  
        <div className='io'>
          <textarea style={{ flex: 1 }} value={input} onChange={(event) => setInput(event.target.value)} />
          <div style={{ width: '100%', borderBottom: '1px solid rgba(118, 118, 118, 0.4)'}} />
          <textarea disabled style={{ flex: 1, }} value={error ?? output} />
        </div>
      </Split>
    </main>
  )
}

export default App;
