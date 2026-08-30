import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ShieldCheck,
  Smartphone,
  KeyRound,
  Sparkles,
  Lock,
  Globe,
  Eye,
  EyeOff,
  UserCheck,
  ArrowRight,
  UserPlus,
} from '../lib/icons';
import { Language, ScreenType, FarmerProfile, UserRole } from '../types';
import { OfflineIndicator } from './OfflineIndicator';

interface LoginScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  onLogin: (profile: FarmerProfile, role: UserRole, destinationScreen: ScreenType) => void;
  onRegister?: (user: { name: string; phone: string; password: string; role: UserRole }) => boolean;
  apiAvailable?: boolean;
  apiBaseURL?: string;
  onSetApiBaseURL?: (url: string) => void;
}

interface RegisteredUser {
  id: string;
  name: string;
  phone: string;
  password: string;
  role: UserRole;
}

interface AdminToken {
  token: string;
  role: UserRole;
  used: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  language, 
  onToggleLanguage, 
  onLogin, 
  onRegister,
  apiAvailable, 
  apiBaseURL, 
  onSetApiBaseURL 
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginToken, setLoginToken] = useState('');

  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regToken, setRegToken] = useState('');
  const [tokenError, setTokenError] = useState<string | null>(null);

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [adminTokens, setAdminTokens] = useState<AdminToken[]>([]);

  const loadData = useCallback(async () => {
    try {
      const usersData = await AsyncStorage.getItem('mpamboly_users');
      const tokensData = await AsyncStorage.getItem('mpamboly_admin_tokens');
      if (usersData) setRegisteredUsers(JSON.parse(usersData));
      if (tokensData) setAdminTokens(JSON.parse(tokensData));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const saveUsers = async (users: RegisteredUser[]) => {
    await AsyncStorage.setItem('mpamboly_users', JSON.stringify(users));
    setRegisteredUsers(users);
  };

  const saveTokens = async (tokens: AdminToken[]) => {
    await AsyncStorage.setItem('mpamboly_admin_tokens', JSON.stringify(tokens));
    setAdminTokens(tokens);
  };

  const validateAdminToken = (token: string): { valid: boolean; role?: UserRole } => {
    const found = adminTokens.find(t => t.token === token && !t.used);
    if (found) {
      return { valid: true, role: found.role };
    }
    return { valid: false };
  };

  const markTokenAsUsed = async (token: string) => {
    const updated = adminTokens.map(t => 
      t.token === token ? { ...t, used: true } : t
    );
    await saveTokens(updated);
  };

  const handleLogin = async () => {
    setFormError(null);
    setSuccessMessage(null);

    if (!loginPhone.trim() || !loginPassword.trim()) {
      setFormError(language === 'fr' ? 'Veuillez remplir tous les champs' : 'Mampidira ny laharana finday sy kaody');
      return;
    }

    if (loginToken.trim()) {
      const validation = validateAdminToken(loginToken.trim());
      if (validation.valid && validation.role) {
        const user: RegisteredUser = {
          id: 'u-' + Date.now(),
          name: loginPhone,
          phone: loginPhone,
          password: loginPassword,
          role: validation.role,
        };
        const updatedUsers = [...registeredUsers, user];
        await saveUsers(updatedUsers);
        await markTokenAsUsed(loginToken.trim());
        
        const profile: FarmerProfile = {
          name: user.name,
          phone: user.phone,
          location: 'Madagascar',
          region: 'Analamanga',
          cooperative: '',
          totalLandArea: '0',
          memberSince: new Date().toISOString().split('T')[0],
          activeRole: user.role,
        };
        onLogin(profile, user.role, 'home');
        return;
      } else {
        setFormError(language === 'fr' ? 'Jeton invalide ou déjà utilisé' : 'Tokana tsy mety na efa nampiasaina');
        return;
      }
    }

    const user = registeredUsers.find(u => u.phone === loginPhone.trim() && u.password === loginPassword);
    if (user) {
      const profile: FarmerProfile = {
        name: user.name,
        phone: user.phone,
        location: 'Madagascar',
        region: 'Analamanga',
        cooperative: '',
        totalLandArea: '0',
        memberSince: new Date().toISOString().split('T')[0],
        activeRole: user.role,
      };
      onLogin(profile, user.role, 'home');
    } else {
      setFormError(language === 'fr' ? 'Téléphone ou mot de passe incorrect' : 'Laharan\'ny finday na kaody diso');
    }
  };

  const handleRegister = async () => {
    setFormError(null);
    setTokenError(null);

    if (!regName.trim() || !regPhone.trim() || !regPassword.trim() || !regConfirmPassword.trim()) {
      setFormError(language === 'fr' ? 'Veuillez remplir tous les champs' : 'Mampidira ny laharana rehetra');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setFormError(language === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Ny kaody dia mitovy');
      return;
    }

    if (regPassword.length < 4) {
      setFormError(language === 'fr' ? 'Le mot de passe doit contenir au moins 4 caractères' : 'Ny kaody dia mila litera 4 kokoa');
      return;
    }

    let role: UserRole = 'agriculteur';

    if (regToken.trim()) {
      const validation = validateAdminToken(regToken.trim());
      if (validation.valid && validation.role) {
        role = validation.role;
        await markTokenAsUsed(regToken.trim());
      } else {
        setTokenError(language === 'fr' ? 'Jeton admin invalide ou déjà utilisé' : 'Tokana admin tsy mety');
        return;
      }
    }

    const existingUser = registeredUsers.find(u => u.phone === regPhone.trim());
    if (existingUser) {
      setFormError(language === 'fr' ? 'Ce numéro est déjà enregistré' : 'Ity laharana ity dia efa misy');
      return;
    }

    const newUser: RegisteredUser = {
      id: 'u-' + Date.now(),
      name: regName.trim(),
      phone: regPhone.trim(),
      password: regPassword,
      role: role,
    };

    await saveUsers([...registeredUsers, newUser]);
    
    if (onRegister) {
      onRegister(newUser);
    }

    setSuccessMessage(language === 'fr' ? 'Inscription réussie ! Vous pouvez vous connecter.' : 'Nahomby ny fanidirana !');
    setRegName('');
    setRegPhone('');
    setRegPassword('');
    setRegConfirmPassword('');
    setRegToken('');
    setActiveTab('login');
  };

  return (
    <ScrollView className="flex-1 bg-[#F5F2EB]" contentContainerStyle={{ padding: 14 }}>
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
            <Text className="text-[10px] text-[#706B5E] font-medium">Tech&apos;Ntsaha Madagascar 2026</Text>
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

      {/* Hero */}
      <View className="mt-3 items-center">
        <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D5A27]/10">
          <Sparkles className="w-3 h-3 text-brand-green" />
          <Text className="text-[10px] font-extrabold uppercase tracking-wider text-brand-green">
            {language === 'fr' ? 'Plateforme Agricole Connectée' : 'Sehatra Fambolena Mifandray'}
          </Text>
        </View>
        <Text className="text-lg font-black text-[#2A2621] tracking-tight mt-1.5 text-center">
          {language === 'fr' ? 'Bienvenue' : "Tongasoa"}
        </Text>
        <Text className="text-xs text-[#706B5E] leading-relaxed mt-1 text-center px-2">
          {language === 'fr'
            ? 'Connectez-vous avec votre numéro de téléphone ou inscrivez-vous pour accéder à la plateforme.'
            : "Ampidiro ny laharana findayao na hiditra amin'ny sehatra."}
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row p-1 bg-brand-beige rounded-2xl border border-[#C4BFB1] mt-3">
        <Pressable
          onPress={() => { setActiveTab('login'); setFormError(null); setSuccessMessage(null); }}
          className={`flex-1 py-2.5 px-3 rounded-xl flex-row items-center justify-center gap-1.5 ${
            activeTab === 'login' ? 'bg-white shadow-sm' : ''
          }`}
        >
          <UserCheck className="w-4 h-4 text-brand-green" />
          <Text className={`text-xs font-bold ${activeTab === 'login' ? 'text-brand-green' : 'text-[#706B5E]'}`}>
            {language === 'fr' ? 'Connexion' : 'Fidirana'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => { setActiveTab('register'); setFormError(null); setSuccessMessage(null); }}
          className={`flex-1 py-2.5 px-3 rounded-xl flex-row items-center justify-center gap-1.5 ${
            activeTab === 'register' ? 'bg-white shadow-sm' : ''
          }`}
        >
          <UserPlus className="w-4 h-4 text-brand-green" />
          <Text className={`text-xs font-bold ${activeTab === 'register' ? 'text-brand-green' : 'text-[#706B5E]'}`}>
            {language === 'fr' ? 'Inscription' : 'Fisoratana Anarana'}
          </Text>
        </Pressable>
      </View>

      {/* LOGIN TAB */}
      {activeTab === 'login' && (
        <View className="mt-3">
          <View className="gap-3 bg-white p-5 rounded-3xl border border-[#D7D3C6] shadow-sm">
            {/* Token Login */}
            <View>
              <Text className="text-xs font-black text-brand-brown uppercase tracking-wider mb-2">
                {language === 'fr' ? 'Connexion par jeton admin' : 'Fidirana amin\'ny tokana admin'}
              </Text>
              <View className="flex-row items-center gap-2">
                <View className="flex-1 relative flex-row items-center">
                  <View className="absolute left-3 z-10">
                    <KeyRound className="w-4 h-4 text-brand-green" />
                  </View>
                  <TextInput
                    value={loginToken}
                    onChangeText={(text) => {
                      setLoginToken(text);
                      setFormError(null);
                    }}
                    placeholder={language === 'fr' ? 'Ex: MPA-2026-ABCD' : 'Ohatra: MPA-2026-ABCD'}
                    autoCapitalize="characters"
                    className="flex-1 pl-9 pr-3 py-2.5 bg-[#F5F2EB] border border-[#D7D3C6] rounded-xl text-xs font-bold text-[#2A2621]"
                  />
                </View>
              </View>
              <Text className="text-[10px] text-[#706B5E] mt-1">
                {language === 'fr' ? 'Utilisez le jeton fourni par l\'administrateur' : 'Ampiasao ny tokana omen\'ny mpitantana'}
              </Text>
            </View>

            <View className="flex-row items-center my-1 px-1">
              <View className="flex-1 h-px bg-[#D7D3C6]" />
              <Text className="px-3 text-[10px] font-bold text-[#706B5E]">
                {language === 'fr' ? 'OU' : 'NA'}
              </Text>
              <View className="flex-1 h-px bg-[#D7D3C6]" />
            </View>

            {/* Phone */}
            <View>
              <Text className="text-xs font-black text-brand-brown uppercase tracking-wider mb-1.5">
                {language === 'fr' ? 'Numéro de téléphone' : 'Laharan\'ny finday'}
              </Text>
              <View className="relative flex-row items-center">
                <View className="absolute left-3 z-10">
                  <Smartphone className="w-4 h-4 text-brand-green" />
                </View>
                <TextInput
                  value={loginPhone}
                  onChangeText={setLoginPhone}
                  placeholder="034 88 123 45"
                  keyboardType="phone-pad"
                  className="flex-1 pl-9 pr-3 py-2.5 bg-[#F5F2EB] border border-[#D7D3C6] rounded-2xl text-xs font-bold text-[#2A2621]"
                />
              </View>
            </View>

            {/* Password */}
            <View>
              <Text className="text-xs font-black text-brand-brown uppercase tracking-wider mb-1.5">
                {language === 'fr' ? 'Mot de passe' : 'Teny miafina'}
              </Text>
              <View className="relative flex-row items-center">
                <View className="absolute left-3 z-10">
                  <Lock className="w-4 h-4 text-[#B45309]" />
                </View>
                <TextInput
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                  placeholder={language === 'fr' ? 'Votre mot de passe' : 'Teny miafina'}
                  secureTextEntry={!showPassword}
                  className="flex-1 pl-9 pr-10 py-2.5 bg-[#F5F2EB] border border-[#D7D3C6] rounded-2xl text-xs font-bold text-[#2A2621]"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} className="absolute right-3 z-10">
                  {showPassword ? <EyeOff className="w-4 h-4 text-[#706B5E]" /> : <Eye className="w-4 h-4 text-[#706B5E]" />}
                </Pressable>
              </View>
            </View>

            {formError && (
              <View className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <Text className="text-red-700 text-xs font-medium">{formError}</Text>
              </View>
            )}

            {successMessage && (
              <View className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <Text className="text-emerald-700 text-xs font-medium">{successMessage}</Text>
              </View>
            )}

            <Pressable
              onPress={handleLogin}
              className="w-full py-3.5 px-4 bg-brand-green rounded-2xl flex-row items-center justify-center gap-2 mt-2"
            >
              <Lock className="w-4 h-4 text-white" />
              <Text className="text-white font-black text-sm">
                {language === 'fr' ? 'Se connecter' : 'Hiditra'}
              </Text>
              <ArrowRight className="w-4 h-4 text-white" />
            </Pressable>
          </View>

          {apiAvailable !== undefined && (
            <View className="mt-3 p-3 bg-[#F5F2EB] rounded-2xl border border-[#D7D3C6]">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-1.5">
                  <View className={`w-2 h-2 rounded-full ${apiAvailable ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <Text className="text-[10px] font-bold text-brand-brown">
                    {language === 'fr' ? 'API Backend' : 'API Avoalohany'}
                  </Text>
                </View>
                <Text className="text-[9px] text-brand-brownLight font-mono" numberOfLines={1}>
                  {apiBaseURL}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* REGISTER TAB */}
      {activeTab === 'register' && (
        <View className="mt-3">
          <View className="gap-3 bg-white p-5 rounded-3xl border border-[#D7D3C6] shadow-sm">
            {/* Admin Token */}
            <View>
              <Text className="text-xs font-black text-brand-brown uppercase tracking-wider mb-1.5">
                {language === 'fr' ? 'Jeton administrateur (optionnel)' : 'Tokana admin (tsy obligatoire)'}
              </Text>
              <View className="relative flex-row items-center">
                <View className="absolute left-3 z-10">
                  <KeyRound className="w-4 h-4 text-brand-green" />
                </View>
                <TextInput
                  value={regToken}
                  onChangeText={(text) => {
                    setRegToken(text);
                    setTokenError(null);
                  }}
                  placeholder={language === 'fr' ? 'Ex: MPA-2026-ABCD' : 'Ohatra: MPA-2026-ABCD'}
                  autoCapitalize="characters"
                  className="flex-1 pl-9 pr-3 py-2.5 bg-[#F5F2EB] border border-[#D7D3C6] rounded-xl text-xs font-bold text-[#2A2621]"
                />
              </View>
              <Text className="text-[10px] text-[#706B5E] mt-1">
                {language === 'fr' ? 'Entrez le jeton fourni par l\'administrateur pour obtenir un rôle' : 'Ampidiro ny tokana omen\'ny mpitantana'}
              </Text>
              {tokenError && (
                <View className="p-2 mt-2 bg-red-50 border border-red-200 rounded-xl">
                  <Text className="text-red-700 text-xs font-medium">{tokenError}</Text>
                </View>
              )}
            </View>

            {/* Name */}
            <View>
              <Text className="text-xs font-black text-brand-brown uppercase tracking-wider mb-1.5">
                {language === 'fr' ? 'Nom complet' : 'Anarana'}
              </Text>
              <TextInput
                value={regName}
                onChangeText={setRegName}
                placeholder={language === 'fr' ? 'Votre nom' : 'Anaranao'}
                className="px-3 py-2.5 bg-[#F5F2EB] border border-[#D7D3C6] rounded-2xl text-xs font-bold text-[#2A2621]"
              />
            </View>

            {/* Phone */}
            <View>
              <Text className="text-xs font-black text-brand-brown uppercase tracking-wider mb-1.5">
                {language === 'fr' ? 'Numéro de téléphone' : 'Laharan\'ny finday'}
              </Text>
              <View className="relative flex-row items-center">
                <View className="absolute left-3 z-10">
                  <Smartphone className="w-4 h-4 text-brand-green" />
                </View>
                <TextInput
                  value={regPhone}
                  onChangeText={setRegPhone}
                  placeholder="034 88 123 45"
                  keyboardType="phone-pad"
                  className="flex-1 pl-9 pr-3 py-2.5 bg-[#F5F2EB] border border-[#D7D3C6] rounded-2xl text-xs font-bold text-[#2A2621]"
                />
              </View>
            </View>

            {/* Password */}
            <View>
              <Text className="text-xs font-black text-brand-brown uppercase tracking-wider mb-1.5">
                {language === 'fr' ? 'Mot de passe' : 'Teny miafina'}
              </Text>
              <View className="relative flex-row items-center">
                <View className="absolute left-3 z-10">
                  <Lock className="w-4 h-4 text-[#B45309]" />
                </View>
                <TextInput
                  value={regPassword}
                  onChangeText={setRegPassword}
                  placeholder={language === 'fr' ? 'Minimum 4 caractères' : 'Litera 4 farafahakelika'}
                  secureTextEntry={!showPassword}
                  className="flex-1 pl-9 pr-10 py-2.5 bg-[#F5F2EB] border border-[#D7D3C6] rounded-2xl text-xs font-bold text-[#2A2621]"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} className="absolute right-3 z-10">
                  {showPassword ? <EyeOff className="w-4 h-4 text-[#706B5E]" /> : <Eye className="w-4 h-4 text-[#706B5E]" />}
                </Pressable>
              </View>
            </View>

            {/* Confirm Password */}
            <View>
              <Text className="text-xs font-black text-brand-brown uppercase tracking-wider mb-1.5">
                {language === 'fr' ? 'Confirmer le mot de passe' : 'Hamereno ny teny miafina'}
              </Text>
              <View className="relative flex-row items-center">
                <View className="absolute left-3 z-10">
                  <Lock className="w-4 h-4 text-[#B45309]" />
                </View>
                <TextInput
                  value={regConfirmPassword}
                  onChangeText={setRegConfirmPassword}
                  placeholder={language === 'fr' ? 'Retapez votre mot de passe' : 'Havereno indray ny teny miafina'}
                  secureTextEntry={!showPassword}
                  className="flex-1 pl-9 pr-3 py-2.5 bg-[#F5F2EB] border border-[#D7D3C6] rounded-2xl text-xs font-bold text-[#2A2621]"
                />
              </View>
            </View>

            {formError && (
              <View className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <Text className="text-red-700 text-xs font-medium">{formError}</Text>
              </View>
            )}

            {successMessage && (
              <View className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <Text className="text-emerald-700 text-xs font-medium">{successMessage}</Text>
              </View>
            )}

            <Pressable
              onPress={handleRegister}
              className="w-full py-3.5 px-4 bg-brand-green rounded-2xl flex-row items-center justify-center gap-2 mt-2"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <Text className="text-white font-black text-sm">
                {language === 'fr' ? 'S\'inscrire' : 'Hanoratra Anarana'}
              </Text>
              <ArrowRight className="w-4 h-4 text-white" />
            </Pressable>
          </View>
        </View>
      )}

      {/* Footer */}
      <View className="mt-4 py-2.5 px-3 bg-white/70 rounded-2xl border border-[#D7D3C6] flex-row items-center justify-center gap-2">
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
