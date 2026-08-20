import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal } from 'react-native';
import {
  CloudSun,
  Droplet,
  Wind,
  TrendingUp,
  Plus,
  Stethoscope,
  ShoppingBag,
  Calculator,
  ChevronRight,
  MapPin,
  Cpu,
  ClipboardCheck,
  Store,
  Users,
  LogOut,
  Check,
} from '../lib/icons';
import {
  Crop,
  Language,
  WeatherInfo,
  ScreenType,
  FarmerProfile,
  CommodityPrice,
  UserRole,
  IoTSensorNode,
  CooperativeGroup,
} from '../types';
import { translations } from '../data/translations';
import { OfflineIndicator } from './OfflineIndicator';
import { RoleSelector } from './RoleSelector';

interface HomeScreenProps {
  crops: Crop[];
  weather: WeatherInfo;
  prices: CommodityPrice[];
  farmer: FarmerProfile;
  language: Language;
  activeRole: UserRole;
  sensorNodes: IoTSensorNode[];
  cooperative: CooperativeGroup;
  selectedRegion: string;
  onSelectRole: (role: UserRole) => void;
  onSelectRegion: (region: string) => void;
  onSelectCrop: (crop: Crop) => void;
  onOpenNewCrop: () => void;
  onNavigate: (screen: ScreenType) => void;
  onOpenCalculators: () => void;
  onToggleLanguage: () => void;
  onLogout?: () => void;
}

