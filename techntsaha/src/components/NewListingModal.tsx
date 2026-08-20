import React, { useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView, TextInput, Image } from 'react-native';
import { X, Tag, Plus } from '../lib/icons';
import { MarketItem, Language } from '../types';
import { translations } from '../data/translations';
import { regionsList } from '../data/mockData';
import { SelectField } from './ui/SelectField';

interface NewListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (listing: Omit<MarketItem, 'id' | 'datePosted'>) => void;
  language: Language;
}

const sampleImages = [
  { label: 'Riz / Vary', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80' },
  { label: 'Café / Kafe', url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=80' },
  { label: 'Vanille', url: 'https://images.unsplash.com/photo-1608797178974-15b35a63deda?w=500&auto=format&fit=crop&q=80' },
  { label: 'Girofle', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80' },
  { label: 'Légumes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80' },
];

const unitOptions = [
  { value: 'kg', label: 'kg' },
  { value: 'sac 50kg', label: 'sac 50kg' },
  { value: 'tonne', label: 'tonne' },
  { value: 'litre', label: 'litre' },
  { value: 'unité', label: 'unité' },
];

export const NewListingModal: React.FC<NewListingModalProps> = ({ isOpen, onClose, onAddListing, language }) => {
  const t = translations[language];

  const categoryOptions = [
    { value: 'recoltes', label: t.catHarvest },
    { value: 'semences', label: t.catSeeds },
    { value: 'engrais_outils', label: t.catFertilizer },
    { value: 'elevage', label: t.catLivestock },
  ];

  const [title, setTitle] = useState('');
  const [malagasyTitle, setMalagasyTitle] = useState('');
  const [category, setCategory] = useState<MarketItem['category']>('recoltes');
  const [price, setPrice] = useState('15000');
  const [unit, setUnit] = useState('kg');
  const [location, setLocation] = useState('Antsirabe, Vakinankaratra');
  const [region, setRegion] = useState('Vakinankaratra');
  const [sellerName, setSellerName] = useState('Mamy Rakoto');
  const [sellerPhone, setSellerPhone] = useState('+261 34 12 345 67');
  const [sellerWhatsapp, setSellerWhatsapp] = useState('+261341234567');
  const [stockAmount, setStockAmount] = useState('500 kg');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(sampleImages[0].url);

  const handleSubmit = () => {
    onAddListing({
      title: title || 'Produit Agricole',
      malagasyTitle: malagasyTitle || title || 'Vokatra Fambolena',
      category,
      price: parseFloat(price) || 5000,
      unit,
      location,
      region,
      sellerName: sellerName || 'Producteur local',
      sellerPhone: sellerPhone || '+261 34 00 000 00',
      sellerWhatsapp,
      sellerType: 'producteur',
      verifiedSeller: true,
      inStock: true,
      stockAmount,
      imageUrl,
      description: description || 'Produit local de première qualité récolté avec soin.',
      malagasyDescription: description || 'Vokatra madio sy tsara kalitao.',
      badge: 'Nouveau',
    });
    onClose();
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center p-4 bg-black/60">
        <View className="bg-brand-cream w-full rounded-3xl border-2 border-brand-beige overflow-hidden" style={{ maxWidth: 480, maxHeight: '90%' }}>
          <View className="bg-brand-green p-5 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5 flex-1">
              <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
                <Tag className="w-4 h-4 text-white" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-white">{t.postAd}</Text>
                <Text className="text-xs text-brand-beige/80">
                  {language === 'mg' ? "Mivarotra mivantana amin'ny mpividy" : 'Vente directe du producteur'}
                </Text>
              </View>
            </View>
            <Pressable onPress={onClose} className="w-8 h-8 rounded-full bg-white/10 items-center justify-center">
              <X className="w-4 h-4 text-white" />
            </Pressable>
          </View>
    
          <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
            <View>
              <Text className="text-xs font-bold text-brand-brown mb-1">
                {language === 'mg' ? "Anaran'ny vokatra" : "Titre de l'annonce"}
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Riz Blanc Makalioka Bio"
                className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-medium text-brand-brown"
              />
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <SelectField label={t.category} value={category} onChange={(v) => setCategory(v as MarketItem['category'])} options={categoryOptions} />
              </View>
              <View className="flex-1">
                <SelectField label="Région" value={region} onChange={setRegion} options={regionsList.map((r) => ({ value: r, label: r }))} />
              </View>
            </View>

            <View className="flex-row gap-3">
              <View style={{ flex: 2 }}>
                <Text className="text-xs font-bold text-brand-brown mb-1">Prix en Ariary (Ar)</Text>
                <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-medium text-brand-brown" />
              </View>
              <View className="flex-1">
                <SelectField label="Par unité" value={unit} onChange={setUnit} options={unitOptions} />
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-xs font-bold text-brand-brown mb-1">Stock disponible</Text>
                <TextInput value={stockAmount} onChangeText={setStockAmount} placeholder="Ex: 500 kg" className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-medium text-brand-brown" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-brand-brown mb-1">Lieu exact</Text>
                <TextInput value={location} onChangeText={setLocation} placeholder="Ex: Antsirabe Ville" className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-medium text-brand-brown" />
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-xs font-bold text-brand-brown mb-1">Nom du vendeur</Text>
                <TextInput value={sellerName} onChangeText={setSellerName} className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-medium text-brand-brown" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-brand-brown mb-1">Téléphone (Appels & WhatsApp)</Text>
                <TextInput
                  value={sellerPhone}
                  onChangeText={(v) => {
                    setSellerPhone(v);
                    setSellerWhatsapp(v.replace(/\s+/g, ''));
                  }}
                  keyboardType="phone-pad"
                  className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-medium text-brand-brown"
                />
              </View>
            </View>

            <View>
              <Text className="text-xs font-bold text-brand-brownLight uppercase tracking-wider mb-2">Photo du produit</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {sampleImages.map((img) => (
                    <Pressable
                      key={img.label}
                      onPress={() => setImageUrl(img.url)}
                      className={`rounded-xl border-2 overflow-hidden relative ${imageUrl === img.url ? 'border-brand-green' : 'border-brand-beige opacity-75'}`}
                      style={{ width: 80, height: 64 }}
                    >
                      <Image source={{ uri: img.url }} style={{ width: '100%', height: '100%' }} />
                      <View className="absolute bottom-0 inset-x-0 bg-black/60 py-0.5">
                        <Text className="text-white text-[8px] text-center" numberOfLines={1}>
                          {img.label}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View>
              <Text className="text-xs font-bold text-brand-brown mb-1">Description du produit</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Précisez la qualité, le mode de séchage, le conditionnement..."
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2.5 text-xs font-medium text-brand-brown"
                style={{ minHeight: 64 }}
              />
            </View>

            <View className="pt-3 border-t border-brand-beige flex-row justify-end gap-2">
              <Pressable onPress={onClose} className="px-4 py-2.5 rounded-xl border border-brand-beige">
                <Text className="text-xs font-bold text-brand-brownLight">{t.cancel}</Text>
              </Pressable>
              <Pressable onPress={handleSubmit} className="px-5 py-2.5 rounded-xl bg-brand-green flex-row items-center gap-1.5">
                <Plus className="w-4 h-4 text-white" />
                <Text className="text-xs font-bold text-white">{t.postAd}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
