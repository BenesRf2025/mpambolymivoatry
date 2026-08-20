import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  ScreenType,
  Language,
  UserRole,
  Crop,
  MarketItem,
  FinancialEntry,
  FarmerProfile,
  IoTSensorNode,
  FieldInspectionRound,
  CooperativeGroup,
  InAppOrder,
  ChatThread,
} from './src/types';
import {
  initialCrops,
  initialMarketItems,
  commodityPrices,
  weatherData,
  initialFarmerProfile,
  demoProfiles,
  initialTransactions,
  initialIoTSensors,
  initialFieldInspections,
  initialCooperative,
  initialInAppOrders,
  initialChatThreads,
} from './src/data/mockData';
import { loadJSON, saveJSON, loadString, saveString } from './src/lib/storage';
import { HomeScreen } from './src/components/HomeScreen';
import { MarketScreen } from './src/components/MarketScreen';
import { DiagnosticScreen } from './src/components/DiagnosticScreen';
import { GuidesScreen } from './src/components/GuidesScreen';
import { ManagementScreen } from './src/components/ManagementScreen';
import { SmartIrrigationScreen } from './src/components/SmartIrrigationScreen';
import { FieldInspectionScreen } from './src/components/FieldInspectionScreen';
import { SellerShopScreen } from './src/components/SellerShopScreen';
import { BuyerHubScreen } from './src/components/BuyerHubScreen';
import { AssociationScreen } from './src/components/AssociationScreen';
import { LoginScreen } from './src/components/LoginScreen';
import { NavigationBottom } from './src/components/NavigationBottom';
import { CropDetailModal } from './src/components/CropDetailModal';
import { NewCropModal } from './src/components/NewCropModal';
import { NewListingModal } from './src/components/NewListingModal';
import { NewTransactionModal } from './src/components/NewTransactionModal';
import { CalculatorsModal } from './src/components/CalculatorsModal';
import { Check } from './src/lib/icons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  // Navigation & Role State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [activeRole, setActiveRole] = useState<UserRole>('agriculteur');
  const [language, setLanguage] = useState<Language>('fr');
  const [selectedRegion, setSelectedRegion] = useState<string>('Vakinankaratra');

  // Data states (persisted via AsyncStorage)
  const [crops, setCrops] = useState<Crop[]>(initialCrops);
  const [marketItems, setMarketItems] = useState<MarketItem[]>(initialMarketItems);
  const [transactions, setTransactions] = useState<FinancialEntry[]>(initialTransactions);
  const [sensorNodes, setSensorNodes] = useState<IoTSensorNode[]>(initialIoTSensors);
  const [inspections, setInspections] = useState<FieldInspectionRound[]>(initialFieldInspections);
  const [cooperative, setCooperative] = useState<CooperativeGroup>(initialCooperative);
  const [orders, setOrders] = useState<InAppOrder[]>(initialInAppOrders);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(initialChatThreads);
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>(initialFarmerProfile);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // UI states
  const [selectedCropDetail, setSelectedCropDetail] = useState<Crop | null>(null);
  const [isNewCropModalOpen, setIsNewCropModalOpen] = useState<boolean>(false);
  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState<boolean>(false);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState<boolean>(false);
  const [isCalculatorsModalOpen, setIsCalculatorsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ---- Load persisted state on first mount ----
  useEffect(() => {
    (async () => {
      const [
        savedCrops,
        savedMarket,
        savedTransactions,
        savedSensors,
        savedInspections,
        savedCoop,
        savedOrders,
        savedChats,
        savedAuth,
      ] = await Promise.all([
        loadJSON('mpamboly_crops', initialCrops),
        loadJSON('mpamboly_market', initialMarketItems),
        loadJSON('mpamboly_transactions', initialTransactions),
        loadJSON('mpamboly_sensors', initialIoTSensors),
        loadJSON('mpamboly_inspections', initialFieldInspections),
        loadJSON('mpamboly_coop', initialCooperative),
        loadJSON('mpamboly_orders', initialInAppOrders),
        loadJSON('mpamboly_chats', initialChatThreads),
        loadString('mpamboly_is_authenticated'),
      ]);
      setCrops(savedCrops);
      setMarketItems(savedMarket);
      setTransactions(savedTransactions);
      setSensorNodes(savedSensors);
      setInspections(savedInspections);
      setCooperative(savedCoop);
      setOrders(savedOrders);
      setChatThreads(savedChats);
      setIsAuthenticated(savedAuth === 'true');
      setIsReady(true);
    })();
  }, []);

  // ---- Persist on change (skip until initial load is done) ----
  useEffect(() => {
    if (isReady) saveJSON('mpamboly_crops', crops);
  }, [crops, isReady]);
  useEffect(() => {
    if (isReady) saveJSON('mpamboly_market', marketItems);
  }, [marketItems, isReady]);
  useEffect(() => {
    if (isReady) saveJSON('mpamboly_transactions', transactions);
  }, [transactions, isReady]);
  useEffect(() => {
    if (isReady) saveJSON('mpamboly_sensors', sensorNodes);
  }, [sensorNodes, isReady]);
  useEffect(() => {
    if (isReady) saveJSON('mpamboly_inspections', inspections);
  }, [inspections, isReady]);
  useEffect(() => {
    if (isReady) saveJSON('mpamboly_orders', orders);
  }, [orders, isReady]);
  useEffect(() => {
    if (isReady) saveJSON('mpamboly_chats', chatThreads);
  }, [chatThreads, isReady]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const handleToggleLanguage = () => {
    const nextLang = language === 'mg' ? 'fr' : 'mg';
    setLanguage(nextLang);
    showToast(nextLang === 'mg' ? 'Fiteny: Malagasy 🇲🇬' : 'Langue: Français 🇲🇬');
  };

  const handleSelectRole = (role: UserRole) => {
    setActiveRole(role);
    setFarmerProfile((prev) => ({ ...prev, activeRole: role }));

    if (role === 'agriculteur') {
      showToast(language === 'fr' ? 'Rôle : Agriculteur & Producteur (IoT & Terrains)' : 'Andraikitra : Mpamboly & Mpamokatra');
    } else if (role === 'vendeur') {
      showToast(language === 'fr' ? 'Rôle : Vendeur & Ma Boutique Directe' : 'Andraikitra : Mpivarotra & Fivarotana');
    } else if (role === 'commercant') {
      showToast(language === 'fr' ? 'Rôle : Commerçant & Acheteur Professionnel' : 'Andraikitra : Mpividy & Famatsiana');
    } else if (role === 'association') {
      showToast(language === 'fr' ? 'Rôle : Association & Coopérative Miray Hina' : 'Andraikitra : Koperativa & Mpiombona');
    } else {
      showToast(language === 'fr' ? 'Vue Globale : Tous les Rôles Mpamboly' : 'Fahitana : Andraikitra Rehetra');
    }
  };

  const handleLogin = (role: UserRole, customProfile?: FarmerProfile, destinationScreen?: ScreenType) => {
    setIsAuthenticated(true);
    saveString('mpamboly_is_authenticated', 'true');
    setActiveRole(role);
    if (customProfile) setFarmerProfile(customProfile);
    setCurrentScreen(destinationScreen || 'home');
    showToast(
      language === 'mg'
        ? `Tafiditra soa aman-tsara : ${customProfile?.name || role}`
        : `Connecté avec succès : ${customProfile?.name || role}`
    );
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    saveString('mpamboly_is_authenticated', 'false');
    showToast(language === 'mg' ? 'Tafavoaka ny kaonty' : 'Déconnecté avec succès');
  };

  const handleAddCrop = (newCrop: Omit<Crop, 'id'>) => {
    const createdCrop: Crop = { ...newCrop, id: 'crop-' + Date.now() };
    setCrops((prev) => [createdCrop, ...prev]);
    showToast(language === 'mg' ? 'Voatahiry soa aman-tsara ny voly vaovao!' : 'Nouvelle culture enregistrée avec succès !');
  };

  const handleAddListing = (newListing: Omit<MarketItem, 'id' | 'datePosted'>) => {
    const createdItem: MarketItem = {
      ...newListing,
      id: 'm-' + Date.now(),
      datePosted: language === 'mg' ? 'Vao teo' : "À l'instant",
    };
    setMarketItems((prev) => [createdItem, ...prev]);
    showToast(language === 'mg' ? 'Navoaka soa aman-tsara ny tolotra!' : 'Votre annonce a été publiée sur le marché !');
  };

  const handleAddTransaction = (newTrx: Omit<FinancialEntry, 'id'>) => {
    const createdTrx: FinancialEntry = { ...newTrx, id: 't-' + Date.now() };
    setTransactions((prev) => [createdTrx, ...prev]);
    showToast(language === 'mg' ? 'Voarakitra ny asa ara-bola!' : 'Transaction enregistrée avec succès !');
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast(language === 'mg' ? 'Voafafa ny firaketana' : 'Opération supprimée');
  };

  const handleUpdateCropStage = (cropId: string, newStage: Crop['stage']) => {
    setCrops((prev) =>
      prev.map((c) => {
        if (c.id === cropId) {
          return {
            ...c,
            stage: newStage,
            progressPercent:
              newStage === 'semis' ? 20 : newStage === 'croissance' ? 45 : newStage === 'floraison' ? 70 : newStage === 'maturation' ? 88 : 98,
          };
        }
        return c;
      })
    );
    if (selectedCropDetail && selectedCropDetail.id === cropId) {
      setSelectedCropDetail((prev) => (prev ? { ...prev, stage: newStage } : null));
    }
    showToast(language === 'mg' ? 'Voavaozina ny dingana' : 'Stade de développement mis à jour');
  };

  const handleUpdateSensor = (updatedSensor: IoTSensorNode) => {
    setSensorNodes((prev) => prev.map((s) => (s.id === updatedSensor.id ? updatedSensor : s)));
  };

  const handleAddInspection = (inspection: FieldInspectionRound) => {
    setInspections((prev) => [inspection, ...prev]);
  };

  const handlePlaceOrder = (order: InAppOrder) => {
    setOrders((prev) => [order, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, status: InAppOrder['deliveryStatus']) => {
    setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, deliveryStatus: status } : ord)));
    showToast(language === 'fr' ? `Statut commande mis à jour : ${status}` : 'Voavaozina ny kaomandy');
  };

  const handleSendMessage = (threadId: string, text: string) => {
    setChatThreads((prev) =>
      prev.map((th) => {
        if (th.id === threadId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            senderName: farmerProfile.name,
            senderRole: (activeRole === 'agriculteur' || activeRole === 'vendeur' ? 'seller' : 'buyer') as any,
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          return {
            ...th,
            lastMessage: text,
            lastUpdated: "À l'instant",
            messages: [...th.messages, newMsg],
          };
        }
        return th;
      })
    );
  };

  const handleInitiateChat = (item: MarketItem, message: string) => {
    const newThread: ChatThread = {
      id: `chat-${Date.now()}`,
      buyerName: 'Acheteur Partenaire (Vous)',
      sellerName: item.sellerName,
      productTitle: item.title,
      lastMessage: message,
      lastUpdated: "À l'instant",
      unreadCount: 0,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderName: 'Vous (Acheteur)',
          senderRole: 'buyer',
          text: message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOfferProposal: true,
          proposedPrice: item.price,
          proposedQuantity: 50,
        },
      ],
    };
    setChatThreads((prev) => [newThread, ...prev]);
    setCurrentScreen('seller_shop');
  };

  const handleDistributeDividends = () => {
    setCooperative((prev) => ({
      ...prev,
      members: prev.members.map((m) => ({ ...m, paymentStatus: 'paid_mvola' })),
    }));
  };

  const currentWeather = weatherData[selectedRegion] || weatherData['Vakinankaratra'];

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-cream">
        <Text className="text-3xl mb-2">🌱</Text>
        <Text className="text-brand-green font-bold">MpambolyMivoatry</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView className="flex-1 bg-brand-cream" style={{ paddingTop: RNStatusBar.currentHeight }}>
      <StatusBar style="dark" />

      {!isAuthenticated ? (
        <LoginScreen language={language} onToggleLanguage={handleToggleLanguage} onLogin={handleLogin} />
      ) : (
        <View className="flex-1">
          <View className="flex-1">
            {currentScreen === 'home' && (
              <HomeScreen
                crops={crops}
                weather={currentWeather}
                prices={commodityPrices}
                farmer={farmerProfile}
                language={language}
                activeRole={activeRole}
                sensorNodes={sensorNodes}
                cooperative={cooperative}
                selectedRegion={selectedRegion}
                onSelectRole={handleSelectRole}
                onSelectRegion={setSelectedRegion}
                onSelectCrop={(c) => setSelectedCropDetail(c)}
                onOpenNewCrop={() => setIsNewCropModalOpen(true)}
                onNavigate={(s) => setCurrentScreen(s)}
                onOpenCalculators={() => setIsCalculatorsModalOpen(true)}
                onToggleLanguage={handleToggleLanguage}
                onLogout={handleLogout}
              />
            )}

            {currentScreen === 'smart_irrigation' && (
              <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
                <SmartIrrigationScreen sensors={sensorNodes} onUpdateSensor={handleUpdateSensor} lang={language} />
              </ScrollView>
            )}

            {currentScreen === 'field_inspection' && (
              <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
                <FieldInspectionScreen inspections={inspections} onAddInspection={handleAddInspection} lang={language} />
              </ScrollView>
            )}

            {currentScreen === 'seller_shop' && (
              <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
                <SellerShopScreen
                  profile={farmerProfile}
                  crops={crops}
                  orders={orders}
                  marketItems={marketItems}
                  chatThreads={chatThreads}
                  onAddMarketItem={(item) => setMarketItems((prev) => [item, ...prev])}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onSendMessage={handleSendMessage}
                  lang={language}
                />
              </ScrollView>
            )}

            {currentScreen === 'buyer_hub' && (
              <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
                <BuyerHubScreen marketItems={marketItems} onPlaceOrder={handlePlaceOrder} onInitiateChat={handleInitiateChat} lang={language} />
              </ScrollView>
            )}

            {currentScreen === 'association' && (
              <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
                <AssociationScreen cooperative={cooperative} onDistributeDividends={handleDistributeDividends} lang={language} />
              </ScrollView>
            )}

            {currentScreen === 'market' && (
              <MarketScreen
                items={marketItems}
                prices={commodityPrices}
                language={language}
                onOpenNewListing={() => setIsNewListingModalOpen(true)}
              />
            )}

            {currentScreen === 'diagnostic' && <DiagnosticScreen language={language} />}

            {currentScreen === 'guides' && (
              <GuidesScreen language={language} onOpenCalculators={() => setIsCalculatorsModalOpen(true)} />
            )}

            {currentScreen === 'management' && (
              <ManagementScreen
                farmer={farmerProfile}
                transactions={transactions}
                crops={crops}
                language={language}
                onOpenNewTransaction={() => setIsNewTransactionModalOpen(true)}
                onDeleteTransaction={handleDeleteTransaction}
              />
            )}
          </View>

          <NavigationBottom currentScreen={currentScreen} onSelectScreen={setCurrentScreen} language={language} activeRole={activeRole} />
        </View>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <View
          className="absolute bottom-6 self-center bg-brand-green rounded-2xl px-4 py-2.5 flex-row items-center gap-2 border border-white/20"
          style={{ elevation: 6 }}
        >
          <Check className="w-4 h-4 text-[#FFD700]" />
          <Text className="text-white text-xs font-bold">{toastMessage}</Text>
        </View>
      )}

      {/* Interactive Modals */}
      <CropDetailModal crop={selectedCropDetail} onClose={() => setSelectedCropDetail(null)} language={language} onUpdateCropStage={handleUpdateCropStage} />
      <NewCropModal isOpen={isNewCropModalOpen} onClose={() => setIsNewCropModalOpen(false)} onAddCrop={handleAddCrop} language={language} />
      <NewListingModal isOpen={isNewListingModalOpen} onClose={() => setIsNewListingModalOpen(false)} onAddListing={handleAddListing} language={language} />
      <NewTransactionModal isOpen={isNewTransactionModalOpen} onClose={() => setIsNewTransactionModalOpen(false)} onAddTransaction={handleAddTransaction} language={language} />
      <CalculatorsModal isOpen={isCalculatorsModalOpen} onClose={() => setIsCalculatorsModalOpen(false)} language={language} />
      </SafeAreaView>
    </QueryClientProvider>
  );
}
