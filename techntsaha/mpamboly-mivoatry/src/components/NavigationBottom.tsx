import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import {
  Home,
  ShoppingBag,
  Stethoscope,
  BookOpen,
  Wallet,
  Cpu,
  ClipboardCheck,
  Store,
  Users,
  Compass,
} from '../lib/icons';
import { ScreenType, Language, UserRole } from '../types';
import { translations } from '../data/translations';

interface NavigationBottomProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  language: Language;
  activeRole: UserRole;
}

export const NavigationBottom: React.FC<NavigationBottomProps> = ({
  currentScreen,
  onSelectScreen,
  language,
  activeRole,
}) => {
  const t = translations[language];

  // Dynamic Navigation Items based on the selected Role
  const getNavItems = (): Array<{
    id: ScreenType;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }> => {
    switch (activeRole) {
      case 'agriculteur':
        return [
          {
            id: 'home',
            label: t.home,
            icon: <Home className="w-5 h-5" />,
          },
          {
            id: 'smart_irrigation',
            label: language === 'fr' ? 'IoT & Eau' : 'IoT & Rano',
            icon: <Cpu className="w-5 h-5" />,
            badge: 'IoT',
          },
          {
            id: 'field_inspection',
            label: language === 'fr' ? 'Inspection' : 'Fisafoana',
            icon: <ClipboardCheck className="w-5 h-5" />,
          },
          {
            id: 'diagnostic',
            label: language === 'mg' ? 'Fahasalamana' : 'Docteur IA',
            icon: <Stethoscope className="w-5 h-5" />,
            badge: 'IA',
          },
          {
            id: 'management',
            label: t.management,
            icon: <Wallet className="w-5 h-5" />,
          },
        ];

      case 'vendeur':
        return [
          {
            id: 'home',
            label: t.home,
            icon: <Home className="w-5 h-5" />,
          },
          {
            id: 'seller_shop',
            label: language === 'fr' ? 'Boutique' : 'Fivarotana',
            icon: <Store className="w-5 h-5" />,
            badge: 'PRO',
          },
          {
            id: 'market',
            label: t.market,
            icon: <ShoppingBag className="w-5 h-5" />,
          },
          {
            id: 'association',
            label: language === 'fr' ? 'Coopérative' : 'Koperativa',
            icon: <Users className="w-5 h-5" />,
          },
          {
            id: 'management',
            label: t.management,
            icon: <Wallet className="w-5 h-5" />,
          },
        ];

      case 'commercant':
        return [
          {
            id: 'home',
            label: t.home,
            icon: <Home className="w-5 h-5" />,
          },
          {
            id: 'buyer_hub',
            label: language === 'fr' ? 'Sourcing' : 'Famatsiana',
            icon: <ShoppingBag className="w-5 h-5" />,
            badge: 'Direct',
          },
          {
            id: 'market',
            label: t.market,
            icon: <Compass className="w-5 h-5" />,
          },
          {
            id: 'association',
            label: language === 'fr' ? 'Coopérative' : 'Koperativa',
            icon: <Users className="w-5 h-5" />,
          },
          {
            id: 'management',
            label: t.management,
            icon: <Wallet className="w-5 h-5" />,
          },
        ];

      case 'association':
        return [
          {
            id: 'home',
            label: t.home,
            icon: <Home className="w-5 h-5" />,
          },
          {
            id: 'association',
            label: language === 'fr' ? 'Koperativa' : 'Koperativa',
            icon: <Users className="w-5 h-5" />,
            badge: '95/5',
          },
          {
            id: 'seller_shop',
            label: language === 'fr' ? 'Vente Coop' : 'Fivarotana',
            icon: <Store className="w-5 h-5" />,
          },
          {
            id: 'smart_irrigation',
            label: language === 'fr' ? 'Capteurs' : 'Fandrefesana',
            icon: <Cpu className="w-5 h-5" />,
          },
          {
            id: 'management',
            label: t.management,
            icon: <Wallet className="w-5 h-5" />,
          },
        ];

      case 'all':
      default:
        return [
          {
            id: 'home',
            label: t.home,
            icon: <Home className="w-5 h-5" />,
          },
          {
            id: 'market',
            label: t.market,
            icon: <ShoppingBag className="w-5 h-5" />,
          },
          {
            id: 'smart_irrigation',
            label: language === 'fr' ? 'Smart IoT' : 'IoT Rano',
            icon: <Cpu className="w-5 h-5" />,
            badge: 'IoT',
          },
          {
            id: 'diagnostic',
            label: language === 'mg' ? 'Fahasalamana' : 'Docteur IA',
            icon: <Stethoscope className="w-5 h-5" />,
            badge: 'IA',
          },
          {
            id: 'seller_shop',
            label: language === 'fr' ? 'Boutique' : 'Fivarotana',
            icon: <Store className="w-5 h-5" />,
          },
          {
            id: 'association',
            label: language === 'fr' ? 'Coopérative' : 'Koperativa',
            icon: <Users className="w-5 h-5" />,
          },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <View
      className="shrink-0 h-[68px] bg-white border-t border-brand-beige flex-row justify-around items-center px-1 z-30"
      style={{ shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 16, shadowOffset: { width: 0, height: -4 } }}
    >
      {navItems.map((item) => {
        const isActive = currentScreen === item.id;
        return (
          <Pressable
            key={item.id}
            onPress={() => onSelectScreen(item.id)}
            className="flex-1 items-center justify-center py-1.5 px-1"
            style={{ minWidth: 56 }}
          >
            <View className="relative">
              {React.cloneElement(item.icon as React.ReactElement, {
                className: `w-5 h-5 ${isActive ? 'text-brand-green' : 'text-brand-brownLight'}`,
              })}
              {item.badge && (
                <View className="absolute -top-1.5 -right-3 px-1 py-0.5 bg-[#FFD700] rounded-full">
                  <Text className="text-[8px] font-black text-brand-green">{item.badge}</Text>
                </View>
              )}
            </View>
            <Text
              numberOfLines={1}
              className={`text-[9px] mt-1 font-bold tracking-tight ${
                isActive ? 'text-brand-green' : 'text-brand-brownLight'
              }`}
              style={{ maxWidth: 62 }}
            >
              {item.label}
            </Text>
            {isActive && <View className="w-1.5 h-1.5 rounded-full bg-brand-green mt-0.5" />}
          </Pressable>
        );
      })}
    </View>
  );
};
