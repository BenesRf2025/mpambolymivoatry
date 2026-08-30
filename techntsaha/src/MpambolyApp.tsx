import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StatusBar as RNStatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
} from './types';
import {
  initialCrops,
  initialMarketItems,
  commodityPrices,
  weatherData,
  initialFarmerProfile,
  initialTransactions,
  initialIoTSensors,
  initialFieldInspections,
  initialCooperative,
  initialInAppOrders,
  initialChatThreads,
} from './data/mockData';
import { loadJSON, saveJSON, loadString, saveString } from './lib/storage';
import { HomeScreen } from './components/HomeScreen';
import { MarketScreen } from './components/MarketScreen';
import { DiagnosticScreen } from './components/DiagnosticScreen';
import { GuidesScreen } from './components/GuidesScreen';
import { ManagementScreen } from './components/ManagementScreen';
import { SmartIrrigationScreen } from './components/SmartIrrigationScreen';
import { FieldInspectionScreen } from './components/FieldInspectionScreen';
import { SellerShopScreen } from './components/SellerShopScreen';
import { BuyerHubScreen } from './components/BuyerHubScreen';
import { AssociationScreen } from './components/AssociationScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginScreen } from './components/LoginScreen';
import { LogoutScreen } from './components/LogoutScreen';
import { NavigationBottom } from './components/NavigationBottom';
import { FamilyOverviewScreen } from './components/FamilyOverviewScreen';
import { AssociationsScreen } from './components/AssociationsScreen';
import { CropDetailModal } from './components/CropDetailModal';
import { NewCropModal } from './components/NewCropModal';
import { NewListingModal } from './components/NewListingModal';
import { NewTransactionModal } from './components/NewTransactionModal';
import { CalculatorsModal } from './components/CalculatorsModal';
import { Check } from './lib/icons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setApiAuthToken, setApiBaseURL, getAuthToken } from './services/reactQueryHooks';
import api, { login as apiLogin } from './services/apiClient';
import { Family, AssociationMember } from './types';

