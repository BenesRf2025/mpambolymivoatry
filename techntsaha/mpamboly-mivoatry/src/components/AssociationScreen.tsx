import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { CooperativeGroup } from '../types';
import { translations } from '../data/translations';
import { Users, Building2, Home, Scale, CheckCircle2, Send } from '../lib/icons';

interface AssociationScreenProps {
  cooperative: CooperativeGroup;
  onDistributeDividends: () => void;
  lang: 'fr' | 'mg';
}

export const AssociationScreen: React.FC<AssociationScreenProps> = ({ cooperative, onDistributeDividends, lang }) => {
  const t = translations[lang];
  const [selectedStructure, setSelectedStructure] = useState<'family' | 'neighborhood' | 'coop'>('coop');
  const [payoutSuccessToast, setPayoutSuccessToast] = useState<string | null>(null);

  const handleTriggerPayout = () => {
    onDistributeDividends();
    setPayoutSuccessToast(
      lang === 'fr'
        ? 'Versements MVola de 17 527 500 Ar transférés équitablement aux membres de la coopérative !'
        : "Voazara tamin'ny MVola tamin'ireo mpikambana rehetra ara-drariny ny vola 17 527 500 Ar !"
    );
    setTimeout(() => setPayoutSuccessToast(null), 5000);
  };

  return (
    <View style={{ gap: 16, paddingBottom: 40 }}>
      {/* Header Banner */}
      <View className="bg-[#173f3a] rounded-2xl p-4">
        <View className="flex-row items-center gap-3">
          <View className="p-2.5 rounded-xl bg-white/15">
            <Users className="w-6 h-6 text-teal-300" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-2 flex-wrap">
              <Text className="font-bold text-base leading-tight text-white">{cooperative.name}</Text>
              <Text className="text-[10px] px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-200 font-semibold">
                {cooperative.structureLabelFr}
              </Text>
            </View>
            <Text className="text-xs text-teal-100/85 leading-tight mt-0.5">{t.associationSubtitle}</Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2 mt-3 pt-3 border-t border-white/15">
          <View className="bg-white/10 rounded-xl p-2.5" style={{ width: '48%' }}>
            <Text className="text-[10px] text-teal-200 uppercase font-semibold">{t.totalCollectiveStock}</Text>
            <Text className="text-base font-black mt-0.5 text-white">{cooperative.collectiveStockTonnes} Tonnes</Text>
            <Text className="text-[10px] text-white/70">4 Récoltes mutualisées</Text>
          </View>

          <View className="bg-white/10 rounded-xl p-2.5" style={{ width: '48%' }}>
            <Text className="text-[10px] text-teal-200 uppercase font-semibold">{t.activeCoopMembers}</Text>
            <Text className="text-base font-black mt-0.5 text-white">{cooperative.totalMembers} Familles</Text>
            <Text className="text-[10px] text-white/70">{cooperative.totalHectares} Hectares</Text>
          </View>

          <View className="bg-white/10 rounded-xl p-2.5" style={{ width: '48%' }}>
            <Text className="text-[10px] text-teal-200 uppercase font-semibold">{t.activeNegotiations}</Text>
            <Text className="text-base font-black text-amber-300 mt-0.5">{cooperative.activeNegotiationsCount} Contrats</Text>
            <Text className="text-[10px] text-white/70">Grandes enseignes</Text>
          </View>

          <View className="bg-white/10 rounded-xl p-2.5" style={{ width: '48%' }}>
            <Text className="text-[10px] text-teal-200 uppercase font-semibold">Répartition</Text>
            <Text className="text-base font-black text-emerald-300 mt-0.5">95% / 5%</Text>
            <Text className="text-[10px] text-white/70">Transparence totale</Text>
          </View>
        </View>
      </View>

      {/* Payout Toast */}
      {payoutSuccessToast && (
        <View className="bg-teal-900 p-3 rounded-xl flex-row items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <Text className="text-teal-100 text-xs flex-1">{payoutSuccessToast}</Text>
        </View>
      )}

      {/* 3 Collective Archetypes */}
      <View className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E3DFD2] gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="font-bold text-stone-900 text-xs uppercase tracking-wider">
            {lang === 'fr' ? "Niveaux d'Organisation Collective" : "Ambaratongan'ny Fiaraha-miombona"}
          </Text>
          <Text className="text-[11px] text-stone-500">{lang === 'fr' ? 'Adapté à chaque taille' : 'Mifanaraka amin\'ny rehetra'}</Text>
        </View>

        <View className="gap-2.5">
          <Pressable
            onPress={() => setSelectedStructure('family')}
            className={`p-3 rounded-xl border ${selectedStructure === 'family' ? 'bg-teal-50/80 border-teal-400' : 'bg-white border-stone-200'}`}
          >
            <View className="flex-row items-center gap-2 mb-1">
              <View className="p-1.5 rounded-lg bg-teal-100">
                <Home className="w-4 h-4 text-teal-700" />
              </View>
              <Text className="font-bold text-xs text-stone-900">{lang === 'fr' ? 'Groupement Familial' : 'Fianakaviana Mpiombona'}</Text>
            </View>
            <Text className="text-[11px] text-stone-600">{t.groupFamily}</Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedStructure('neighborhood')}
            className={`p-3 rounded-xl border ${selectedStructure === 'neighborhood' ? 'bg-teal-50/80 border-teal-400' : 'bg-white border-stone-200'}`}
          >
            <View className="flex-row items-center gap-2 mb-1">
              <View className="p-1.5 rounded-lg bg-teal-100">
                <Users className="w-4 h-4 text-teal-700" />
              </View>
              <Text className="font-bold text-xs text-stone-900">{lang === 'fr' ? 'Association Fokontany' : 'Fikambanana Fokontany'}</Text>
            </View>
            <Text className="text-[11px] text-stone-600">{t.groupNeighborhood}</Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedStructure('coop')}
            className={`p-3 rounded-xl border ${selectedStructure === 'coop' ? 'bg-teal-50/80 border-teal-400' : 'bg-white border-stone-200'}`}
          >
            <View className="flex-row items-center gap-2 mb-1">
              <View className="p-1.5 rounded-lg bg-teal-100">
                <Building2 className="w-4 h-4 text-teal-700" />
              </View>
              <Text className="font-bold text-xs text-stone-900">{lang === 'fr' ? 'Coopérative Formelle' : 'Koperativa Ara-dalàna'}</Text>
            </View>
            <Text className="text-[11px] text-stone-600">{t.groupCoop}</Text>
          </Pressable>
        </View>
      </View>

      {/* Stock Mutualisé */}
      <View className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E3DFD2] gap-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="font-bold text-stone-900 text-sm">{t.mutualizedStockTitle}</Text>
            <Text className="text-xs text-stone-500">{t.mutualizedStockSubtitle}</Text>
          </View>
          <Text className="text-xs font-black text-teal-800 bg-teal-100 px-2.5 py-1 rounded-lg">
            {cooperative.collectiveStockTonnes} Tonnes
          </Text>
        </View>

        <View className="gap-3">
          {cooperative.mutualizedStock.map((stk) => (
            <View key={stk.id} className="bg-white rounded-xl p-3.5 border border-stone-200/80 gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-xs text-stone-900">{lang === 'fr' ? stk.cropName : stk.malagasyName}</Text>
                <Text className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Grade {stk.qualityGrade}</Text>
              </View>

              <View className="flex-row items-baseline justify-between">
                <Text className="text-xl font-black text-teal-900">
                  {stk.totalVolumeTonnes} <Text className="text-xs font-normal">Tonnes</Text>
                </Text>
                <Text className="text-xs font-bold text-stone-700">{stk.targetWholesalePrice.toLocaleString('fr-FR')} Ar / kg</Text>
              </View>

              <View className="w-full bg-stone-100 h-2 rounded-full overflow-hidden flex-row">
                <View className="bg-teal-600 h-full" style={{ width: `${(stk.reservedVolumeTonnes / stk.totalVolumeTonnes) * 100}%` }} />
                <View className="bg-emerald-400 h-full" style={{ width: `${(stk.availableVolumeTonnes / stk.totalVolumeTonnes) * 100}%` }} />
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-[10px] text-stone-500">
                  {stk.reservedVolumeTonnes}T réservées ({stk.buyerInNegotiation})
                </Text>
                <Text className="text-[10px] text-stone-500">{stk.availableVolumeTonnes}T dispo</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Répartition Équitable */}
      <View className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E3DFD2] gap-4">
        <View className="pb-3 border-b border-stone-200 gap-2">
          <View className="flex-row items-center gap-2">
            <Scale className="w-4 h-4 text-teal-600" />
            <Text className="font-bold text-stone-900 text-sm">{t.fairShareTitle}</Text>
          </View>
          <Text className="text-xs text-stone-500">{t.fairShareSubtitle}</Text>

          <Pressable onPress={handleTriggerPayout} className="flex-row items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-800 self-start">
            <Send className="w-3.5 h-3.5 text-white" />
            <Text className="text-white text-xs font-bold">{lang === 'fr' ? 'Déclencher Versements MVola' : 'Handefa ny Anjara Vola'}</Text>
          </Pressable>
        </View>

        <View className="gap-2">
          {cooperative.members.map((mem) => (
            <View key={mem.id} className="bg-white rounded-xl p-3 border border-stone-200/80 gap-2">
              <View className="flex-row items-center gap-2.5">
                <View className="w-8 h-8 rounded-full bg-teal-100 items-center justify-center">
                  <Text className="text-teal-800 font-black text-xs">{mem.name.charAt(0)}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-stone-900 text-xs">{mem.name}</Text>
                  <Text className="text-[11px] text-stone-500">
                    {mem.roleInCoop} · Fokontany {mem.fokontany}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-bold text-stone-900 text-xs">{mem.contributedKgThisMonth} kg</Text>
                  <Text className="text-[10px] text-stone-500">{t.contributedKg}</Text>
                </View>

                <View className="items-end">
                  <Text className="font-black text-teal-800 text-xs">{mem.allocatedRevenueAr.toLocaleString('fr-FR')} Ar</Text>
                  <Text className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                    {mem.paymentStatus === 'paid_mvola' ? 'MVola Versé' : 'En attente'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
