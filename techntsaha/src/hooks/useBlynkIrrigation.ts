import { useCallback, useMemo, useState } from 'react';
import { useBlynkService, BlynkConnectionStatus } from '../services/blynkService';

export interface BlynkSensor {
  id: string;
  name: string;
  plotName: string;
  status: string;
  batteryLevel: number;
  soilMoisture: number;
  soilTemperature: number;
  airHumidity: number;
  rainfallMmPerHour: number;
  valveStatus: 'open' | 'closed' | 'auto';
  autoMode: boolean;
  lastTransmission: string;
  smsAlertsEnabled: boolean;
  moistureMinThreshold: number;
  moistureMaxThreshold: number;
  signalStrength: string;
  latitude: number | null;
  longitude: number | null;
  recommendedActionFr: string;
  recommendedActionMg: string;
  createdAt: string;
}

export interface UseBlynkIrrigationOptions {
  authToken: string;
  lang?: 'fr' | 'mg';
  onAlert?: (message: string) => void;
}

export function useBlynkIrrigation(options: UseBlynkIrrigationOptions) {
  const { authToken, lang = 'fr', onAlert } = options;

  const blynk = useBlynkService({
    authToken,
    onError: (error) => {
      console.error('Blynk error', error);
    },
  });

  const [isActionInProgress, setIsActionInProgress] = useState<string | null>(null);

  const sensor: BlynkSensor = useMemo(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString(lang === 'fr' ? 'fr-FR' : 'mg', { hour: '2-digit', minute: '2-digit' });

    return {
      id: 'blynk-sensor-1',
      name: 'ESP32 Irrigation',
      plotName: lang === 'fr' ? 'Parcelle Blynk' : 'Tany Blynk',
      status: blynk.connectionStatus === 'connected' ? 'online' : 'offline',
      batteryLevel: 85,
      soilMoisture: blynk.soilMoisture ?? 0,
      soilTemperature: blynk.soilTemperature ?? 0,
      airHumidity: 60,
      rainfallMmPerHour: 0,
      valveStatus: blynk.valveStatus === true ? 'open' : blynk.valveStatus === false ? 'closed' : 'auto',
      autoMode: blynk.autoMode ?? true,
      lastTransmission: timeStr,
      smsAlertsEnabled: true,
      moistureMinThreshold: blynk.moistureMin ?? 35,
      moistureMaxThreshold: blynk.moistureMax ?? 75,
      signalStrength: blynk.connectionStatus === 'connected' ? 'Blynk Cloud' : 'Déconnecté',
      latitude: null,
      longitude: null,
      recommendedActionFr: 'Surveillez l\'humidité du sol via les widgets Blynk.',
      recommendedActionMg: 'Amparilofo ny hamandoana amin\'ny widgets Blynk.',
      createdAt: new Date().toISOString(),
    };
  }, [blynk, lang]);

  const sendCommand = useCallback(async (pin: number, value: string | number) => {
    setIsActionInProgress(`pin-${pin}`);
    try {
      blynk.virtualWrite(pin, value);
    } finally {
      setTimeout(() => setIsActionInProgress(null), 500);
    }
  }, [blynk]);

  const handleToggleValve = useCallback(async (mode: 'open' | 'closed' | 'auto') => {
    if (mode === 'auto') {
      await sendCommand(5, 1);
    } else if (mode === 'open') {
      await sendCommand(5, 0);
      await sendCommand(4, 1);
    } else {
      await sendCommand(5, 0);
      await sendCommand(4, 0);
    }
  }, [sendCommand]);

  const handleTriggerWateringPulse = useCallback(async () => {
    await sendCommand(5, 0);
    await sendCommand(4, 1);
    onAlert?.(lang === 'fr'
      ? 'Arrosage d\'appoint lancé (15 min).'
      : 'Fanondrahana maika natao (15 min).');
  }, [sendCommand, onAlert, lang]);

  return {
    sensors: [sensor],
    selectedSensor: sensor,
    connectionStatus: blynk.connectionStatus,
    isActionInProgress,
    handleToggleValve,
    handleTriggerWateringPulse,
    refresh: blynk.reconnect,
    blynkState: blynk,
  };
}
