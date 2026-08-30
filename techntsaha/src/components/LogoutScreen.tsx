import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  LogOut,
  ArrowRight,
  ShieldCheck,
  Sprout,
  Store,
  ShoppingBag,
  Users,
  Layers,
  Globe,
} from '../lib/icons';
import { UserRole, Language, ScreenType } from '../types';
import { OfflineIndicator } from './OfflineIndicator';

interface LogoutScreenProps {
  language: Language;
  activeRole: UserRole;
  userName: string;
  onToggleLanguage: () => void;
  onNavigate: (screen: ScreenType) => void;
  onConfirmLogout: () => void;
}

const roleInfo: Record<UserRole, { labelFr: string; labelMg: string; icon: React.ReactNode; color: string }> = {
  agriculteur: {
    labelFr: 'Agriculteur·rice',
    labelMg: 'Mpamboly',
    icon: <Sprout className="w-8 h-8 text-emerald-800" />,
    color: '#2D5A27',
  },
  vendeur: {
    labelFr: 'Vendeur·se',
    labelMg: 'Mpivarotra',
    icon: <Store className="w-8 h-8 text-amber-800" />,
    color: '#B45309',
  },
  commercant: {
    labelFr: 'Commerçant·e',
    labelMg: 'Mpiantoka',
    icon: <ShoppingBag className="w-8 h-8 text-blue-800" />,
    color: '#1E3A8A',
  },
  acheteur: {
    labelFr: 'Acheteur·euse',
    labelMg: 'Mpividy',
    icon: <ShoppingBag className="w-8 h-8 text-indigo-800" />,
    color: '#3730A3',
  },
  association: {
    labelFr: 'Association',
    labelMg: 'Koperativa',
    icon: <Users className="w-8 h-8 text-teal-800" />,
    color: '#0F766E',
  },
  administrateur: {
    labelFr: 'Administrateur',
    labelMg: 'Mpitantana',
    icon: <ShieldCheck className="w-8 h-8 text-purple-800" />,
    color: '#7C3AED',
  },
  all: {
    labelFr: 'Vue Complète',
    labelMg: 'Tontolo Iray',
    icon: <Layers className="w-8 h-8 text-[#4A3728]" />,
    color: '#4A3728',
  },
};

export const LogoutScreen: React.FC<LogoutScreenProps> = ({
  language,
  activeRole,
  userName,
  onToggleLanguage,
  onNavigate,
  onConfirmLogout,
}) => {
  const role = roleInfo[activeRole] || roleInfo.all;

  return (
    <ScrollView className="flex-1 bg-[#F5F2EB]" contentContainerStyle={{ padding: 16 }}>
      {/* Header */}
      <View className="flex-row items-center justify-between gap-2 pb-3 border-b border-[#D7D3C6]">
        <View className="flex-row items-center gap-2">
          <View className="w-9 h-9 rounded-2xl bg-brand-green items-center justify-center">
            <Text className="text-lg">🌱</Text>
          </View>
          <View>
            <Text className="text-base font-black text-brand-green tracking-tight leading-tight">
              MpambolyMivoatry
            </Text>
            <Text className="text-[10px] text-[#706B5E] font-medium">Tech'Ntsaha Madagascar 2026</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1.5">
          <OfflineIndicator language={language} variant="badge" />
          <Pressable
            onPress={onToggleLanguage}
            className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-[#C4BFB1]"
          >
            <Globe className="w-3.5 h-3.5 text-brand-green" />
            <Text className="text-[11px] font-bold text-brand-brown">{language === 'mg' ? 'MG 🇲🇬' : 'FR 🇲🇬'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Logout Card */}
      <View className="mt-6 items-center">
        <View
          className="w-20 h-20 rounded-3xl items-center justify-center border-2"
          style={{ backgroundColor: role.color + '15', borderColor: role.color }}
        >
          {role.icon}
        </View>

        <Text className="text-xl font-black text-[#2A2621] mt-4 text-center">
          {userName}
        </Text>
        <Text className="text-sm font-bold mt-1" style={{ color: role.color }}>
          {language === 'fr' ? role.labelFr : role.labelMg}
        </Text>
      </View>

      {/* Confirmation Card */}
      <View className="mt-6 bg-white rounded-3xl border border-[#D7D3C6] p-5">
        <View className="flex-row items-center gap-3 mb-4">
          <View className="w-12 h-12 rounded-2xl bg-red-50 items-center justify-center border border-red-200">
            <LogOut className="w-6 h-6 text-red-600" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-black text-[#2A2621]">
              {language === 'fr' ? 'Se déconnecter ?' : 'Hialaavo ?'}
            </Text>
            <Text className="text-xs text-[#706B5E] mt-0.5">
              {language === 'fr'
                ? 'Voulez-vous vraiment quitter votre session ?'
                : 'Tena te hialaavo ve ianao?'
              }
            </Text>
          </View>
        </View>

        <View className="p-3 bg-[#F5F2EB] rounded-2xl border border-[#D7D3C6] mb-4">
          <Text className="text-xs text-[#706B5E] text-center">
            {language === 'fr'
              ? 'Vos données sont sauvegardées localement. Vous pourrez vous reconnecter à tout moment avec votre jeton d\'accès.'
              : 'Voatahiry ao an-toerana ny angonao. Afaka miverina hiditra ianao amin\'ny alalan\'ny tokana.'
            }
          </Text>
        </View>

        {/* Confirm Logout Button */}
        <Pressable
          onPress={onConfirmLogout}
          className="w-full py-3.5 px-4 bg-red-600 rounded-2xl flex-row items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4 text-white" />
          <Text className="text-white font-black text-sm">
            {language === 'fr' ? 'Confirmer la déconnexion' : 'Hanamarina ny fialavana'}
          </Text>
          <ArrowRight className="w-4 h-4 text-white" />
        </Pressable>

        {/* Cancel Button */}
        <Pressable
          onPress={() => onNavigate('home')}
          className="w-full py-3 px-4 bg-[#F5F2EB] rounded-2xl flex-row items-center justify-center gap-2 mt-3 border border-[#D7D3C6]"
        >
          <Text className="text-brand-brown font-bold text-sm">
            {language === 'fr' ? 'Annuler et retour' : 'Foana miverina'}
          </Text>
        </Pressable>
      </View>

      {/* Role Summary */}
      <LinearGradient
        colors={[role.color, role.color + 'CC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="mt-6 rounded-3xl p-4"
      >
        <Text className="text-white/80 text-[10px] font-bold uppercase tracking-wider">
          {language === 'fr' ? 'Résumé de votre session' : 'Famintinana ny session'}
        </Text>
        <View className="flex-row items-center gap-3 mt-2">
          <View className="w-10 h-10 rounded-xl bg-white/20 items-center justify-center">
            {role.icon}
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-sm">
              {language === 'fr' ? role.labelFr : role.labelMg}
            </Text>
            <Text className="text-white/70 text-xs">
              {language === 'fr' ? 'Espace dédié actif' : 'Toerana manokana mandeha'}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Footer */}
      <View className="mt-6 py-2 px-3 bg-white/70 rounded-2xl border border-[#D7D3C6] flex-row items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
        <Text className="text-[10px] text-[#706B5E] text-center flex-1">
          {language === 'fr'
            ? 'Données stockées localement · Fonctionne 100% en brousse sans connexion Internet'
            : "Voatahiry ato an-toerana ny angona · Miasa 100% any an-tsaha na tsy misy aterineto aza"}
        </Text>
      </View>
    </ScrollView>
  );
};
