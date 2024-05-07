'use client'

import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { CppEditor } from '@src/components/CppEditor';
import { useWebsocket } from '@src/hooks/useWebsocket';
import { BsPlay } from "react-icons/bs";
import Split from 'react-split';
import { Button } from '@src/components/Button';
import { Stack } from '@src/components/Stack';
import { LoadingPage } from '@src/features/LoadingPage';

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? '';

function App() {
  const [code, setCode] = useState('#include<iostream>\n\nusing namespace std;\n\nint main() {\n\tcout << "Hello, World!";\n\treturn 0;\n}');
  const [isCodeLoading, setIsCodeLoading] = useState<boolean>(true);
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    setIsCodeLoading(true);
    const storedCode = localStorage.getItem('code');
    if (storedCode) {
      setCode(storedCode);
    }
    setIsCodeLoading(false);
  }, []);

  const {
    output,
    error,
    submit,
    isLoading: websocketLoading,
  } = useWebsocket(WEBSOCKET_URL);

  const handleClick = useCallback(() => {
    submit(code, input);
  }, [submit, code, input]);

  if(isCodeLoading) {
    return (
      <LoadingPage />
    );
  }

  return (
    <main>
      <Stack alignItems='center' justifyContent='flex-end' gap={8} className='header'>
        <Button variant="default" disabled >
          Add Input Case
        </Button>
        <Button variant="primary" isLoading={websocketLoading} onClick={handleClick} icon={<BsPlay size={16} />}>
          Run Code
        </Button>
      </Stack>
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
        gutterStyle={() => ({
          backgroundColor: '#24251F',
          width: '10px',
          cursor: 'col-resize',
          borderRight: '1px solid rgba(118, 118, 118, 0.2)',
          borderLeft: '1px solid rgba(118, 118, 118, 0.2)',
        })}
      >
        <CppEditor code={code} setCode={(code: string) => {
          setCode(code);
          localStorage.setItem('code', code);
        }} />  
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
