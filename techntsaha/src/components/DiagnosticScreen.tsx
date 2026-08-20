import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Stethoscope, Camera, Sparkles, AlertCircle, Volume2, Leaf } from '../lib/icons';
import { PlantDiagnostic, Language } from '../types';
import { translations } from '../data/translations';
import { diagnosePlantIssue, playTextSpeech } from '../services/geminiService';
import { sampleDiagnostics } from '../data/mockData';
import { SelectField } from './ui/SelectField';

interface DiagnosticScreenProps {
  language: Language;
}

const cropOptions = [
  { value: 'Riz (Vary)', label: 'Riz (Vary Makalioka / Gasy / SRI)' },
  { value: 'Caféier Arabica', label: 'Caféier Arabica / Robusta (Kafe)' },
  { value: 'Vanille Bourbon', label: 'Vanille Bourbon (Lavanila)' },
  { value: 'Maïs (Katsaka)', label: 'Maïs (Katsaka)' },
  { value: 'Tomate (Voatabia)', label: 'Tomate / Maraîchage (Voatabia)' },
  { value: 'Pomme de terre (Ovy)', label: 'Pomme de terre (Ovy)' },
  { value: 'Giroflier', label: 'Giroflier (Girofle)' },
];

const cropPresets = [
  { name: 'Riz (Vary)', symptoms: 'Taches en fuseau brunâtres avec centre grisâtre sur les feuilles de riz' },
  { name: 'Caféier Arabica', symptoms: 'Poussière orange sous les feuilles de café, chute anormale des feuilles' },
  { name: 'Maïs (Katsaka)', symptoms: 'Trous dans les jeunes feuilles et sciure au cœur du cornet' },
  { name: 'Tomate (Voatabia)', symptoms: 'Taches noires huileuses et flétrissement des feuilles après la pluie' },
  { name: 'Vanille Bourbon', symptoms: 'Jaunissement des lianes et pourriture noire des racines adventives' },
];

