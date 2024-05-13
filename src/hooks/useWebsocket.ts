import React, { useCallback, useEffect } from "react";

export const useWebsocket = (url: string) => {
  const ws = React.useRef<WebSocket | null>(null);
  const reconnectInterval = React.useRef<number | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const reconnect = useCallback((connect: () => void) => {
    if (reconnectInterval.current) {
      return;
    }
    reconnectInterval.current = window.setInterval(() => {
      connect();
    }, 1000);
  }, []);

  const clearReconnect = useCallback(() => {
    if(reconnectInterval.current) {
      clearInterval(reconnectInterval.current);
      reconnectInterval.current = null;
    }
  }, []);

  const connect = useCallback((url: string) => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setError(null);
      console.log("Connected to server");
      clearReconnect();
    }

    ws.current.onclose = () => {
      console.log("Disconnected from server");
      setError("Disconnected from server");
      reconnect(() => connect(url));
    }

    ws.current.onerror = (event) => {
      console.error("Error connecting to server", event);
      setError("Error connecting to server");
    }
  }, [reconnect, clearReconnect]);

  useEffect(() => {
    connect(url);

    return () => {
      ws.current?.close();
    }
  }, [url, connect]);

  const submit = async (code: string, inputs: string[]) => {
    setLoading(true);
    return new Promise<string[]>((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {
        ws.current?.removeEventListener('message', handleMessage);
        const outputs = JSON.parse(event.data) as string[];
        resolve(outputs.map(output => output.slice(1)));
        setLoading(false);
      }

      ws.current?.addEventListener('message', handleMessage);

      setTimeout(() => {
        reject("Timeout");
        setLoading(false);
      }, 10000);

      ws.current?.send(JSON.stringify({ code, stdin: inputs, userId: 1 }));
    });
  }

  return {
    error,
    submit,
    isLoading: loading,
  };
}