import React, { useState } from 'react';
import { View, Text, Pressable, Modal, ActivityIndicator } from 'react-native';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  X,
  Activity,
  Database,
} from '../lib/icons';
import { Language } from '../types';
import { translations } from '../data/translations';

interface OfflineIndicatorProps {
  language: Language;
  variant?: 'badge' | 'status-bar' | 'compact';
  onSyncTriggered?: () => void;
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  language,
  variant = 'badge',
  onSyncTriggered,
  className = '',
}) => {
  const t = translations[language];

  // Sur mobile, l'app est conçue pour fonctionner 100% hors-ligne (données
  // persistées en local via AsyncStorage). On ne branche pas de détection
  // réseau réelle par défaut : ce bouton simule/déclenche une synchronisation.
  // Pour une vraie détection, ajoutez @react-native-community/netinfo.
  const [simulatedOffline, setSimulatedOffline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [isTestingPing, setIsTestingPing] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  const effectiveOnline = !simulatedOffline;

  const handleTestConnection = async () => {
    if (!effectiveOnline) {
      setPingLatency(null);
      return;
    }
    setIsTestingPing(true);
    const start = Date.now();
    try {
      const res = await fetch('https://clients3.google.com/generate_204');
      if (res.ok || res.status === 204) {
        setPingLatency(Date.now() - start);
        setLastSyncTime(new Date());
      } else {
        setPingLatency(null);
      }
    } catch {
      setPingLatency(null);
    } finally {
      setIsTestingPing(false);
    }
  };

  const handleManualSync = () => {
    if (!effectiveOnline) return;
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date());
      if (onSyncTriggered) onSyncTriggered();
    }, 1200);
  };

  const toggleSimulation = () => {
    const next = !simulatedOffline;
    setSimulatedOffline(next);
    if (!next) {
      setIsSyncing(true);
      setTimeout(() => {
        setIsSyncing(false);
        setLastSyncTime(new Date());
        if (onSyncTriggered) onSyncTriggered();
      }, 1000);
    }
  };

  const DetailModal = (
    <Modal
      visible={isDetailModalOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setIsDetailModalOpen(false)}
    >
      <Pressable
        className="flex-1 items-center justify-center p-4 bg-black/60"
        onPress={() => setIsDetailModalOpen(false)}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-brand-cream w-full max-w-sm rounded-3xl border-2 border-brand-beige shadow-2xl overflow-hidden p-5"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center pb-3 border-b border-brand-beige">
            <View className="flex-row items-center gap-2">
              <View
                className={`w-8 h-8 rounded-xl items-center justify-center ${
                  effectiveOnline ? 'bg-emerald-100' : 'bg-amber-100'
                }`}
              >
                {effectiveOnline ? (
                  <Wifi className="w-4 h-4 text-emerald-800" />
                ) : (
                  <WifiOff className="w-4 h-4 text-amber-800" />
                )}
              </View>
              <View>
                <Text className="text-sm font-bold text-brand-brown">{t.networkStatus}</Text>
                <Text className="text-[10px] text-brand-brownLight font-medium">
                  {effectiveOnline ? t.onlineNotice : t.offlineNotice}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => setIsDetailModalOpen(false)}
              className="w-7 h-7 rounded-full bg-brand-beige items-center justify-center"
            >
              <X className="w-4 h-4 text-brand-brown" />
            </Pressable>
          </View>

          {/* Status Box */}
          <View
            className={`p-4 rounded-2xl border mt-3 ${
              effectiveOnline
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-amber-50 border-amber-300'
            }`}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                <View
                  className={`w-2.5 h-2.5 rounded-full ${
                    effectiveOnline ? 'bg-emerald-500' : 'bg-amber-600'
                  }`}
                />
                <Text
                  className={`text-xs font-bold uppercase tracking-wider ${
                    effectiveOnline ? 'text-emerald-950' : 'text-amber-950'
                  }`}
                >
                  {effectiveOnline ? t.online : t.offline}
                </Text>
              </View>
              <Text
                className={`text-[10px] font-semibold opacity-75 ${
                  effectiveOnline ? 'text-emerald-950' : 'text-amber-950'
                }`}
              >
                {effectiveOnline ? t.syncActive : t.syncPending}
              </Text>
            </View>
            <Text
              className={`text-xs leading-relaxed opacity-90 mt-2 ${
                effectiveOnline ? 'text-emerald-950' : 'text-amber-950'
              }`}
            >
              {effectiveOnline ? t.onlineNotice : t.offlineNotice}
            </Text>
          </View>

          {/* Local Storage Info */}
          <View className="bg-white p-3 rounded-2xl border border-brand-beige mt-3">
            <View className="flex-row items-center gap-2">
              <Database className="w-4 h-4 text-brand-green" />
              <Text className="text-xs font-bold text-brand-green">{t.localDataProtected}</Text>
            </View>
            <Text className="text-[11px] text-brand-brownLight leading-relaxed mt-1.5">
              {language === 'mg'
                ? "Ny fampiharana Mpamboly dia miasa tanteraka na tsy misy tambajotra aza. Voatahiry ao amin'ny finday ny voly, ny kaonty ary ny tolotra rehetra."
                : "L'application fonctionne à 100% hors connexion. Toutes vos parcelles, calculs et opérations sont conservés sur votre appareil."}
            </Text>
            <View className="pt-2 mt-2 border-t border-brand-beige flex-row justify-between items-center">
              <Text className="text-[10px] text-brand-brown">Dernière vérification :</Text>
              <Text className="text-[10px] text-brand-green font-bold">
                {lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </Text>
            </View>
            {pingLatency !== null && (
              <View className="flex-row justify-between items-center mt-1">
                <Text className="text-[10px] text-brand-brown">Latence serveur :</Text>
                <Text className="text-[10px] text-emerald-700 font-bold">{pingLatency} ms (Excellent)</Text>
              </View>
            )}
          </View>

          {/* Actions */}
          <View className="mt-3 gap-2">
            {effectiveOnline && (
              <View className="flex-row gap-2">
                <Pressable
                  onPress={handleTestConnection}
                  disabled={isTestingPing}
                  className="flex-1 bg-brand-beige py-2.5 rounded-xl flex-row items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isTestingPing ? (
                    <ActivityIndicator size="small" color="#2D5A27" />
                  ) : (
                    <Activity className="w-3.5 h-3.5 text-brand-brown" />
                  )}
                  <Text className="text-xs font-bold text-brand-brown">
                    {isTestingPing ? 'Test...' : t.testConnection}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleManualSync}
                  disabled={isSyncing}
                  className="flex-1 bg-brand-green py-2.5 rounded-xl flex-row items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSyncing ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 text-white" />
                  )}
                  <Text className="text-xs font-bold text-white">
                    {isSyncing ? (t as any).syncing : 'Synchroniser'}
                  </Text>
                </Pressable>
              </View>
            )}

            <Pressable
              onPress={toggleSimulation}
              className={`w-full py-2.5 rounded-xl border flex-row items-center justify-center gap-2 ${
                simulatedOffline
                  ? 'bg-emerald-600 border-emerald-700'
                  : 'bg-white border-brand-beige'
              }`}
            >
              {simulatedOffline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-white" />
                  <Text className="text-xs font-bold text-white">{t.simulateOnline}</Text>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                  <Text className="text-xs font-bold text-[#8B5E3C]">{t.simulateOffline}</Text>
                </>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );

  if (variant === 'status-bar') {
    return (
      <>
        <Pressable
          onPress={() => setIsDetailModalOpen(true)}
          className={`flex-row items-center gap-1 px-1.5 py-0.5 rounded-md ${
            effectiveOnline ? 'bg-emerald-500/10' : 'bg-amber-500/20'
          } ${className}`}
        >
          {isSyncing ? (
            <RefreshCw className="w-3 h-3 text-brand-green" />
          ) : effectiveOnline ? (
            <Wifi className="w-3 h-3 text-emerald-700" />
          ) : (
            <WifiOff className="w-3 h-3 text-amber-700" />
          )}
          <Text
            className={`text-[9px] font-extrabold uppercase tracking-tight ${
              effectiveOnline ? 'text-emerald-800' : 'text-amber-900'
            }`}
          >
            {isSyncing ? 'Sync...' : effectiveOnline ? 'Online' : 'Offline'}
          </Text>
          <View className={`w-1.5 h-1.5 rounded-full ${effectiveOnline ? 'bg-emerald-500' : 'bg-amber-600'}`} />
        </Pressable>
        {DetailModal}
      </>
    );
  }

  return (
    <>
      <Pressable
        onPress={() => setIsDetailModalOpen(true)}
        className={`flex-row items-center gap-1.5 px-2.5 py-1.5 rounded-xl border ${
          effectiveOnline
            ? 'bg-emerald-50/80 border-emerald-300/80'
            : 'bg-amber-50 border-amber-300'
        } ${className}`}
      >
        <View className="relative items-center justify-center">
          {isSyncing ? (
            <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
          ) : effectiveOnline ? (
            <Wifi className="w-3.5 h-3.5 text-emerald-700" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-amber-800" />
          )}
        </View>

                <Text className={`text-xs font-bold ${effectiveOnline ? 'text-emerald-800' : 'text-amber-900'}`}>
          {isSyncing ? (t as any).syncing : effectiveOnline ? t.online : t.offline}
        </Text>

        <View className={`w-2 h-2 rounded-full ${effectiveOnline ? 'bg-emerald-500' : 'bg-amber-600'}`} />
      </Pressable>
      {DetailModal}
    </>
  );
};