export const DiagnosticScreen: React.FC<DiagnosticScreenProps> = ({ language }) => {
  const t = translations[language];

  const [cropName, setCropName] = useState('Riz (Vary)');
  const [symptoms, setSymptoms] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<PlantDiagnostic | null>(sampleDiagnostics[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleSelectPreset = (preset: (typeof cropPresets)[0]) => {
    setCropName(preset.name);
    setSymptoms(preset.symptoms);
  };

  const handlePickImage = async (fromCamera: boolean) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7 });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setImagePreview(asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri);
    }
  };

  const handleRunDiagnostic = async () => {
    setIsAnalyzing(true);
    try {
      const result = await diagnosePlantIssue({
        cropName,
        symptoms: symptoms || 'Observations visuelles sur les feuilles et tiges',
        imageBase64: imagePreview || undefined,
        language,
      });
      setCurrentResult(result);
    } catch (err) {
      console.error('Diagnosis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAudioPlay = () => {
    if (!currentResult) return;
    const textToSpeak =
      language === 'mg'
        ? `${currentResult.malagasyIssue}. ${currentResult.malagasyAdvice}`
        : `${currentResult.identifiedIssue}. Résumé : ${currentResult.symptomsSummary}. Traitement naturel recommandé : ${currentResult.organicTreatment.join('. ')}.`;

    setIsPlayingAudio(true);
    playTextSpeech(textToSpeak, language);
    setTimeout(() => setIsPlayingAudio(false), 6000);
  };

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 32 }}>
      {/* Header */}
      <View>
        <View className="flex-row items-center gap-2">
          <View className="w-7 h-7 rounded-lg bg-brand-green items-center justify-center">
            <Stethoscope className="w-4 h-4 text-white" />
          </View>
          <Text className="text-xl font-bold text-brand-green tracking-tight">{t.diagnosticTitle}</Text>
        </View>
        <Text className="text-xs text-brand-brownLight mt-0.5">{t.diagnosticSubtitle}</Text>
      </View>

      {/* Input Box Card */}
      <View className="bg-white p-4 rounded-3xl border border-brand-beige gap-3.5">
        {/* Photo */}
        <View>
          <Text className="text-xs font-bold text-brand-brown uppercase tracking-wider mb-2">
            {language === 'mg' ? "Sarin'ny ravina na voly marary" : 'Photo de la plante ou de la feuille'}
          </Text>

          {imagePreview ? (
            <View className="relative rounded-2xl overflow-hidden border-2 border-brand-green h-44 bg-black/5">
              <Image source={{ uri: imagePreview }} style={{ width: '100%', height: '100%' }} />
              <Pressable onPress={() => setImagePreview(null)} className="absolute top-2 right-2 bg-black/70 px-2.5 py-1 rounded-full">
                <Text className="text-white text-[10px] font-bold">Supprimer</Text>
              </Pressable>
            </View>
          ) : (
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => handlePickImage(true)}
                className="flex-1 border-2 border-dashed border-brand-beige bg-brand-cream rounded-2xl p-4 items-center"
              >
                <View className="w-11 h-11 rounded-full bg-[#F2F8F1] items-center justify-center mb-1.5">
                  <Camera className="w-5 h-5 text-brand-green" />
                </View>
                <Text className="text-xs font-bold text-brand-brown text-center">{t.takePhoto}</Text>
              </Pressable>
              <Pressable
                onPress={() => handlePickImage(false)}
                className="flex-1 border-2 border-dashed border-brand-beige bg-brand-cream rounded-2xl p-4 items-center"
              >
                <View className="w-11 h-11 rounded-full bg-[#F2F8F1] items-center justify-center mb-1.5">
                  <Camera className="w-5 h-5 text-brand-green" />
                </View>
                <Text className="text-xs font-bold text-brand-brown text-center">{t.uploadPhoto}</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Crop Selection */}
        <SelectField label={t.selectCrop} value={cropName} onChange={setCropName} options={cropOptions} />

        {/* Symptoms */}
        <View>
          <Text className="text-xs font-bold text-brand-brown mb-1">
            {language === 'mg' ? 'Fambara hita maso' : 'Symptômes observés'}
          </Text>
          <TextInput
            value={symptoms}
            onChangeText={setSymptoms}
            placeholder={t.describeSymptoms}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            className="w-full bg-brand-cream border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-medium text-brand-brown"
            style={{ minHeight: 64 }}
          />
        </View>

        {/* Presets */}
        <View>
          <Text className="text-[10px] font-bold text-brand-brownLight uppercase tracking-wider mb-1.5">{t.samplePresets}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-1.5">
              {cropPresets.map((preset) => (
                <Pressable
                  key={preset.name}
                  onPress={() => handleSelectPreset(preset)}
                  className={`px-2.5 py-1 rounded-full border ${
                    cropName === preset.name ? 'bg-brand-green border-brand-green' : 'bg-brand-beige border-transparent'
                  }`}
                >
                  <Text className={`text-[10px] font-bold ${cropName === preset.name ? 'text-white' : 'text-brand-brown'}`}>{preset.name}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Run Diagnostic */}
        <Pressable
          onPress={handleRunDiagnostic}
          disabled={isAnalyzing}
          className="w-full bg-brand-green py-3 rounded-2xl flex-row items-center justify-center gap-2"
          style={{ opacity: isAnalyzing ? 0.75 : 1 }}
        >
          {isAnalyzing ? (
            <>
              <ActivityIndicator size="small" color="#FFD700" />
              <Text className="text-white font-bold text-xs">{t.analyzing}</Text>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#FFD700]" />
              <Text className="text-white font-bold text-xs">{t.runDiagnostic}</Text>
            </>
          )}
        </Pressable>
      </View>

      {/* Result Card */}
      {currentResult && (
        <View className="bg-white rounded-3xl p-5 border border-brand-beige gap-4">
          <View className="flex-row justify-between items-start border-b border-brand-beige pb-3">
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <View className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <Text className="text-[10px] font-extrabold uppercase tracking-wider text-red-600">{t.diagnosisResult}</Text>
              </View>
              <Text className="text-base font-extrabold text-brand-brown mt-1 leading-tight">{currentResult.identifiedIssue}</Text>
              <Text className="text-xs font-bold text-brand-green mt-0.5">{currentResult.malagasyIssue}</Text>
            </View>

            <Pressable onPress={handleAudioPlay} className="flex-row items-center gap-1 bg-[#F2F8F1] px-3 py-1.5 rounded-full border border-brand-green/20">
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-brand-green' : 'text-brand-green'}`} />
              <Text className="text-xs font-bold text-brand-green">{isPlayingAudio ? 'Lecture...' : 'Écouter'}</Text>
            </Pressable>
          </View>

          <View className="flex-row gap-2">
            <Text className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
              Gravité : {currentResult.severity.toUpperCase()}
            </Text>
            <Text className="px-2.5 py-1 rounded-full bg-[#F2F8F1] text-brand-green text-[10px] font-bold">
              Fiabilité IA : {currentResult.confidence}%
            </Text>
          </View>

          <View className="bg-brand-cream p-3 rounded-2xl border border-brand-beige">
            <Text className="text-brand-brownLight text-[10px] uppercase font-bold mb-0.5">Description clinique</Text>
            <Text className="text-xs text-[#4A3728]/90">{currentResult.symptomsSummary}</Text>
          </View>

          <View className="bg-[#F2F8F1] p-4 rounded-2xl border border-brand-green/20 gap-2">
            <View className="flex-row items-center gap-1.5">
              <Leaf className="w-4 h-4 text-brand-green" />
              <Text className="text-xs font-bold text-brand-green uppercase tracking-wide">{t.organicTreatments}</Text>
            </View>
            <View className="gap-1.5">
              {currentResult.organicTreatment.map((item, idx) => (
                <View key={idx} className="flex-row items-start gap-2">
                  <View className="w-4 h-4 rounded-full bg-brand-green items-center justify-center mt-0.5">
                    <Text className="text-white text-[9px] font-bold">✓</Text>
                  </View>
                  <Text className="text-xs text-brand-brown flex-1">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {currentResult.chemicalTreatment && currentResult.chemicalTreatment.length > 0 && (
            <View className="bg-[#FDF5EB] p-3.5 rounded-2xl border border-[#8B5E3C]/20 gap-1.5">
              <View className="flex-row items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#8B5E3C]" />
                <Text className="text-[11px] font-bold text-[#8B5E3C] uppercase tracking-wide">{t.chemicalTreatments}</Text>
              </View>
              <View className="gap-1">
                {currentResult.chemicalTreatment.map((item, idx) => (
                  <Text key={idx} className="text-xs text-brand-brown">
                    • {item}
                  </Text>
                ))}
              </View>
            </View>
          )}

          <View className="bg-brand-green p-3.5 rounded-2xl">
            <Text className="text-[11px] font-bold text-[#FFD700] uppercase tracking-wider mb-1">🇲🇬 {t.malagasySummary}</Text>
            <Text className="text-xs text-brand-cream leading-relaxed">{currentResult.malagasyAdvice}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};
