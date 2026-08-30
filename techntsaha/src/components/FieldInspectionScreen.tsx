import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Image } from 'react-native';
import { FieldInspectionRound } from '../types';
import { translations } from '../data/translations';
import { ClipboardCheck, Camera, Mic, MicOff, CheckCircle2, Play, Sparkles, Calendar, User, Share2, Plus } from '../lib/icons';
import { useInspections, useCreateInspection } from '../services/reactQueryHooks';

interface FieldInspectionScreenProps {
  inspections: FieldInspectionRound[];
  onAddInspection: (inspection: FieldInspectionRound) => void;
  lang: 'fr' | 'mg';
}

const stationsData = (lang: 'fr' | 'mg') => [
  {
    id: 1,
    title: lang === 'fr' ? 'Station 1 : État végétatif et tallage' : "Toerana 1 : Fitomboan'ny ravina sy vanim-bary",
    description:
      lang === 'fr'
        ? 'Contrôlez la densité des talles, la couleur verte franche et la hauteur homogène du riz SRI.'
        : "Zahao ny hamaroan'ny vaniny, ny lokon'ny ravina maitso tsara ary ny fitomboana mitovy.",
  },
  {
    id: 2,
    title: lang === 'fr' ? 'Station 2 : Humidité du sol et adventices' : "Toerana 2 : Hamandoan'ny tany sy bozaka",
    description:
      lang === 'fr'
        ? "Vérifiez la pellicule d'eau superficielle et l'absence de mauvaises herbes concurrentes."
        : "Zahao ny haavon-drano sy ny fahamendrehan'ny tany, ary ny fisian'ny bozaka.",
  },
  {
    id: 3,
    title: lang === 'fr' ? 'Station 3 : Détection ravageurs et maladies' : 'Toerana 3 : Fikarohana bibikely sy aretina',
    description:
      lang === 'fr'
        ? 'Inspectez les gaines foliaires : absence de pyriculariose, cicadelles ou chenilles mineuses.'
        : 'Zahao tsara ny ambany ravina : tsy misy olitra na drakidraky na fahasimbana.',
  },
  {
    id: 4,
    title: lang === 'fr' ? 'Station 4 : Vannes et canalisations' : 'Toerana 4 : Vanne sy lalan-drano',
    description:
      lang === 'fr'
        ? 'Contrôlez le bon écoulement dans les rigoles et le clapet de fermeture étanche.'
        : "Zahao ny fandehan'ny rano anaty tatatra sy ny fihidiana tsaran'ny vanne.",
  },
];

const samplePhotos = [
  'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
];

