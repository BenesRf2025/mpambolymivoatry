import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Modal, ActivityIndicator } from 'react-native';
import { Calculator, Send, ChevronRight, Bot, Clock, Leaf, X } from '../lib/icons';
import { ExpertTip, Language } from '../types';
import { expertTipsList } from '../data/mockData';
import { translations } from '../data/translations';
import { askAgronomistAI } from '../services/geminiService';

interface GuidesScreenProps {
  language: Language;
  onOpenCalculators: () => void;
}

export const GuidesScreen: React.FC<GuidesScreenProps> = ({ language, onOpenCalculators }) => {
  const t = translations[language];

  const [selectedTip, setSelectedTip] = useState<ExpertTip | null>(null);
  const [question, setQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text:
        language === 'mg'
          ? "Salama tompoko ! Izaho no Agrônoma mpanolo-tsaina AI an'ny Mpamboly. Inona no tianao hanontaniana momba ny volinao na ny biby fiompinao ?"
          : "Bonjour ! Je suis l'Agronome IA de Mpamboly. Quelle question souhaitez-vous poser sur vos cultures (riz SRI, vanille, café...), engrais ou calendrier agricole ?",
    },
  ]);
  const [isAsking, setIsAsking] = useState(false);

  const handleSendQuestion = async () => {
    if (!question.trim()) return;

    const userQ = question;
    setQuestion('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userQ }]);
    setIsAsking(true);

    try {
      const answer = await askAgronomistAI(userQ, language);
      setChatMessages((prev) => [...prev, { sender: 'ai', text: answer }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text:
            language === 'mg'
              ? 'Miala tsiny, nisy olana kely. Avereno azafady ny fanontanianao.'
              : "Désolé, une erreur s'est produite lors de la consultation. Veuillez réessayer.",
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
      {/* Header */}
      <View>
        <Text className="text-xl font-bold text-brand-green tracking-tight">{t.guidesTitle}</Text>
        <Text className="text-xs text-brand-brownLight">{t.guidesSubtitle}</Text>
      </View>

      {/* Calculators Banner */}
      <Pressable onPress={onOpenCalculators} className="bg-brand-green p-4 rounded-3xl flex-row items-center justify-between border border-brand-greenDark">
        <View className="flex-row items-center gap-3 flex-1">
          <View className="w-10 h-10 rounded-2xl bg-white/20 items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-white">{t.calculatorsTitle}</Text>
            <Text className="text-[11px] text-brand-beige">Calculateur Semences SRI & Compost chaud</Text>
          </View>
        </View>
        <ChevronRight className="w-5 h-5 text-[#FFD700]" />
      </Pressable>

      {/* AI Agronomist Chat */}
      <View className="bg-white rounded-3xl p-4 border border-brand-beige gap-3">
        <View className="flex-row items-center gap-2 pb-2 border-b border-brand-beige">
          <View className="w-8 h-8 rounded-full bg-[#F2F8F1] items-center justify-center">
            <Bot className="w-4 h-4 text-brand-green" />
          </View>
          <View>
            <Text className="text-xs font-bold text-brand-brown">{t.askAgronomist}</Text>
            <Text className="text-[10px] text-brand-brownLight">
              {language === 'mg' ? 'Valiny maimaim-poana avy hatrany' : 'Réponses instantanées adaptées aux terroirs malgaches'}
            </Text>
          </View>
        </View>

        <View style={{ maxHeight: 200 }}>
          <ScrollView>
            <View className="gap-2 p-1">
              {chatMessages.map((msg, i) => (
                <View key={i} className={`flex-row ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <View
                    className={`rounded-2xl p-2.5 ${
                      msg.sender === 'user' ? 'bg-brand-green' : 'bg-brand-cream border border-brand-beige'
                    }`}
                    style={{ maxWidth: '85%' }}
                  >
                    <Text className={`text-xs leading-relaxed ${msg.sender === 'user' ? 'text-white' : 'text-brand-brown'}`}>{msg.text}</Text>
                  </View>
                </View>
              ))}
              {isAsking && (
                <View className="flex-row justify-start">
                  <View className="bg-brand-cream border border-brand-beige rounded-2xl p-2.5 flex-row items-center gap-2">
                    <ActivityIndicator size="small" color="#2D5A27" />
                    <Text className="text-xs text-brand-brownLight">
                      {language === 'mg' ? 'Eo am-pandinihana...' : "L'agronome analyse votre question..."}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>

        <View className="flex-row gap-2 pt-1">
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder={t.askPrompt}
            onSubmitEditing={handleSendQuestion}
            className="flex-1 bg-brand-cream border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-medium text-brand-brown"
          />
          <Pressable
            onPress={handleSendQuestion}
            disabled={!question.trim() || isAsking}
            className="bg-brand-green px-3.5 py-2 rounded-xl items-center justify-center"
            style={{ opacity: !question.trim() || isAsking ? 0.5 : 1 }}
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </Pressable>
        </View>
      </View>

      {/* Expert Guides List */}
      <View className="gap-3">
        <Text className="text-xs font-bold text-brand-brown uppercase tracking-wider">Fiches Pratiques & Guides</Text>

        {expertTipsList.map((tip) => (
          <Pressable key={tip.id} onPress={() => setSelectedTip(tip)} className="bg-white p-4 rounded-3xl border border-brand-beige gap-2">
            <View className="flex-row justify-between items-start">
              <Text className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-brand-beige text-brand-brown">
                {language === 'mg' ? tip.badgeMg : tip.badgeFr}
              </Text>
              <View className="flex-row items-center gap-1">
                <Clock className="w-3 h-3 text-brand-brownLight" />
                <Text className="text-[10px] text-brand-brownLight">{tip.readTimeMin} min</Text>
              </View>
            </View>

            <View className="flex-row items-start gap-3">
              <View className="p-2 rounded-2xl bg-brand-cream border border-brand-beige">
                <Text className="text-2xl">{tip.icon}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-brand-brown leading-snug">{language === 'mg' ? tip.titleMg : tip.titleFr}</Text>
                <Text className="text-[11px] text-brand-brownLight mt-1 leading-relaxed" numberOfLines={2}>
                  {language === 'mg' ? tip.summaryMg : tip.summaryFr}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Guide Detail Modal */}
      <Modal visible={!!selectedTip} transparent animationType="fade" onRequestClose={() => setSelectedTip(null)}>
        <View className="flex-1 items-center justify-center p-4 bg-black/60">
          {selectedTip && (
            <View className="bg-brand-cream w-full rounded-3xl border-2 border-brand-beige overflow-hidden" style={{ maxWidth: 480, maxHeight: '90%' }}>
              <View className="bg-brand-green p-5 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2.5 flex-1">
                  <Text className="text-2xl">{selectedTip.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-[10px] uppercase font-bold text-[#FFD700] tracking-wider">
                      {language === 'mg' ? selectedTip.categoryMg : selectedTip.categoryFr}
                    </Text>
                    <Text className="text-base font-bold text-white leading-tight">
                      {language === 'mg' ? selectedTip.titleMg : selectedTip.titleFr}
                    </Text>
                  </View>
                </View>
                <Pressable onPress={() => setSelectedTip(null)} className="w-8 h-8 rounded-full bg-white/10 items-center justify-center">
                  <X className="w-4 h-4 text-white" />
                </Pressable>
              </View>

              <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
                <View className="bg-[#F2F8F1] p-3.5 rounded-2xl border border-brand-green/20">
                  <Text className="text-xs text-brand-brown font-medium leading-relaxed">
                    {language === 'mg' ? selectedTip.contentMg : selectedTip.contentFr}
                  </Text>
                </View>

                <View>
                  <View className="flex-row items-center gap-1.5 mb-2">
                    <Leaf className="w-4 h-4 text-brand-green" />
                    <Text className="text-xs font-bold text-brand-green uppercase tracking-wider">
                      {language === 'mg' ? 'Ireo dingana tokony harahina' : 'Étapes Méthodologiques'}
                    </Text>
                  </View>
                  <View className="gap-2">
                    {(language === 'mg' ? selectedTip.stepsMg : selectedTip.stepsFr).map((step, idx) => (
                      <View key={idx} className="bg-white p-3 rounded-2xl border border-brand-beige flex-row items-start gap-2.5">
                        <View className="w-5 h-5 rounded-full bg-brand-green items-center justify-center mt-0.5">
                          <Text className="text-white text-[10px] font-bold">{idx + 1}</Text>
                        </View>
                        <Text className="text-xs text-brand-brown leading-snug flex-1">{step}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>

              <View className="p-4 bg-white border-t border-brand-beige items-end">
                <Pressable onPress={() => setSelectedTip(null)} className="px-5 py-2.5 bg-brand-green rounded-xl">
                  <Text className="text-white text-xs font-bold">Fermer</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};
