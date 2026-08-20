import React, { useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView, TextInput } from 'react-native';
import { X, Sprout, Plus } from '../lib/icons';
import { Crop, Language } from '../types';
import { translations } from '../data/translations';
import { regionsList } from '../data/mockData';
import { SelectField } from './ui/SelectField';

interface NewCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCrop: (crop: Omit<Crop, 'id'>) => void;
  language: Language;
}

const cropPresets = [
  { name: 'Riz Blanc (Vary)', malagasy: 'Vary Gasy / SRI', icon: '🌾', variety: 'Makalioka / FOFIFA' },
  { name: 'Vanille Bourbon', malagasy: 'Lavanila Bourbon', icon: '🌱', variety: 'Planifolia' },
  { name: 'Café Arabica', malagasy: 'Kafe Arabica', icon: '☕', variety: 'Bourbon Rouge' },
  { name: 'Girofle Bio', malagasy: 'Girofle Ranomainty', icon: '🌿', variety: 'Clous bio' },
];

const stageOptions = [
  { value: 'semis', label: 'Semis / Tanin-ketsa' },
  { value: 'croissance', label: 'Croissance / Faniriana' },
  { value: 'floraison', label: 'Floraison / Voniny' },
  { value: 'maturation', label: 'Maturation / Fahamasahana' },
  { value: 'recolte', label: 'Récolte / Fiotazana' },
];

const unitOptions = [
  { value: 'ha', label: 'Hectares (ha)' },
  { value: 'ares', label: 'Ares (a)' },
];