export const FieldInspectionScreen: React.FC<FieldInspectionScreenProps> = ({ inspections: propInspections, onAddInspection, lang }) => {
  const t = translations[lang];
  const stations = stationsData(lang);
  const [isStartingNewRound, setIsStartingNewRound] = useState(false);
  const [stationChecks, setStationChecks] = useState<boolean[]>([false, false, false, false]);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordedVoiceNote, setRecordedVoiceNote] = useState<string | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [notesText, setNotesText] = useState('');
  const [selectedPlot] = useState('Tanim-bary Atsimo (Parcelle 1 - Riz SRI)');
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const inspectionsQuery = useInspections();
  const inspections = (inspectionsQuery.data && inspectionsQuery.data.length > 0)
    ? inspectionsQuery.data.map((insp) => ({
        id: insp.id,
        plotName: 'Parcelle',
        inspectorName: 'Inspecteur',
        date: insp.createdAt ? new Date(insp.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: 'completed',
        overallHealthScore: 80,
        stationsChecked: 2,
        totalStations: 4,
        photos: [],
        audioNotesCount: 0,
        observationsFr: [insp.observation || 'Inspection effectuée'],
        observationsMg: [insp.observation || 'Inspection effectuée'],
        actionRequired: false,
        syncedToCoop: true,
      }))
    : propInspections;

  const createInspectionMutation = useCreateInspection();

  const handleToggleStation = (index: number) => {
    const updated = [...stationChecks];
    updated[index] = !updated[index];
    setStationChecks(updated);
  };

  const handleSimulatePhoto = () => {
    const picked = samplePhotos[capturedPhotos.length % samplePhotos.length];
    setCapturedPhotos([...capturedPhotos, picked]);
  };

  const handleToggleVoiceRecord = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setTimeout(() => {
        setIsRecordingVoice(false);
        setRecordedVoiceNote(
          lang === 'fr'
            ? 'Note vocale enregistrée : "Tallage vigoureux, niveau d\'eau régulé, aucun ravageur détecté."'
            : 'Feo voarakitra : "Miroborobo tsara ny vanim-bary, ampy tsara ny rano, tsy misy bibikely."'
        );
      }, 3000);
    } else {
      setIsRecordingVoice(false);
    }
  };

  const handleFinishRound = async () => {
    const completedCount = stationChecks.filter(Boolean).length;
    const healthScore = Math.round((completedCount / 4) * 30 + 70);

    const newInspection: FieldInspectionRound = {
      id: `insp-${Date.now()}`,
      plotName: selectedPlot,
      inspectorName: 'Mamy Rakoto',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      overallHealthScore: healthScore,
      stationsChecked: completedCount,
      totalStations: 4,
      photos: capturedPhotos.length > 0 ? capturedPhotos : [samplePhotos[0]],
      audioNotesCount: recordedVoiceNote ? 1 : 0,
      observationsFr: [notesText || "Ronde d'inspection complète effectuée avec succès.", 'Contrôle des 4 stations conforme aux standards agroécologiques.'],
      observationsMg: [notesText || "Vita soa aman-tsara ny fisafoana ny saha rehetra.", "Mifanaraka amin'ny fomba fambolena manara-penitra ny zava-bita."],
      actionRequired: false,
      syncedToCoop: true,
    };

    if (createInspectionMutation.isPending === false) {
      try {
        await createInspectionMutation.mutateAsync({
          parcelId: 'default',
          inspectorUserId: 'default',
          status: 'PLANIFIEE',
          observation: notesText || "Ronde d'inspection complète",
          voiceNoteUrl: recordedVoiceNote || undefined,
        });
      } catch {
        // fallback to local
      }
    }

    onAddInspection(newInspection);
    setIsStartingNewRound(false);
    setStationChecks([false, false, false, false]);
    setCapturedPhotos([]);
    setRecordedVoiceNote(null);
    setNotesText('');

    setSyncToast(
      lang === 'fr'
        ? "Rapport d'inspection synchronisé avec la Coopérative Miray Hina !"
        : "Voarindra any amin'ny Koperativa Miray Hina ny tatitra fisafoana !"
    );
    setTimeout(() => setSyncToast(null), 5000);
  };

  return (
    <View style={{ gap: 16, paddingBottom: 40 }}>
      {/* Header Banner */}
      <View className="bg-[#3d4f38] rounded-2xl p-4 flex-row items-center justify-between gap-3">
        <View className="flex-row items-center gap-3 flex-1">
          <View className="p-2.5 rounded-xl bg-white/15">
            <ClipboardCheck className="w-6 h-6 text-emerald-300" />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-base leading-tight text-white">{t.fieldInspectionTitle}</Text>
            <Text className="text-xs text-emerald-100/90 leading-tight">{t.fieldInspectionSubtitle}</Text>
          </View>
        </View>

        {!isStartingNewRound && (
          <Pressable onPress={() => setIsStartingNewRound(true)} className="flex-row items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white">
            <Plus className="w-4 h-4 text-[#4A6343]" />
            <Text className="text-[#4A6343] text-xs font-bold">{lang === 'fr' ? 'Nouvelle Ronde' : 'Fisafoana Vaovao'}</Text>
          </Pressable>
        )}
      </View>

      {/* Sync Toast */}
      {syncToast && (
        <View className="bg-emerald-900 p-3 rounded-xl flex-row items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <Text className="text-emerald-100 text-xs font-medium flex-1">{syncToast}</Text>
        </View>
      )}

      {/* Guided Round Form */}
      {isStartingNewRound && (
        <View className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E3DFD2] gap-4">
          <View className="pb-3 border-b border-stone-200 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-[#5B7553]">
                {lang === 'fr' ? 'Ronde Guidée en Cours' : 'Fisafoana Mandeha'}
              </Text>
              <Text className="font-bold text-stone-900 text-base">{selectedPlot}</Text>
            </View>
            <Pressable onPress={() => setIsStartingNewRound(false)}>
              <Text className="text-xs text-stone-500 px-2 py-1">{t.cancel}</Text>
            </Pressable>
          </View>

          <View className="gap-2.5">
            <Text className="text-xs font-bold text-stone-800">
              {lang === 'fr' ? 'Points de contrôle des 4 Stations :' : 'Ireo toerana 4 tsy maintsy hozahana :'}
            </Text>

            {stations.map((st, idx) => {
              const isChecked = stationChecks[idx];
              return (
                <Pressable
                  key={st.id}
                  onPress={() => handleToggleStation(idx)}
                  className={`p-3 rounded-xl border flex-row items-start gap-3 ${
                    isChecked ? 'bg-emerald-50/80 border-emerald-300' : 'bg-white border-stone-200/80'
                  }`}
                >
                  <View className={`w-5 h-5 rounded-md items-center justify-center mt-0.5 border ${isChecked ? 'bg-[#5B7553] border-[#5B7553]' : 'border-stone-300'}`}>
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-xs text-stone-900">{st.title}</Text>
                    <Text className="text-[11px] text-stone-600 mt-0.5">{st.description}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Photo & Voice */}
          <View className="gap-3">
            <View className="bg-white rounded-xl p-3 border border-stone-200">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <Text className="text-xs font-bold text-stone-900">
                    {t.takeSnapshot} ({capturedPhotos.length})
                  </Text>
                </View>
                <Pressable onPress={handleSimulatePhoto} className="px-2.5 py-1 rounded-lg bg-stone-100">
                  <Text className="text-[11px] text-stone-700 font-semibold">+ {lang === 'fr' ? 'Photo' : 'Sary'}</Text>
                </Pressable>
              </View>

              {capturedPhotos.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {capturedPhotos.map((p, idx) => (
                      <Image key={idx} source={{ uri: p }} style={{ width: 64, height: 64, borderRadius: 8 }} />
                    ))}
                  </View>
                </ScrollView>
              ) : (
                <Text className="text-[11px] text-stone-500 italic">
                  {lang === 'fr' ? 'Aucune photo prise. Touchez pour ajouter un cliché.' : 'Tsy misy sary. Tsindrio ny bokotra.'}
                </Text>
              )}
            </View>

            <View className="bg-white rounded-xl p-3 border border-stone-200">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-1.5">
                  <Mic className="w-4 h-4 text-orange-600" />
                  <Text className="text-xs font-bold text-stone-900">{t.recordVoiceNote}</Text>
                </View>
                <Pressable onPress={handleToggleVoiceRecord} className={`px-2.5 py-1 rounded-lg flex-row items-center gap-1 ${isRecordingVoice ? 'bg-red-600' : 'bg-stone-100'}`}>
                  {isRecordingVoice ? (
                    <>
                      <MicOff className="w-3 h-3 text-white" />
                      <Text className="text-[11px] text-white font-semibold">{lang === 'fr' ? 'Enregistrement...' : 'Mandraikitra...'}</Text>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3 h-3 text-stone-700" />
                      <Text className="text-[11px] text-stone-700 font-semibold">{lang === 'fr' ? 'Parler' : 'Hitendry'}</Text>
                    </>
                  )}
                </Pressable>
              </View>

              {recordedVoiceNote ? (
                <View className="bg-amber-50 p-2 rounded-lg border border-amber-200">
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <Play className="w-3 h-3 text-amber-600" />
                    <Text className="text-[11px] font-bold text-amber-900">{lang === 'fr' ? 'Transcription automatique :' : 'Feo voasoratra :'}</Text>
                  </View>
                  <Text className="text-[11px] text-amber-900">{recordedVoiceNote}</Text>
                </View>
              ) : (
                <Text className="text-[11px] text-stone-500 italic">
                  {lang === 'fr' ? 'Dictez vos remarques en Malagasy ou Français sans taper de texte.' : 'Mitenena mivantana fa tsy mila manoratra.'}
                </Text>
              )}
            </View>
          </View>

          <View>
            <Text className="text-xs font-semibold text-stone-700 mb-1">
              {lang === 'fr' ? 'Observations complémentaires (optionnel) :' : 'Fanamarihana fanampiny :'}
            </Text>
            <TextInput
              value={notesText}
              onChangeText={setNotesText}
              placeholder={
                lang === 'fr'
                  ? "Ex: Bonne floraison, arrosage régulier nécessaire d'ici 3 jours..."
                  : 'Ohatra: Miroborobo tsara, mila tondrahana afaka 3 andro...'
              }
              multiline
              numberOfLines={2}
              textAlignVertical="top"
              className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-stone-900"
              style={{ minHeight: 56 }}
            />
          </View>

          <View className="flex-row items-center justify-end gap-2">
            <Pressable onPress={() => setIsStartingNewRound(false)} className="px-3.5 py-2 rounded-xl">
              <Text className="text-xs font-semibold text-stone-600">{t.cancel}</Text>
            </Pressable>
            <Pressable onPress={handleFinishRound} className="flex-row items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5B7553]">
              <Sparkles className="w-4 h-4 text-white" />
              <Text className="text-white text-xs font-bold">
                {lang === 'fr' ? 'Valider et Synchroniser le Rapport' : "Hamarina sy Handefa any amin'ny Koperativa"}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Inspection History */}
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="font-bold text-stone-900 text-sm">{t.inspectionHistory}</Text>
          <Text className="text-xs text-stone-500">
            {inspections.length} {lang === 'fr' ? 'rondes validées' : 'fisafoana vita'}
          </Text>
        </View>

        <View className="gap-3">
          {inspections.map((insp) => (
            <View key={insp.id} className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E3DFD2] gap-3">
              <View className="flex-row items-center justify-between gap-2 flex-wrap">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 flex-wrap">
                    <Text className="font-bold text-stone-900 text-sm">{insp.plotName}</Text>
                    <Text
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        insp.overallHealthScore >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Score : {insp.overallHealthScore}%
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-3 mt-0.5">
                    <View className="flex-row items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-500" />
                      <Text className="text-[11px] text-stone-500">{insp.date}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <User className="w-3 h-3 text-stone-500" />
                      <Text className="text-[11px] text-stone-500">{insp.inspectorName}</Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center gap-1 bg-blue-100 px-2 py-0.5 rounded-full">
                  <Share2 className="w-3 h-3 text-blue-800" />
                  <Text className="text-[10px] text-blue-800 font-semibold">Coop Synchronisée</Text>
                </View>
              </View>

              {insp.photos && insp.photos.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {insp.photos.map((url, pIdx) => (
                      <Image key={pIdx} source={{ uri: url }} style={{ width: 80, height: 80, borderRadius: 12 }} />
                    ))}
                  </View>
                </ScrollView>
              )}

              <View className="bg-white rounded-xl p-3 border border-stone-200/80">
                <Text className="text-[11px] font-bold text-stone-700 mb-1">
                  {lang === 'fr' ? 'Observations validées sur le terrain :' : 'Fanamarihana teo an-toerana :'}
                </Text>
                <View className="gap-1">
                  {(lang === 'fr' ? insp.observationsFr : insp.observationsMg).map((obs, oIdx) => (
                    <Text key={oIdx} className="text-xs text-stone-600">
                      • {obs}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
