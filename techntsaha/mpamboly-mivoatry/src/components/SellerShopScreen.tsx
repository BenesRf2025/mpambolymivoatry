import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Image } from 'react-native';
import { Crop, InAppOrder, MarketItem, ChatThread, FarmerProfile } from '../types';
import { translations } from '../data/translations';
import { Store, Plus, PackageCheck, Truck, MessageSquare, CheckCircle2, ShieldCheck, Send } from '../lib/icons';
import { SelectField } from './ui/SelectField';

interface SellerShopScreenProps {
  profile: FarmerProfile;
  crops: Crop[];
  orders: InAppOrder[];
  marketItems: MarketItem[];
  chatThreads: ChatThread[];
  onAddMarketItem: (item: MarketItem) => void;
  onUpdateOrderStatus: (orderId: string, status: InAppOrder['deliveryStatus']) => void;
  onSendMessage: (threadId: string, text: string) => void;
  lang: 'fr' | 'mg';
}

const unitOptions = [
  { value: 'kg', label: 'Ar / kg' },
  { value: 'sac 50kg', label: 'sac 50kg' },
  { value: 'cageot', label: 'cageot' },
  { value: 'tonne', label: 'tonne' },
];

export const SellerShopScreen: React.FC<SellerShopScreenProps> = ({
  profile,
  crops,
  orders,
  marketItems,
  chatThreads,
  onAddMarketItem,
  onUpdateOrderStatus,
  onSendMessage,
  lang,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'chat' | 'mvola'>('orders');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState<string>(crops[0]?.id || '');
  const [sellingPrice, setSellingPrice] = useState<number>(2500);
  const [sellingUnit, setSellingUnit] = useState<string>('kg');
  const [stockVolume, setStockVolume] = useState<string>('200 kg');
  const [selectedThreadId, setSelectedThreadId] = useState<string>(chatThreads[0]?.id || '');
  const [replyMessage, setReplyMessage] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const myShopItems = marketItems.filter((item) => item.sellerName.includes(profile.name) || item.sellerType === 'producteur');
  const currentChat = chatThreads.find((c) => c.id === selectedThreadId) || chatThreads[0];
  const totalMonthlySales = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);

  const cropOptions = crops.map((c) => ({ value: c.id, label: `${c.name} (${c.plotName})` }));

  const handlePostProductToShop = () => {
    const selectedCrop = crops.find((c) => c.id === selectedCropId) || crops[0];
    if (!selectedCrop) return;

    const newItem: MarketItem = {
      id: `m-shop-${Date.now()}`,
      title: `${selectedCrop.name} (Direct Producteur)`,
      malagasyTitle: `${selectedCrop.malagasyName} (Mivantana)`,
      category: 'recoltes',
      price: Number(sellingPrice),
      unit: sellingUnit,
      location: profile.location,
      region: profile.region,
      sellerName: profile.shopName || profile.name,
      sellerType: 'producteur',
      sellerPhone: profile.phone,
      sellerWhatsapp: profile.phone.replace(/[^0-9]/g, ''),
      verifiedSeller: true,
      inStock: true,
      stockAmount: stockVolume,
      imageUrl:
        selectedCrop.name.toLowerCase().includes('riz') || selectedCrop.name.toLowerCase().includes('vary')
          ? 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80'
          : selectedCrop.name.toLowerCase().includes('tomate')
          ? 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=80',
      datePosted: lang === 'fr' ? "À l'instant" : 'Vao teo',
      description: `Produit récolté à ${profile.location}. Vente directe sans intermédiaire avec livraison rapide disponible.`,
      malagasyDescription: `Vokatra vao avy notazana teto ${profile.location}. Mivantana tsy misy mpanelanelana.`,
      badge: 'Direct Producteur',
      targetBuyers: ['particulier', 'epicerie', 'restaurant'],
    };

    onAddMarketItem(newItem);
    setIsAddingProduct(false);
    setToastMessage(lang === 'fr' ? 'Produit mis en vente dans votre boutique et sur le marché !' : "Voarotsaka amidy ao amin'ny fivarotanao sy ny tsena ny vokatra !");
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSendChatReply = () => {
    if (!replyMessage.trim() || !currentChat) return;
    onSendMessage(currentChat.id, replyMessage.trim());
    setReplyMessage('');
  };

  const tabs = [
    { id: 'orders' as const, label: `${t.ordersReceived} (${orders.length})`, icon: PackageCheck },
    { id: 'products' as const, label: `${lang === 'fr' ? 'Mes Articles' : 'Entana Amidy'} (${myShopItems.length})`, icon: Store },
    { id: 'chat' as const, label: `${t.directChatWithBuyers} (${chatThreads.length})`, icon: MessageSquare },
    { id: 'mvola' as const, label: 'Mobile Money', icon: ShieldCheck },
  ];

  return (
    <View style={{ gap: 16, paddingBottom: 40 }}>
      {/* Header Banner */}
      <View className="bg-[#6e461f] rounded-2xl p-4">
        <View className="flex-row items-center justify-between gap-3 flex-wrap">
          <View className="flex-row items-center gap-3 flex-1">
            <View className="p-2.5 rounded-xl bg-white/15">
              <Store className="w-6 h-6 text-amber-200" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-2 flex-wrap">
                <Text className="font-bold text-base leading-tight text-white">{profile.shopName || t.sellerTitle}</Text>
                <Text className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 font-semibold">
                  {lang === 'fr' ? 'Vendeur Certifié' : 'Mpivarotra Voamarina'}
                </Text>
              </View>
              <Text className="text-xs text-amber-100/85 leading-tight mt-0.5">{t.sellerSubtitle}</Text>
            </View>
          </View>

          <Pressable onPress={() => setIsAddingProduct(true)} className="flex-row items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white">
            <Plus className="w-4 h-4 text-[#8A5A2B]" />
            <Text className="text-[#8A5A2B] text-xs font-bold">{t.listCropToShop}</Text>
          </Pressable>
        </View>

        <View className="flex-row gap-2 mt-3 pt-3 border-t border-white/15">
          <View className="flex-1 bg-white/10 rounded-xl p-2.5">
            <Text className="text-[10px] text-amber-200 uppercase font-semibold">{t.monthlySalesRevenue}</Text>
            <Text className="text-sm font-black mt-0.5 text-white">{totalMonthlySales.toLocaleString('fr-FR')} Ar</Text>
          </View>
          <View className="flex-1 bg-white/10 rounded-xl p-2.5">
            <Text className="text-[10px] text-amber-200 uppercase font-semibold">{t.ordersReceived}</Text>
            <Text className="text-sm font-black mt-0.5 text-white">
              {orders.length} {lang === 'fr' ? 'commandes' : 'kaomandy'}
            </Text>
          </View>
          <View className="flex-1 bg-white/10 rounded-xl p-2.5">
            <Text className="text-[10px] text-amber-200 uppercase font-semibold">MVola & Orange</Text>
            <Text className="text-sm font-black text-emerald-300 mt-0.5">100% {lang === 'fr' ? 'Sécurisé' : 'Voaaro'}</Text>
          </View>
        </View>
      </View>

      {toastMessage && (
        <View className="bg-amber-900 p-3 rounded-xl flex-row items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-300" />
          <Text className="text-amber-100 text-xs flex-1">{toastMessage}</Text>
        </View>
      )}

      {/* Sub-Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row items-center gap-1.5 bg-[#EBE7DC] p-1 rounded-xl border border-[#D7D3C6]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-lg ${isActive ? 'bg-[#8A5A2B]' : ''}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-700'}`} />
                <Text className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-stone-700'}`}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Add Product Form */}
      {isAddingProduct && (
        <View className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E3DFD2] gap-3">
          <View className="flex-row items-center justify-between pb-2 border-b border-stone-200">
            <Text className="font-bold text-stone-900 text-sm">
              {lang === 'fr' ? 'Mettre une récolte en vente directe' : 'Hametraka vokatra amidy mivantana'}
            </Text>
            <Pressable onPress={() => setIsAddingProduct(false)}>
              <Text className="text-xs text-stone-500">{t.cancel}</Text>
            </Pressable>
          </View>

          <SelectField label={lang === 'fr' ? 'Choisir la culture :' : 'Safidio ny volinao :'} value={selectedCropId} onChange={setSelectedCropId} options={cropOptions} />

          <View>
            <Text className="text-xs font-semibold text-stone-700 mb-1">{lang === 'fr' ? 'Prix unitaire (Ariary) :' : 'Vidiny (Ariary) :'}</Text>
            <View className="flex-row gap-2">
              <TextInput
                value={String(sellingPrice)}
                onChangeText={(v) => setSellingPrice(Number(v) || 0)}
                keyboardType="numeric"
                className="flex-1 text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-stone-900"
              />
              <View style={{ width: 110 }}>
                <SelectField value={sellingUnit} onChange={setSellingUnit} options={unitOptions} />
              </View>
            </View>
          </View>

          <View>
            <Text className="text-xs font-semibold text-stone-700 mb-1">{lang === 'fr' ? 'Volume disponible à la vente :' : "Habetsahan'ny vokatra amidy :"}</Text>
            <TextInput value={stockVolume} onChangeText={setStockVolume} placeholder="Ex: 500 kg ou 20 cageots" className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-stone-900" />
          </View>

          <View className="flex-row items-center justify-end gap-2">
            <Pressable onPress={() => setIsAddingProduct(false)} className="px-3 py-2 rounded-xl">
              <Text className="text-xs font-semibold text-stone-600">{t.cancel}</Text>
            </Pressable>
            <Pressable onPress={handlePostProductToShop} className="flex-row items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8A5A2B]">
              <Store className="w-3.5 h-3.5 text-white" />
              <Text className="text-white text-xs font-bold">{lang === 'fr' ? 'Publier dans Ma Boutique' : "Arotsaka ao amin'ny Fivarotana"}</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* TAB: ORDERS */}
      {activeTab === 'orders' && (
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="font-bold text-stone-900 text-sm">{lang === 'fr' ? 'Commandes Reçues Directement' : 'Kaomandy Voaray Mivantana'}</Text>
            <Text className="text-xs text-stone-500">
              {orders.length} {lang === 'fr' ? 'commandes au total' : 'kaomandy'}
            </Text>
          </View>

          <View className="gap-3">
            {orders.map((ord) => (
              <View key={ord.id} className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E3DFD2] gap-3">
                <View className="flex-row items-center justify-between gap-2 pb-2 border-b border-stone-200 flex-wrap">
                  <View>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-xs font-bold text-[#8A5A2B]">{ord.orderNumber}</Text>
                      <Text className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 font-semibold uppercase">{ord.buyerSegment}</Text>
                    </View>
                    <Text className="text-sm font-bold text-stone-900 mt-0.5">{ord.buyerName}</Text>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <Text
                      className={`text-[10px] px-2.5 py-1 rounded-lg font-bold ${
                        ord.paymentStatus === 'transferred_to_farmer' || ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.paymentMethod.toUpperCase()} · {ord.paymentStatus}
                    </Text>
                    <Text
                      className={`text-[10px] px-2.5 py-1 rounded-lg font-bold ${
                        ord.deliveryStatus === 'in_transit' ? 'bg-blue-100 text-blue-800' : ord.deliveryStatus === 'delivered' ? 'bg-stone-200 text-stone-800' : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {ord.deliveryStatus}
                    </Text>
                  </View>
                </View>

                <View className="gap-1.5">
                  {ord.items.map((it, idx) => (
                    <View key={idx} className="flex-row items-center justify-between bg-white p-2 rounded-xl border border-stone-200/80">
                      <Text className="text-xs text-stone-800">
                        <Text className="font-semibold">{it.title}</Text> · {it.quantity} {it.unit}
                      </Text>
                      <Text className="text-xs font-bold text-stone-800">{it.subtotal.toLocaleString('fr-FR')} Ar</Text>
                    </View>
                  ))}
                </View>

                <View className="bg-[#EBE7DC] p-2.5 rounded-xl border border-[#D7D3C6] flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2 flex-1">
                    <Truck className="w-4 h-4 text-[#8A5A2B]" />
                    <View className="flex-1">
                      <Text className="font-semibold text-stone-900 text-xs">{ord.deliveryPartner ? ord.deliveryPartner.name : 'Livreur Assigné'}</Text>
                      <Text className="text-stone-500 text-[11px]">{ord.deliveryAddress}</Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-[10px] text-stone-500">Total Net Reçu</Text>
                    <Text className="text-sm font-black text-[#8A5A2B]">{ord.totalAmount.toLocaleString('fr-FR')} Ar</Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-end gap-2">
                  <Pressable
                    onPress={() => {
                      setSelectedThreadId(chatThreads[0]?.id || '');
                      setActiveTab('chat');
                    }}
                    className="flex-row items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-stone-700" />
                    <Text className="text-xs text-stone-700 font-semibold">{lang === 'fr' ? 'Échanger' : 'Hiresaka'}</Text>
                  </Pressable>

                  {ord.deliveryStatus !== 'delivered' && (
                    <Pressable onPress={() => onUpdateOrderStatus(ord.id, 'delivered')} className="flex-row items-center gap-1 px-3 py-1.5 rounded-lg bg-[#5B7553]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <Text className="text-xs text-white font-semibold">{lang === 'fr' ? 'Marquer Livré' : 'Efa voatolotra'}</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* TAB: PRODUCTS */}
      {activeTab === 'products' && (
        <View className="flex-row flex-wrap gap-3">
          {myShopItems.map((item) => (
            <View key={item.id} className="bg-[#FAF8F5] rounded-2xl p-3.5 border border-[#E3DFD2] flex-row gap-3" style={{ width: '100%' }}>
              <Image source={{ uri: item.imageUrl }} style={{ width: 80, height: 80, borderRadius: 12 }} />
              <View className="flex-1 justify-between">
                <View>
                  <Text className="font-bold text-xs text-stone-900" numberOfLines={1}>
                    {lang === 'fr' ? item.title : item.malagasyTitle || item.title}
                  </Text>
                  <Text className="text-xs font-black text-[#8A5A2B] mt-0.5">
                    {item.price.toLocaleString('fr-FR')} Ar / {item.unit}
                  </Text>
                  <Text className="text-[10px] text-stone-500 mt-0.5">{item.stockAmount}</Text>
                </View>
                <Text className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold self-start">
                  {lang === 'fr' ? 'En vitrine direct' : 'Misy amidy'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* TAB: CHAT */}
      {activeTab === 'chat' && (
        <View className="bg-[#FAF8F5] rounded-2xl border border-[#E3DFD2] overflow-hidden" style={{ minHeight: 420 }}>
          <View className="border-b border-stone-200 p-3 gap-2">
            <Text className="text-xs font-bold text-stone-700 mb-1">{lang === 'fr' ? 'Discussions Négociations' : 'Fifampiraharahana'}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {chatThreads.map((thread) => {
                  const isSelected = thread.id === currentChat?.id;
                  return (
                    <Pressable
                      key={thread.id}
                      onPress={() => setSelectedThreadId(thread.id)}
                      className={`p-2.5 rounded-xl ${isSelected ? 'bg-[#8A5A2B]' : 'bg-white'}`}
                      style={{ minWidth: 160 }}
                    >
                      <View className="flex-row items-center justify-between">
                        <Text className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-stone-800'}`} numberOfLines={1}>
                          {thread.buyerName}
                        </Text>
                        <Text className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-stone-400'}`}>{thread.lastUpdated}</Text>
                      </View>
                      <Text className={`text-[11px] mt-0.5 ${isSelected ? 'text-white/90' : 'text-stone-500'}`} numberOfLines={1}>
                        {thread.lastMessage}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {currentChat && (
            <View className="flex-1 p-3 gap-3" style={{ minHeight: 300 }}>
              <View className="pb-2 border-b border-stone-200 flex-row items-center justify-between">
                <View>
                  <Text className="font-bold text-xs text-stone-900">{currentChat.buyerName}</Text>
                  <Text className="text-[10px] text-stone-500">{currentChat.productTitle}</Text>
                </View>
                <Text className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">MVola Vérifié</Text>
              </View>

              <ScrollView style={{ maxHeight: 260 }}>
                <View className="gap-2.5 p-1">
                  {currentChat.messages.map((m) => {
                    const isMe = m.senderRole === 'seller' || m.senderRole === 'association';
                    return (
                      <View key={m.id} className={`${isMe ? 'items-end' : 'items-start'}`}>
                        <View className={`p-2.5 rounded-2xl ${isMe ? 'bg-[#8A5A2B]' : 'bg-white border border-stone-200'}`} style={{ maxWidth: '85%' }}>
                          <Text className={`text-[10px] font-bold opacity-75 mb-0.5 ${isMe ? 'text-white' : 'text-stone-900'}`}>{m.senderName}</Text>
                          <Text className={`text-xs ${isMe ? 'text-white' : 'text-stone-900'}`}>{m.text}</Text>
                          {m.isOfferProposal && (
                            <Text className={`mt-2 pt-2 border-t text-[11px] font-bold ${isMe ? 'border-white/20 text-white' : 'border-stone-200 text-stone-900'}`}>
                              Offre : {m.proposedPrice?.toLocaleString('fr-FR')} Ar ({m.proposedQuantity} kg)
                            </Text>
                          )}
                        </View>
                        <Text className="text-[9px] text-stone-400 mt-0.5 px-1">{m.timestamp}</Text>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>

              <View className="flex-row gap-2 pt-2 border-t border-stone-200">
                <TextInput
                  value={replyMessage}
                  onChangeText={setReplyMessage}
                  placeholder={lang === 'fr' ? "Répondre à l'acheteur..." : 'Hamaly ny mpividy...'}
                  onSubmitEditing={handleSendChatReply}
                  className="flex-1 text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-stone-900"
                />
                <Pressable onPress={handleSendChatReply} className="p-2.5 rounded-xl bg-[#8A5A2B]">
                  <Send className="w-4 h-4 text-white" />
                </Pressable>
              </View>
            </View>
          )}
        </View>
      )}

      {/* TAB: MVOLA */}
      {activeTab === 'mvola' && (
        <View className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E3DFD2] gap-4">
          <View className="flex-row items-center gap-3 pb-3 border-b border-stone-200">
            <View className="p-2.5 rounded-xl bg-emerald-100">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-stone-900 text-sm">
                {lang === 'fr' ? 'Paiements Mobiles Sécurisés (Sans Banque)' : "Fandoavam-bola amin'ny Finday"}
              </Text>
              <Text className="text-xs text-stone-500">{t.mvolaOrangeMoneyIntegrated}</Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-3">
            <View className="bg-white p-3.5 rounded-xl border border-stone-200" style={{ width: '48%' }}>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs font-black text-amber-600 uppercase">MVola Telma</Text>
                <Text className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Actif</Text>
              </View>
              <Text className="text-sm font-bold text-stone-900">{profile.mvolaNumber || '034 12 345 67'}</Text>
              <Text className="text-[11px] text-stone-500 mt-1">
                {lang === 'fr' ? "Versements automatiques dès validation de livraison par l'acheteur." : "Voaloa avy hatrany rehefa voaray ny entana."}
              </Text>
            </View>

            <View className="bg-white p-3.5 rounded-xl border border-stone-200" style={{ width: '48%' }}>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs font-black text-orange-600 uppercase">Orange Money</Text>
                <Text className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Actif</Text>
              </View>
              <Text className="text-sm font-bold text-stone-900">{profile.orangeMoneyNumber || '032 55 987 12'}</Text>
              <Text className="text-[11px] text-stone-500 mt-1">{lang === 'fr' ? 'Accessible sans frais de tenue de compte.' : 'Tsy misy sarany fanampiny.'}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
