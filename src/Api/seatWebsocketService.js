import { useEffect, useRef } from "react";
import { WS_BASE_URL } from "./config";

const buildSeatSocketUrl = () => {
  const token = localStorage.getItem("access_token");
  const baseUrl = `${WS_BASE_URL}/ws/admin`
  
  return token ? `${baseUrl}?token=${encodeURIComponent(token)}` : baseUrl;
};

const useSeatSocket = (updateSeatUI, options = {}) => {
  const { enabled = true } = options;
  const updateSeatUIRef = useRef(updateSeatUI);
  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const shouldReconnectRef = useRef(true);

  useEffect(() => {
    updateSeatUIRef.current = updateSeatUI;
  }, [updateSeatUI]);

  useEffect(() => {
    if (!enabled) return undefined;

    shouldReconnectRef.current = true;

    const connect = () => {
      if (socketRef.current) return;

      const wsUrl = buildSeatSocketUrl();
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("Connected to StudySphere WebSocket");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (typeof updateSeatUIRef.current === "function") {
            updateSeatUIRef.current(data);
          }
        } catch (error) {
          console.error("Invalid WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = (event) => {
        console.log("WebSocket disconnected:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });

        socketRef.current = null;

        // Do not reconnect when component intentionally unmounts.
        if (!shouldReconnectRef.current) return;

        // 1000 = normal close. Other codes can happen during deploy/network drops.
        if (event.code !== 1000) {
          reconnectTimerRef.current = window.setTimeout(connect, 3000);
        }
      };
    };

    connect();

    return () => {
      shouldReconnectRef.current = false;

      if (reconnectTimerRef.current) {
        window.clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }

      const ws = socketRef.current;
      socketRef.current = null;

      if (
        ws &&
        (ws.readyState === WebSocket.OPEN ||
          ws.readyState === WebSocket.CONNECTING)
      ) {
        ws.close(1000, "Component unmounted");
      }
    };
  }, [enabled]);

  return socketRef;
};

export default useSeatSocket;
