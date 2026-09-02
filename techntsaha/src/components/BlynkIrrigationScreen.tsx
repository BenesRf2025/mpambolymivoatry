import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { translations } from '../data/translations';
import { Droplets, Sun, Thermometer, Power, Radio, CheckCircle2, MessageSquare } from '../lib/icons';
import { useBlynkIrrigation } from '../hooks/useBlynkIrrigation';

export const BlynkIrrigationScreen: React.FC<{ lang: 'fr' | 'mg'; authToken: string }> = ({ lang, authToken }) => {
  const t = translations[lang];
  const {
    selectedSensor,
    connectionStatus,
    isActionInProgress,
    handleToggleValve,
    handleTriggerWateringPulse,
    refresh,
  } = useBlynkIrrigation({
    authToken,
    lang,
    onAlert: (message) => {
      console.log('Blynk alert', message);
    },
  });

  const [localSmsToast, setLocalSmsToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setLocalSmsToast(message);
    setTimeout(() => setLocalSmsToast(null), 5000);
  };

  const onToggleValve = async (mode: 'open' | 'closed' | 'auto') => {
    await handleToggleValve(mode);
    showToast(lang === 'fr'
      ? `Vanne passée en mode ${mode.toUpperCase()}`
      : `Novana ho ${mode.toUpperCase()} ny vanne`);
  };

  const onTriggerPulse = async () => {
    await handleTriggerWateringPulse();
  };

  const sensor = selectedSensor;

  return (
    <View style={{ gap: 16, paddingBottom: 40 }}>
      {/* Connection Status Banner */}
      <View className={`rounded-2xl p-4 ${connectionStatus === 'connected' ? 'bg-[#3c4f37]' : 'bg-red-900'}`}>
        <View className="flex-row items-center justify-between gap-2">
          <View className="flex-row items-center gap-2">
            <Radio className={`w-5 h-5 ${connectionStatus === 'connected' ? 'text-emerald-300' : 'text-red-300'}`} />
            <View>
              <Text className="font-bold text-base leading-tight text-white">
                {connectionStatus === 'connected' ? (lang === 'fr' ? 'Connecté à Blynk' : 'Mifandray amin\'Blynk') : (lang === 'fr' ? 'Déconnecté' : 'Tsy mifandray')}
              </Text>
              <Text className="text-xs text-white/80">
                {connectionStatus === 'connected' ? 'Cloud Blynk actif' : 'Vérifiez le token et le WiFi'}
              </Text>
            </View>
          </View>
          <Pressable onPress={refresh} className="bg-white/20 rounded-xl px-3 py-2">
            <Text className="text-white text-xs font-semibold">{lang === 'fr' ? 'Reconnexion' : 'Hamerina'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Toast */}
      {localSmsToast && (
        <Pressable className="bg-stone-900 p-3 rounded-xl flex-row items-start gap-2.5">
          <MessageSquare className="w-4 h-4 mt-0.5 text-amber-400" />
          <View className="flex-1">
            <Text className="font-bold text-stone-200 text-xs">
              {lang === 'fr' ? 'Commande Blynk' : 'Baiko Blynk'}
            </Text>
            <Text className="text-amber-200 mt-0.5 text-[11px]">{localSmsToast}</Text>
          </View>
        </Pressable>
      )}

      {/* Active Sensor Card */}
      {sensor && (
        <View className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E3DFD2] gap-4">
          <View className="pb-3 border-b border-stone-200/80 gap-2">
            <View className="flex-row items-center gap-2 flex-wrap">
              <Text className="font-bold text-stone-900 text-base">{sensor.name}</Text>
              <Text className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${connectionStatus === 'connected' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                {connectionStatus === 'connected' ? 'En ligne' : 'Hors ligne'}
              </Text>
            </View>
            <Text className="text-xs text-stone-500">
              {sensor.plotName} · {lang === 'fr' ? 'Dernière synchro :' : 'Fandrindrana farany :'} {sensor.lastTransmission}
            </Text>

            <View className="flex-row items-center gap-2">
              <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <Text className="text-stone-700 text-xs font-medium">{sensor.batteryLevel}% Solaire</Text>
              </View>
              <View className={`flex-row items-center gap-1 px-2.5 py-1 rounded-lg ${
                sensor.valveStatus === 'open' ? 'bg-blue-100' : sensor.valveStatus === 'auto' ? 'bg-emerald-100' : 'bg-stone-200'
              }`}>
                <Power className="w-3 h-3 text-stone-700" />
                <Text className="text-xs font-semibold text-stone-700">
                  {sensor.valveStatus === 'auto' ? t.valveAuto : sensor.valveStatus === 'open' ? t.valveOpen : t.valveClosed}
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
                <Text className="text-2xl font-black text-stone-900">{sensor.soilMoisture}%</Text>
                <View className="w-full bg-stone-100 h-2 rounded-full mt-1.5 overflow-hidden">
                  <View
                    className={`h-full rounded-full ${
                      sensor.soilMoisture < 45 ? 'bg-amber-500' : sensor.soilMoisture > 80 ? 'bg-blue-600' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${sensor.soilMoisture}%` }}
                  />
                </View>
              </View>
              <Text className="text-[10px] text-stone-500 font-medium">
                {sensor.soilMoisture < 45
                  ? lang === 'fr'
                    ? '⚠️ Sol trop sec'
                    : '⚠️ Maina loatra ny tany'
                  : sensor.soilMoisture > 75
                  ? lang === 'fr'
                    ? '💧 Parfait pour SRI'
                    : '💧 Mety tsara ho an\'ny SRI'
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
                <Text className="text-2xl font-black text-stone-900">{sensor.soilTemperature}°C</Text>
                <Text className="text-[11px] text-stone-500 mt-1">
                  {lang === 'fr' ? 'Air ambiant :' : 'Toetran-drivotra :'} {sensor.airHumidity}%
                </Text>
              </View>
              <Text className="text-[10px] text-emerald-700 font-medium">
                {lang === 'fr' ? 'Température idéale' : 'Hafanana mampahazo aina'}
              </Text>
            </View>

            <View className="bg-white rounded-xl p-3 border border-stone-200/80 justify-between" style={{ width: '48%' }}>
              <View className="flex-row items-center justify-between">
                <Text className="text-stone-500 text-xs">{t.sensorRain}</Text>
                <View className="w-4 h-4 rounded-full bg-indigo-500" />
              </View>
              <View className="my-2">
                <Text className="text-2xl font-black text-stone-900">
                  {sensor.rainfallMmPerHour} <Text className="text-xs font-normal">mm/h</Text>
                </Text>
                <Text className="text-[11px] text-stone-500 mt-1">
                  {sensor.rainfallMmPerHour > 0 ? (lang === 'fr' ? 'Pluie active' : 'Misy orana') : lang === 'fr' ? 'Temps sec' : 'Maina ny andro'}
                </Text>
              </View>
              <Text className="text-[10px] text-stone-500 font-medium">
                {sensor.rainfallMmPerHour > 0
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
                <Text className="text-xl font-bold text-stone-900">{sensor.signalStrength}</Text>
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
              <Sun className="w-4 h-4 text-white" />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                {lang === 'fr' ? 'Recommandation' : 'Toro-marika'}
              </Text>
              <Text className="text-xs text-stone-700 mt-0.5">
                {lang === 'fr' ? sensor.recommendedActionFr : sensor.recommendedActionMg}
              </Text>
            </View>
          </View>

          {/* Valve Controls */}
          <View className="pt-2 gap-2">
            <View className="flex-row items-center justify-between flex-wrap">
              <Text className="text-xs font-bold text-stone-900">
                {lang === 'fr' ? 'Contrôle à Distance de la Vanne Solaire' : "Fandrindrana ny Vanne amin'ny Finday"}
              </Text>
              <Text className="text-[11px] font-normal text-stone-500">
                {lang === 'fr' ? 'Via Blynk Cloud' : 'Aminy Blynk Cloud'}
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-2">
              <Pressable
                onPress={() => onToggleValve('auto')}
                disabled={isActionInProgress !== null}
                className={`flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-xl border ${
                  sensor.valveStatus === 'auto' ? 'bg-[#5B7553] border-[#5B7553]' : 'bg-white border-stone-200'
                }`}
                style={{ width: '48%' }}
              >
                <Sun className={`w-4 h-4 ${sensor.valveStatus === 'auto' ? 'text-white' : 'text-stone-700'}`} />
                <Text className={`text-xs font-semibold ${sensor.valveStatus === 'auto' ? 'text-white' : 'text-stone-700'}`}>{t.valveAuto}</Text>
              </Pressable>

              <Pressable
                onPress={() => onToggleValve('open')}
                disabled={isActionInProgress !== null}
                className={`flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-xl border ${
                  sensor.valveStatus === 'open' ? 'bg-blue-600 border-blue-600' : 'bg-white border-stone-200'
                }`}
                style={{ width: '48%' }}
              >
                <Droplets className={`w-4 h-4 ${sensor.valveStatus === 'open' ? 'text-white' : 'text-stone-700'}`} />
                <Text className={`text-xs font-semibold ${sensor.valveStatus === 'open' ? 'text-white' : 'text-stone-700'}`}>
                  {lang === 'fr' ? 'Ouvrir Vanne' : 'Hanokatra Vanne'}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => onToggleValve('closed')}
                disabled={isActionInProgress !== null}
                className={`flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-xl border ${
                  sensor.valveStatus === 'closed' ? 'bg-stone-800 border-stone-800' : 'bg-white border-stone-200'
                }`}
                style={{ width: '48%' }}
              >
                <Power className={`w-4 h-4 ${sensor.valveStatus === 'closed' ? 'text-white' : 'text-stone-700'}`} />
                <Text className={`text-xs font-semibold ${sensor.valveStatus === 'closed' ? 'text-white' : 'text-stone-700'}`}>
                  {lang === 'fr' ? 'Fermer Vanne' : 'Hanidy Vanne'}
                </Text>
              </Pressable>

              <Pressable
                onPress={onTriggerPulse}
                disabled={isActionInProgress !== null}
                className="flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-600"
                style={{ width: '48%' }}
              >
                <Power className="w-3.5 h-3.5 text-white" />
                <Text className="text-white text-xs font-semibold">{lang === 'fr' ? 'Arroser +15 min' : 'Handefa rano +15min'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
