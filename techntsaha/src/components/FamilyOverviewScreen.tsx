import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import {
  Users,
  Droplet,
  ClipboardCheck,
  ShoppingBag,
  TrendingUp,
  ChevronRight,
  UserPlus,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Package,
} from '../lib/icons';
import { Language, UserRole, FamilyMember, ActivityTrace, Crop, MarketItem } from '../types';
import { translations } from '../data/translations';
import { getFamilyMembers, getFamilyActivities, getMyFamily } from '../services/apiClient';
import { setApiAuthToken } from '../services/reactQueryHooks';

interface FamilyOverviewScreenProps {
  language: Language;
  activeRole: UserRole;
  crops: Crop[];
  marketItems: MarketItem[];
  onNavigate: (screen: any) => void;
  onToggleLanguage: () => void;
  apiBaseURL?: string;
  apiToken?: string;
  onLogin?: (profile: any, role: UserRole, destinationScreen: any) => void;
}

export const FamilyOverviewScreen: React.FC<FamilyOverviewScreenProps> = ({
  language,
  activeRole,
  crops,
  marketItems,
  onNavigate,
  onToggleLanguage,
  apiBaseURL,
  apiToken,
  onLogin,
}) => {
  const [family, setFamily] = useState<any>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [activities, setActivities] = useState<ActivityTrace[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (!apiToken) {
      setLoading(false);
      return;
    }

    try {
      setApiAuthToken(apiToken);
      const [familyData, membersData, activitiesData] = await Promise.all([
        getMyFamily(apiToken),
        getFamilyMembers(apiToken),
        getFamilyActivities(apiToken),
      ]);

      setFamily(familyData);
      setMembers(membersData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading family data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [apiToken]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getActivityIcon = (actionType: string) => {
    switch (actionType) {
      case 'IRRIGATION': return <Droplet className="w-4 h-4 text-blue-600" />;
      case 'INSPECTION': return <ClipboardCheck className="w-4 h-4 text-emerald-600" />;
      case 'SALE': return <ShoppingBag className="w-4 h-4 text-amber-600" />;
      case 'CROP_CREATE': return <Plus className="w-4 h-4 text-brand-green" />;
      case 'HARVEST': return <Package className="w-4 h-4 text-purple-600" />;
      case 'LISTING_CREATE': return <TrendingUp className="w-4 h-4 text-teal-600" />;
      default: return <Clock className="w-4 h-4 text-brand-brownLight" />;
    }
  };

  const getActionLabel = (actionType: string) => {
    const labels: Record<string, { fr: string; mg: string }> = {
      IRRIGATION: { fr: 'Arrosage', mg: 'Fampanadihana rano' },
      INSPECTION: { fr: 'Inspection', mg: 'Fisafoana' },
      SALE: { fr: 'Vente', mg: 'Varotra' },
      CROP_CREATE: { fr: 'Nouvelle culture', mg: 'Voly vaovao' },
      CROP_UPDATE: { fr: 'Mise à jour culture', mg: 'Fanavaozana voly' },
      HARVEST: { fr: 'Récolte', mg: 'Jinjia' },
      LISTING_CREATE: { fr: 'Nouvelle annonce', mg: 'Tolotra vaovao' },
      SENSOR_UPDATE: { fr: 'Capteur', mg: 'Sensor' },
    };
    return labels[actionType] ? (language === 'fr' ? labels[actionType].fr : labels[actionType].mg) : actionType;
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return language === 'fr' ? 'À l\'instant' : 'Indrisy ankehitriny';
    if (minutes < 60) return language === 'fr' ? `Il y a ${minutes}min` : `${minutes} min lasa`;
    if (hours < 24) return language === 'fr' ? `Il y a ${hours}h` : `${hours} ora lasa`;
    return language === 'fr' ? `Il y a ${days}j` : `${days} andro lasa`;
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-cream">
        <ActivityIndicator size="large" color="#2D5A27" />
        <Text className="text-brand-brown mt-3 text-sm font-medium">Chargement...</Text>
      </View>
    );
  }

  if (!family) {
    return (
      <ScrollView className="flex-1 bg-brand-cream" contentContainerStyle={{ padding: 16 }}>
        <View className="items-center py-10">
          <Users className="w-16 h-16 text-brand-brownLight mb-4" />
          <Text className="text-lg font-black text-brand-brown mb-2">
            {language === 'fr' ? 'Aucune famille' : 'Tsy misy fianakaviana'}
          </Text>
          <Text className="text-sm text-brand-brownLight text-center px-4">
            {language === 'fr' 
              ? 'Inscrivez-vous avec un jeton de famille pour rejoindre votre famille.'
              : 'Hidirana amin\'ny tokana fianakaviana hanohizana ny fianakavianao.'}
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-brand-cream"
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Family Header */}
      <View className="bg-brand-green rounded-3xl p-5 border border-brand-greenDark">
        <View className="flex-row items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-[#FFD700]" />
          <Text className="text-xs font-bold text-brand-beige uppercase tracking-wider">
            {language === 'fr' ? 'Famille' : 'Fianakaviana'}
          </Text>
        </View>
        <Text className="text-xl font-black text-white tracking-tight">{family.name}</Text>
        <Text className="text-xs text-brand-beige mt-1">
          {language === 'fr' ? `${members.length} membre(s)` : `Mpikambana ${members.length}`}
        </Text>
      </View>

      {/* Members Section */}
      <View className="bg-white rounded-3xl p-4 border border-brand-beige">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-1.5">
            <Users className="w-4 h-4 text-brand-green" />
            <Text className="text-sm font-black text-brand-brown">
              {language === 'fr' ? 'Membres' : 'Mpikambana'}
            </Text>
          </View>
          <Text className="text-[10px] font-bold text-brand-green bg-brand-cream px-2 py-1 rounded-full">
            {members.length}
          </Text>
        </View>

        <View className="gap-2">
          {members.map((member) => (
            <View key={member.id} className="flex-row items-center gap-3 p-3 bg-brand-cream rounded-2xl">
              <View className="w-10 h-10 rounded-full bg-brand-green items-center justify-center">
                <Text className="text-white font-bold text-sm">{member.userName.charAt(0).toUpperCase()}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-brand-brown">{member.userName}</Text>
                <Text className="text-[10px] text-brand-brownLight">
                  {member.roleInFamily === 'head' 
                    ? (language === 'fr' ? 'Chef de famille' : 'Lohan\'ny fianakaviana')
                    : (language === 'fr' ? 'Membre' : 'Mpikambana')
                  }
                </Text>
              </View>
              {member.roleInFamily === 'head' && (
                <View className="px-2 py-1 bg-[#FFD700]/20 rounded-full">
                  <Text className="text-[10px] font-bold text-[#B45309]">👑</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Activity Traces Section */}
      <View className="bg-white rounded-3xl p-4 border border-brand-beige">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-green" />
            <Text className="text-sm font-black text-brand-brown">
              {language === 'fr' ? 'Activités récentes' : 'Hevitry ny tranga'}
            </Text>
          </View>
          <Text className="text-[10px] font-bold text-brand-green bg-brand-cream px-2 py-1 rounded-full">
            {activities.length}
          </Text>
        </View>

        <View className="gap-2">
          {activities.slice(0, 10).map((activity) => (
            <View key={activity.id} className="flex-row items-start gap-3 p-3 bg-brand-cream rounded-2xl">
              <View className="w-8 h-8 rounded-full bg-white items-center justify-center mt-0.5">
                {getActivityIcon(activity.actionType)}
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-0.5">
                  <Text className="text-xs font-bold text-brand-brown">{activity.userName}</Text>
                  <Text className="text-[10px] text-brand-brownLight">
                    {formatTimeAgo(activity.timestamp)}
                  </Text>
                </View>
                <Text className="text-xs text-brand-brown">
                  {getActionLabel(activity.actionType)}
                </Text>
                {activity.details && Object.keys(activity.details).length > 0 && (
                  <Text className="text-[10px] text-brand-brownLight mt-0.5" numberOfLines={1}>
                    {JSON.stringify(activity.details)}
                  </Text>
                )}
              </View>
            </View>
          ))}
          {activities.length === 0 && (
            <View className="py-6 items-center">
              <Clock className="w-8 h-8 text-brand-brownLight mb-2" />
              <Text className="text-xs text-brand-brownLight">
                {language === 'fr' ? 'Aucune activité pour le moment' : 'Tsy misy hevitra ankehitriny'}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Family Shop Section */}
      <View className="bg-white rounded-3xl p-4 border border-brand-beige">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-brand-green" />
            <Text className="text-sm font-black text-brand-brown">
              {language === 'fr' ? 'Boutique familiale' : 'Fivarotana fianakaviana'}
            </Text>
          </View>
          <Pressable onPress={() => onNavigate('seller_shop')} className="flex-row items-center gap-1">
            <Text className="text-[10px] font-bold text-brand-green">{language === 'fr' ? 'Voir' : 'Hijery'}</Text>
            <ChevronRight className="w-3 h-3 text-brand-green" />
          </Pressable>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {marketItems.slice(0, 4).map((item) => (
            <View key={item.id} className="p-2.5 bg-brand-cream rounded-xl border border-brand-beige" style={{ width: '48%' }}>
              <Text className="text-xs font-bold text-brand-brown" numberOfLines={1}>{item.title}</Text>
              <Text className="text-[10px] text-brand-green font-bold mt-0.5">
                {item.price.toLocaleString()} Ar/{item.unit}
              </Text>
              <Text className="text-[9px] text-brand-brownLight mt-0.5">
                {item.stockKg ? `${item.stockKg} kg` : (language === 'fr' ? 'En stock' : 'Misy')}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Family Crops Section */}
      <View className="bg-white rounded-3xl p-4 border border-brand-beige">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-1.5">
            <Package className="w-4 h-4 text-brand-green" />
            <Text className="text-sm font-black text-brand-brown">
              {language === 'fr' ? 'Cultures familiales' : 'Voly fianakaviana'}
            </Text>
          </View>
          <Pressable onPress={() => onNavigate('home')} className="flex-row items-center gap-1">
            <Text className="text-[10px] font-bold text-brand-green">{language === 'fr' ? 'Voir' : 'Hijery'}</Text>
            <ChevronRight className="w-3 h-3 text-brand-green" />
          </Pressable>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {crops.slice(0, 4).map((crop) => (
            <View key={crop.id} className="p-2.5 bg-brand-cream rounded-xl border border-brand-beige" style={{ width: '48%' }}>
              <Text className="text-xs font-bold text-brand-brown" numberOfLines={1}>
                {language === 'mg' ? crop.malagasyName : crop.name}
              </Text>
              <Text className="text-[10px] text-brand-brownLight mt-0.5">
                {language === 'fr' ? `Récolte dans ${crop.daysToHarvest}j` : `Jinjia ao ${crop.daysToHarvest} andro`}
              </Text>
              <View className="flex-row justify-between items-center mt-1">
                <Text className="text-[9px] text-brand-brownLight">{crop.surfaceArea} {crop.surfaceUnit}</Text>
                <Text className="text-[9px] text-brand-green font-bold">{crop.healthScore}% {language === 'fr' ? 'santé' : 'salama'}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};