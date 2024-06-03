import { createContext } from "react";
import { useCallback, useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY='codes';

interface IO {
  input: string;
  output: string;
}

interface Code {
  name: string;
  code: string;
  io: IO[];
}

type Storage = Record<string, Code>;

export const useStorage = () => {
  const [storage, setStorage] = useState<Storage>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if(data === null) {
        return ;
      }
      const initialStorage = JSON.parse(data) as Storage;
      setStorage(initialStorage)
    } catch (e) {
      console.error("Error: when getting storage items, reverting to default: ", e)
    } finally {
      setIsLoading(false)
    }
  }, []);

  const stringifiedStorage = JSON.stringify(storage);

  useEffect(() => {
    if(!isLoading) {
      localStorage.setItem(LOCAL_STORAGE_KEY, stringifiedStorage)
    }
  }, [stringifiedStorage, isLoading])

  const updateCode = useCallback((id: string, code: string, io: IO[]) => {
    setStorage((storage) => {
      const newStorage = {
        ...storage,
      }
      newStorage[id] = {
        ...newStorage[id],
        code,
        io
      }
      return newStorage;
    })
  }, [setStorage]);

  const removeCode = useCallback((id: string) => {
    setStorage((storage) => {
      delete storage[id] 
      return {
        ...storage
      };
    })
  }, [setStorage])

  const addCode = useCallback((code: Code) => {
    const id = uuidv4();
    setStorage((storage) => ({
        ...storage,
        [id]: code
    }))
  }, [setStorage])

  const getSize = useCallback(() => {
    return Object.keys(storage).length;
  }, [storage])

  return {
    isLoading,
    storage,
    updateCode,
    removeCode,
    addCode,
    getSize,
  }
}

export const StorageContext = createContext<{
  isLoading: boolean;
  storage: Storage;
  updateCode: (id: string, code: string, io: IO[]) => void;
  removeCode: (id: string) => void;
  addCode: (code: Code) => void;
  getSize: () => number;
} | null>(null);

export const StorageProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    isLoading,
    storage,
    updateCode,
    removeCode,
    addCode,
    getSize,
  } = useStorage();

  return (
    <StorageContext.Provider value={
      {
        isLoading,
        storage,
        updateCode,
        removeCode,
        addCode,
        getSize,
      }
    }>
      {children}
    </StorageContext.Provider>
  )
}