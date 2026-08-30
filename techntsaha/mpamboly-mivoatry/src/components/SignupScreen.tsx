import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Sprout,
  Store,
  ShoppingBag,
  Users,
  Layers,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  KeyRound,
  Sparkles,
  Check,
  ChevronDown,
  UserCheck,
  Eye,
  EyeOff,
} from '../lib/icons';
import { UserRole, Language, ScreenType, FarmerProfile } from '../types';
import { demoProfiles, regionsList } from '../data/mockData';
import { translations } from '../data/translations';

interface SignupScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  onSignup: (role: UserRole, profile: FarmerProfile, destinationScreen: ScreenType) => void;
  onSwitchToLogin: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ language, onToggleLanguage, onSignup, onSwitchToLogin }) => {
  const t = translations[language];
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [region, setRegion] = useState('Vakinankaratra');
  const [shopName, setShopName] = useState('');
  const [associationName, setAssociationName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('agriculteur');
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roles = [
    { id: 'agriculteur' as UserRole, labelFr: 'Agriculteur·rice', labelMg: 'Mpamboly', subFr: 'Cultures & IoT', subMg: 'Fambolena', icon: <Sprout className="w-4 h-4" />, theme: '#2D5A27' },
    { id: 'vendeur' as UserRole, labelFr: 'Vendeur·se', labelMg: 'Mpivarotra', subFr: 'Boutique & Vente', subMg: 'Fivarotana', icon: <Store className="w-4 h-4" />, theme: '#B45309' },
    { id: 'commercant' as UserRole, labelFr: 'Acheteur / Commerçant', labelMg: 'Mpividy', subFr: 'Sourcing Direct', subMg: 'Famatsiana', icon: <ShoppingBag className="w-4 h-4" />, theme: '#1E3A8A' },
    { id: 'association' as UserRole, labelFr: 'Association & Coop', labelMg: 'Koperativa', subFr: 'Force Collective', subMg: 'Fiaraha-miombona', icon: <Users className="w-4 h-4" />, theme: '#0F766E' },
    { id: 'all' as UserRole, labelFr: 'Vue Complète', labelMg: 'Tontolo Iray', subFr: 'Écosystème 360°', subMg: 'Fitaovana rehetra', icon: <Layers className="w-4 h-4" />, theme: '#4A3728' },
  ];

  const getDestinationScreen = (role: UserRole): ScreenType => {
    if (role === 'vendeur') return 'seller_shop';
    if (role === 'commercant') return 'buyer_hub';
    if (role === 'association') return 'association';
    return 'home';
  };

  const handleSignup = () => {
    if (!fullName.trim() || !phoneNumber.trim() || !pin || !confirmPin) {
      setError(language === 'fr' ? t.fillAllFields : 'Hampidira ireo laharana ilaina rehetra');
      return;
    }
    if (pin !== confirmPin) {
      setError(t.pinMismatch);
      return;
    }
    if (pin.length < 4) {
      setError(language === 'fr' ? 'PIN trop court (min 4 chiffres)' : 'Fohy loatra ny PIN (4 ny minimum)');
      return;
    }

    const baseProfile = demoProfiles[selectedRole] || demoProfiles.agriculteur;
    const customProfile: FarmerProfile = {
      ...baseProfile,
      name: fullName.trim(),
      phone: phoneNumber.trim(),
      location: region,
      region,
      activeRole: selectedRole,
      shopName: selectedRole === 'vendeur' ? shopName.trim() || baseProfile.shopName : baseProfile.shopName,
      associationName: selectedRole === 'association' ? associationName.trim() || baseProfile.cooperative : baseProfile.cooperative,
      mvolaNumber: phoneNumber.trim(),
      orangeMoneyNumber: baseProfile.orangeMoneyNumber,
    };

    const destScreen = getDestinationScreen(selectedRole);
    onSignup(selectedRole, customProfile, destScreen);
  };

  return (
    <ScrollView className="flex-1 bg-[#F5F2EB]" contentContainerStyle={{ padding: 14 }}>
      <View className="flex-row items-center justify-between gap-2 pb-3 border-b border-[#D7D3C6]">
        <View className="flex-row items-center gap-2">
          <View className="w-9 h-9 rounded-2xl bg-brand-green items-center justify-center">
            <Text className="text-lg">🌱</Text>
          </View>
          <View>
            <Text className="text-base font-black text-brand-green tracking-tight leading-tight">{t.appTitle}</Text>
            <Text className="text-[10px] text-[#706B5E] font-medium">{t.appSubtitle}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Pressable onPress={onToggleLanguage} className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-[#C4BFB1]">
            <Smartphone className="w-3.5 h-3.5 text-brand-green" />
            <Text className="text-[11px] font-bold text-brand-brown">{language === 'mg' ? 'MG 🇲🇬' : 'FR 🇲🇬'}</Text>
          </Pressable>
        </View>
      </View>

      <View className="mt-3 items-center">
        <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D5A27]/10">
          <UserCheck className="w-3 h-3 text-brand-green" />
          <Text className="text-[10px] font-extrabold uppercase tracking-wider text-brand-green">
            {language === 'fr' ? 'Inscription & Choix du Rôle' : 'Fisoratana & Safidiana Andraikitra'}
          </Text>
        </View>
        <Text className="text-lg font-black text-[#2A2621] tracking-tight mt-1.5 text-center">{t.signupTitle}</Text>
        <Text className="text-xs text-[#706B5E] leading-relaxed mt-1 text-center px-2">{t.signupSubtitle}</Text>
      </View>

      <View className="gap-3 bg-white p-4 rounded-3xl border border-[#D7D3C6] shadow-sm mt-3">
        {error && (
          <View className="p-2 bg-red-50 border border-red-200 rounded-xl">
            <Text className="text-red-700 text-xs font-medium">{error}</Text>
          </View>
        )}

        <View>
          <Text className="text-xs font-black text-brand-brown uppercase tracking-wider mb-1.5">{t.fullName}</Text>
          <View className="relative flex-row items-center">
            <View className="absolute left-3 z-10">
              <UserCheck className="w-4 h-4 text-brand-green" />
            </View>
            <TextInput value={fullName} onChangeText={setFullName} placeholder={t.fullNamePlaceholder} className="flex-1 pl-9 pr-3 py-2.5 bg-[#F5F2EB] border border-[#D7D3C6] rounded-2xl text-xs font-bold text-[#2A2621]" />
          </View>
        </View>

        <View>
          <Text className="text-xs font-black text-brand-brown uppercase tracking-wider mb-1">{t.phone}</Text>
          <View className="relative flex-row items-center">
            <View className="absolute left-3 z-10">
              <Smartphone className="w-4 h-4 text-brand-green" />
            </View>
            <TextInput value={phoneNumber} onChangeText={setPhoneNumber} placeholder={t.phonePlaceholder} keyboardType="phone-pad" className="flex-1 pl-9 pr-3 py-2.5 bg-[#F5F2EB] border border-[#D7D3C6] rounded-2xl text-xs font-bold text-[#2A2621]" />
          </View>
        </View>

        <View className="flex-row gap-2">
          <View className="flex-1">
            <Text className="text-xs font-black text-brand-brown uppercase tracking-wider mb-1">{t.pin}</Text>
            <View className="relative flex-row items-center">
              <View className="absolute left-3 z-10">
                <KeyRound className="w-4 h-4 text-[#B45309]" />
              </View>
              <TextInput value={pin} onChangeText={setPin} placeholder={t.pinPlaceholder} secureTextEntry={!showPin} keyboardType="number-pad" className="flex-1 pl-9 pr-10 py-2.5 bg-[#F5F2EB] border border-[#D7D3C6] rounded-2xl text-xs font-bold text-[#2A2621]" />
              <Pressable onPress={() => setShowPin(!showPin)} className="absolute right-3 z-10">
                {showPin ? <EyeOff className="w-4 h-4 text-[#706B5E]" /> : <Eye className="w-4 h-4 text-[#706B5E]" />}
              </Pressable>
            </View>
          </View>
          <View className="flex-1">
            <Text className="text-xs font-black text-brand-brown uppercase tracking-wider mb-1">{t.confirmPin}</Text>
            <View className="relative flex-row items-center">
              <View className="absolute left-3 z-10">
                <KeyRound className="w-4 h-4 text-[#B45309]" />
              </View>
              <TextInput value={confirmPin} onChangeText={setConfirmPin} placeholder={t.confirmPinPlaceholder} secureTextEntry={!showConfirmPin} keyboardType="number-pad" className="flex-1 pl-9 pr-10 py-2.5 bg-[#F5F2EB] border border-[#D7D3C6] rounded-2xl text-xs font-bold text-[#2A2621]" />
              <Pressable onPress={() => setShowConfirmPin(!showConfirmPin)} className="absolute right-3 z-10">
                {showConfirmPin ? <EyeOff className="w-4 h-4 text-[#706B5E]" /> : <Eye className="w-4 h-4 text-[#706B5E]" />}
              </Pressable>
            </View>
          </View>
        </View>

        <View>
          <Text className="text-xs font-black text-brand-brown uppercase tracking-wider mb-1">{t.selectRegion}</Text>
          <View className="relative flex-row items-center">
            <View className="absolute left-3 z-10">
              <Sprout className="w-4 h-4 text-brand-green" />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1 pl-9 pr-1 py-1">
              <View className="flex-row items-center gap-1.5">
                {regionsList.map((r) => {
                  const isSelected = region === r;
                  return (
                    <Pressable key={r} onPress={() => setRegion(r)} className={`px-3 py-1.5 rounded-xl border ${isSelected ? 'bg-brand-green border-brand-green' : 'bg-white border-[#D7D3C6]'}`}>
                      <Text className={`text-[10px] font-bold ${isSelected ? 'text-white' : 'text-brand-brown'}`}>{r}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>

        <View>
          <Text className="text-xs font-black text-brand-brown uppercase tracking-wider mb-1">{t.chooseRole}</Text>
          <View className="flex-row flex-wrap gap-2">
            {roles.map((role) => {
              const isSelected = selectedRole === role.id;
              return (
                <Pressable key={role.id} onPress={() => setSelectedRole(role.id)} className={`p-2.5 rounded-2xl border-2 flex-row items-center gap-2 ${isSelected ? 'border-brand-green bg-emerald-50/70' : 'border-brand-beige'}`} style={{ width: '48%' }}>
                  <View className={`w-7 h-7 rounded-xl items-center justify-center ${isSelected ? 'bg-brand-green' : 'bg-brand-beige'}`}>
                    {React.cloneElement(role.icon as React.ReactElement, { className: `w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-brand-brown'}` })}
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-[#2A2621]" numberOfLines={1}>{language === 'fr' ? role.labelFr : role.labelMg}</Text>
                    <Text className="text-[9px] text-[#706B5E]" numberOfLines={1}>{language === 'fr' ? role.subFr : role.subMg}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {selectedRole === 'vendeur' && (
          <View>
            <Text className="text-xs font-black text-brand-brown uppercase tracking-wider mb-1">{t.shopName}</Text>
            <View className="relative flex-row items-center">
              <View className="absolute left-3 z-10">
                <Store className="w-4 h-4 text-amber-700" />
              </View>
              <TextInput value={shopName} onChangeText={setShopName} placeholder={t.shopNamePlaceholder} className="flex-1 pl-9 pr-3 py-2.5 bg-[#F5F2EB] border border-[#D7D3C6] rounded-2xl text-xs font-bold text-[#2A2621]" />
            </View>
          </View>
        )}

        {selectedRole === 'association' && (
          <View>
            <Text className="text-xs font-black text-brand-brown uppercase tracking-wider mb-1">{t.associationName}</Text>
            <View className="relative flex-row items-center">
              <View className="absolute left-3 z-10">
                <Users className="w-4 h-4 text-teal-800" />
              </View>
              <TextInput value={associationName} onChangeText={setAssociationName} placeholder={t.associationNamePlaceholder} className="flex-1 pl-9 pr-3 py-2.5 bg-[#F5F2EB] border border-[#D7D3C6] rounded-2xl text-xs font-bold text-[#2A2621]" />
            </View>
          </View>
        )}
      </View>

      <Pressable onPress={handleSignup} className="w-full py-3.5 px-4 bg-brand-green rounded-2xl flex-row items-center justify-center gap-2 mt-4">
        <Check className="w-4 h-4 text-white" />
        <Text className="text-white font-black text-sm">{t.signupButton}</Text>
        <ArrowRight className="w-4 h-4 text-white" />
      </Pressable>

      <View className="mt-3 py-2 px-3 bg-white/70 rounded-2xl border border-[#D7D3C6] flex-row items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
        <Text className="text-[10px] text-[#706B5E] text-center flex-1">
          {language === 'fr' ? 'Données stockées localement · Fonctionne 100% en brousse sans connexion Internet' : "Voatahiry ato an-toerana ny angona · Miasa 100% any an-tsaha na tsy misy aterineto aza"}
        </Text>
      </View>

      <Pressable onPress={onSwitchToLogin} className="mt-3 py-2 items-center">
        <Text className="text-xs font-bold text-brand-green">{t.alreadyHaveAccount} <Text className="underline">{t.goToLogin}</Text></Text>
      </Pressable>
    </ScrollView>
  );
};