const queryClient = new QueryClient();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const [apiBaseURL, setApiBaseURLState] = useState<string>('http://localhost:3000');
  const [isApiAvailable, setIsApiAvailable] = useState<boolean>(false);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const stored = await loadString('mpamboly_api_base');
        const url = stored || 'http://localhost:3000';
      setApiBaseURLState(url);
      setApiBaseURL(url);
      api.defaults.baseURL = url;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        try {
          const response = await fetch(`${url}/api/auth/login`, {
            method: 'OPTIONS',
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          setIsApiAvailable(response.ok || response.status !== 0);
        } catch {
          clearTimeout(timeoutId);
          setIsApiAvailable(false);
        }
      } catch {
        setIsApiAvailable(false);
      }
    };
    checkApi();
  }, []);

  const handleSetApiBaseURL = useCallback(async (url: string) => {
    setApiBaseURLState(url);
    setApiBaseURL(url);
    await saveString('mpamboly_api_base', url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    try {
      const response = await fetch(`${url}/api/auth/login`, {
        method: 'OPTIONS',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      setIsApiAvailable(response.ok || response.status !== 0);
    } catch {
      clearTimeout(timeoutId);
      setIsApiAvailable(false);
    }
  }, []);

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [activeRole, setActiveRole] = useState<UserRole>('agriculteur');
  const [language, setLanguage] = useState<Language>('fr');
  const [selectedRegion, setSelectedRegion] = useState<string>('Vakinankaratra');

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
  const [family, setFamily] = useState<Family | null>(null);
  const [associations, setAssociations] = useState<AssociationMember[]>([]);

  const [selectedCropDetail, setSelectedCropDetail] = useState<Crop | null>(null);
  const [isNewCropModalOpen, setIsNewCropModalOpen] = useState<boolean>(false);
  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState<boolean>(false);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState<boolean>(false);
  const [isCalculatorsModalOpen, setIsCalculatorsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
      ] = await Promise.all([
        loadJSON('mpamboly_crops', initialCrops),
        loadJSON('mpamboly_market', initialMarketItems),
        loadJSON('mpamboly_transactions', initialTransactions),
        loadJSON('mpamboly_sensors', initialIoTSensors),
        loadJSON('mpamboly_inspections', initialFieldInspections),
        loadJSON('mpamboly_coop', initialCooperative),
        loadJSON('mpamboly_orders', initialInAppOrders),
        loadJSON('mpamboly_chats', initialChatThreads),
      ]);
      setCrops(savedCrops);
      setMarketItems(savedMarket);
      setTransactions(savedTransactions);
      setSensorNodes(savedSensors);
      setInspections(savedInspections);
      setCooperative(savedCoop);
      setOrders(savedOrders);
      setChatThreads(savedChats);
      setIsAuthenticated(false);
      setIsReady(true);
    })();
  }, []);

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
    } else if (role === 'commercant' || role === 'acheteur') {
      showToast(language === 'fr' ? 'Rôle : Acheteur & Commerçant Professionnel' : 'Andraikitra : Mpividy & Mpitantana');
    } else if (role === 'association') {
      showToast(language === 'fr' ? 'Rôle : Association & Coopérative Miray Hina' : 'Andraikitra : Koperativa & Mpiombona');
    } else if (role === 'administrateur') {
      showToast(language === 'fr' ? 'Rôle : Administrateur Plateforme' : 'Andraikitra : Mpitantana');
    } else {
      showToast(language === 'fr' ? 'Vue Globale : Tous les Rôles Mpamboly' : 'Fahitana : Andraikitra Rehetra');
    }
  };

  const handleLogin = async (profile: FarmerProfile, role: UserRole, destinationScreen?: ScreenType) => {
    if (isApiAvailable && profile?.phone) {
      try {
        const response = await apiLogin(profile.phone, 'demo');
        if (response.token) {
          setApiAuthToken(response.token);
        }
      } catch {
        // fallback to demo login
      }
    }
    setIsAuthenticated(true);
    setActiveRole(role);
    if (profile) setFarmerProfile(profile);
    setCurrentScreen(destinationScreen || 'home');
    showToast(
      language === 'mg'
        ? `Tafiditra soa aman-tsara : ${profile?.name || role}`
        : `Connecté avec succès : ${profile?.name || role}`
    );
  };

  const handleRegister = (user: { name: string; phone: string; password: string; role: UserRole }): boolean => {
    showToast(
      language === 'mg'
        ? `Nisoratra Anarana soa aman-tsara : ${user.name}`
        : `Inscription réussie : ${user.name}`
    );
    return true;
  };

  const handleLogout = () => {
    setCurrentScreen('logout');
  };

  const handleConfirmLogout = () => {
    setApiAuthToken(null);
    setIsAuthenticated(false);
    setCurrentScreen('home');
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
          <LoginScreen
            language={language}
            onToggleLanguage={handleToggleLanguage}
            onLogin={handleLogin}
            onRegister={handleRegister}
            apiAvailable={isApiAvailable}
            apiBaseURL={apiBaseURL}
            onSetApiBaseURL={handleSetApiBaseURL}
          />
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

              {currentScreen === 'family_overview' && (
                <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
                  <FamilyOverviewScreen
                    language={language}
                    activeRole={activeRole}
                    crops={crops}
                    marketItems={marketItems}
                    onNavigate={(s) => setCurrentScreen(s)}
                    onToggleLanguage={handleToggleLanguage}
                    apiBaseURL={apiBaseURL}
                    apiToken={getAuthToken() ?? undefined}
                    onLogin={handleLogin}
                  />
                </ScrollView>
              )}

              {currentScreen === 'associations' && (
                <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
                  <AssociationsScreen
                    language={language}
                    activeRole={activeRole}
                    onNavigate={(s) => setCurrentScreen(s)}
                    onToggleLanguage={handleToggleLanguage}
                    apiToken={getAuthToken() ?? undefined}
                    onLogin={handleLogin}
                  />
                </ScrollView>
              )}

              {currentScreen === 'admin' && (
                <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
                  <AdminDashboard language={language} />
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

              {currentScreen === 'logout' && (
                <LogoutScreen
                  language={language}
                  activeRole={activeRole}
                  userName={farmerProfile.name}
                  onToggleLanguage={handleToggleLanguage}
                  onNavigate={(s) => setCurrentScreen(s)}
                  onConfirmLogout={handleConfirmLogout}
                />
              )}
            </View>

            {currentScreen !== 'logout' && (
              <NavigationBottom currentScreen={currentScreen} onSelectScreen={setCurrentScreen} language={language} activeRole={activeRole} />
            )}
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
