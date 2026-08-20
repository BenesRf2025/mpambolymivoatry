import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { IoTSensorNode } from '../types';
import { translations } from '../data/translations';
import { Droplets, Sun, Thermometer, CloudRain, Radio, Power, CheckCircle2, MessageSquare, Sparkles, TrendingUp, Send, Zap } from '../lib/icons';

interface SmartIrrigationScreenProps {
  sensors: IoTSensorNode[];
  onUpdateSensor: (updatedSensor: IoTSensorNode) => void;
  lang: 'fr' | 'mg';
}

export const SmartIrrigationScreen: React.FC<SmartIrrigationScreenProps> = ({ sensors, onUpdateSensor, lang }) => {
  const t = translations[lang];
  const [selectedSensorId, setSelectedSensorId] = useState<string>(sensors[0]?.id || 'sensor-1');
  const [isSimulatingAction, setIsSimulatingAction] = useState<string | null>(null);
  const [simulatedSmsToast, setSimulatedSmsToast] = useState<string | null>(null);

  const currentSensor = sensors.find((s) => s.id === selectedSensorId) || sensors[0];

  const handleToggleValve = (mode: 'open' | 'closed' | 'auto') => {
    if (!currentSensor) return;
    setIsSimulatingAction(mode);

    setTimeout(() => {
      const updated: IoTSensorNode = {
        ...currentSensor,
        valveStatus: mode,
        autoMode: mode === 'auto',
        lastTransmission: lang === 'fr' ? "À l'instant" : 'Vao teo',
      };
      onUpdateSensor(updated);
      setIsSimulatingAction(null);

      const smsMsg =
        lang === 'fr'
          ? `[SMS Mpamboly IoT] ${currentSensor.plotName}: Vanne passée en mode ${mode.toUpperCase()}. Humidité: ${currentSensor.soilMoisture}%.`
          : `[SMS Mpamboly IoT] ${currentSensor.plotName}: Novana ho ${mode.toUpperCase()} ny vanne. Hamandoana: ${currentSensor.soilMoisture}%.`;
      setSimulatedSmsToast(smsMsg);

      setTimeout(() => setSimulatedSmsToast(null), 5000);
    }, 600);
  };

  const handleTriggerWateringPulse = () => {
    if (!currentSensor) return;
    setIsSimulatingAction('pulse');

    setTimeout(() => {
      const newMoisture = Math.min(88, currentSensor.soilMoisture + 15);
      const updated: IoTSensorNode = {
        ...currentSensor,
        soilMoisture: newMoisture,
        valveStatus: 'open',
        lastTransmission: lang === 'fr' ? "À l'instant" : 'Vao teo',
      };
      onUpdateSensor(updated);
      setIsSimulatingAction(null);

      const smsMsg =
        lang === 'fr'
          ? `[SMS Mpamboly IoT] Arrosage d'appoint lancé sur ${currentSensor.plotName}. Humidité remontée à ${newMoisture}%.`
          : `[SMS Mpamboly IoT] Fanondrahana maika natao tao amin'ny ${currentSensor.plotName}. Niakatra ho ${newMoisture}% ny hamandoana.`;
      setSimulatedSmsToast(smsMsg);
      setTimeout(() => setSimulatedSmsToast(null), 5000);
    }, 700);
  };

  return (
    <View style={{ gap: 16, paddingBottom: 40 }}>
      {/* Impact Banner */}
      <View className="bg-[#3c4f37] rounded-2xl p-4">
        <View className="flex-row items-center justify-between gap-2 mb-2">
          <View className="flex-row items-center gap-2 flex-1">
            <View className="p-2 rounded-xl bg-white/15">
              <Droplets className="w-5 h-5 text-emerald-300" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-base leading-tight text-white">{t.smartIrrigationTitle}</Text>
              <Text className="text-xs text-emerald-100/90 leading-tight">{t.smartIrrigationSubtitle}</Text>
            </View>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2 mt-3 pt-3 border-t border-white/15">
          <View className="bg-white/10 rounded-xl p-2.5 flex-row items-center gap-2" style={{ width: '48%' }}>
            <TrendingUp className="w-4 h-4 text-emerald-300" />
            <View className="flex-1">
              <Text className="text-xs font-bold leading-tight text-white">{t.statYieldBoost}</Text>
              <Text className="text-[10px] text-white/70">SRI & Maraîchage</Text>
            </View>
          </View>

          <View className="bg-white/10 rounded-xl p-2.5 flex-row items-center gap-2" style={{ width: '48%' }}>
            <Droplets className="w-4 h-4 text-blue-300" />
            <View className="flex-1">
              <Text className="text-xs font-bold leading-tight text-white">{t.statWaterSaved}</Text>
              <Text className="text-[10px] text-white/70">Zéro gaspillage</Text>
            </View>
          </View>

          <View className="bg-white/10 rounded-xl p-2.5 flex-row items-center gap-2" style={{ width: '48%' }}>
            <Zap className="w-4 h-4 text-amber-300" />
            <View className="flex-1">
              <Text className="text-xs font-bold leading-tight text-white">{t.statRoi}</Text>
              <Text className="text-[10px] text-white/70">Capteurs &lt;30 USD</Text>
            </View>
          </View>

          <View className="bg-white/10 rounded-xl p-2.5 flex-row items-center gap-2" style={{ width: '48%' }}>
            <Radio className="w-4 h-4 text-purple-300" />
            <View className="flex-1">
              <Text className="text-xs font-bold leading-tight text-white">{t.statSms}</Text>
              <Text className="text-[10px] text-white/70">LoRa / SMS 2G</Text>
            </View>
          </View>
        </View>
      </View>

      {/* SMS Toast */}
      {simulatedSmsToast && (
        <View className="bg-stone-900 p-3 rounded-xl flex-row items-start gap-2.5">
          <MessageSquare className="w-4 h-4 mt-0.5 text-amber-400" />
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text className="font-bold text-stone-200 text-xs">
                {lang === 'fr' ? 'Alerte SMS Réceptionnée (Hors-ligne)' : 'Hafatra SMS Voaray (Tsy misy Aterineto)'}
              </Text>
              <Text className="text-[10px] text-stone-400">Telma / Orange GSM</Text>
            </View>
            <Text className="text-amber-200 mt-0.5 text-[11px]">{simulatedSmsToast}</Text>
          </View>
        </View>
      )}

      {/* Sensor Selector Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row items-center gap-2">
          {sensors.map((sensor) => {
            const isSelected = sensor.id === selectedSensorId;
            return (
              <Pressable
                key={sensor.id}
                onPress={() => setSelectedSensorId(sensor.id)}
                className={`flex-row items-center gap-2 px-3.5 py-2 rounded-xl border ${
                  isSelected ? 'bg-[#5B7553] border-[#5B7553]' : 'bg-white border-stone-200'
                }`}
              >
                <Radio className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#5B7553]'}`} />
                <Text className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-stone-700'}`}>{sensor.name.split(' - ')[0]}</Text>
                <Text className={`text-[10px] px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-white/25 text-white' : 'bg-stone-100 text-stone-600'}`}>
                  {sensor.soilMoisture}%
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Active Sensor Card */}
      {currentSensor && (
        <View className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E3DFD2] gap-4">
          <View className="pb-3 border-b border-stone-200/80 gap-2">
            <View className="flex-row items-center gap-2 flex-wrap">
              <Text className="font-bold text-stone-900 text-base">{currentSensor.name}</Text>
              <Text className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                {currentSensor.signalStrength} Direct
              </Text>
            </View>
            <Text className="text-xs text-stone-500">
              {currentSensor.plotName} · {lang === 'fr' ? 'Dernière synchro :' : 'Fandrindrana farany :'} {currentSensor.lastTransmission}
            </Text>

            <View className="flex-row items-center gap-2">
              <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <Text className="text-stone-700 text-xs font-medium">{currentSensor.batteryLevel}% Solaire</Text>
              </View>
              <View
                className={`flex-row items-center gap-1 px-2.5 py-1 rounded-lg ${
                  currentSensor.valveStatus === 'open' ? 'bg-blue-100' : currentSensor.valveStatus === 'auto' ? 'bg-emerald-100' : 'bg-stone-200'
                }`}
              >
                <Power className="w-3 h-3 text-stone-700" />
                <Text className="text-xs font-semibold text-stone-700">
                  {currentSensor.valveStatus === 'auto' ? t.valveAuto : currentSensor.valveStatus === 'open' ? t.valveOpen : t.valveClosed}
                </Text>
              </View>
            </View>
          </View>

          {/* 4 Live Gauges */}
          <View className="flex-row flex-wrap gap-3">
            <View className="bg-white rounded-xl p-3 border border-stone-200/80 justify-between" style={{ width: '48%' }}>
              <View className="flex-row items-center justify-between">
                <Text className="text-stone-500 text-xs">{t.sensorMoisture}</Text>
                <Droplets className="w-4 h-4 text-blue-500" />
              </View>
              <View className="my-2">
                <Text className="text-2xl font-black text-stone-900">{currentSensor.soilMoisture}%</Text>
                <View className="w-full bg-stone-100 h-2 rounded-full mt-1.5 overflow-hidden">
                  <View
                    className={`h-full rounded-full ${
                      currentSensor.soilMoisture < 45 ? 'bg-amber-500' : currentSensor.soilMoisture > 80 ? 'bg-blue-600' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${currentSensor.soilMoisture}%` }}
                  />
                </View>
              </View>
              <Text className="text-[10px] text-stone-500 font-medium">
                {currentSensor.soilMoisture < 45
                  ? lang === 'fr'
                    ? '⚠️ Sol trop sec'
                    : '⚠️ Maina loatra ny tany'
                  : currentSensor.soilMoisture > 75
                  ? lang === 'fr'
                    ? '💧 Parfait pour SRI'
                    : "💧 Mety tsara ho an'ny SRI"
                  : lang === 'fr'
                  ? '✅ Humidité optimale'
                  : '✅ Hamandoana tsara'}
              </Text>
            </View>

            <View className="bg-white rounded-xl p-3 border border-stone-200/80 justify-between" style={{ width: '48%' }}>
              <View className="flex-row items-center justify-between">
                <Text className="text-stone-500 text-xs">{t.sensorTemp}</Text>
                <Thermometer className="w-4 h-4 text-orange-500" />
              </View>
              <View className="my-2">
                <Text className="text-2xl font-black text-stone-900">{currentSensor.soilTemperature}°C</Text>
                <Text className="text-[11px] text-stone-500 mt-1">
                  {lang === 'fr' ? 'Air ambiant :' : 'Toetran-drivotra :'} {currentSensor.airHumidity}%
                </Text>
              </View>
              <Text className="text-[10px] text-emerald-700 font-medium">
                {lang === 'fr' ? 'Température idéale' : 'Hafanana mampahazo aina'}
              </Text>
            </View>

            <View className="bg-white rounded-xl p-3 border border-stone-200/80 justify-between" style={{ width: '48%' }}>
              <View className="flex-row items-center justify-between">
                <Text className="text-stone-500 text-xs">{t.sensorRain}</Text>
                <CloudRain className="w-4 h-4 text-indigo-500" />
              </View>
              <View className="my-2">
                <Text className="text-2xl font-black text-stone-900">
                  {currentSensor.rainfallMmPerHour} <Text className="text-xs font-normal">mm/h</Text>
                </Text>
                <Text className="text-[11px] text-stone-500 mt-1">
                  {currentSensor.rainfallMmPerHour > 0 ? (lang === 'fr' ? 'Pluie active' : 'Misy orana') : lang === 'fr' ? 'Temps sec' : 'Maina ny andro'}
                </Text>
              </View>
              <Text className="text-[10px] text-stone-500 font-medium">
                {currentSensor.rainfallMmPerHour > 0
                  ? lang === 'fr'
                    ? 'Vanne coupée auto'
                    : 'Naato ho azy ny rano'
                  : lang === 'fr'
                  ? 'Pas de pluie'
                  : 'Tsy misy orana'}
              </Text>
            </View>

            <View className="bg-white rounded-xl p-3 border border-stone-200/80 justify-between" style={{ width: '48%' }}>
              <View className="flex-row items-center justify-between">
                <Text className="text-stone-500 text-xs">Réseau & SMS</Text>
                <Radio className="w-4 h-4 text-purple-500" />
              </View>
              <View className="my-2">
                <Text className="text-xl font-bold text-stone-900">{currentSensor.signalStrength} 100%</Text>
                <View className="flex-row items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  <Text className="text-[11px] text-emerald-700 font-medium">SMS Actif</Text>
                </View>
              </View>
              <Text className="text-[10px] text-stone-500 font-medium">{t.smsNotice}</Text>
            </View>
          </View>

          {/* AI Recommendation */}
          <View className="bg-[#EBE7DC] rounded-xl p-3.5 border border-[#D7D3C6] flex-row items-start gap-3">
            <View className="p-2 rounded-lg bg-[#5B7553]">
              <Sparkles className="w-4 h-4 text-white" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                {lang === 'fr' ? 'Recommandation IA & Automatisation' : 'Toro-marika AI & Fandrindrana'}
              </Text>
              <Text className="text-xs text-stone-700 mt-0.5">
                {lang === 'fr' ? currentSensor.recommendedActionFr : currentSensor.recommendedActionMg}
              </Text>
            </View>
          </View>

          {/* Valve Controls */}
          <View className="pt-2 gap-2">
            <View className="flex-row items-center justify-between flex-wrap">
              <Text className="text-xs font-bold text-stone-900">
                {lang === 'fr' ? 'Contrôle à Distance de la Vanne Solaire' : "Fandrindrana ny Vanne amin'ny Finday"}
              </Text>
              <Text className="text-[11px] font-normal text-stone-500">Action immédiate par relais LoRa/SMS</Text>
            </View>

            <View className="flex-row flex-wrap gap-2">
              <Pressable
                onPress={() => handleToggleValve('auto')}
                disabled={isSimulatingAction !== null}
                className={`flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-xl border ${
                  currentSensor.valveStatus === 'auto' ? 'bg-[#5B7553] border-[#5B7553]' : 'bg-white border-stone-200'
                }`}
                style={{ width: '48%' }}
              >
                <Sparkles className={`w-4 h-4 ${currentSensor.valveStatus === 'auto' ? 'text-white' : 'text-stone-700'}`} />
                <Text className={`text-xs font-semibold ${currentSensor.valveStatus === 'auto' ? 'text-white' : 'text-stone-700'}`}>{t.valveAuto}</Text>
              </Pressable>

              <Pressable
                onPress={() => handleToggleValve('open')}
                disabled={isSimulatingAction !== null}
                className={`flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-xl border ${
                  currentSensor.valveStatus === 'open' ? 'bg-blue-600 border-blue-600' : 'bg-white border-stone-200'
                }`}
                style={{ width: '48%' }}
              >
                <Droplets className={`w-4 h-4 ${currentSensor.valveStatus === 'open' ? 'text-white' : 'text-stone-700'}`} />
                <Text className={`text-xs font-semibold ${currentSensor.valveStatus === 'open' ? 'text-white' : 'text-stone-700'}`}>
                  {lang === 'fr' ? 'Ouvrir Vanne' : 'Hanokatra Vanne'}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleToggleValve('closed')}
                disabled={isSimulatingAction !== null}
                className={`flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-xl border ${
                  currentSensor.valveStatus === 'closed' ? 'bg-stone-800 border-stone-800' : 'bg-white border-stone-200'
                }`}
                style={{ width: '48%' }}
              >
                <Power className={`w-4 h-4 ${currentSensor.valveStatus === 'closed' ? 'text-white' : 'text-stone-700'}`} />
                <Text className={`text-xs font-semibold ${currentSensor.valveStatus === 'closed' ? 'text-white' : 'text-stone-700'}`}>
                  {lang === 'fr' ? 'Fermer Vanne' : 'Hanidy Vanne'}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleTriggerWateringPulse}
                disabled={isSimulatingAction !== null}
                className="flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-600"
                style={{ width: '48%' }}
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <Text className="text-white text-xs font-semibold">{lang === 'fr' ? 'Arroser +15 min' : 'Handefa rano +15min'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
