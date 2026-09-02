import { useEffect, useRef, useState, useCallback } from 'react';

export type BlynkConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface BlynkState {
  connectionStatus: BlynkConnectionStatus;
  soilMoisture: number | null;
  soilTemperature: number | null;
  valveStatus: boolean | null;
  autoMode: boolean | null;
  moistureMin: number | null;
  moistureMax: number | null;
}

export interface BlynkServiceOptions {
  authToken: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onVirtualPinWrite?: (pin: number, value: string | number) => void;
}

const BLYNK_WS_URL = 'wss://blynk.cloud:443/websocket';
const RECONNECT_DELAY_MS = 5000;

export function useBlynkService(options: BlynkServiceOptions) {
  const { authToken, onConnect, onDisconnect, onError, onVirtualPinWrite } = options;

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusRef = useRef<BlynkConnectionStatus>('disconnected');
  const connectingRef = useRef(false);

  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);
  const onErrorRef = useRef(onError);
  const onVirtualPinWriteRef = useRef(onVirtualPinWrite);

  onConnectRef.current = onConnect;
  onDisconnectRef.current = onDisconnect;
  onErrorRef.current = onError;
  onVirtualPinWriteRef.current = onVirtualPinWrite;

  const [state, setState] = useState<BlynkState>({
    connectionStatus: 'disconnected',
    soilMoisture: null,
    soilTemperature: null,
    valveStatus: null,
    autoMode: null,
    moistureMin: null,
    moistureMax: null,
  });

  const updateStatus = useCallback((status: BlynkConnectionStatus) => {
    statusRef.current = status;
    setState(prev => ({ ...prev, connectionStatus: status }));
  }, []);

  const send = useCallback((message: string) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(message);
      } catch (error) {
        console.error('Blynk send error', error);
      }
    }
  }, []);

  const virtualWrite = useCallback((pin: number, value: string | number) => {
    const ts = Math.floor(Date.now() / 1000);
    const msg = `${ts}|vl|${pin}|${value}`;
    send(msg);
  }, [send]);

  const parseMessage = useCallback((raw: string) => {
    const parts = raw.split('|');
    if (parts.length < 2) return;

    if (parts[0] === '200') {
      updateStatus('connected');
      onConnectRef.current?.();
      return;
    }

    const cmd = parts[1];

    switch (cmd) {
      case 'vw': {
        const pin = parseInt(parts[2], 10);
        const value = parts[3] || '';
        if (!Number.isNaN(pin)) {
          setState(prev => {
            const updates: Partial<BlynkState> = {};
            switch (pin) {
              case 0:
                updates.soilMoisture = Number(value);
                break;
              case 1:
                updates.soilTemperature = Number(value);
                break;
              case 2:
                updates.valveStatus = value === '1' || value === 'true';
                break;
              case 3:
                updates.autoMode = value === '1' || value === 'true';
                break;
              case 6:
                updates.moistureMin = Number(value);
                break;
              case 7:
                updates.moistureMax = Number(value);
                break;
              default:
                break;
            }
            return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
          });

          onVirtualPinWriteRef.current?.(pin, value);
        }
        break;
      }
      default:
        break;
    }
  }, [updateStatus]);

  const connect = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.CONNECTING || wsRef.current.readyState === WebSocket.OPEN)) {
      return;
    }

    if (connectingRef.current) {
      return;
    }

    connectingRef.current = true;
    updateStatus('connecting');

    const ws = new WebSocket(BLYNK_WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(`0|${authToken}`);
    };

    ws.onmessage = (event) => {
      const raw = typeof event.data === 'string' ? event.data : String(event.data);
      if (raw.trim() === '') return;
      parseMessage(raw.trim());
    };

    ws.onerror = () => {
      console.error('Blynk WebSocket error');
      updateStatus('error');
      onErrorRef.current?.(new Error('Erreur de connexion Blynk'));
    };

    ws.onclose = () => {
      wsRef.current = null;
      connectingRef.current = false;
      if (statusRef.current !== 'disconnected') {
        updateStatus('disconnected');
        onDisconnectRef.current?.();
      }

      reconnectTimerRef.current = setTimeout(() => {
        connect();
      }, RECONNECT_DELAY_MS);
    };
  }, [authToken, updateStatus, parseMessage]);

  const clearConnection = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    const ws = wsRef.current;
    if (ws) {
      ws.onclose = null;
      ws.onerror = null;
      ws.onmessage = null;
      ws.onopen = null;
      ws.close();
      wsRef.current = null;
    }

    connectingRef.current = false;
    updateStatus('disconnected');
  }, [updateStatus]);

  useEffect(() => {
    connect();

    return () => {
      clearConnection();
    };
  }, [connect, clearConnection]);

  return {
    ...state,
    virtualWrite,
    reconnect: connect,
  };
}
