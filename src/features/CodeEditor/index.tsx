import { Button } from '@src/components/Button';
import { CppEditor } from '@src/components/CppEditor';
import { Input, TextArea } from '@src/components/Input';
import { Modal } from '@src/components/Modal';
import { Stack } from '@src/components/Stack';
import { Text } from '@src/components/Typography';
import { CodeforcesService } from '@src/services/codeforces';
import { useMutation } from '@tanstack/react-query';
import React, { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from 'react';
import Split from 'react-split';
import { LoadingBackdrop } from '../LoadingPage';
import { BsFillTrash3Fill, BsPlay } from 'react-icons/bs';
import { CodeforcesIcon } from '@src/components/Icons/codeforces';
import { IO } from '@src/app/page';
import { BackendService, ISubmission } from '@src/services/backend';
import { useHotkeys } from 'react-hotkeys-hook';
import { StorageContext } from '@src/providers/storage';
import AceEditor from 'react-ace';

import './CodeEditor.css';

const DEFAULT_CODE = "#include<iostream>\n\nusing namespace std;\n\nint main() {\n\tcout << \"Hello, World!\";\n\treturn 0;\n}";

interface CodeEditorProps {
  initialCode?: string;
  initialIO?: IO[];
  id: string;
}

export const CodeEditor = ({ initialCode, initialIO, id }: CodeEditorProps) => {
  const [code, setCode] = useState(initialCode ?? DEFAULT_CODE);
  const [io, setIO] = useState<IO[]>(initialIO ?? [{
    input: '',
    output: '',
  }]);
  const storage = useContext(StorageContext);
  const ref = React.useRef<AceEditor>(null);

  const updateCode = useCallback((id: string, code: string, io: IO[]) => {
    storage?.updateCode(id, code, io);
  }, [storage]);

  if(!storage) {
    throw new Error('Storage context is not provided');
  }

  const {
    mutate: executeCode,
    isPending: isExecuting,
  } = useMutation({
    mutationFn: async (submission: ISubmission) => await BackendService.executeCode(submission),
    onSuccess: (data) => {
      const outputs = data.map((output) => output.trim());
      setIO((prev) => {
        return prev.map((test, index) => {
          return {
            ...test,
            output: outputs[index],
          }
        });
      });
    }
  });

  useEffect(() => {
    updateCode(id, code, io);
  }, [code, io, id]);

  const execute = useCallback(async () => {
    const inputs = io.map(test => test.input);
    const submission: ISubmission = {
      code,
      stdin: inputs,
    }
    executeCode(submission);
  }, [code, io, executeCode]);

  useHotkeys('ctrl+shift+e, meta+shift+e', execute);

  useEffect(() => {
    if(ref.current) {
      ref.current.editor.commands.addCommand({
        name: 'execute',
        bindKey: { win: 'Ctrl-Shift-E', mac: 'Cmd-Shift-E' },
        exec: execute,
      });
    }
  }, [ref, execute]);

  return (
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
        <CppEditor ref={ref} code={code} setCode={setCode} />
        <IOView tests={io} setTests={setIO} loading={isExecuting} execute={execute} />
      </Split>
  )
}

interface IOViewProps {
  tests: IO[];
  setTests: Dispatch<SetStateAction<IO[]>>;
  loading?: boolean;
  execute: () => Promise<void>;
}

const IOView = ({ tests, setTests, loading = false, execute }: IOViewProps) => {
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
        output: '',
      }))]);
      setOpenCodeforces(false);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  return (
    <div className="relative">
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
                <Button variant="default" icon={<BsFillTrash3Fill size={16} />} onClick={() => {
                  deleteTest(index)
                }} />
              </Stack>
              <TextArea maxLength={140} label={"Input"} value={test.input} onChange={(event) => {
                updateTestInput(index, event.target.value);
              }} style={{ height: '100px'}} />
              <TextArea maxLength={400} label={"Output"} disabled style={{ flex: 1, height: '100px' }} value={test.output} />
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
        <Button className='align-bottom' variant="primary" isLoading={loading} onClick={execute} icon={<BsPlay size={16} />}>
          Run Code
        </Button>
      </div>
    </div>
  )
}
