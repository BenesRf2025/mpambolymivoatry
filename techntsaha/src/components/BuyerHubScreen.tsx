import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Image, Modal } from 'react-native';
import { MarketItem, InAppOrder } from '../types';
import { translations } from '../data/translations';
import { ShoppingBag, Store, Utensils, Globe2, Users, Search, CheckCircle2, ShieldCheck, MessageSquare, MapPin, X, TrendingUp, Package } from '../lib/icons';
import { useListings, useCreateListing } from '../services/reactQueryHooks';

interface BuyerHubScreenProps {
  marketItems: MarketItem[];
  onPlaceOrder: (order: InAppOrder) => void;
  onInitiateChat: (item: MarketItem, message: string) => void;
  lang: 'fr' | 'mg';
}

export const BuyerHubScreen: React.FC<BuyerHubScreenProps> = ({ marketItems: propMarketItems, onPlaceOrder, onInitiateChat, lang }) => {
  const t = translations[lang];
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [orderingItem, setOrderingItem] = useState<MarketItem | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(50);
  const [orderPaymentMethod, setOrderPaymentMethod] = useState<'mvola' | 'orange_money'>('mvola');
  const [orderAddress, setOrderAddress] = useState<string>('Pavillon 12, Marché Anosibe, Antananarivo');
  const [negotiatingItem, setNegotiatingItem] = useState<MarketItem | null>(null);
  const [negotiationMessage, setNegotiationMessage] = useState<string>('');
  const [proposedPrice, setProposedPrice] = useState<number>(0);
  const [orderSuccessToast, setOrderSuccessToast] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'products' | 'sellers'>('products');

  const listingsQuery = useListings();
  const createListingMutation = useCreateListing();

  const marketItems = (listingsQuery.data && listingsQuery.data.length > 0)
    ? listingsQuery.data.map((listing): MarketItem => ({
        id: listing.id,
        title: listing.name,
        malagasyTitle: listing.name,
        category: 'recoltes',
        price: listing.price || 0,
        unit: listing.unit || 'kg',
        location: 'Madagascar',
        region: 'Madagascar',
        sellerName: 'Vendeur',
        sellerType: (listing.sellerType as 'producteur' | 'association' | 'commercant') || 'producteur',
        sellerPhone: '',
        verifiedSeller: true,
        inStock: true,
        stockAmount: listing.quantity?.toString() || '',
        stockKg: listing.quantity || undefined,
        imageUrl: listing.images?.[0] || 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=500&auto=format&fit=crop&q=80',
        datePosted: listing.createdAt || "À l'instant",
        description: listing.description || '',
        malagasyDescription: listing.description || '',
        targetBuyers: [],
        bulkDiscount: undefined,
      }))
    : propMarketItems;

  const sellersMap = new Map<string, MarketItem[]>();
  marketItems.forEach((item) => {
    const key = item.sellerName;
    if (!sellersMap.has(key)) sellersMap.set(key, []);
    sellersMap.get(key)!.push(item);
  });
  const sellers = Array.from(sellersMap.entries()).map(([name, items]) => ({
    name,
    items,
    count: items.length,
    minPrice: Math.min(...items.map((i) => i.price)),
    maxPrice: Math.max(...items.map((i) => i.price)),
    totalStock: items.reduce((sum, i) => sum + (i.stockKg || 0), 0),
    sellerType: items[0].sellerType,
  }));

  const segments = [
    { id: 'all', label: lang === 'fr' ? 'Tous les Acheteurs' : 'Mpividy Rehetra', icon: Users },
    { id: 'particulier', label: t.buyerSegmentParticulier, icon: Users },
    { id: 'epicerie', label: t.buyerSegmentEpicerie, icon: Store },
    { id: 'restaurant', label: t.buyerSegmentRestaurant, icon: Utensils },
    { id: 'export', label: t.buyerSegmentExport, icon: Globe2 },
  ];

  const filteredItems = marketItems.filter((item) => {
    const matchesSegment = selectedSegment === 'all' || (item.targetBuyers && item.targetBuyers.includes(selectedSegment as any));
    const q = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || item.title.toLowerCase().includes(q) || item.location.toLowerCase().includes(q) || item.sellerName.toLowerCase().includes(q);
    return matchesSegment && matchesSearch;
  });

  const handleConfirmOrder = () => {
    if (!orderingItem) return;

    const subtotal = orderingItem.price * orderQuantity;
    const isDiscounted = orderingItem.bulkDiscount && orderQuantity >= orderingItem.bulkDiscount.minQuantity;
    const finalTotal = isDiscounted ? Math.round(subtotal * (1 - orderingItem.bulkDiscount!.discountPercent / 100)) : subtotal;

    const newOrder: InAppOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `CMD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      buyerName: 'Acheteur Partenaire (Vous)',
      buyerPhone: '+261 34 50 111 22',
      buyerSegment: (selectedSegment === 'all' ? 'epicerie' : selectedSegment) as any,
      sellerName: orderingItem.sellerName,
      items: [
        {
          title: orderingItem.title,
          quantity: orderQuantity,
          unit: orderingItem.unit,
          unitPrice: orderingItem.price,
          subtotal: finalTotal,
        },
      ],
      totalAmount: finalTotal,
      paymentMethod: orderPaymentMethod,
      paymentStatus: 'paid',
      deliveryStatus: 'preparing',
      deliveryPartner: {
        name: 'Express Moto Cargo Madagascar',
        phone: '+261 33 45 888 99',
        vehicleType: 'Moto-cargo Isuzu',
      },
      deliveryFee: 12000,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      deliveryAddress: orderAddress,
    };

    onPlaceOrder(newOrder);
    setOrderingItem(null);
    setOrderSuccessToast(
      lang === 'fr'
        ? `Commande de ${finalTotal.toLocaleString('fr-FR')} Ar validée avec succès via ${orderPaymentMethod.toUpperCase()} !`
        : `Voaray soa aman-tsara ny kaomandy ${finalTotal.toLocaleString('fr-FR')} Ar tamin'ny ${orderPaymentMethod.toUpperCase()} !`
    );
    setTimeout(() => setOrderSuccessToast(null), 5000);
  };

  const handleSendNegotiation = () => {
    if (!negotiatingItem) return;

    onInitiateChat(
      negotiatingItem,
      negotiationMessage || `Bonjour, nous souhaitons commander en gros pour notre établissement. Proposition de prix : ${proposedPrice} Ar/${negotiatingItem.unit}.`
    );
    setNegotiatingItem(null);
    setNegotiationMessage('');
    setOrderSuccessToast(lang === 'fr' ? 'Offre de négociation envoyée directement au producteur !' : "Lasa any amin'ny mpamokatra ny tolotra fifampiraharahana !");
    setTimeout(() => setOrderSuccessToast(null), 4000);
  };

  return (
    <View style={{ gap: 16, paddingBottom: 40 }}>
      {/* Banner */}
      <View className="bg-[#232a38] rounded-2xl p-4">
        <View className="flex-row items-center gap-3">
          <View className="p-2.5 rounded-xl bg-white/15">
            <ShoppingBag className="w-6 h-6 text-blue-300" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-2 flex-wrap">
              <Text className="font-bold text-base leading-tight text-white">{t.buyerTitle}</Text>
              <Text className="text-[10px] px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-200 font-semibold">Direct Champ</Text>
            </View>
            <Text className="text-xs text-blue-100/85 leading-tight mt-0.5">{t.buyerSubtitle}</Text>
          </View>
        </View>

        <View className="mt-3 pt-3 border-t border-white/15 relative flex-row items-center">
          <Search className="w-4 h-4 absolute left-3 z-10 text-stone-400" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={lang === 'fr' ? 'Rechercher une récolte, un producteur, une région...' : 'Hikaroka vokatra, mpamokatra, faritra...'}
            placeholderTextColor="#a8a29e"
            className="flex-1 pl-9 pr-3 py-2.5 rounded-xl bg-white/10 text-white text-xs"
          />
        </View>
      </View>

      {orderSuccessToast && (
        <View className="bg-blue-900 p-3 rounded-xl flex-row items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-300" />
          <Text className="text-blue-100 text-xs flex-1">{orderSuccessToast}</Text>
        </View>
      )}

      {/* Segment Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row items-center gap-2">
          {segments.map((seg) => {
            const isSelected = selectedSegment === seg.id;
            const Icon = seg.icon;
            return (
              <Pressable
                key={seg.id}
                onPress={() => setSelectedSegment(seg.id)}
                className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl border ${isSelected ? 'bg-stone-800 border-stone-800' : 'bg-white border-stone-200'}`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-stone-700'}`} />
                <Text className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-stone-700'}`}>{seg.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* View Mode Toggle */}
      <View className="flex-row gap-2 bg-white p-1 rounded-xl border border-stone-200">
        <Pressable
          onPress={() => setViewMode('products')}
          className={`flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-lg ${viewMode === 'products' ? 'bg-stone-900' : ''}`}
        >
          <Package className={`w-4 h-4 ${viewMode === 'products' ? 'text-white' : 'text-stone-700'}`} />
          <Text className={`text-xs font-bold ${viewMode === 'products' ? 'text-white' : 'text-stone-700'}`}>
            {lang === 'fr' ? 'Par Produit' : 'Avy amin\'ny Vokatra'}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setViewMode('sellers')}
          className={`flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-lg ${viewMode === 'sellers' ? 'bg-stone-900' : ''}`}
        >
          <Store className={`w-4 h-4 ${viewMode === 'sellers' ? 'text-white' : 'text-stone-700'}`} />
          <Text className={`text-xs font-bold ${viewMode === 'sellers' ? 'text-white' : 'text-stone-700'}`}>
            {lang === 'fr' ? 'Par Vendeur' : 'Avy amin\'ny Mpivarotra'}
          </Text>
        </Pressable>
      </View>

      {/* Sourcing Catalog */}
      {viewMode === 'products' ? (
        <View className="flex-row flex-wrap gap-3">
          {filteredItems.map((item) => (
            <View key={item.id} className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E3DFD2] gap-3 justify-between" style={{ width: '100%' }}>
            <View>
              <View className="relative mb-2.5">
                <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: 144, borderRadius: 12 }} />
                <View className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-stone-900/80">
                  <Text className="text-white text-[10px] font-bold">
                    {item.sellerType === 'association' ? (lang === 'fr' ? 'Stock Coopérative' : 'Tahiry Koperativa') : lang === 'fr' ? 'Direct Producteur' : 'Mpamokatra Mivantana'}
                  </Text>
                </View>
                {item.bulkDiscount && (
                  <View className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-amber-500">
                    <Text className="text-white text-[10px] font-bold">
                      -{item.bulkDiscount.discountPercent}% dès {item.bulkDiscount.minQuantity} {item.unit}
                    </Text>
                  </View>
                )}
              </View>

              <View className="flex-row items-start justify-between gap-2">
                <View className="flex-1">
                  <Text className="font-bold text-sm text-stone-900 leading-tight">{lang === 'fr' ? item.title : item.malagasyTitle || item.title}</Text>
                  <View className="flex-row items-center gap-1.5 mt-1">
                    <MapPin className="w-3 h-3 text-[#5B7553]" />
                    <Text className="text-[11px] text-stone-500">{item.location}</Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text className="text-sm font-black text-stone-900">{item.price.toLocaleString('fr-FR')} Ar</Text>
                  <Text className="text-[10px] text-stone-500">par {item.unit}</Text>
                </View>
              </View>

              <Text className="text-xs text-stone-600 mt-2" numberOfLines={2}>
                {lang === 'fr' ? item.description : item.malagasyDescription || item.description}
              </Text>
            </View>

            <View className="pt-2 border-t border-stone-200 flex-row items-center gap-2">
              <Pressable
                onPress={() => {
                  setNegotiatingItem(item);
                  setProposedPrice(Math.round(item.price * 0.9));
                }}
                className="flex-1 flex-row items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-stone-300"
              >
                <MessageSquare className="w-3.5 h-3.5 text-stone-700" />
                <Text className="text-stone-700 text-xs font-semibold">{lang === 'fr' ? 'Négocier Gros' : 'Hifampiraharaha'}</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setOrderingItem(item);
                  setOrderQuantity(item.bulkDiscount ? item.bulkDiscount.minQuantity : 20);
                }}
                className="flex-1 flex-row items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-900"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-white" />
                <Text className="text-white text-xs font-bold">{t.orderDirect}</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
      ) : (
        <View className="gap-3">
          {sellers.map((seller) => (
            <View key={seller.name} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <View className="p-4 bg-stone-900 flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Store className="w-4 h-4 text-amber-300" />
                    <Text className="font-bold text-sm text-white">{seller.name}</Text>
                  </View>
                  <View className="flex-row items-center gap-3 mt-1">
                    <Text className="text-[10px] text-stone-300">
                      {lang === 'fr' ? `${seller.count} produit(s)` : `Vokatra ${seller.count}`}
                    </Text>
                    <Text className="text-[10px] text-stone-300">
                      {lang === 'fr' ? `Stock total: ${seller.totalStock.toLocaleString('fr-FR')} kg` : `Fahatahirana: ${seller.totalStock.toLocaleString('fr-FR')} kg`}
                    </Text>
                    <Text className="text-[10px] text-amber-200 font-bold">
                      {seller.minPrice.toLocaleString('fr-FR')} - {seller.maxPrice.toLocaleString('fr-FR')} Ar
                    </Text>
                  </View>
                </View>
                <View className="bg-white/15 px-2.5 py-1 rounded-full">
                  <Text className="text-[10px] font-bold text-white uppercase">{seller.sellerType}</Text>
                </View>
              </View>
              <View className="p-3 gap-2">
                {seller.items.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      setOrderingItem(item);
                      setOrderQuantity(item.bulkDiscount ? item.bulkDiscount.minQuantity : 20);
                    }}
                    className="flex-row items-center justify-between bg-[#FAF8F5] p-3 rounded-xl border border-stone-100"
                  >
                    <View className="flex-1">
                      <Text className="text-xs font-bold text-stone-900">{lang === 'fr' ? item.title : item.malagasyTitle || item.title}</Text>
                      <Text className="text-[10px] text-stone-500">{item.stockAmount} {item.unit}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-xs font-black text-stone-900">{item.price.toLocaleString('fr-FR')} Ar</Text>
                      <Text className="text-[9px] text-stone-500">/ {item.unit}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* ORDER MODAL */}
      <Modal visible={!!orderingItem} transparent animationType="fade" onRequestClose={() => setOrderingItem(null)}>
        <View className="flex-1 bg-black/60 items-center justify-center p-3">
          {orderingItem && (
            <ScrollView className="bg-[#FAF8F5] rounded-2xl w-full border border-stone-300" style={{ maxWidth: 420, maxHeight: '90%' }} contentContainerStyle={{ padding: 16, gap: 14 }}>
              <View className="flex-row items-center justify-between pb-2 border-b border-stone-200">
                <View className="flex-1">
                  <Text className="text-[10px] uppercase font-bold text-blue-600">{lang === 'fr' ? 'Commande Directe Sécurisée' : 'Kaomandy Mivantana'}</Text>
                  <Text className="font-bold text-stone-900 text-sm">{orderingItem.title}</Text>
                </View>
                <Pressable onPress={() => setOrderingItem(null)}>
                  <X className="w-4 h-4 text-stone-500" />
                </Pressable>
              </View>

              <View>
                <Text className="text-xs font-semibold text-stone-700 mb-1">
                  {lang === 'fr' ? `Quantité à commander (${orderingItem.unit}) :` : 'Habetsahana :'}
                </Text>
                <TextInput
                  value={String(orderQuantity)}
                  onChangeText={(v) => setOrderQuantity(Number(v) || 0)}
                  keyboardType="numeric"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 font-bold"
                />
              </View>

              <View>
                <Text className="text-xs font-semibold text-stone-700 mb-1">
                  {lang === 'fr' ? 'Adresse de livraison à Madagascar :' : 'Toerana hanaterana azy :'}
                </Text>
                <TextInput value={orderAddress} onChangeText={setOrderAddress} className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-stone-900" />
              </View>

              <View>
                <Text className="text-xs font-semibold text-stone-700 mb-1.5">
                  {lang === 'fr' ? 'Paiement Mobile Money instantané :' : "Fandoavam-bola amin'ny Finday :"}
                </Text>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => setOrderPaymentMethod('mvola')}
                    className={`flex-1 p-2.5 rounded-xl border flex-row items-center justify-center gap-1.5 ${
                      orderPaymentMethod === 'mvola' ? 'bg-amber-600 border-amber-600' : 'bg-white border-stone-200'
                    }`}
                  >
                    <ShieldCheck className={`w-3.5 h-3.5 ${orderPaymentMethod === 'mvola' ? 'text-white' : 'text-stone-700'}`} />
                    <Text className={`text-xs font-bold ${orderPaymentMethod === 'mvola' ? 'text-white' : 'text-stone-700'}`}>MVola Telma</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setOrderPaymentMethod('orange_money')}
                    className={`flex-1 p-2.5 rounded-xl border flex-row items-center justify-center gap-1.5 ${
                      orderPaymentMethod === 'orange_money' ? 'bg-orange-600 border-orange-600' : 'bg-white border-stone-200'
                    }`}
                  >
                    <ShieldCheck className={`w-3.5 h-3.5 ${orderPaymentMethod === 'orange_money' ? 'text-white' : 'text-stone-700'}`} />
                    <Text className={`text-xs font-bold ${orderPaymentMethod === 'orange_money' ? 'text-white' : 'text-stone-700'}`}>Orange Money</Text>
                  </Pressable>
                </View>
              </View>

              <View className="bg-[#EBE7DC] p-3 rounded-xl border border-[#D7D3C6] flex-row items-center justify-between">
                <View>
                  <Text className="text-stone-500 text-[10px]">Total à payer (frais livraison inclus)</Text>
                  <Text className="font-bold text-stone-900 text-xs">
                    {orderQuantity} {orderingItem.unit} × {orderingItem.price} Ar
                  </Text>
                </View>
                <Text className="text-base font-black text-stone-900">{(orderingItem.price * orderQuantity).toLocaleString('fr-FR')} Ar</Text>
              </View>

              <View className="flex-row items-center justify-end gap-2">
                <Pressable onPress={() => setOrderingItem(null)} className="px-3.5 py-2 rounded-xl">
                  <Text className="text-xs font-semibold text-stone-600">{t.cancel}</Text>
                </Pressable>
                <Pressable onPress={handleConfirmOrder} className="px-4 py-2.5 rounded-xl bg-stone-900">
                  <Text className="text-white text-xs font-bold">{lang === 'fr' ? 'Valider et Payer' : 'Handoa Vola'}</Text>
                </Pressable>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* NEGOTIATION MODAL */}
      <Modal visible={!!negotiatingItem} transparent animationType="fade" onRequestClose={() => setNegotiatingItem(null)}>
        <View className="flex-1 bg-black/60 items-center justify-center p-3">
          {negotiatingItem && (
            <View className="bg-[#FAF8F5] rounded-2xl w-full border border-stone-300" style={{ maxWidth: 420, padding: 16, gap: 14 }}>
              <View className="flex-row items-center justify-between pb-2 border-b border-stone-200">
                <View className="flex-1">
                  <Text className="text-[10px] uppercase font-bold text-amber-600">
                    {lang === 'fr' ? 'Proposition de Prix de Gros' : "Fifampiraharahana Vidin'ny Ambongadiny"}
                  </Text>
                  <Text className="font-bold text-stone-900 text-sm">{negotiatingItem.title}</Text>
                </View>
                <Pressable onPress={() => setNegotiatingItem(null)}>
                  <X className="w-4 h-4 text-stone-500" />
                </Pressable>
              </View>

              <View>
                <Text className="text-xs font-semibold text-stone-700 mb-1">
                  {lang === 'fr' ? `Votre proposition de prix (Ar / ${negotiatingItem.unit}) :` : 'Vidy atolotrao :'}
                </Text>
                <TextInput
                  value={String(proposedPrice)}
                  onChangeText={(v) => setProposedPrice(Number(v) || 0)}
                  keyboardType="numeric"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 font-bold"
                />
              </View>

              <View>
                <Text className="text-xs font-semibold text-stone-700 mb-1">
                  {lang === 'fr' ? 'Message au producteur / coopérative :' : "Hafatra ho an'ny mpamokatra :"}
                </Text>
                <TextInput
                  value={negotiationMessage}
                  onChangeText={setNegotiationMessage}
                  placeholder={
                    lang === 'fr'
                      ? 'Ex: Nous avons besoin de 500 kg hebdomadaires pour approvisionner notre cuisine...'
                      : "Ohatra: Mila 500 kg isan-kerinandro izahay ho an'ny trano fisakafoanana..."
                  }
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-stone-900"
                  style={{ minHeight: 72 }}
                />
              </View>

              <View className="flex-row items-center justify-end gap-2">
                <Pressable onPress={() => setNegotiatingItem(null)} className="px-3.5 py-2 rounded-xl">
                  <Text className="text-xs font-semibold text-stone-600">{t.cancel}</Text>
                </Pressable>
                <Pressable onPress={handleSendNegotiation} className="px-4 py-2.5 rounded-xl bg-[#8A5A2B]">
                  <Text className="text-white text-xs font-bold">{lang === 'fr' ? "Envoyer l'Offre" : 'Handefa Tolotra'}</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};
