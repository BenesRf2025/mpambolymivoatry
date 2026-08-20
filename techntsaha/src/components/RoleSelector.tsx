import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { UserRole } from '../types';
import { Sprout, Store, ShoppingBag, Users, Layers, Info } from '../lib/icons';
import { translations } from '../data/translations';

interface RoleSelectorProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  lang: 'fr' | 'mg';
  compact?: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  currentRole,
  onSelectRole,
  lang,
  compact = false,
}) => {
  const t = translations[lang];

  const roles: {
    id: UserRole;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    bgActive: string;
  }[] = [
    {
      id: 'all',
      label: lang === 'fr' ? 'Vue Unifiée' : 'Tontolo Iray',
      sublabel: lang === 'fr' ? 'Écosystème complet' : 'Ny andraikitra rehetra',
      icon: <Layers className="w-4 h-4" />,
      bgActive: 'bg-[#5B7553]',
    },
    {
      id: 'agriculteur',
      label: lang === 'fr' ? 'Agriculteur·rice' : 'Mpamboly',
      sublabel: lang === 'fr' ? 'Cultures & IoT' : 'Mamboly & Fanaraha-maso',
      icon: <Sprout className="w-4 h-4" />,
      bgActive: 'bg-[#5B7553]',
    },
    {
      id: 'vendeur',
      label: lang === 'fr' ? 'Vendeur·se' : 'Mpivarotra',
      sublabel: lang === 'fr' ? 'Boutique & Vente' : 'Fivarotana & MVola',
      icon: <Store className="w-4 h-4" />,
      bgActive: 'bg-amber-700',
    },
    {
      id: 'commercant',
      label: lang === 'fr' ? 'Acheteur / Commerçant' : 'Mpividy / Mpiantoka',
      sublabel: lang === 'fr' ? 'Direct Producteur' : 'Mividy mivantana',
      icon: <ShoppingBag className="w-4 h-4" />,
      bgActive: 'bg-stone-800',
    },
    {
      id: 'association',
      label: lang === 'fr' ? 'Association & Coop' : 'Fikambanana & Koperativa',
      sublabel: lang === 'fr' ? 'Force du Collectif' : 'Tahiry & Fizarana 95/5',
      icon: <Users className="w-4 h-4" />,
      bgActive: 'bg-teal-800',
    },
  ];

  if (compact) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="w-full py-1">
        <View className="flex-row items-center gap-1.5">
          {roles.map((r) => {
            const isSelected = currentRole === r.id;
            return (
              <Pressable
                key={r.id}
                onPress={() => onSelectRole(r.id)}
                className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full ${
                  isSelected ? `${r.bgActive} shadow-sm` : 'bg-[#E3DFD2]/70'
                }`}
              >
                {React.cloneElement(r.icon as React.ReactElement<any>, {
                  className: `w-4 h-4 ${isSelected ? 'text-white' : 'text-stone-700'}`,
                })}
                <Text className={`text-xs font-medium ${isSelected ? 'text-white font-semibold' : 'text-stone-700'}`}>
                  {r.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  return (
    <View className="bg-[#EBE7DC] rounded-2xl p-3 border border-[#D7D3C6] shadow-sm">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            {t.rolesTitle}
          </Text>
          <Text className="text-[10px] px-2 py-0.5 rounded-full bg-[#5B7553]/15 text-[#5B7553] font-medium">
            Tech'Ntsaha 2026
          </Text>
        </View>
        <Text className="text-[11px] text-stone-500 font-medium">
          {roles.find((r) => r.id === currentRole)?.label}
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {roles.map((r) => {
          const isSelected = currentRole === r.id;
          return (
            <Pressable
              key={r.id}
              onPress={() => onSelectRole(r.id)}
              className={`items-start p-2.5 rounded-xl border ${
                isSelected ? `${r.bgActive} border-transparent shadow-md` : 'bg-white/80 border-stone-200/80'
              }`}
              style={{ width: '48%' }}
            >
              <View className={`p-1.5 rounded-lg mb-1.5 ${isSelected ? 'bg-white/20' : 'bg-stone-100'}`}>
                {React.cloneElement(r.icon as React.ReactElement<any>, {
                  className: `w-4 h-4 ${isSelected ? 'text-white' : 'text-stone-800'}`,
                })}
              </View>
              <Text
                numberOfLines={1}
                className={`font-semibold text-xs leading-tight ${isSelected ? 'text-white' : 'text-stone-800'}`}
              >
                {r.label}
              </Text>
              <Text
                numberOfLines={1}
                className={`text-[10px] leading-tight mt-0.5 ${isSelected ? 'text-white/80' : 'text-stone-500'}`}
              >
                {r.sublabel}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-2.5 pt-2 border-t border-[#D7D3C6]/60 flex-row items-start gap-1.5">
        <Info className="w-3.5 h-3.5 mt-0.5 text-[#5B7553]" />
        <Text className="text-[11px] text-stone-600 flex-1">{t.dualRoleNotice}</Text>
      </View>
    </View>
  );
};
