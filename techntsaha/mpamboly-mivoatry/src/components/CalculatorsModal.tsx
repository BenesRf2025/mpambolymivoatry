import React, { useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView, TextInput } from 'react-native';
import { X, Calculator, Sprout, Sparkles } from '../lib/icons';
import { Language } from '../types';
import { translations } from '../data/translations';
import { SelectField } from './ui/SelectField';

interface CalculatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const spacingOptions = [
  { value: '20', label: '20 x 20 cm (250 000 trous/ha)' },
  { value: '25', label: '25 x 25 cm standard (160 000 trous/ha)' },
  { value: '30', label: '30 x 30 cm sol riche (111 000 trous/ha)' },
];

const dungOptions = [
  { value: 'zebu', label: 'Fumier de Zébu (Zezi-pahitra)' },
  { value: 'volaille', label: 'Fientes de volaille (Taim-borona)' },
  { value: 'porc', label: 'Lisier de porc (Dikim-kisoa)' },
];

export const CalculatorsModal: React.FC<CalculatorsModalProps> = ({ isOpen, onClose, language }) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'sri' | 'compost'>('sri');

  const [sriSurface, setSriSurface] = useState('1');
  const [sriSpacing, setSriSpacing] = useState('25');

  const [targetCompostTonnes, setTargetCompostTonnes] = useState('2');
  const [dungType, setDungType] = useState<'zebu' | 'volaille' | 'porc'>('zebu');

  const surfaceHa = parseFloat(sriSurface) || 1;
  const spacingMeters = (parseFloat(sriSpacing) || 25) / 100;
  const hillsPerHa = Math.round(10000 / (spacingMeters * spacingMeters));
  const totalHills = Math.round(hillsPerHa * surfaceHa);
  const sriSeedKgNeeded = Math.round((surfaceHa * 7 * 10) / 10);
  const conventionalSeedKg = surfaceHa * 80;
  const seedSavingsKg = conventionalSeedKg - sriSeedKgNeeded;
  const estimatedYieldTonnes = (surfaceHa * 5.5).toFixed(1);

  const targetTonnes = parseFloat(targetCompostTonnes) || 2;
  const dryBrownKg = Math.round(targetTonnes * 400);
  const greenWasteKg = Math.round(targetTonnes * 350);
  const manureKg = Math.round(targetTonnes * 250);
  const waterLiters = Math.round(targetTonnes * 300);

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center p-4 bg-black/60">
        <View className="bg-brand-cream w-full rounded-3xl border-2 border-brand-beige overflow-hidden" style={{ maxWidth: 480, maxHeight: '90%' }}>
          {/* Header */}
          <View className="bg-brand-green p-5 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5 flex-1">
              <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
                <Calculator className="w-4 h-4 text-white" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-white">{t.calculatorsTitle}</Text>
                <Text className="text-xs text-brand-beige/80">
                  {language === 'mg' ? "Fikajiana voa SRI sy Zezi-pahitra" : 'Outils de calculs agronomiques de précision'}
                </Text>
              </View>
            </View>
            <Pressable onPress={onClose} className="w-8 h-8 rounded-full bg-white/10 items-center justify-center">
              <X className="w-4 h-4 text-white" />
            </Pressable>
          </View>

          {/* Tabs */}
          <View className="flex-row border-b border-brand-beige bg-white px-4 pt-3 gap-2">
            <Pressable
              onPress={() => setActiveTab('sri')}
              className={`pb-3 px-2 flex-row items-center gap-1.5 border-b-2 ${activeTab === 'sri' ? 'border-brand-green' : 'border-transparent'}`}
            >
              <Sprout className={`w-4 h-4 ${activeTab === 'sri' ? 'text-brand-green' : 'text-brand-brownLight'}`} />
              <Text className={`text-xs font-bold ${activeTab === 'sri' ? 'text-brand-green' : 'text-brand-brownLight'}`}>
                {language === 'mg' ? 'Fikajiana SRI' : 'Riziculture (SRI)'}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('compost')}
              className={`pb-3 px-2 flex-row items-center gap-1.5 border-b-2 ${activeTab === 'compost' ? 'border-brand-green' : 'border-transparent'}`}
            >
              <Sparkles className={`w-4 h-4 ${activeTab === 'compost' ? 'text-brand-green' : 'text-brand-brownLight'}`} />
              <Text className={`text-xs font-bold ${activeTab === 'compost' ? 'text-brand-green' : 'text-brand-brownLight'}`}>
                {language === 'mg' ? 'Fikajiana Kompôsta' : 'Compost Bio'}
              </Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
            {activeTab === 'sri' ? (
              <>
                <View className="bg-[#F2F8F1] p-3.5 rounded-2xl border border-brand-green/20">
                  <Text className="text-xs text-brand-green leading-relaxed">
                    <Text className="font-bold">{language === 'mg' ? "Tombony amin'ny SRI :" : 'Principe du SRI : '}</Text>
                    {language === 'mg'
                      ? "Ketsa tanora 8-12 andro, tokana isaky ny lavaka, elanelana 25cm. Mitsitsy voa hatramin'ny 80% ary mampitombo ny voka-bary."
                      : "Repiquage jeune (8-12j), 1 brin par trou avec écartement 25cm x 25cm. Réduit la semence requise de 85% tout en doublant le tallage."}
                  </Text>
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-brand-brown mb-1">Superficie de la rizière (ha)</Text>
                    <TextInput
                      value={sriSurface}
                      onChangeText={setSriSurface}
                      keyboardType="decimal-pad"
                      className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-bold text-brand-brown"
                    />
                  </View>
                  <View className="flex-1">
                    <SelectField label="Écartement des plants" value={sriSpacing} onChange={setSriSpacing} options={spacingOptions} />
                  </View>
                </View>

                <View className="bg-white p-4 rounded-2xl border border-brand-beige gap-3">
                  <Text className="text-xs font-bold text-brand-brown uppercase tracking-wider">
                    {language === 'mg' ? 'Vokatry ny fikajiana' : 'Résultats Prévisionnels'}
                  </Text>

                  <View className="flex-row gap-3">
                    <View className="flex-1 p-3 bg-[#F2F8F1] rounded-xl border border-brand-green/20">
                      <Text className="text-[10px] uppercase font-bold text-brand-brownLight">Semences SRI requises</Text>
                      <Text className="text-xl font-bold text-brand-green">{sriSeedKgNeeded} kg</Text>
                      <Text className="text-[10px] text-brand-brownLight mt-0.5">(vs {conventionalSeedKg}kg en méthode classique)</Text>
                    </View>

                    <View className="flex-1 p-3 bg-[#FDF5EB] rounded-xl border border-[#8B5E3C]/20">
                      <Text className="text-[10px] uppercase font-bold text-brand-brownLight">Économie de semence</Text>
                      <Text className="text-xl font-bold text-[#8B5E3C]">-{seedSavingsKg} kg</Text>
                      <Text className="text-[10px] text-brand-brownLight mt-0.5">~{(seedSavingsKg * 6500).toLocaleString()} Ar économisés</Text>
                    </View>
                  </View>

                  <View className="p-3 bg-white rounded-xl border border-brand-beige flex-row justify-between items-center">
                    <Text className="text-brand-brownLight text-xs">Nombre total de touffes / brins :</Text>
                    <Text className="text-brand-brown font-bold text-xs">{totalHills.toLocaleString()} plants</Text>
                  </View>

                  <View className="p-3 bg-white rounded-xl border border-brand-beige flex-row justify-between items-center">
                    <Text className="text-brand-brownLight text-xs">Estimation rendement paddy :</Text>
                    <Text className="text-brand-green font-bold text-xs">{estimatedYieldTonnes} Tonnes</Text>
                  </View>
                </View>
              </>
            ) : (
              <>
                <View className="bg-[#FDF5EB] p-3.5 rounded-2xl border border-[#8B5E3C]/20">
                  <Text className="text-xs text-[#8B5E3C] leading-relaxed">
                    <Text className="font-bold">{language === 'mg' ? 'Fitsipika volamena : ' : "Règle d'or du compostage : "}</Text>
                    {language === 'mg'
                      ? "Fangarona pako maina (karbônina) sy maitso (azôta) ary dikim-biby. Masaka ao anatin'ny 45 andro rehefa avadika matetika."
                      : "Équilibre 40% matières brunes (carbone), 35% matières vertes (azote) et 25% fumier d'élevage. Prêt en 45 jours."}
                  </Text>
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-brand-brown mb-1">Compost visé (Tonnes)</Text>
                    <TextInput
                      value={targetCompostTonnes}
                      onChangeText={setTargetCompostTonnes}
                      keyboardType="decimal-pad"
                      className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-bold text-brand-brown"
                    />
                  </View>
                  <View className="flex-1">
                    <SelectField label="Type de fumier" value={dungType} onChange={(v) => setDungType(v as any)} options={dungOptions} />
                  </View>
                </View>

                <View className="bg-white p-4 rounded-2xl border border-brand-beige gap-3">
                  <Text className="text-xs font-bold text-brand-brown uppercase tracking-wider">
                    {language === 'mg' ? "Akora ilaina amin'ny fanaovana azy" : 'Ingrédients & Dosages Requis'}
                  </Text>

                  <View className="gap-2">
                    <View className="flex-row items-center justify-between p-2.5 bg-brand-cream rounded-xl border border-brand-beige">
                      <View className="flex-row items-center gap-2 flex-1">
                        <View className="w-2.5 h-2.5 rounded-full bg-[#8B5E3C]" />
                        <Text className="font-semibold text-brand-brown text-xs flex-1">Matières brunes (Paille, brindilles, sciure)</Text>
                      </View>
                      <Text className="text-[#8B5E3C] font-bold text-xs">{dryBrownKg} kg</Text>
                    </View>

                    <View className="flex-row items-center justify-between p-2.5 bg-brand-cream rounded-xl border border-brand-beige">
                      <View className="flex-row items-center gap-2 flex-1">
                        <View className="w-2.5 h-2.5 rounded-full bg-brand-green" />
                        <Text className="font-semibold text-brand-brown text-xs flex-1">Matières vertes (Déchets de cuisine, herbes)</Text>
                      </View>
                      <Text className="text-brand-green font-bold text-xs">{greenWasteKg} kg</Text>
                    </View>

                    <View className="flex-row items-center justify-between p-2.5 bg-brand-cream rounded-xl border border-brand-beige">
                      <View className="flex-row items-center gap-2 flex-1">
                        <View className="w-2.5 h-2.5 rounded-full bg-brand-brown" />
                        <Text className="font-semibold text-brand-brown text-xs flex-1">Fumier d'élevage</Text>
                      </View>
                      <Text className="text-brand-brown font-bold text-xs">{manureKg} kg</Text>
                    </View>

                    <View className="flex-row items-center justify-between p-2.5 bg-brand-cream rounded-xl border border-brand-beige">
                      <View className="flex-row items-center gap-2 flex-1">
                        <View className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                        <Text className="font-semibold text-brand-brown text-xs flex-1">Eau d'arrosage</Text>
                      </View>
                      <Text className="text-[#3B82F6] font-bold text-xs">~{waterLiters} Litres</Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </ScrollView>

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
