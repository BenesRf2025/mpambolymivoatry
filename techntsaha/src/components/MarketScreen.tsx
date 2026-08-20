import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Image, Modal, Linking } from 'react-native';
import { ShoppingBag, Search, Plus, Phone, MessageCircle, MapPin, CheckCircle2, X, TrendingUp } from '../lib/icons';
import { MarketItem, Language, MarketCategory, CommodityPrice } from '../types';
import { translations } from '../data/translations';

interface MarketScreenProps {
  items: MarketItem[];
  prices: CommodityPrice[];
  language: Language;
  onOpenNewListing: () => void;
}

export const MarketScreen: React.FC<MarketScreenProps> = ({ items, prices, language, onOpenNewListing }) => {
  const t = translations[language];

  const [activeCategory, setActiveCategory] = useState<MarketCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemForContact, setSelectedItemForContact] = useState<MarketItem | null>(null);

  const categories: Array<{ id: MarketCategory; labelFr: string; labelMg: string }> = [
    { id: 'all', labelFr: 'Tout', labelMg: 'Rehetra' },
    { id: 'recoltes', labelFr: 'Récoltes', labelMg: 'Vokatra' },
    { id: 'semences', labelFr: 'Semences', labelMg: 'Voa' },
    { id: 'engrais_outils', labelFr: 'Engrais & Outils', labelMg: 'Zezika' },
    { id: 'elevage', labelFr: 'Élevage', labelMg: 'Fiompiana' },
  ];

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(q) ||
      item.malagasyTitle.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 32 }}>
      {/* Header */}
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-xl font-bold text-brand-green tracking-tight">{t.marketTitle}</Text>
          <Text className="text-xs text-brand-brownLight">{t.marketSubtitle}</Text>
        </View>
        <Pressable onPress={onOpenNewListing} className="bg-brand-green px-3 py-2 rounded-xl flex-row items-center gap-1.5">
          <Plus className="w-4 h-4 text-white" />
          <Text className="text-white text-xs font-bold">{t.postAd}</Text>
        </Pressable>
      </View>

      {/* Search Bar */}
      <View className="relative flex-row items-center">
        <Search className="w-4 h-4 text-brand-brownLight absolute left-3.5 z-10" />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t.searchPlaceholder}
          className="flex-1 bg-white border border-brand-beige rounded-2xl pl-10 pr-9 py-2.5 text-xs font-medium text-brand-brown"
        />
        {searchQuery !== '' && (
          <Pressable onPress={() => setSearchQuery('')} className="absolute right-3 z-10">
            <X className="w-4 h-4 text-brand-brownLight" />
          </Pressable>
        )}
      </View>

      {/* Categories Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full ${isActive ? 'bg-brand-green' : 'bg-brand-beige'}`}
              >
                <Text className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-brand-brown'}`}>
                  {language === 'mg' ? cat.labelMg : cat.labelFr}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Commodity Price Index */}
      <View className="bg-[#F2F8F1] p-3 rounded-2xl border border-brand-green/20">
        <View className="flex-row items-center gap-1.5 mb-2">
          <TrendingUp className="w-3.5 h-3.5 text-brand-green" />
          <Text className="text-[10px] font-bold uppercase tracking-wider text-brand-green">{t.priceIndex}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {prices.map((p) => (
              <View key={p.id} className="bg-white px-2.5 py-1.5 rounded-xl border border-brand-beige">
                <Text className="font-semibold text-brand-brown text-[10px]">{language === 'mg' ? p.malagasyName : p.name}</Text>
                <View className="flex-row items-center gap-1.5 mt-0.5">
                  <Text className="text-brand-green font-bold text-[10px]">{p.currentPrice.toLocaleString()} Ar</Text>
                  <Text className={`text-[8px] font-bold ${p.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {p.trend === 'up' ? '▲' : '▼'}
                    {Math.abs(p.variationPercent)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Items List */}
      <View className="gap-3.5">
        {filteredItems.length === 0 ? (
          <View className="bg-white p-8 rounded-3xl border border-brand-beige items-center">
            <ShoppingBag className="w-8 h-8 text-brand-brownLight mb-2 opacity-50" />
            <Text className="font-bold text-brand-brown text-xs">Aucun produit trouvé</Text>
            <Text className="text-[11px] mt-1 text-brand-brownLight">Essayez un autre mot-clé ou catégorie.</Text>
          </View>
        ) : (
          filteredItems.map((item) => (
            <View key={item.id} className="bg-white p-4 rounded-3xl flex-row gap-4 border border-brand-beige">
              <View className="w-24 h-24 rounded-2xl overflow-hidden bg-[#FDF5EB] relative">
                <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: '100%' }} />
                {item.badge && (
                  <View className="absolute top-1.5 left-1.5 bg-brand-green px-1.5 py-0.5 rounded-md">
                    <Text className="text-white text-[9px] font-extrabold">{item.badge}</Text>
                  </View>
                )}
              </View>

              <View className="flex-1 justify-between">
                <View>
                  <View className="flex-row justify-between items-start gap-2">
                    <Text className="text-sm font-bold text-brand-brown leading-tight flex-1" numberOfLines={2}>
                      {language === 'mg' ? item.malagasyTitle : item.title}
                    </Text>
                    {item.verifiedSeller && (
                      <View className="flex-row items-center gap-0.5 bg-[#F2F8F1] px-1.5 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3 text-brand-green" />
                        <Text className="text-[9px] font-bold text-brand-green">{t.verified}</Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-row items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-brand-brownLight" />
                    <Text className="text-[10px] text-brand-brownLight">{item.location}</Text>
                  </View>

                  <Text className="text-[11px] text-[#4A3728]/85 mt-1.5 leading-relaxed" numberOfLines={2}>
                    {language === 'mg' ? item.malagasyDescription : item.description}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between mt-3 pt-2.5 border-t border-brand-beige">
                  <View>
                    <Text className="text-base font-extrabold text-brand-green">{item.price.toLocaleString()} Ar</Text>
                    <Text className="text-[10px] text-brand-brownLight font-semibold">/ {item.unit}</Text>
                    <Text className="text-[9px] text-brand-brownLight">Dispo: {item.stockAmount}</Text>
                  </View>

                  <Pressable onPress={() => setSelectedItemForContact(item)} className="bg-brand-green px-3.5 py-2 rounded-xl flex-row items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-white" />
                    <Text className="text-white text-xs font-bold">{t.contactSeller}</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Contact Seller Modal */}
      <Modal visible={!!selectedItemForContact} transparent animationType="fade" onRequestClose={() => setSelectedItemForContact(null)}>
        <View className="flex-1 items-center justify-center p-4 bg-black/60">
          {selectedItemForContact && (
            <View className="bg-brand-cream w-full rounded-3xl border-2 border-brand-beige p-5" style={{ maxWidth: 360 }}>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-base font-bold text-brand-green">{t.contactSeller}</Text>
                <Pressable onPress={() => setSelectedItemForContact(null)} className="w-7 h-7 rounded-full bg-brand-beige items-center justify-center">
                  <X className="w-4 h-4 text-brand-brown" />
                </Pressable>
              </View>

              <View className="bg-white p-3 rounded-2xl border border-brand-beige mb-4">
                <Text className="text-xs font-bold text-brand-brown">{selectedItemForContact.title}</Text>
                <Text className="text-xs font-bold text-brand-green mt-0.5">
                  {selectedItemForContact.price.toLocaleString()} Ar / {selectedItemForContact.unit}
                </Text>
                <Text className="text-[11px] text-brand-brownLight mt-1">
                  Vendeur : <Text className="font-bold">{selectedItemForContact.sellerName}</Text>
                </Text>
              </View>

              <View className="gap-2">
                <Pressable
                  onPress={() => Linking.openURL(`tel:${selectedItemForContact.sellerPhone}`)}
                  className="w-full bg-brand-green py-2.5 rounded-xl flex-row items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-white" />
                  <Text className="text-white font-bold text-xs">
                    {t.call} ({selectedItemForContact.sellerPhone})
                  </Text>
                </Pressable>

                {selectedItemForContact.sellerWhatsapp && (
                  <Pressable
                    onPress={() =>
                      Linking.openURL(
                        `https://wa.me/${selectedItemForContact!.sellerWhatsapp!.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Bonjour, je suis intéressé par votre annonce sur Mpamboly : ${selectedItemForContact!.title}`
                        )}`
                      )
                    }
                    className="w-full bg-[#25D366] py-2.5 rounded-xl flex-row items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                    <Text className="text-white font-bold text-xs">{t.whatsapp}</Text>
                  </Pressable>
                )}
              </View>
            </View>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};
