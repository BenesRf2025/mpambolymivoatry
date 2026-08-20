import React, { useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { X, Calendar, MapPin, Layers, Droplet, CheckCircle2, TrendingUp, Sparkles, Volume2 } from '../lib/icons';
import { Crop, Language } from '../types';
import { translations } from '../data/translations';
import { playTextSpeech } from '../services/geminiService';

interface CropDetailModalProps {
  crop: Crop | null;
  onClose: () => void;
  language: Language;
  onUpdateCropStage?: (cropId: string, newStage: Crop['stage']) => void;
}

export const CropDetailModal: React.FC<CropDetailModalProps> = ({ crop, onClose, language, onUpdateCropStage }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const t = translations[language];

  if (!crop) return null;

  const handleAudio = () => {
    const text =
      language === 'mg'
        ? `${crop.malagasyName}. Dingana: ${crop.stage}. Toro-hevitra: ${crop.nextActionMg}. Fahasalamana: ${crop.healthScore} isan-jato.`
        : `${crop.name}. Stade: ${crop.stage}. Prochaine action: ${crop.nextActionFr}. Score de santé: ${crop.healthScore} pourcent. Récolte estimée dans ${crop.daysToHarvest} jours.`;

    setIsPlayingAudio(true);
    playTextSpeech(text, language);
    setTimeout(() => setIsPlayingAudio(false), 5000);
  };

  const stages: Array<{ id: Crop['stage']; labelFr: string; labelMg: string }> = [
    { id: 'semis', labelFr: 'Semis & Pépinière', labelMg: 'Tanin-ketsa' },
    { id: 'croissance', labelFr: 'Croissance / Tallage', labelMg: 'Faniriana & Zanaka' },
    { id: 'floraison', labelFr: 'Floraison / Épiaison', labelMg: 'Voniny & Salohy' },
    { id: 'maturation', labelFr: 'Maturation', labelMg: 'Fahamasahana' },
    { id: 'recolte', labelFr: 'Récolte', labelMg: 'Fiotazana' },
  ];

  const currentStageIndex = stages.findIndex((s) => s.id === crop.stage);

  return (
    <Modal visible={!!crop} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center p-4 bg-black/60">
        <View className="bg-brand-cream w-full rounded-3xl border-2 border-brand-beige overflow-hidden" style={{ maxWidth: 480, maxHeight: '90%' }}>
          {/* Header */}
          <View className="bg-brand-green p-5 relative">
            <Pressable onPress={onClose} className="absolute top-4 right-4 w-9 h-9 bg-white/20 rounded-full items-center justify-center z-10">
              <X className="w-5 h-5 text-white" />
            </Pressable>

            <View className="flex-row items-center gap-3 mb-2 pr-10">
              <View className="p-2 bg-white/15 rounded-2xl">
                <Text className="text-3xl">{crop.icon}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-semibold text-brand-beige uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded-full self-start">
                  {crop.variety}
                </Text>
                <Text className="text-xl font-bold mt-1 text-white leading-tight">
                  {language === 'mg' ? crop.malagasyName : crop.name}
                </Text>
                <View className="flex-row items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-beige/80" />
                  <Text className="text-xs text-brand-beige/80">
                    {crop.plotName} • {crop.region}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-white/15">
              <View>
                <Text className="text-brand-beige text-xs">{t.harvestIn}</Text>
                <Text className="text-base font-bold text-[#FFD700]">
                  {crop.daysToHarvest} {t.days}
                </Text>
              </View>
              <Pressable onPress={handleAudio} className="flex-row items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
                <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'text-[#FFD700]' : 'text-white'}`} />
                <Text className="text-white text-xs font-medium">{isPlayingAudio ? 'Lecture...' : 'Écouter'}</Text>
              </Pressable>
            </View>
          </View>

          {/* Content Body */}
          <ScrollView className="p-5" contentContainerStyle={{ gap: 16, padding: 20 }}>
            {/* Key Metrics */}
            <View className="flex-row gap-3">
              <View className="flex-1 bg-white p-3 rounded-2xl border border-brand-beige items-center">
                <Text className="text-[10px] uppercase font-bold text-brand-brownLight">{t.health}</Text>
                <View className="flex-row items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-green" />
                  <Text className="text-lg font-bold text-brand-green">{crop.healthScore}%</Text>
                </View>
                <Text className="text-[10px] text-brand-brownLight">{crop.healthScore > 85 ? 'Excellente' : 'Surveillance'}</Text>
              </View>

              <View className="flex-1 bg-white p-3 rounded-2xl border border-brand-beige items-center">
                <Text className="text-[10px] uppercase font-bold text-brand-brownLight">{t.soilMoisture}</Text>
                <View className="flex-row items-center gap-1 mt-0.5">
                  <Droplet className="w-4 h-4 text-[#8B5E3C]" />
                  <Text className="text-lg font-bold text-[#8B5E3C]">{crop.soilMoisture}%</Text>
                </View>
                <Text className="text-[10px] text-brand-brownLight">Sol équilibré</Text>
              </View>

              <View className="flex-1 bg-white p-3 rounded-2xl border border-brand-beige items-center">
                <Text className="text-[10px] uppercase font-bold text-brand-brownLight">Superficie</Text>
                <Text className="text-lg font-bold text-brand-brown mt-0.5">
                  {crop.surfaceArea} {crop.surfaceUnit}
                </Text>
                <Text className="text-[10px] text-brand-brownLight">~{crop.harvestYieldKg ? `${crop.harvestYieldKg} kg` : 'N/A'}</Text>
              </View>
            </View>

            {/* Action Recommandée */}
            <View className="bg-[#F2F8F1] border-l-4 border-brand-green p-4 rounded-r-2xl">
              <View className="flex-row items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-brand-green mt-0.5" />
                <View className="flex-1">
                  <Text className="text-xs font-bold text-brand-green uppercase tracking-wide">
                    {language === 'mg' ? 'Asa maika tokony hatao' : 'Action Recommandée'}
                  </Text>
                  <Text className="text-sm font-semibold text-brand-brown mt-1 leading-snug">
                    {language === 'mg' ? crop.nextActionMg : crop.nextActionFr}
                  </Text>
                </View>
              </View>
            </View>

            {/* Timeline Stages */}
            <View className="bg-white p-4 rounded-2xl border border-brand-beige">
              <View className="flex-row items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-brand-green" />
                <Text className="text-xs font-bold text-brand-brown uppercase tracking-wider">
                  {language === 'mg' ? "Fivoaran'ny dingam-pambolena" : 'Cycle de Développement'}
                </Text>
              </View>

              <View className="gap-2.5">
                {stages.map((stage, idx) => {
                  const isPassed = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;

                  return (
                    <View
                      key={stage.id}
                      className={`flex-row items-center justify-between p-2.5 rounded-xl ${
                        isCurrent ? 'bg-brand-green' : isPassed ? 'bg-[#F2F8F1]' : 'bg-brand-cream opacity-70'
                      }`}
                    >
                      <View className="flex-row items-center gap-2.5 flex-1">
                        <View
                          className={`w-5 h-5 rounded-full items-center justify-center ${
                            isCurrent ? 'bg-white' : isPassed ? 'bg-brand-green' : 'bg-brand-beige'
                          }`}
                        >
                          <Text className={`text-[10px] font-bold ${isCurrent ? 'text-brand-green' : isPassed ? 'text-white' : 'text-brand-brownLight'}`}>
                            {isPassed ? '✓' : idx + 1}
                          </Text>
                        </View>
                        <Text className={`text-xs ${isCurrent ? 'text-white font-bold' : isPassed ? 'text-brand-green font-medium' : 'text-brand-brownLight'}`}>
                          {language === 'mg' ? stage.labelMg : stage.labelFr}
                        </Text>
                      </View>

                      {isCurrent && (
                        <Text className="text-[10px] bg-[#FFD700] text-brand-green px-2 py-0.5 rounded-full uppercase font-bold">En cours</Text>
                      )}

                      {!isCurrent && onUpdateCropStage && (
                        <Pressable onPress={() => onUpdateCropStage(crop.id, stage.id)}>
                          <Text className="text-[10px] underline text-brand-brownLight">Changer</Text>
                        </Pressable>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Dates */}
            <View className="flex-row gap-3 bg-white p-3 rounded-2xl border border-brand-beige">
              <View className="flex-row items-center gap-2 flex-1">
                <Calendar className="w-4 h-4 text-brand-brownLight" />
                <View>
                  <Text className="text-brand-brownLight text-[10px]">Date de semis</Text>
                  <Text className="font-semibold text-brand-brown text-xs">{crop.plantingDate}</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2 flex-1">
                <TrendingUp className="w-4 h-4 text-brand-green" />
                <View>
                  <Text className="text-brand-brownLight text-[10px]">Date récolte prévue</Text>
                  <Text className="font-semibold text-brand-green text-xs">{crop.expectedHarvestDate}</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="p-4 bg-white border-t border-brand-beige items-end">
            <Pressable onPress={onClose} className="px-5 py-2.5 bg-brand-green rounded-xl">
              <Text className="text-white text-xs font-bold">Fermer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
