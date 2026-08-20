import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Sprout,
  Store,
  ShoppingBag,
  Users,
  Layers,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  KeyRound,
  Sparkles,
  CheckCircle2,
  Lock,
  Globe,
  Radio,
  Eye,
  EyeOff,
  UserCheck,
  Check,
} from '../lib/icons';
import { UserRole, Language, ScreenType, FarmerProfile } from '../types';
import { demoProfiles } from '../data/mockData';
import { OfflineIndicator } from './OfflineIndicator';

interface LoginScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  onLogin: (role: UserRole, customProfile?: FarmerProfile, destinationScreen?: ScreenType) => void;
}

interface RoleSlideItem {
  id: UserRole;
  labelFr: string;
  labelMg: string;
  subtitleFr: string;
  subtitleMg: string;
  taglineFr: string;
  taglineMg: string;
  destinationScreen: ScreenType;
  destinationLabelFr: string;
  destinationLabelMg: string;
  icon: React.ReactNode;
  themeColor: string;
  gradientColors: [string, string];
  featuresFr: string[];
  featuresMg: string[];
  metrics: Array<{ labelFr: string; labelMg: string; value: string }>;
  defaultUser: { name: string; phone: string; location: string };
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ language, onToggleLanguage, onLogin }) => {
  const [activeTab, setActiveTab] = useState<'carousel' | 'form'>('carousel');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isAutoPlayActive, setIsAutoPlayActive] = useState<boolean>(true);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [selectedRoleInForm, setSelectedRoleInForm] = useState<UserRole>('agriculteur');
  const [phoneNumber, setPhoneNumber] = useState<string>('034 88 123 45');
  const [pinCode, setPinCode] = useState<string>('1234');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPin, setShowPin] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const roleSlides: RoleSlideItem[] = [
    {
      id: 'agriculteur',
      labelFr: 'Agriculteur·rice & Producteur',
      labelMg: 'Mpamboly & Mpamokatra',
      subtitleFr: 'Cultures SRI, Capteurs IoT & Diagnostic IA',
      subtitleMg: "Vary SRI, Fitaovana IoT & Mpitsabo Voly AI",
      taglineFr: 'Optimisez vos rendements aux champs grâce aux données en temps réel et alertes SMS.',
      taglineMg: "Hampiakarana ny vokatry ny tany amin'ny alalan'ny fitaovana marani-tsaina sy SMS.",
      destinationScreen: 'home',
      destinationLabelFr: 'Tableau de Bord Cultures & Capteurs IoT',
      destinationLabelMg: "Fandraisana Voly & Fandrindrana Rano",
      icon: <Sprout className="w-6 h-6 text-emerald-800" />,
      themeColor: '#2D5A27',
      gradientColors: ['#2D5A27', '#1E3F1A'],
      featuresFr: [
        'Suivi du cycle végétatif (Vary Makalioka, Katsaka, Lavanila)',
        "Capteurs solaires d'humidité du sol (<30$) et pilotage de vannes",
        'Diagnostic phytosanitaire instantané par IA avec remèdes bio',
        "Rondes d'inspection guidées avec photos et notes vocales",
      ],
      featuresMg: [
        "Fanaraha-maso ny dingan'ny voly (Vary, Katsaka, Lavanila)",
        "Fitaovana IoT mandeha amin'ny masoandro sy fanokafana vano",
        "Fitiliana aretina sy bibikely amin'ny alalan'ny AI sy fanafody natoraly",
        "Fisafoana saha miaraka amin'ny sary sy feo voarakitra",
      ],
      metrics: [
        { labelFr: 'Rendement SRI', labelMg: 'Vokatra SRI', value: '+35%' },
        { labelFr: 'Économie Eau', labelMg: 'Fitsitsiana Rano', value: '-45%' },
        { labelFr: 'Alertes', labelMg: 'Fampahafantarana', value: 'SMS 2G' },
      ],
      defaultUser: { name: 'Jean Solo Randria', phone: '034 88 123 45', location: 'Antsirabe II, Vakinankaratra' },
    },
    {
      id: 'vendeur',
      labelFr: 'Vendeur·se & Boutique Directe',
      labelMg: 'Mpivarotra & Fivarotana Mivantana',
      subtitleFr: 'Boutique en Ligne, Commandes & Paiement MVola',
      subtitleMg: 'Fivarotana Aterineto, Kaomandy & MVola',
      taglineFr: 'Vendez vos récoltes au meilleur prix sans intermédiaire et recevez vos paiements mobiles.',
      taglineMg: "Amidio mivantana tsy misy mpanelanelana ny vokatrao ary raiso amin'ny MVola ny volanao.",
      destinationScreen: 'seller_shop',
      destinationLabelFr: 'Ma Boutique Personnelle & Commandes',
      destinationLabelMg: 'Ny Fivarotako & Kaomandy Voaray',
      icon: <Store className="w-6 h-6 text-amber-800" />,
      themeColor: '#B45309',
      gradientColors: ['#B45309', '#78350F'],
      featuresFr: [
        'Mise en vente directe de vos récoltes et fixez vos prix',
        'Suivi des commandes avec validation QR Code à la livraison',
        'Encaissement sécurisé MVola & Orange Money sans compte bancaire',
        'Messagerie instantanée pour négocier avec grossistes et particuliers',
      ],
      featuresMg: [
        "Famindrana ny vokatra ho eny an-tsena amin'ny vidiny sahaza",
        "Fanaraha-maso ny kaomandy amin'ny QR Code azo antoka",
        "Fandraisana vola amin'ny MVola & Orange Money tsy mila banky",
        "Fifandraisana hafatra mivantana amin'ny mpividy sy mpiantoka",
      ],
      metrics: [
        { labelFr: 'Commission', labelMg: 'Saram-panelanelana', value: '0 Ar' },
        { labelFr: 'Paiement', labelMg: 'Fandoavam-bola', value: 'MVola/OM' },
        { labelFr: 'Sécurité', labelMg: 'Fiarovana', value: 'QR Code' },
      ],
      defaultUser: { name: 'Rasoanirina Christine', phone: '032 40 567 89', location: 'Anosibe, Antananarivo' },
    },
    {
      id: 'commercant',
      labelFr: 'Acheteur Pro & Commerçant',
      labelMg: 'Mpividy & Mpiantoka Ambongadiny',
      subtitleFr: 'Sourcing Direct, Mercuriale des Prix & Gros Volumes',
      subtitleMg: 'Famatsiana Mivantana, Vidim-bokatra & Kaomandy Be',
      taglineFr: "Approvisionnez votre restaurant, épicerie ou chaîne d'export directement à la source.",
      taglineMg: "Mamatsia ny tranombarotra, hotely na orinasanao mivantana avy any amin'ny mpamboly.",
      destinationScreen: 'buyer_hub',
      destinationLabelFr: 'Espace Sourcing Grossiste & Offres',
      destinationLabelMg: "Toeran'ny Mpividy & Tolotra Vokatra",
      icon: <ShoppingBag className="w-6 h-6 text-blue-800" />,
      themeColor: '#1E3A8A',
      gradientColors: ['#1E3A8A', '#1E293B'],
      featuresFr: [
        'Accès aux récoltes certifiées et stocks mutualisés des coopératives',
        'Mercuriale des cours en direct (Anosibe, Tsianaloka, Bazar Be)',
        'Propositions de prix au volume et commandes groupées (tonnes)',
        "Suivi de la livraison jusqu'à votre entrepôt",
      ],
      featuresMg: [
        "Fidirana amin'ny vokatra voamarina sy tahiry iombonana",
        "Vidim-bokatra mivantana an-tsena isan'andro",
        "Tolotra vidiny ambongadiny sy kaomandy amin'ny gony na taonina",
        "Fanaraha-maso ny fitaterana hatrany amin'ny trano fitehirizana",
      ],
      metrics: [
        { labelFr: 'Traçabilité', labelMg: 'Fiaviana', value: '100% Direct' },
        { labelFr: 'Économie', labelMg: 'Fitsitsiana', value: '-20% Prix' },
        { labelFr: 'Qualité', labelMg: 'Kalitao', value: 'Certifiée' },
      ],
      defaultUser: { name: 'Andry Nirina (Tsiky Wholesale)', phone: '033 15 789 01', location: 'Bazar Be, Toamasina / Tana' },
    },
    {
      id: 'association',
      labelFr: 'Association & Coopérative',
      labelMg: 'Fikambanana & Koperativa',
      subtitleFr: 'Stock Mutualisé, Achats Groupés & Répartition 95/5',
      subtitleMg: 'Tahiry Iombonana, Fitaovana & Fizarana 95/5',
      taglineFr: 'Unissez vos forces paysannes : négociez en gros et répartissez équitablement les gains.',
      taglineMg: "Manambatra ny herin'ny mpamboly : miara-mivarotra lafo ary mizara mangarahara.",
      destinationScreen: 'association',
      destinationLabelFr: 'Espace Coopérative Miray Hina',
      destinationLabelMg: 'Sehatra Koperativa Miray Hina',
      icon: <Users className="w-6 h-6 text-teal-800" />,
      themeColor: '#0F766E',
      gradientColors: ['#0F766E', '#115E59'],
      featuresFr: [
        'Mutualisation des stocks individuels en un volume commercial',
        "Achats groupés d'intrants (engrais bio, semences certifiées)",
        'Répartition équitable 95% membres / 5% solidarité via MVola',
        "Accès aux contrats institutionnels et subventions d'État",
      ],
      featuresMg: [
        "Fampivondronana ny vokatry ny mpikambana ho lasa tahiry matanjaka",
        "Fividianana masomboly sy zezika miaraka amin'ny vidiny ambany",
        "Fizarana ara-drariny 95% mpikambana / 5% tahiry amin'ny MVola",
        "Fidirana amin'ny tsenam-panjakana sy findramam-bola",
      ],
      metrics: [
        { labelFr: 'Répartition', labelMg: 'Fizarana', value: '95% / 5%' },
        { labelFr: 'Membres', labelMg: 'Mpikambana', value: '42 Actifs' },
        { labelFr: 'Stock', labelMg: 'Tahiry', value: '34.5 T' },
      ],
      defaultUser: { name: 'Koperativa Miray Hina (Bureau)', phone: '034 12 345 67', location: 'Ambatolampy, Vakinankaratra' },
    },
    {
      id: 'all',
      labelFr: 'Vue Complète Écosystème',
      labelMg: 'Tontolo Iray Manontolo',
      subtitleFr: "Tous les modules Tech'Ntsaha 360°",
      subtitleMg: "Ny fitaovana rehetra amin'ny toerana iray",
      taglineFr: "Explorez l'ensemble des fonctionnalités agricoles, commerciales et communautaires.",
      taglineMg: 'Zahao ny fitaovana fambolena, varotra ary fiaraha-miombona rehetra.',
      destinationScreen: 'home',
      destinationLabelFr: 'Accueil Global Multi-Rôles',
      destinationLabelMg: 'Fandraisana Ankapobeny',
      icon: <Layers className="w-6 h-6 text-[#4A3728]" />,
      themeColor: '#4A3728',
      gradientColors: ['#4A3728', '#2A2621'],
      featuresFr: [
        'Accès simultané aux outils Agriculteur, Vendeur, Acheteur et Coop',
        "Basculement instantané d'un rôle à un autre selon vos activités",
        'Calculateurs agronomiques et carnet de gestion financière',
        'Mode 100% hors-ligne avec synchronisation automatique',
      ],
      featuresMg: [
        "Fidirana amin'ny fitaovan'ny Mpamboly, Mpivarotra, Mpividy ary Koperativa",
        "Fampiovaovana andraikitra amin'ny tsindry iray",
        "Fikajiana fambolena sy bokin'ny vola miditra sy mivoaka",
        "Miasa 100% ivelan'ny aterineto",
      ],
      metrics: [
        { labelFr: 'Écosystème', labelMg: 'Tontolo', value: '5 en 1' },
        { labelFr: 'Réseau', labelMg: 'Tambajotra', value: 'Hors-Ligne' },
        { labelFr: 'Fiteny', labelMg: 'Langues', value: 'MG / FR' },
      ],
      defaultUser: { name: 'Mamy Rakoto', phone: '034 12 345 67', location: 'Ambatolampy, Vakinankaratra' },
    },
  ];

  useEffect(() => {
    if (isAutoPlayActive && activeTab === 'carousel') {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % roleSlides.length);
      }, 5500);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlayActive, activeTab, roleSlides.length]);

  const handleNextSlide = () => {
    setIsAutoPlayActive(false);
    setCurrentSlideIndex((prev) => (prev + 1) % roleSlides.length);
  };

  const handlePrevSlide = () => {
    setIsAutoPlayActive(false);
    setCurrentSlideIndex((prev) => (prev - 1 + roleSlides.length) % roleSlides.length);
  };

  const handleSelectSlideIndex = (index: number) => {
    setIsAutoPlayActive(false);
    setCurrentSlideIndex(index);
  };

  const handleQuickLoginAsSlideRole = (slide: RoleSlideItem) => {
    const profile = demoProfiles[slide.id] || {
      ...demoProfiles.agriculteur,
      name: slide.defaultUser.name,
      phone: slide.defaultUser.phone,
      location: slide.defaultUser.location,
      activeRole: slide.id,
    };
    onLogin(slide.id, profile, slide.destinationScreen);
  };

  const handleFormLoginSubmit = () => {
    if (!phoneNumber || phoneNumber.trim().length < 6) {
      setFormError(language === 'fr' ? 'Veuillez saisir un numéro de téléphone valide' : 'Mampidira laharana finday marina');
      return;
    }
    setFormError(null);

    const baseProfile = demoProfiles[selectedRoleInForm] || demoProfiles.agriculteur;
    const customProfile: FarmerProfile = {
      ...baseProfile,
      phone: phoneNumber,
      activeRole: selectedRoleInForm,
    };

    let destScreen: ScreenType = 'home';
    if (selectedRoleInForm === 'vendeur') destScreen = 'seller_shop';
    else if (selectedRoleInForm === 'commercant') destScreen = 'buyer_hub';
    else if (selectedRoleInForm === 'association') destScreen = 'association';

    onLogin(selectedRoleInForm, customProfile, destScreen);
  };

  const currentSlide = roleSlides[currentSlideIndex];

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
            <Text className="text-[10px] text-[#706B5E] font-medium">Tech'Ntsaha Madagascar 2026</Text>
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
            {language === 'fr' ? 'Plateforme Multi-Rôles Agricole' : 'Sehatra Fambolena sy Varotra'}
          </Text>
        </View>
        <Text className="text-lg font-black text-[#2A2621] tracking-tight mt-1.5 text-center">
          {language === 'fr' ? 'Bienvenue sur MpambolyMivoatry' : "Tongasoa eto amin'ny MpambolyMivoatry"}
        </Text>
        <Text className="text-xs text-[#706B5E] leading-relaxed mt-1 text-center px-2">
          {language === 'fr'
            ? 'Choisissez votre rôle pour explorer les outils dédiés aux producteurs, vendeurs, acheteurs et coopératives.'
            : "Safidio ny andraikitrao hijerena ireo fitaovana ho an'ny mpamboly, mpivarotra, mpividy ary koperativa."}
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row p-1 bg-brand-beige rounded-2xl border border-[#C4BFB1] mt-3">
        <Pressable
          onPress={() => setActiveTab('carousel')}
          className={`flex-1 py-2 px-3 rounded-xl flex-row items-center justify-center gap-1.5 ${
            activeTab === 'carousel' ? 'bg-white' : ''
          }`}
        >
          <Layers className="w-4 h-4 text-brand-green" />
          <Text className={`text-xs font-bold ${activeTab === 'carousel' ? 'text-brand-green' : 'text-[#706B5E]'}`}>
            {language === 'fr' ? 'Découvrir les Rôles' : 'Ireo Andraikitra'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('form')}
          className={`flex-1 py-2 px-3 rounded-xl flex-row items-center justify-center gap-1.5 ${
            activeTab === 'form' ? 'bg-white' : ''
          }`}
        >
          <Smartphone className="w-4 h-4 text-[#B45309]" />
          <Text className={`text-xs font-bold ${activeTab === 'form' ? 'text-brand-green' : 'text-[#706B5E]'}`}>
            {language === 'fr' ? 'Connexion Directe' : "Fidirana amin'ny Finday"}
          </Text>
        </Pressable>
      </View>

      {/* TAB 1: CAROUSEL */}
      {activeTab === 'carousel' && (
        <View className="mt-3">
          {/* Role pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-1">
            <View className="flex-row items-center gap-1.5">
              {roleSlides.map((slide, idx) => {
                const isSelected = idx === currentSlideIndex;
                return (
                  <Pressable
                    key={slide.id}
                    onPress={() => handleSelectSlideIndex(idx)}
                    className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
                      isSelected ? 'bg-brand-green border-brand-green' : 'bg-white border-[#D7D3C6]'
                    }`}
                  >
                    {React.cloneElement(slide.icon as React.ReactElement<any>, {
                      className: `w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-brand-brown'}`,
                    })}
                    <Text className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-brand-brown'}`}>
                      {(language === 'fr' ? slide.labelFr : slide.labelMg).split('&')[0]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Slide card */}
          <View
            className="relative bg-white rounded-3xl border-2 shadow-md overflow-hidden mt-2"
            style={{ borderColor: currentSlide.themeColor }}
          >
            <LinearGradient
              colors={currentSlide.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="p-4"
            >
              <View className="flex-row items-start justify-between gap-2">
                <View className="flex-row items-center gap-2.5 flex-1">
                  <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center border border-white/30">
                    {React.cloneElement(currentSlide.icon as React.ReactElement<any>, { className: 'w-6 h-6 text-white' })}
                  </View>
                  <View className="flex-1">
                    <Text className="text-[10px] uppercase font-black tracking-widest text-white/80 bg-white/10 px-2 py-0.5 rounded-md self-start">
                      {language === 'fr' ? 'Rôle Dédié' : 'Andraikitra'} #{currentSlideIndex + 1}/5
                    </Text>
                    <Text className="text-base font-black leading-snug mt-0.5 text-white">
                      {language === 'fr' ? currentSlide.labelFr : currentSlide.labelMg}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-1 bg-black/25 px-2 py-1 rounded-full">
                  <Radio className="w-3 h-3 text-emerald-300" />
                  <Text className="text-[10px] font-semibold text-white">
                    {language === 'fr' ? 'Défilement' : 'Fihodinana'}
                  </Text>
                </View>
              </View>

              <Text className="text-xs text-white/90 mt-2 font-medium leading-relaxed">
                {language === 'fr' ? currentSlide.taglineFr : currentSlide.taglineMg}
              </Text>

              <View className="flex-row gap-2 mt-3 pt-2 border-t border-white/20">
                {currentSlide.metrics.map((m, mIdx) => (
                  <View key={mIdx} className="flex-1 bg-black/20 rounded-xl p-1.5 items-center">
                    <Text className="text-xs font-black text-white">{m.value}</Text>
                    <Text className="text-[9px] text-white/75 text-center">
                      {language === 'fr' ? m.labelFr : m.labelMg}
                    </Text>
                  </View>
                ))}
              </View>
            </LinearGradient>

            {/* Body */}
            <View className="p-4">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-1 flex-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-green" />
                  <Text className="text-[11px] font-black uppercase tracking-wider text-[#706B5E]" numberOfLines={1}>
                    {language === 'fr' ? 'Fonctionnalités clés :' : 'Ireo fitaovana hita ato :'}
                  </Text>
                </View>
              </View>
              <Text className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-brand-beige text-brand-brown self-start mb-2">
                {language === 'fr' ? currentSlide.destinationLabelFr : currentSlide.destinationLabelMg}
              </Text>

              <View className="gap-2">
                {(language === 'fr' ? currentSlide.featuresFr : currentSlide.featuresMg).map((feat, fIdx) => (
                  <View key={fIdx} className="flex-row items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-green mt-0.5" />
                    <Text className="text-xs text-[#2A2621] leading-tight flex-1">{feat}</Text>
                  </View>
                ))}
              </View>

              <View className="mt-3 p-2.5 rounded-2xl bg-[#F5F2EB] border border-[#D7D3C6] flex-row items-center justify-between">
                <View className="flex-row items-center gap-2 flex-1">
                  <View className="w-7 h-7 rounded-xl bg-brand-green items-center justify-center">
                    <UserCheck className="w-3.5 h-3.5 text-white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[9px] text-[#706B5E] font-medium">
                      {language === 'fr' ? 'Profil démo préconfiguré :' : 'Kaonty ohatra efa voaomana :'}
                    </Text>
                    <Text className="font-extrabold text-[#2A2621] text-xs" numberOfLines={1}>
                      {currentSlide.defaultUser.name}
                    </Text>
                  </View>
                </View>
                <Text className="text-[10px] font-bold text-[#706B5E]">{currentSlide.defaultUser.location}</Text>
              </View>

              <Pressable
                onPress={() => handleQuickLoginAsSlideRole(currentSlide)}
                className="w-full py-3 px-4 rounded-2xl flex-row items-center justify-center gap-2 mt-3"
                style={{ backgroundColor: currentSlide.themeColor }}
              >
                <Text className="text-white font-black text-sm">
                  {language === 'fr'
                    ? `Entrer dans l'espace ${currentSlide.labelFr.split('&')[0]}`
                    : `Hiditra amin'ny toerana ${currentSlide.labelMg.split('&')[0]}`}
                </Text>
                <ArrowRight className="w-4 h-4 text-white" />
              </Pressable>
            </View>
          </View>

          {/* Controls */}
          <View className="flex-row items-center justify-between px-2 pt-2">
            <Pressable onPress={handlePrevSlide} className="p-2 rounded-xl bg-white border border-[#D7D3C6]">
              <ChevronLeft className="w-4 h-4 text-brand-brown" />
            </Pressable>

            <View className="flex-row items-center gap-1.5">
              {roleSlides.map((slide, dotIdx) => {
                const isActive = dotIdx === currentSlideIndex;
                return (
                  <Pressable
                    key={slide.id}
                    onPress={() => handleSelectSlideIndex(dotIdx)}
                    className={`h-2 rounded-full ${isActive ? 'w-6 bg-brand-green' : 'w-2 bg-[#C4BFB1]'}`}
                  />
                );
              })}
            </View>

            <Pressable onPress={handleNextSlide} className="p-2 rounded-xl bg-white border border-[#D7D3C6]">
              <ChevronRight className="w-4 h-4 text-brand-brown" />
            </Pressable>
          </View>

          {/* Quick access */}
          <View className="mt-2 pt-2 border-t border-[#D7D3C6]">
            <Text className="text-[11px] font-bold text-[#706B5E] mb-1.5">
              {language === 'fr' ? 'Accès direct 1-clic par compte :' : 'Fidirana haingana isaky ny kaonty :'}
            </Text>
            <View className="flex-row flex-wrap gap-1.5">
              {roleSlides.slice(0, 4).map((slide) => (
                <Pressable
                  key={slide.id}
                  onPress={() => handleQuickLoginAsSlideRole(slide)}
                  className="flex-row items-center gap-1.5 p-2 rounded-xl bg-white border border-[#D7D3C6]"
                  style={{ width: '48%' }}
                >
                  <View className="p-1 rounded-lg bg-[#F5F2EB]">
                    {React.cloneElement(slide.icon as React.ReactElement<any>, { className: 'w-3.5 h-3.5 text-brand-brown' })}
                  </View>
                  <View className="flex-1">
                    <Text className="text-[10px] font-extrabold text-[#2A2621]" numberOfLines={1}>
                      {slide.defaultUser.name.split(' ')[0]}
                    </Text>
                    <Text className="text-[9px] text-[#706B5E]" numberOfLines={1}>
                      {(language === 'fr' ? slide.labelFr : slide.labelMg).split(' ')[0]}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* TAB 2: FORM */}
      {activeTab === 'form' && (
        <View className="mt-3">
          <View className="gap-3 bg-white p-4 rounded-3xl border border-[#D7D3C6] shadow-sm">
            <View>
              <Text className="text-xs font-black text-brand-brown uppercase tracking-wider mb-1.5">
                {language === 'fr' ? '1. Choisissez votre rôle principal :' : '1. Safidio ny andraikitrao :'}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {roleSlides.map((role) => {
                  const isSelected = selectedRoleInForm === role.id;
                  return (
                    <Pressable
                      key={role.id}
                      onPress={() => setSelectedRoleInForm(role.id)}
                      className={`p-2.5 rounded-2xl border-2 flex-row items-center gap-2 ${
                        isSelected ? 'border-brand-green bg-emerald-50/70' : 'border-brand-beige'
                      }`}
                      style={{ width: '48%' }}
                    >
                      <View
                        className={`w-7 h-7 rounded-xl items-center justify-center ${
                          isSelected ? 'bg-brand-green' : 'bg-brand-beige'
                        }`}
                      >
                        {React.cloneElement(role.icon as React.ReactElement<any>, {
                          className: `w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-brand-brown'}`,
                        })}
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs font-bold text-[#2A2621]" numberOfLines={1}>
                          {(language === 'fr' ? role.labelFr : role.labelMg).split('&')[0]}
                        </Text>
                        <Text className="text-[9px] text-[#706B5E]" numberOfLines={1}>
                          {language === 'fr' ? role.destinationLabelFr : role.destinationLabelMg}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Phone */}
            <View>
              <Text className="text-xs font-black text-brand-brown uppercase tracking-wider mb-1">
                {language === 'fr' ? '2. Numéro de téléphone (Madagascar) :' : '2. Laharana finday :'}
              </Text>
              <View className="relative flex-row items-center">
                <View className="absolute left-3 z-10">
                  <Smartphone className="w-4 h-4 text-brand-green" />
                </View>
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="034 88 123 45"
                  keyboardType="phone-pad"
                  className="flex-1 pl-9 pr-3 py-2.5 bg-[#F5F2EB] border border-[#D7D3C6] rounded-2xl text-xs font-bold text-[#2A2621]"
                />
              </View>
              <Text className="text-[10px] text-[#706B5E] mt-1">
                🇲🇬 MVola (034/038) · Orange Money (032) · Airtel (033)
              </Text>
            </View>

            {/* PIN */}
            <View>
              <Text className="text-xs font-black text-brand-brown uppercase tracking-wider mb-1">
                {language === 'fr' ? '3. Code PIN / Mot de passe :' : '3. Kaody PIN / Tenimiafina :'}
              </Text>
              <View className="relative flex-row items-center">
                <View className="absolute left-3 z-10">
                  <KeyRound className="w-4 h-4 text-[#B45309]" />
                </View>
                <TextInput
                  value={pinCode}
                  onChangeText={setPinCode}
                  placeholder="PIN à 4 chiffres"
                  secureTextEntry={!showPin}
                  keyboardType="number-pad"
                  className="flex-1 pl-9 pr-10 py-2.5 bg-[#F5F2EB] border border-[#D7D3C6] rounded-2xl text-xs font-bold text-[#2A2621]"
                />
                <Pressable onPress={() => setShowPin(!showPin)} className="absolute right-3 z-10">
                  {showPin ? <EyeOff className="w-4 h-4 text-[#706B5E]" /> : <Eye className="w-4 h-4 text-[#706B5E]" />}
                </Pressable>
              </View>
            </View>

            {/* Remember me */}
            <Pressable onPress={() => setRememberMe(!rememberMe)} className="flex-row items-center gap-2 pt-1">
              <View
                className={`w-4 h-4 rounded items-center justify-center border ${
                  rememberMe ? 'bg-brand-green border-brand-green' : 'border-[#C4BFB1]'
                }`}
              >
                {rememberMe && <Check className="w-3 h-3 text-white" />}
              </View>
              <Text className="text-[#4A3728] font-medium text-[11px] flex-1">
                {language === 'fr' ? 'Se souvenir de ce compte (Mode Hors-Ligne)' : "Tadidio ity kaonty ity (Ivelan-tserasera)"}
              </Text>
            </Pressable>

            {formError && (
              <View className="p-2 bg-red-50 border border-red-200 rounded-xl">
                <Text className="text-red-700 text-xs font-medium">{formError}</Text>
              </View>
            )}
          </View>

          <Pressable
            onPress={handleFormLoginSubmit}
            className="w-full py-3.5 px-4 bg-brand-green rounded-2xl flex-row items-center justify-center gap-2 mt-4"
          >
            <Lock className="w-4 h-4 text-white" />
            <Text className="text-white font-black text-sm">
              {language === 'fr' ? 'Se connecter & Accéder à mon espace' : "Hiditra & Hijery ny toerako"}
            </Text>
            <ArrowRight className="w-4 h-4 text-white" />
          </Pressable>
        </View>
      )}

      {/* Footer */}
      <View className="mt-3 py-2 px-3 bg-white/70 rounded-2xl border border-[#D7D3C6] flex-row items-center justify-center gap-2">
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
