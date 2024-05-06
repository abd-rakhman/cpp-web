import React, { useEffect } from "react";

export const useWebsocket = (url: string) => {
  const ws = React.useRef<WebSocket | null>(null);
  const [output, setOutput] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setError(null);
      console.log("Connected to server");
    }

    ws.current.onclose = () => {
      console.log("Disconnected from server");
      setError("Disconnected from server");
    }

    ws.current.onmessage = (event) => {
      console.log("Received message from server", event.data)
      setOutput(event.data.substr(1));
      setLoading(false);
    }

    return () => {
      ws.current?.close();
    };
  }, [url]);

  const submit = (code: string, input: string) => {
    setLoading(true);
    ws.current?.send(JSON.stringify({ code, stdin: input, userId: 1 }));
  }

  return {
    output,
    error,
    submit,
    loading,
  };
}