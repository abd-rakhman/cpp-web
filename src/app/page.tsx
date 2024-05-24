'use client'

import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import './App.css';
import { CppEditor } from '@src/components/CppEditor';
import { BsFillTrashFill, BsPlay } from "react-icons/bs";
import Split from 'react-split';
import { Button } from '@src/components/Button';
import { Stack } from '@src/components/Stack';
import { LoadingBackdrop, LoadingPage } from '@src/features/LoadingPage';
import { Input, TextArea } from '@src/components/Input';
import { Text } from '@src/components/Typography';
import { Select } from '@src/components/Select';
import { useMutation } from '@tanstack/react-query';
import { BackendService, ISubmission } from '@src/services/backend';
import { CodeforcesService } from '@src/services/codeforces';
import { Modal } from '@src/components/Modal';
import { CodeforcesIcon } from '@src/components/Icons/codeforces';

interface IOTests {
  input: string;
  output: string;
}

function App() {
  const [code, setCode] = useState('#include<iostream>\n\nusing namespace std;\n\nint main() {\n\tcout << "Hello, World!";\n\treturn 0;\n}');
  const [isCodeLoading, setIsCodeLoading] = useState<boolean>(true);
  const [ioTests, setIOTests] = useState<IOTests[]>([{ input: '', output: '' }]);
  const [language] = useState('cpp14');

  useEffect(() => {
    setIsCodeLoading(true);
    const storedCode = localStorage.getItem('code');
    if (storedCode) {
      setCode(storedCode);
    }
    setIsCodeLoading(false);
  }, []);

  const {
    mutate: executeCode,
    isPending,
  } = useMutation({
    mutationFn: (submission: ISubmission) => BackendService.executeCode(submission),
    onSuccess: (data) => {
      const outputs = data.map((output) => output.trim());
      setIOTests((prev) => {
        return prev.map((test, index) => {
          return {
            ...test,
            output: outputs[index],
          }
        });
      }); 
    }
  })

  

  const handleClick = useCallback(() => {
    const inputs = ioTests.map(test => test.input);
    const submission: ISubmission = {
      code,
      stdin: inputs,
    }
    executeCode(submission);
  }, [code, ioTests, executeCode]);

  if(isCodeLoading) {
    return (
      <LoadingPage />
    );
  }

  return (
    <main>
      <Stack alignItems='center' justifyContent='flex-end' gap={8} className='header'>
        <div className=''>
          <Select className='language-select' disabled items={[
            { value: 'cpp14', label: 'C++14' },
          ]} value={language} />
        </div>
        <Button variant="primary" isLoading={isPending} onClick={handleClick} icon={<BsPlay size={16} />}>
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
        <IOView tests={ioTests} setTests={setIOTests} loading={isPending} />
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
  const [openCodeforces, setOpenCodeforces] = useState(false);
  const [contestId, setContestId] = useState<number | undefined>(undefined);
  const [problemId, setProblemId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
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
  
  const {
    mutate: getCodeforcesProblem,
    isPending: isProblemLoading,
  } = useMutation({
    mutationFn: ({ contestId, problemId }: {
      contestId: number;
      problemId: string;
    }) => CodeforcesService.getProblem(contestId, problemId),
    onSuccess: (data) => {
      setTests((prevTests) => [...prevTests, ...data.sampleTests.map((test) => ({
        input: test.input,
        output: test.output,
      }))]);
      setOpenCodeforces(false);
    },
    onError: (error) => {
      setError(error.message);
    }
  })

  return (
    <div className='io'>
      <Modal open={openCodeforces} title="Parse Codeforces Problem" onOpenChange={() => setOpenCodeforces((prev) => !prev)}>
        <Stack direction='column' gap={8}>
          <Stack direction='row' gap={8}>
            <Input fullWidth label="Contest ID" placeholder='1973' required value={contestId} onChange={(e) => setContestId(Number(e.target.value))} />
            <Input fullWidth label="Problem ID" placeholder='A' required value={problemId} onChange={(e) => setProblemId(e.target.value)} />
          </Stack>
          {error && <Text color="error">{error}</Text>}
          <Button fullWidth variant="primary" onClick={() => {
            if(!contestId || !problemId) {
              setError('Contest ID and Problem ID are required');
              return;
            }
            getCodeforcesProblem({ contestId, problemId });
          }} isLoading={isProblemLoading}>Get Problem</Button>
        </Stack>
      </Modal>
      {loading && <LoadingBackdrop />}
      {tests.map((test, index) => (
        <React.Fragment key={index}>
          <div className="card">
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
        </React.Fragment>
      ))}
      <Stack direction='column' gap={8}>
        <Button onClick={() => setOpenCodeforces(true)} icon={<CodeforcesIcon size={16} />}>Parse Codeforces Problem</Button>
        {tests.length < INPUTS_LIMIT && <Button onClick={addTest} variant="default">
          Add Input Case
        </Button>}
      </Stack>
    </div>
  )
}

export default App;