const REGIONS = [
  { value: 'Vakinankaratra', label: 'Vakinankaratra (Antsirabe)' },
  { value: 'Analamanga', label: 'Analamanga (Antananarivo)' },
  { value: 'Sava', label: 'Sava (Sambava)' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  crops,
  weather,
  prices,
  farmer,
  language,
  activeRole,
  sensorNodes,
  cooperative,
  selectedRegion,
  onSelectRole,
  onSelectRegion,
  onSelectCrop,
  onOpenNewCrop,
  onNavigate,
  onOpenCalculators,
  onToggleLanguage,
  onLogout,
}) => {
  const t = translations[language];
  const [regionPickerOpen, setRegionPickerOpen] = useState(false);

  const onlineSensorsCount = sensorNodes.filter((s) => s.status === 'online').length;
  const currentRegionLabel = REGIONS.find((r) => r.value === selectedRegion)?.label || selectedRegion;

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}>
      {/* Top Profile & Role Switching Header */}
      <View className="flex-row justify-between items-start gap-2">
        <View>
          <View className="flex-row items-center gap-1.5">
            <Text className="text-[10px] font-bold uppercase tracking-wider text-brand-brownLight">{t.welcome}</Text>
            <Text className="text-[10px] px-2 py-0.5 rounded-full bg-brand-beige text-brand-green font-extrabold">
              {farmer.associationName || 'Miray Hina'}
            </Text>
          </View>
          <Text className="text-lg font-black text-brand-green tracking-tight mt-0.5">{farmer.name}</Text>
        </View>

        <View className="flex-row items-center gap-1.5">
          <OfflineIndicator language={language} variant="badge" />

          <Pressable
            onPress={onToggleLanguage}
            className="px-2.5 py-1.5 bg-brand-beige rounded-xl border border-[#C4BFB1]/50"
          >
            <Text className="text-[10px] uppercase font-extrabold text-brand-green">
              {language === 'fr' ? 'FR 🇲🇬' : 'MG 🇲🇬'}
            </Text>
          </Pressable>

          {onLogout && (
            <Pressable
              onPress={onLogout}
              className="p-1.5 bg-brand-beige rounded-xl border border-[#C4BFB1]/50"
            >
              <LogOut className="w-4 h-4 text-[#B45309]" />
            </Pressable>
          )}

          <Pressable
            onPress={onLogout}
            className="w-9 h-9 rounded-xl bg-brand-beige items-center justify-center border-2 border-brand-green"
          >
            <View className="w-6 h-6 bg-brand-green rounded-lg items-center justify-center">
              <Text className="text-xs font-bold text-white">{farmer.name.charAt(0)}</Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Role Selection Switcher */}
      <RoleSelector currentRole={activeRole} onSelectRole={onSelectRole} lang={language} />

      {/* Region Selector Bar */}
      <Pressable
        onPress={() => setRegionPickerOpen(true)}
        className="flex-row items-center justify-between bg-white px-3 py-2.5 rounded-2xl border border-brand-beige"
      >
        <View className="flex-row items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-brand-green" />
          <Text className="font-semibold text-brand-brown text-xs">{t.regionLabel}</Text>
        </View>
        <Text className="font-bold text-brand-green text-xs">{currentRegionLabel}</Text>
      </Pressable>

      <Modal visible={regionPickerOpen} transparent animationType="fade" onRequestClose={() => setRegionPickerOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setRegionPickerOpen(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} className="bg-white rounded-t-3xl p-4 pb-8">
            <Text className="text-sm font-black text-brand-brown mb-2">{t.regionLabel}</Text>
            {REGIONS.map((r) => (
              <Pressable
                key={r.value}
                onPress={() => {
                  onSelectRegion(r.value);
                  setRegionPickerOpen(false);
                }}
                className="flex-row items-center justify-between py-3 border-b border-brand-beige"
              >
                <Text className="text-sm text-[#2A2621]">{r.label}</Text>
                {selectedRegion === r.value && <Check className="w-4 h-4 text-brand-green" />}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>

      {/* 4 Presentation Pillar Highlights */}
      <View className="gap-2.5">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-bold text-brand-brown uppercase tracking-wider">
            {language === 'fr' ? 'Modules Stratégiques Mpamboly' : 'Fitaovana fototra Mpamboly'}
          </Text>
          <Text className="text-[10px] text-brand-brownLight font-medium">
            {language === 'fr' ? 'Accès direct' : 'Fidirana mivantana'}
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2.5">
          <Pressable
            onPress={() => onNavigate('smart_irrigation')}
            className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E3DFD2]"
            style={{ width: '48%' }}
          >
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="w-8 h-8 rounded-xl bg-emerald-100 items-center justify-center">
                <Cpu className="w-4 h-4 text-emerald-800" />
              </View>
              <Text className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {onlineSensorsCount}/{sensorNodes.length} IoT
              </Text>
            </View>
            <Text className="font-bold text-xs text-[#2A2621] leading-tight">
              {language === 'fr' ? 'Irrigation Intelligente' : 'Fitantanana Rano IoT'}
            </Text>
            <Text className="text-[10px] text-[#706B5E] mt-0.5" numberOfLines={1}>
              {sensorNodes[0]?.soilMoisture}% sol · Vannes SRI
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onNavigate('field_inspection')}
            className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E3DFD2]"
            style={{ width: '48%' }}
          >
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="w-8 h-8 rounded-xl bg-blue-100 items-center justify-center">
                <ClipboardCheck className="w-4 h-4 text-blue-800" />
              </View>
              <Text className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">4 Stations</Text>
            </View>
            <Text className="font-bold text-xs text-[#2A2621] leading-tight">
              {language === 'fr' ? 'Inspection du Champ' : 'Fisafoana ny Saha'}
            </Text>
            <Text className="text-[10px] text-[#706B5E] mt-0.5" numberOfLines={1}>
              Photos & Notes Vocales
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onNavigate('seller_shop')}
            className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E3DFD2]"
            style={{ width: '48%' }}
          >
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="w-8 h-8 rounded-xl bg-amber-100 items-center justify-center">
                <Store className="w-4 h-4 text-amber-800" />
              </View>
              <Text className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">MVola</Text>
            </View>
            <Text className="font-bold text-xs text-[#2A2621] leading-tight">
              {language === 'fr' ? 'Boutique & Vente' : 'Fivarotana Mivantana'}
            </Text>
            <Text className="text-[10px] text-[#706B5E] mt-0.5" numberOfLines={1}>
              Commandes & Livraisons
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onNavigate('association')}
            className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E3DFD2]"
            style={{ width: '48%' }}
          >
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="w-8 h-8 rounded-xl bg-teal-100 items-center justify-center">
                <Users className="w-4 h-4 text-teal-800" />
              </View>
              <Text className="text-[9px] px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                {cooperative.collectiveStockTonnes}T
              </Text>
            </View>
            <Text className="font-bold text-xs text-[#2A2621] leading-tight">
              {language === 'fr' ? 'Koperativa Miray Hina' : 'Koperativa Mpiombona'}
            </Text>
            <Text className="text-[10px] text-[#706B5E] mt-0.5" numberOfLines={1}>
              Stock 95%/5% Équitable
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Weather Hero Card */}
      <View className="bg-brand-green rounded-3xl p-5 border border-brand-greenDark overflow-hidden">
        <View className="flex-row justify-between items-start">
          <View>
            <View className="flex-row items-center gap-1">
              <CloudSun className="w-3.5 h-3.5 text-[#FFD700]" />
              <Text className="text-xs text-brand-beige font-medium">
                {t.weatherTitle} • {weather.region}
              </Text>
            </View>
            <Text className="text-4xl font-extrabold tracking-tight mt-1 text-white">{weather.currentTemp}°C</Text>
          </View>
          <View className="items-end">
            <Text className="text-2xl">🌤️</Text>
            <Text className="text-[10px] text-brand-beige font-medium">{t.today}</Text>
          </View>
        </View>

        <Text className="text-xs text-white/90 mt-2 font-medium">
          {language === 'mg' ? weather.conditionMg : weather.conditionFr}
        </Text>

        <View className="flex-row gap-2 mt-3 pt-3 border-t border-white/15">
          <View className="flex-row items-center gap-1 flex-1">
            <Droplet className="w-3 h-3 text-[#FFD700]" />
            <Text className="text-[11px] text-brand-beige">{weather.humidity}% {t.humidity}</Text>
          </View>
          <View className="flex-row items-center gap-1 flex-1">
            <Wind className="w-3 h-3 text-brand-beige" />
            <Text className="text-[11px] text-brand-beige">{weather.windSpeed} km/h</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[11px] text-brand-beige">☔ {weather.rainProbability}% pluie</Text>
          </View>
        </View>

        <View className="mt-3 bg-white/10 rounded-xl p-2.5 border border-white/10">
          <Text className="text-[11px] leading-snug text-brand-cream">
            <Text className="text-[#FFD700] font-bold">{t.agroAdvice} </Text>
            {language === 'mg' ? weather.agroAdviceMg : weather.agroAdviceFr}
          </Text>
        </View>
      </View>

      {/* Live Market Price Ticker */}
      <View className="bg-white p-3.5 rounded-2xl border border-brand-beige">
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-brand-green" />
            <Text className="text-xs font-bold text-brand-brown uppercase tracking-wider">{t.marketPrices}</Text>
          </View>
          <Pressable onPress={() => onNavigate('market')} className="flex-row items-center">
            <Text className="text-[10px] font-bold text-brand-green">{t.viewAll}</Text>
            <ChevronRight className="w-3 h-3 text-brand-green" />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2.5">
            {prices.slice(0, 5).map((item) => (
              <Pressable
                key={item.id}
                onPress={() => onNavigate('market')}
                className="p-2.5 bg-brand-cream rounded-xl border border-brand-beige"
                style={{ minWidth: 125 }}
              >
                <Text className="text-[11px] font-bold text-brand-brown" numberOfLines={1}>
                  {language === 'mg' ? item.malagasyName : item.name}
                </Text>
                <Text className="text-xs font-extrabold text-brand-green mt-0.5">
                  {item.currentPrice.toLocaleString()} Ar
                </Text>
                <View className="flex-row justify-between items-center mt-1">
                  <Text className="text-[9px] text-brand-brownLight">/ {item.unit}</Text>
                  <Text
                    className={`text-[9px] font-bold ${
                      item.trend === 'up' ? 'text-emerald-600' : item.trend === 'down' ? 'text-red-500' : 'text-brand-brownLight'
                    }`}
                  >
                    {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '—'} {Math.abs(item.variationPercent)}%
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Quick Action Buttons Grid */}
      <View>
        <Text className="text-xs font-bold text-brand-brown uppercase tracking-wider mb-2.5">{t.quickActions}</Text>
        <View className="flex-row gap-2">
          <Pressable onPress={() => onNavigate('diagnostic')} className="flex-1 bg-white p-3 rounded-2xl border border-brand-beige items-center">
            <View className="w-10 h-10 rounded-xl bg-[#F2F8F1] items-center justify-center mb-1.5">
              <Stethoscope className="w-5 h-5 text-brand-green" />
            </View>
            <Text className="text-[10px] font-bold text-brand-brown leading-tight text-center">{t.scanPlant}</Text>
          </Pressable>

          <Pressable onPress={() => onNavigate('buyer_hub')} className="flex-1 bg-white p-3 rounded-2xl border border-brand-beige items-center">
            <View className="w-10 h-10 rounded-xl bg-[#EFF6FF] items-center justify-center mb-1.5">
              <ShoppingBag className="w-5 h-5 text-[#1E40AF]" />
            </View>
            <Text className="text-[10px] font-bold text-brand-brown leading-tight text-center">
              {language === 'fr' ? 'Acheter' : 'Hividy'}
            </Text>
          </Pressable>

          <Pressable onPress={onOpenCalculators} className="flex-1 bg-white p-3 rounded-2xl border border-brand-beige items-center">
            <View className="w-10 h-10 rounded-xl bg-[#F2F8F1] items-center justify-center mb-1.5">
              <Calculator className="w-5 h-5 text-brand-green" />
            </View>
            <Text className="text-[10px] font-bold text-brand-brown leading-tight text-center">{t.calculators}</Text>
          </Pressable>

          <Pressable onPress={() => onNavigate('management')} className="flex-1 bg-white p-3 rounded-2xl border border-brand-beige items-center">
            <View className="w-10 h-10 rounded-xl bg-brand-beige items-center justify-center mb-1.5">
              <Plus className="w-5 h-5 text-brand-brown" />
            </View>
            <Text className="text-[10px] font-bold text-brand-brown leading-tight text-center">{t.addSale}</Text>
          </Pressable>
        </View>
      </View>

      {/* Mes Cultures Section */}
      <View>
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-sm font-bold text-brand-brown tracking-tight">
            {t.myCrops} ({crops.length})
          </Text>
          <Pressable onPress={onOpenNewCrop} className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-[#F2F8F1] border border-brand-green/20">
            <Plus className="w-3.5 h-3.5 text-brand-green" />
            <Text className="text-xs font-bold text-brand-green">{language === 'mg' ? 'Hampiditra' : 'Ajouter'}</Text>
          </Pressable>
        </View>

        <View className="flex-row flex-wrap gap-3">
          {crops.map((crop) => (
            <Pressable
              key={crop.id}
              onPress={() => onSelectCrop(crop)}
              className="bg-white p-3.5 rounded-2xl border border-brand-beige"
              style={{ width: '48%' }}
            >
              <View className="flex-row justify-between items-start mb-2">
                <View
                  className="w-9 h-9 rounded-xl items-center justify-center"
                  style={{
                    backgroundColor: crop.id === 'crop-1' ? '#F2F8F1' : crop.id === 'crop-2' ? '#FDF5EB' : '#F2F8F1',
                  }}
                >
                  <Text className="text-xl">{crop.icon}</Text>
                </View>
                <Text className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-brand-beige text-brand-brown">
                  {crop.stage}
                </Text>
              </View>

              <Text className="text-xs font-bold text-brand-brown" numberOfLines={1}>
                {language === 'mg' ? crop.malagasyName : crop.name}
              </Text>

              <Text className="text-[10px] text-brand-brownLight mt-0.5">
                {t.harvestIn} <Text className="text-brand-green font-bold">{crop.daysToHarvest}j</Text>
              </Text>

              <View className="w-full bg-brand-beige h-1.5 rounded-full overflow-hidden mt-2">
                <View className="h-full bg-brand-green rounded-full" style={{ width: `${crop.progressPercent}%` }} />
              </View>

              <View className="flex-row justify-between items-center mt-1.5">
                <Text className="text-[9px] text-brand-brownLight font-medium">
                  {crop.surfaceArea} {crop.surfaceUnit}
                </Text>
                <Text className="text-[9px] text-brand-green font-bold">{crop.healthScore}% santé</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Featured Expert Tip Callout */}
      <Pressable onPress={() => onNavigate('guides')} className="bg-[#8B5E3C] rounded-3xl p-4 overflow-hidden">
        <Text className="text-[10px] font-bold bg-[#A67C52] text-white self-start px-2 py-0.5 rounded-md mb-2 tracking-wide uppercase">
          {t.tipOfDay}
        </Text>
        <Text className="text-sm font-bold leading-snug mb-1 text-white">
          {language === 'mg'
            ? "Ahoana no fiarovana ny Lavanila amin'ny hatsiaka sy masoandro be ?"
            : "Comment protéger la Vanille du gel matinal et réguler l'ombrage ?"}
        </Text>
        <Text className="text-[11px] text-brand-beige mb-2" numberOfLines={2}>
          {language === 'mg'
            ? "Mila alokaloka 50% amin'ny hazo tondro toy ny Valavelona sy paillage 15cm."
            : "La vanille nécessite un ombrage régulé à 50% et un paillage épais au pied."}
        </Text>
        <View className="flex-row items-center gap-1">
          <Text className="text-xs font-bold underline text-[#FFD700]">{t.readMore}</Text>
          <ChevronRight className="w-3 h-3 text-[#FFD700]" />
        </View>
      </Pressable>
    </ScrollView>
  );
};
