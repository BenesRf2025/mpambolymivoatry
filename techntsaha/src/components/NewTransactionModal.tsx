import React, { useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView, TextInput } from 'react-native';
import { X, DollarSign, Plus, ArrowUpRight, ArrowDownLeft } from '../lib/icons';
import { FinancialEntry, Language } from '../types';
import { translations } from '../data/translations';
import { SelectField } from './ui/SelectField';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (entry: Omit<FinancialEntry, 'id'>) => void;
  language: Language;
}

const incomeCategories = [
  { value: 'vente_recolte', label: 'Vente Récolte (Varotra)' },
  { value: 'autre', label: 'Autre Revenu' },
];

const expenseCategories = [
  { value: 'semence', label: 'Semences (Voa)' },
  { value: 'engrais', label: 'Engrais & Compost (Zezika)' },
  { value: 'main_oeuvre', label: "Main d'œuvre (Karama)" },
  { value: 'transport', label: 'Transport (Saran-dalana)' },
  { value: 'materiel', label: 'Matériel / Fitaovana' },
  { value: 'autre', label: 'Autre dépense' },
];

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({ isOpen, onClose, onAddTransaction, language }) => {
  const t = translations[language];

  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState<FinancialEntry['category']>('vente_recolte');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [cropRelated, setCropRelated] = useState('');

  const handleSubmit = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    onAddTransaction({
      type,
      category,
      description: description || (type === 'income' ? 'Vente de récolte' : 'Achat intrants'),
      amount: parsedAmount,
      date,
      cropRelated: cropRelated || undefined,
    });

    onClose();
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center p-4 bg-black/60">
        <View className="bg-brand-cream w-full rounded-3xl border-2 border-brand-beige overflow-hidden" style={{ maxWidth: 420 }}>
          <View className="bg-brand-green p-5 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5 flex-1">
              <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-white">{t.addTransaction}</Text>
                <Text className="text-xs text-brand-beige/80">
                  {language === 'mg' ? 'Fanamarihana vola miditra na mivoaka' : 'Journal des recettes et dépenses'}
                </Text>
              </View>
            </View>
            <Pressable onPress={onClose} className="w-8 h-8 rounded-full bg-white/10 items-center justify-center">
              <X className="w-4 h-4 text-white" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
            <View className="flex-row gap-2 p-1 bg-brand-beige rounded-2xl">
              <Pressable
                onPress={() => {
                  setType('income');
                  setCategory('vente_recolte');
                }}
                className={`flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl ${type === 'income' ? 'bg-brand-green' : ''}`}
              >
                <ArrowDownLeft className={`w-4 h-4 ${type === 'income' ? 'text-white' : 'text-brand-brown'}`} />
                <Text className={`text-xs font-bold ${type === 'income' ? 'text-white' : 'text-brand-brown'}`}>{t.income}</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setType('expense');
                  setCategory('engrais');
                }}
                className={`flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl ${type === 'expense' ? 'bg-[#C53030]' : ''}`}
              >
                <ArrowUpRight className={`w-4 h-4 ${type === 'expense' ? 'text-white' : 'text-brand-brown'}`} />
                <Text className={`text-xs font-bold ${type === 'expense' ? 'text-white' : 'text-brand-brown'}`}>{t.expense}</Text>
              </Pressable>
            </View>

            <View>
              <Text className="text-xs font-bold text-brand-brown mb-1">{t.amount}</Text>
              <View className="relative flex-row items-center">
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="Ex: 250000"
                  keyboardType="numeric"
                  className="flex-1 bg-white border border-brand-beige rounded-xl pl-3 pr-12 py-2.5 text-sm font-bold text-brand-brown"
                />
                <Text className="absolute right-3 text-xs font-bold text-brand-brownLight">Ar</Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <SelectField
                  label={t.category}
                  value={category}
                  onChange={(v) => setCategory(v as FinancialEntry['category'])}
                  options={type === 'income' ? incomeCategories : expenseCategories}
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-brand-brown mb-1">{t.date}</Text>
                <TextInput value={date} onChangeText={setDate} placeholder="AAAA-MM-JJ" className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-medium text-brand-brown" />
              </View>
            </View>

            <View>
              <Text className="text-xs font-bold text-brand-brown mb-1">Culture liée (Optionnel)</Text>
              <TextInput
                value={cropRelated}
                onChangeText={setCropRelated}
                placeholder="Ex: Riz Makalioka, Café, Tomates..."
                className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-medium text-brand-brown"
              />
            </View>

            <View>
              <Text className="text-xs font-bold text-brand-brown mb-1">{t.description}</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Ex: Vente de 20 sacs de riz au marché"
                className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-medium text-brand-brown"
              />
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
