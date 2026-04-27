



import { useEffect } from "react";

const useSeatSocket = (updateSeatUI) => {
  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/api/v1/ws/seats");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log(data)

      updateSeatUI(data); 
    };

    ws.onclose = () => {
      console.log("Disconnected");
    };

    return () => ws.close();
  }, []);
};

export default useSeatSocket;