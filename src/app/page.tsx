'use client'

import React, { useCallback, useContext, useRef, useState } from 'react';
import './App.css';
import { Button } from '@src/components/Button';
import { Stack } from '@src/components/Stack';
import { LoadingPage } from '@src/features/LoadingPage';
import { Modal } from '@src/components/Modal';
import { CodeEditor } from '@src/features/CodeEditor';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { BsGear, BsPlusLg, BsX } from 'react-icons/bs';
import { Input } from '@src/components/Input';
import { StorageContext } from '@src/providers/storage';
import { useHotkeys } from 'react-hotkeys-hook';
import * as Popover from '@radix-ui/react-popover';
import { Text } from '@src/components/Typography';


const DEFAULT_CODE = "#include<iostream>\n\nusing namespace std;\n\nint main() {\n\tcout << \"Hello, World!\";\n\treturn 0;\n}";

export interface IO {
  input: string;
  output: string;
}

function App() {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false);
  const filenameRef = useRef<HTMLInputElement>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const storageContext = useContext(StorageContext);

  if(!storageContext) {
    throw new Error('Storage context is not provided');
  }

  const {
    storage,
    isLoading: isStorageLoading,
    addCode,
    removeCode,
    template,
    setTemplate
  } = storageContext;

  useHotkeys('ctrl+shift+n', () => {
    setIsNewFileDialogOpen(true);
  });

  const handleAddCode = useCallback((name: string) => {
    addCode({
      name,
      code: template ?? DEFAULT_CODE,
      io: [{
        input: '',
        output: ''
      }]
    })
  }, [addCode, template]);


  if(isStorageLoading) {
    return (
      <LoadingPage />
    );
  }

  return (
    <main>
      <Modal 
        open={isTemplateDialogOpen} 
        title="Define Template" 
        description="Do you want to define the current code as a template for future use? Each time you open the editor, the template will be loaded."
        onOpenChange={() => setIsTemplateDialogOpen((prev) => !prev)}
      >
        <Stack direction='row' gap={8} justifyContent='flex-end'>
          <Button onClick={() => {
            setTemplate(storage[Object.keys(storage)[selectedTab]].code)
            setIsTemplateDialogOpen(false)
          }} variant='primary'>Confirm</Button>
          <Button>Close</Button>
        </Stack>
      </Modal>
      <Modal
        open={isNewFileDialogOpen}
        title="New File"
        description={"What should be the name of the new file?"}
        onOpenChange={() => {setIsNewFileDialogOpen((prev) => !prev)}}
      >
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = filenameRef.current?.value ?? 'C';
          handleAddCode(name);
          setIsNewFileDialogOpen(false)
        }}>
          <Stack direction='column' gap={8}>
            <Input required ref={filenameRef} id="filename" fullWidth placeholder='Prob. A' />
            <Stack fullWidth gap={8} justifyContent='flex-end'>
              <Button type="submit" variant='primary'>Confirm</Button>
              <Button onClick={() => setIsNewFileDialogOpen(false)}>Close</Button>
            </Stack>
          </Stack>
        </form>
      </Modal>
      <Tabs selectedIndex={selectedTab} onSelect={(index) => setSelectedTab(index)} selectedTabClassName='selected-tab' className="full-content hidden flex flex-col">
        <Stack justifyContent='space-between' gap={8} className='header'>
          <Stack direction="row" grow={1} alignItems='flex-end' justifyContent='flex-start' gap={4} className='file-tabs'>
            <TabList className="tabs-list">
              {Object.entries(storage).map(([key, value], index) => (
                <Tab key={key} style={{ padding: '8px' }}>
                  <Stack alignItems='center' gap={8}>
                    <span>{value.name}</span>
                    {selectedTab === index && <button onClick={() => removeCode(key)} className='ghost-button' style={{ padding: '0px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%'}}>
                      <BsX size={16} />
                    </button>}
                  </Stack>
                </Tab>
              ))}
            </TabList>
            <button className='ghost-button' onClick={() => setIsNewFileDialogOpen(true)} style={{ margin: '4px'}}><BsPlusLg size={16} /></button> 
          </Stack>
          <Stack className="header-actions" alignItems='center' gap={8}>
            <Popover.Root>
              <Popover.Trigger>
                <Button icon={<BsGear size={16} />} />
              </Popover.Trigger>
              <Popover.Content className='popover-content'>
                <Stack direction='column' gap={8}>
                  <Stack justifyContent='space-between' style={{ padding: '8px'}}>
                    <Text>Language: </Text>
                    <Text>C++14</Text>
                  </Stack>
                  <div style={{ width: '100%', height: 1, minHeight: 1,  backgroundColor: 'rgba(118, 118, 118, 0.4)'}} />
                  <Button onClick={() => setIsTemplateDialogOpen(true)}>Define as Template</Button>
                </Stack>
              </Popover.Content>
            </Popover.Root>
          </Stack>
        </Stack>
        {Object.entries(storage).map(([key, value]) => (
          <TabPanel key={key} selectedClassName='selected-tab-panel'>
            <CodeEditor key={key} initialCode={value.code} initialIO={value.io} id={key} />
          </TabPanel>
        ))}
      </Tabs>
    </main>
  )
}

export default App;
