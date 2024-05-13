'use client'

import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import './App.css';
import { CppEditor } from '@src/components/CppEditor';
import { useWebsocket } from '@src/hooks/useWebsocket';
import { BsFillTrashFill, BsPlay } from "react-icons/bs";
import Split from 'react-split';
import { Button } from '@src/components/Button';
import { Stack } from '@src/components/Stack';
import { LoadingBackdrop, LoadingPage } from '@src/features/LoadingPage';
import { TextArea } from '@src/components/Input';
import { Text } from '@src/components/Typography';

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? '';

interface IOTests {
  input: string;
  output: string;
}

function App() {
  const [code, setCode] = useState('#include<iostream>\n\nusing namespace std;\n\nint main() {\n\tcout << "Hello, World!";\n\treturn 0;\n}');
  const [isCodeLoading, setIsCodeLoading] = useState<boolean>(true);
  const [ioTests, setIOTests] = useState<IOTests[]>([{ input: '', output: '' }]);

  useEffect(() => {
    setIsCodeLoading(true);
    const storedCode = localStorage.getItem('code');
    if (storedCode) {
      setCode(storedCode);
    }
    setIsCodeLoading(false);
  }, []);

  const {
    submit,
    isLoading: websocketLoading,
  } = useWebsocket(WEBSOCKET_URL);

  const handleClick = useCallback(async () => {
    const outputs = await submit(code, ioTests.map((test) => test.input));
    setIOTests((prev) => {
      return prev.map((test, index) => {
        return {
          ...test,
          output: outputs[index],
        }
      });
    });
  }, [code, ioTests, submit]);

  if(isCodeLoading) {
    return (
      <LoadingPage />
    );
  }

  return (
    <main>
      <Stack alignItems='center' justifyContent='flex-end' gap={8} className='header'>
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
          overflowY: 'hidden',
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
        <IOView tests={ioTests} setTests={setIOTests} loading={websocketLoading} />
      </Split>
    </main>
  )
}

interface IOViewProps {
  tests: IOTests[];
  setTests: Dispatch<SetStateAction<IOTests[]>>;
  loading?: boolean;
}

const IOView = ({ tests, setTests, loading = false }: IOViewProps) => {
  const INPUTS_LIMIT = 5;

  const updateTestInput = useCallback((index: number, value: string) => {
    setTests((prev) => {
      const newIOTests = [...prev];
      newIOTests[index].input = value;
      return newIOTests;
    });
  }, [setTests]);

  const deleteTest = useCallback((index: number) => {
    setTests((prev) => {
      const newIOTests = [...prev];
      newIOTests.splice(index, 1);
      if(newIOTests.length === 0) {
        newIOTests.push({ input: '', output: '' });
      } 
      return newIOTests;
    });
  }, [setTests]);

  const addTest = useCallback(() => {
    setTests((prev) => ([...prev, { input: '', output: '' }]))
  }, [setTests]);

  return (
    <div className='io'>
      {loading && <LoadingBackdrop />}
      {tests.map((test, index) => (
        <>
          <div key={index} className="card">
            <Stack justifyContent='space-between' alignItems='center'>
              <Text size="default" style={{ marginBottom: 8 }}>Input Case {index}</Text>
              <Button variant="default" icon={<BsFillTrashFill size={16} />} onClick={() => {
                deleteTest(index)
              }} />
            </Stack>
            <TextArea maxLength={140} label={"Input"} value={test.input} onChange={(event) => {
              updateTestInput(index, event.target.value);
            }} />
            <TextArea maxLength={400} label={"Output"} disabled style={{ flex: 1, }} value={test.output} />
          </div>
          {index + 1 < tests.length && <div style={{ width: '100%', height: 1, minHeight: 1,  backgroundColor: 'rgba(118, 118, 118, 0.4)'}} />}
        </>
      ))}
      {tests.length < INPUTS_LIMIT && <Button onClick={addTest} variant="default">
        Add Input Case
      </Button>}
    </div>
  )
}

export default App;