export const NewCropModal: React.FC<NewCropModalProps> = ({ isOpen, onClose, onAddCrop, language }) => {
  const t = translations[language];

  const [name, setName] = useState('Riz Blanc (Vary Makalioka)');
  const [malagasyName, setMalagasyName] = useState('Vary Makalioka');
  const [variety, setVariety] = useState('Makalioka 34');
  const [plotName, setPlotName] = useState('Parcelle Nord 2');
  const [surfaceArea, setSurfaceArea] = useState('1.5');
  const [surfaceUnit, setSurfaceUnit] = useState<'ha' | 'ares'>('ha');
  const [plantingDate, setPlantingDate] = useState('2026-08-12');
  const [expectedHarvestDate, setExpectedHarvestDate] = useState('2026-11-20');
  const [stage, setStage] = useState<Crop['stage']>('semis');
  const [region, setRegion] = useState('Vakinankaratra');
  const [icon, setIcon] = useState('🌾');

  const handleSelectPreset = (preset: (typeof cropPresets)[0]) => {
    setName(preset.name);
    setMalagasyName(preset.malagasy);
    setIcon(preset.icon);
    setVariety(preset.variety);
  };

  const handleSubmit = () => {
    const daysCalc = Math.max(
      10,
      Math.round((new Date(expectedHarvestDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    );

    onAddCrop({
      name,
      malagasyName: malagasyName || name,
      variety,
      plotName,
      surfaceArea: parseFloat(surfaceArea) || 1,
      surfaceUnit,
      plantingDate,
      expectedHarvestDate,
      stage,
      progressPercent: stage === 'semis' ? 15 : stage === 'croissance' ? 45 : stage === 'floraison' ? 70 : 90,
      healthScore: 95,
      soilMoisture: 70,
      nextActionFr: 'Apport de compost organique et désherbage préventif',
      nextActionMg: 'Fametrahana zezika kankana sy fihazana ahi-dratsy',
      icon,
      color: '#2D5A27',
      region,
      daysToHarvest: daysCalc,
      harvestYieldKg: (parseFloat(surfaceArea) || 1) * 3500,
    });

    onClose();
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center p-4 bg-black/60">
        <View className="bg-brand-cream w-full rounded-3xl border-2 border-brand-beige overflow-hidden" style={{ maxWidth: 480, maxHeight: '90%' }}>
          <View className="bg-brand-green p-5 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5 flex-1">
              <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
                <Sprout className="w-4 h-4 text-white" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-white">{t.addCrop}</Text>
                <Text className="text-xs text-brand-beige/80">
                  {language === 'mg' ? 'Fampidirana tany na voly vaovao' : 'Enregistrer une nouvelle parcelle agricole'}
                </Text>
              </View>
            </View>
            <Pressable onPress={onClose} className="w-8 h-8 rounded-full bg-white/10 items-center justify-center">
              <X className="w-4 h-4 text-white" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
            <View>
              <Text className="text-xs font-bold text-brand-brownLight uppercase tracking-wider mb-2">
                {language === 'mg' ? 'Safidy haingana' : 'Cultures courantes à Madagascar'}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {cropPresets.map((preset) => (
                  <Pressable
                    key={preset.name}
                    onPress={() => handleSelectPreset(preset)}
                    className={`p-2 rounded-xl border items-center ${
                      name === preset.name ? 'bg-brand-green border-brand-green' : 'bg-white border-brand-beige'
                    }`}
                    style={{ width: '23%' }}
                  >
                    <Text className="text-lg mb-0.5">{preset.icon}</Text>
                    <Text className={`text-[10px] font-bold text-center ${name === preset.name ? 'text-white' : 'text-brand-brown'}`} numberOfLines={1}>
                      {preset.name.split(' ')[0]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-xs font-bold text-brand-brown mb-1">{language === 'mg' ? "Anaran'ny voly (Fr)" : 'Nom de la culture'}</Text>
                <TextInput value={name} onChangeText={setName} className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-medium text-brand-brown" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-brand-brown mb-1">{language === 'mg' ? 'Anarana malagasy' : 'Nom en Malagasy'}</Text>
                <TextInput value={malagasyName} onChangeText={setMalagasyName} className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-medium text-brand-brown" />
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-xs font-bold text-brand-brown mb-1">Variété / Souche</Text>
                <TextInput value={variety} onChangeText={setVariety} placeholder="Ex: Makalioka 34" className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-medium text-brand-brown" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-brand-brown mb-1">Nom de la parcelle</Text>
                <TextInput value={plotName} onChangeText={setPlotName} placeholder="Ex: Saha Atsimo" className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-medium text-brand-brown" />
              </View>
            </View>

            <View className="flex-row gap-3">
              <View style={{ flex: 2 }}>
                <Text className="text-xs font-bold text-brand-brown mb-1">Superficie</Text>
                <TextInput value={surfaceArea} onChangeText={setSurfaceArea} keyboardType="decimal-pad" className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-medium text-brand-brown" />
              </View>
              <View className="flex-1">
                <SelectField label="Unité" value={surfaceUnit} onChange={(v) => setSurfaceUnit(v as 'ha' | 'ares')} options={unitOptions} />
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <SelectField
                  label="Région"
                  value={region}
                  onChange={setRegion}
                  options={regionsList.map((r) => ({ value: r, label: r }))}
                />
              </View>
              <View className="flex-1">
                <SelectField label="Stade initial" value={stage} onChange={(v) => setStage(v as Crop['stage'])} options={stageOptions} />
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-xs font-bold text-brand-brown mb-1">Date de semis (AAAA-MM-JJ)</Text>
                <TextInput value={plantingDate} onChangeText={setPlantingDate} placeholder="2026-08-12" className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-medium text-brand-brown" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-brand-brown mb-1">Récolte estimée</Text>
                <TextInput value={expectedHarvestDate} onChangeText={setExpectedHarvestDate} placeholder="2026-11-20" className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-medium text-brand-brown" />
              </View>
            </View>

            <View className="pt-3 border-t border-brand-beige flex-row justify-end gap-2">
              <Pressable onPress={onClose} className="px-4 py-2.5 rounded-xl border border-brand-beige">
                <Text className="text-xs font-bold text-brand-brownLight">{t.cancel}</Text>
              </Pressable>
              <Pressable onPress={handleSubmit} className="px-5 py-2.5 rounded-xl bg-brand-green flex-row items-center gap-1.5">
                <Plus className="w-4 h-4 text-white" />
                <Text className="text-xs font-bold text-white">{t.save}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
