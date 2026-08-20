import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Plus, ArrowUpRight, ArrowDownLeft, Trash2, MapPin } from '../lib/icons';
import { FinancialEntry, FarmerProfile, Crop, Language } from '../types';
import { translations } from '../data/translations';

interface ManagementScreenProps {
  farmer: FarmerProfile;
  transactions: FinancialEntry[];
  crops: Crop[];
  language: Language;
  onOpenNewTransaction: () => void;
  onDeleteTransaction: (id: string) => void;
}

export const ManagementScreen: React.FC<ManagementScreenProps> = ({
  farmer,
  transactions,
  crops,
  language,
  onOpenNewTransaction,
  onDeleteTransaction,
}) => {
  const t = translations[language];
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const totalIncome = transactions.filter((tr) => tr.type === 'income').reduce((sum, tr) => sum + tr.amount, 0);
  const totalExpense = transactions.filter((tr) => tr.type === 'expense').reduce((sum, tr) => sum + tr.amount, 0);
  const netBalance = totalIncome - totalExpense;
  const totalYieldKg = crops.reduce((sum, c) => sum + (c.harvestYieldKg || 0), 0);

  const filteredTransactions = transactions.filter((tr) => (filter === 'all' ? true : tr.type === filter));

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 32 }}>
      {/* Header */}
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-xl font-bold text-brand-green tracking-tight">{t.managementTitle}</Text>
          <Text className="text-xs text-brand-brownLight">{t.managementSubtitle}</Text>
        </View>
        <Pressable onPress={onOpenNewTransaction} className="bg-brand-green px-3 py-2 rounded-xl flex-row items-center gap-1.5">
          <Plus className="w-4 h-4 text-white" />
          <Text className="text-white text-xs font-bold">{t.addTransaction}</Text>
        </Pressable>
      </View>

      {/* Farmer Profile Card */}
      <View className="bg-white p-4 rounded-3xl border border-brand-beige">
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-2xl bg-[#F2F8F1] items-center justify-center border border-brand-green/20">
            <Text className="font-extrabold text-lg text-brand-green">{farmer.name.charAt(0)}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-brand-brown leading-tight">{farmer.name}</Text>
            <View className="flex-row items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-brand-green" />
              <Text className="text-[11px] text-brand-brownLight">{farmer.location}</Text>
            </View>
            <Text className="text-[10px] text-brand-green font-semibold mt-0.5">{farmer.cooperative}</Text>
          </View>
        </View>

        <View className="flex-row gap-2 mt-3 pt-3 border-t border-brand-beige">
          <View className="flex-1">
            <Text className="text-[10px] text-brand-brownLight">Surface Totale</Text>
            <Text className="text-brand-brown font-bold text-xs">{farmer.totalLandArea}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[10px] text-brand-brownLight">Estimation Récolte</Text>
            <Text className="text-brand-green font-bold text-xs">{totalYieldKg.toLocaleString()} kg</Text>
          </View>
        </View>
      </View>

      {/* Financial Overview Card */}
      <View className="bg-brand-green rounded-3xl p-5 border border-brand-greenDark">
        <Text className="text-xs text-brand-beige font-semibold uppercase tracking-wider">{t.netProfit} (Solde Net)</Text>
        <Text className="text-3xl font-extrabold text-[#FFD700] tracking-tight mt-1">
          {netBalance >= 0 ? '+' : ''}
          {netBalance.toLocaleString()} Ar
        </Text>

        <View className="flex-row gap-3 pt-3 mt-4 border-t border-white/15">
          <View className="flex-1 bg-white/10 p-3 rounded-2xl border border-white/10">
            <View className="flex-row items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5 text-[#FFD700]" />
              <Text className="text-[10px] uppercase font-bold text-brand-beige">{t.income}</Text>
            </View>
            <Text className="text-base font-bold text-white mt-1">{totalIncome.toLocaleString()} Ar</Text>
          </View>

          <View className="flex-1 bg-white/10 p-3 rounded-2xl border border-white/10">
            <View className="flex-row items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-red-300" />
              <Text className="text-[10px] uppercase font-bold text-brand-beige">{t.expense}</Text>
            </View>
            <Text className="text-base font-bold text-white mt-1">{totalExpense.toLocaleString()} Ar</Text>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="flex-row gap-2">
        <Pressable onPress={() => setFilter('all')} className={`flex-1 py-2 rounded-xl items-center ${filter === 'all' ? 'bg-brand-green' : 'bg-brand-beige'}`}>
          <Text className={`text-xs font-bold ${filter === 'all' ? 'text-white' : 'text-brand-brown'}`}>{language === 'mg' ? 'Rehetra' : 'Toutes'}</Text>
        </Pressable>
        <Pressable onPress={() => setFilter('income')} className={`flex-1 py-2 rounded-xl items-center ${filter === 'income' ? 'bg-brand-green' : 'bg-brand-beige'}`}>
          <Text className={`text-xs font-bold ${filter === 'income' ? 'text-white' : 'text-brand-brown'}`}>{t.income}</Text>
        </Pressable>
        <Pressable onPress={() => setFilter('expense')} className={`flex-1 py-2 rounded-xl items-center ${filter === 'expense' ? 'bg-[#C53030]' : 'bg-brand-beige'}`}>
          <Text className={`text-xs font-bold ${filter === 'expense' ? 'text-white' : 'text-brand-brown'}`}>{t.expense}</Text>
        </Pressable>
      </View>

      {/* Transactions List */}
      <View className="gap-2.5">
        <Text className="text-xs font-bold text-brand-brown uppercase tracking-wider">
          {language === 'mg' ? 'Tantara ara-bola' : 'Historique des Opérations'}
        </Text>

        {filteredTransactions.length === 0 ? (
          <View className="bg-white p-6 rounded-2xl border border-brand-beige items-center">
            <Text className="text-xs text-brand-brownLight">Aucune opération enregistrée.</Text>
          </View>
        ) : (
          filteredTransactions.map((trx) => {
            const isIncome = trx.type === 'income';
            return (
              <View key={trx.id} className="bg-white p-3.5 rounded-2xl border border-brand-beige flex-row items-center justify-between gap-3">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className={`w-9 h-9 rounded-xl items-center justify-center ${isIncome ? 'bg-[#F2F8F1]' : 'bg-[#FDF5EB]'}`}>
                    {isIncome ? <ArrowDownLeft className="w-4 h-4 text-brand-green" /> : <ArrowUpRight className="w-4 h-4 text-[#C53030]" />}
                  </View>

                  <View className="flex-1">
                    <Text className="text-xs font-bold text-brand-brown leading-tight" numberOfLines={1}>
                      {trx.description}
                    </Text>
                    <View className="flex-row items-center gap-2 mt-0.5">
                      <Text className="text-[10px] text-brand-brownLight">{trx.date}</Text>
                      {trx.cropRelated && (
                        <Text className="bg-brand-beige px-1.5 py-0.5 rounded-md font-semibold text-brand-brown text-[10px]">{trx.cropRelated}</Text>
                      )}
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center gap-2">
                  <Text className={`text-xs font-extrabold ${isIncome ? 'text-brand-green' : 'text-[#C53030]'}`}>
                    {isIncome ? '+' : '-'}
                    {trx.amount.toLocaleString()} Ar
                  </Text>

                  <Pressable onPress={() => onDeleteTransaction(trx.id)} className="p-1 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5 text-brand-brownLight" />
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};
