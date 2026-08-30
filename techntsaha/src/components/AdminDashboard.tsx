import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Users,
  UserCheck,
  UserPlus,
  Shield,
  TrendingUp,
  DollarSign,
  CreditCard,
  Activity,
  Clock,
  Search,
  Ban,
  CheckCircle,
  X,
  ChevronRight,
  Copy,
  Trash2,
} from '../lib/icons';
import { Language, UserRole } from '../types';
import { translations } from '../data/translations';

interface RegisteredUser {
  id: string;
  name: string;
  phone: string;
  password: string;
  role: UserRole;
}

interface AdminToken {
  token: string;
  role: UserRole;
  used: boolean;
  createdAt: string;
}

interface AdminUser {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  location: string;
  status: 'active' | 'suspended' | 'pending';
  lastActive: string;
  email?: string;
  joinDate: string;
  activitiesCount: number;
}

interface AdminActivity {
  id: string;
  userName: string;
  type: 'login' | 'listing' | 'purchase' | 'message' | 'crop_update' | 'payment';
  description: string;
  date: string;
}

interface AdminDashboardProps {
  language: Language;
}

const getRoleLabel = (role: UserRole, language: Language) => {
  const labels: Record<UserRole, { fr: string; mg: string }> = {
    all: { fr: 'Tous', mg: 'Rehetra' },
    agriculteur: { fr: 'Agriculteur', mg: 'Mpamboly' },
    vendeur: { fr: 'Vendeur', mg: 'Mpivarotra' },
    commercant: { fr: 'Commerçant', mg: 'Mpiantoka' },
    acheteur: { fr: 'Acheteur', mg: 'Mpividy' },
    association: { fr: 'Association', mg: 'Fikambanana' },
    administrateur: { fr: 'Administrateur', mg: 'Mpitantana' },
  };
  return labels[role]?.[language] || role;
};

const getActivityIcon = (type: AdminActivity['type']) => {
  switch (type) {
    case 'login': return <UserCheck className="w-4 h-4 text-brand-green" />;
    case 'listing': return <Activity className="w-4 h-4 text-blue-500" />;
    case 'purchase': return <DollarSign className="w-4 h-4 text-[#FFD700]" />;
    case 'payment': return <CreditCard className="w-4 h-4 text-brand-green" />;
    case 'crop_update': return <TrendingUp className="w-4 h-4 text-brand-greenDark" />;
    case 'message': return <Activity className="w-4 h-4 text-brand-brownLight" />;
    default: return <Clock className="w-4 h-4 text-brand-brownLight" />;
  }
};

const getStatusBadge = (status: AdminUser['status'], language: Language) => {
  switch (status) {
    case 'active':
      return (
        <View className="px-2.5 py-1 rounded-full bg-[#E8F5E9] border border-brand-green/20">
          <Text className="text-[10px] font-bold text-brand-green">
            {language === 'fr' ? 'Actif' : 'Mavitrika'}
          </Text>
        </View>
      );
    case 'suspended':
      return (
        <View className="px-2.5 py-1 rounded-full bg-red-50 border border-red-200">
          <Text className="text-[10px] font-bold text-red-600">
            {language === 'fr' ? 'Suspendu' : 'Nakatona'}
          </Text>
        </View>
      );
    case 'pending':
      return (
        <View className="px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200">
          <Text className="text-[10px] font-bold text-orange-600">
            {language === 'fr' ? 'En attente' : 'Miandry'}
          </Text>
        </View>
      );
    default:
      return null;
  }
};

const generateToken = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const seg1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const seg2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `MPA-${new Date().getFullYear()}-${seg1}${seg2}`;
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ language }) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [revenuePeriod, setRevenuePeriod] = useState<'thisMonth' | 'thisYear' | 'allTime'>('thisMonth');
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [adminTokens, setAdminTokens] = useState<AdminToken[]>([]);
  const [newTokenRole, setNewTokenRole] = useState<UserRole>('agriculteur');
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const usersData = await AsyncStorage.getItem('mpamboly_users');
      const tokensData = await AsyncStorage.getItem('mpamboly_admin_tokens');
      if (usersData) setRegisteredUsers(JSON.parse(usersData));
      if (tokensData) setAdminTokens(JSON.parse(tokensData));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const handleGenerateToken = async () => {
    const newToken: AdminToken = {
      token: generateToken(),
      role: newTokenRole,
      used: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updatedTokens = [...adminTokens, newToken];
    await AsyncStorage.setItem('mpamboly_admin_tokens', JSON.stringify(updatedTokens));
    setAdminTokens(updatedTokens);
    setShowTokenForm(false);
  };

  const handleDeleteToken = async (token: string) => {
    const updatedTokens = adminTokens.filter(t => t.token !== token);
    await AsyncStorage.setItem('mpamboly_admin_tokens', JSON.stringify(updatedTokens));
    setAdminTokens(updatedTokens);
  };

  const handleCopyToken = (token: string) => {
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const adminUsers: AdminUser[] = registeredUsers.map((u, idx) => ({
    id: u.id,
    name: u.name,
    role: u.role,
    phone: u.phone,
    location: 'Madagascar',
    status: 'active' as const,
    lastActive: new Date().toISOString().split('T')[0],
    joinDate: u.id.split('-')[1] ? new Date(parseInt(u.id.split('-')[1])).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    activitiesCount: ((idx + 1) * 17) % 50,
  }));

  const filteredUsers = adminUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const mockActivities: AdminActivity[] = [
    { id: 'a1', userName: adminUsers[0]?.name || 'Utilisateur', type: 'login', description: language === 'fr' ? 'Connexion à l\'application' : 'Niditra tamin\'ny application', date: '2026-08-27 08:30' },
    { id: 'a2', userName: adminUsers[1]?.name || 'Utilisateur', type: 'listing', description: language === 'fr' ? 'Nouvelle annonce publiée' : 'Tolotra vaovao navoaka', date: '2026-08-27 08:15' },
    { id: 'a3', userName: adminUsers[2]?.name || 'Utilisateur', type: 'purchase', description: language === 'fr' ? 'Commande en gros passée' : 'Kaomandy be natao', date: '2026-08-26 19:45' },
    { id: 'a4', userName: adminUsers[3]?.name || 'Utilisateur', type: 'payment', description: language === 'fr' ? 'Paiement reçu' : 'Vola voaray', date: '2026-08-26 17:00' },
  ];

  const revenueData = {
    thisMonth: { commission: 2450000, subscriptions: 1850000, total: 4300000 },
    thisYear: { commission: 28500000, subscriptions: 22100000, total: 50600000 },
    allTime: { commission: 52400000, subscriptions: 41500000, total: 93900000 },
  };

  const formatCurrency = (amount: number) => {
    return `${(amount / 1000).toFixed(0)}k Ar`;
  };

  const currentRevenue = revenueData[revenuePeriod];

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 32 }}>
      {/* Header */}
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-2xl font-bold text-brand-green tracking-tight">{t.adminTitle}</Text>
          <Text className="text-xs text-brand-brownLight mt-1">{t.adminSubtitle}</Text>
        </View>
        <View className="bg-brand-green rounded-2xl p-3 border border-brand-greenDark">
          <Shield className="w-6 h-6 text-white" />
        </View>
      </View>

      {/* KPI Cards */}
      <View className="gap-3">
        <View className="flex-row gap-3">
          <View className="flex-1 bg-white p-4 rounded-3xl border border-brand-beige">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-8 h-8 rounded-xl bg-[#F2F8F1] items-center justify-center border border-brand-green/20">
                <Users className="w-4 h-4 text-brand-green" />
              </View>
              <Text className="text-[10px] text-brand-brownLight font-semibold uppercase tracking-wide">{t.totalUsers}</Text>
            </View>
            <Text className="text-2xl font-bold text-brand-brown">{adminUsers.length}</Text>
            <Text className="text-[10px] text-brand-green font-semibold mt-1">
              {language === 'fr' ? `${adminTokens.filter(tk => !tk.used).length} jetons disponibles` : `${adminTokens.filter(tk => !tk.used).length} tokana misy`}
            </Text>
          </View>
          <View className="flex-1 bg-white p-4 rounded-3xl border border-brand-beige">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-8 h-8 rounded-xl bg-[#F2F8F1] items-center justify-center border border-brand-green/20">
                <UserCheck className="w-4 h-4 text-brand-green" />
              </View>
              <Text className="text-[10px] text-brand-brownLight font-semibold uppercase tracking-wide">{t.activeUsers}</Text>
            </View>
            <Text className="text-2xl font-bold text-brand-brown">{adminUsers.filter(u => u.status === 'active').length}</Text>
            <Text className="text-[10px] text-brand-green font-semibold mt-1">
              {adminUsers.length > 0 ? `${((adminUsers.filter(u => u.status === 'active').length / adminUsers.length) * 100).toFixed(1)}%` : '0%'}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 bg-brand-green rounded-3xl p-4 border border-brand-greenDark">
            <View className="flex-row items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-white/80" />
              <Text className="text-[10px] text-white/70 font-semibold uppercase tracking-wide">{t.totalRevenue}</Text>
            </View>
            <Text className="text-2xl font-bold text-white">
              {language === 'fr' ? `${(currentRevenue.total / 1000000).toFixed(1)}M` : `${(currentRevenue.total / 1000000).toFixed(1)}M`} Ar
            </Text>
            <Text className="text-[10px] text-white/70 font-semibold mt-1">
              {revenuePeriod === 'thisMonth' ? t.thisMonth : revenuePeriod === 'thisYear' ? t.thisYear : t.allTime}
            </Text>
            <Text className="text-[10px] text-white/50 font-medium mt-0.5">{t.adminTotalRevenue}</Text>
          </View>
          <View className="flex-1 bg-white p-4 rounded-3xl border border-brand-beige">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-8 h-8 rounded-xl bg-[#F2F8F1] items-center justify-center border border-brand-green/20">
                <DollarSign className="w-4 h-4 text-brand-green" />
              </View>
              <Text className="text-[10px] text-brand-brownLight font-semibold uppercase tracking-wide">{t.commissionRevenue}</Text>
            </View>
            <Text className="text-2xl font-bold text-brand-brown">{(currentRevenue.commission / 1000000).toFixed(1)}M Ar</Text>
            <View className="w-full h-2 bg-brand-beige rounded-full mt-2 overflow-hidden">
              <View
                className="h-full bg-brand-green rounded-full"
                style={{ width: `${(currentRevenue.commission / currentRevenue.total) * 100}%` }}
              />
            </View>
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 bg-white p-4 rounded-3xl border border-brand-beige">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-8 h-8 rounded-xl bg-[#F2F8F1] items-center justify-center border border-brand-green/20">
                <CreditCard className="w-4 h-4 text-brand-green" />
              </View>
              <Text className="text-[10px] text-brand-brownLight font-semibold uppercase tracking-wide">{t.subscriptionRevenue}</Text>
            </View>
            <Text className="text-2xl font-bold text-brand-brown">{(currentRevenue.subscriptions / 1000000).toFixed(1)}M Ar</Text>
            <View className="w-full h-2 bg-brand-beige rounded-full mt-2 overflow-hidden">
              <View
                className="h-full bg-[#FFD700] rounded-full"
                style={{ width: `${(currentRevenue.subscriptions / currentRevenue.total) * 100}%` }}
              />
            </View>
          </View>
          <View className="flex-1 bg-white p-4 rounded-3xl border border-brand-beige">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-8 h-8 rounded-xl bg-[#F2F8F1] items-center justify-center border border-brand-green/20">
                <Activity className="w-4 h-4 text-brand-green" />
              </View>
              <Text className="text-[10px] text-brand-brownLight font-semibold uppercase tracking-wide">{t.pendingActions}</Text>
            </View>
            <Text className="text-2xl font-bold text-brand-brown">{adminTokens.filter(tk => !tk.used).length}</Text>
            <Text className="text-[10px] text-orange-600 font-semibold mt-1">
              {language === 'fr' ? 'Jetons disponibles' : 'Tokana misy'}
            </Text>
          </View>
        </View>
      </View>

      {/* Revenue Period Selector */}
      <View className="bg-white rounded-3xl border border-brand-beige p-1.5 flex-row gap-1">
        {([
          { key: 'thisMonth' as const, label: t.thisMonth },
          { key: 'thisYear' as const, label: t.thisYear },
          { key: 'allTime' as const, label: t.allTime },
        ]).map((period) => (
          <Pressable
            key={period.key}
            onPress={() => setRevenuePeriod(period.key)}
            className={`flex-1 py-2.5 rounded-2xl items-center ${
              revenuePeriod === period.key ? 'bg-brand-green' : 'bg-transparent'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                revenuePeriod === period.key ? 'text-white' : 'text-brand-brownLight'
              }`}
            >
              {period.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Revenue Breakdown Visual */}
      <View className="bg-white rounded-3xl border border-brand-beige p-5">
        <Text className="text-sm font-bold text-brand-brown mb-4">{t.revenueBreakdown}</Text>
        <View className="gap-4">
          <View>
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full bg-brand-green" />
                <Text className="text-xs text-brand-brown">{t.commissionRevenue}</Text>
              </View>
              <Text className="text-xs font-bold text-brand-brown">{formatCurrency(currentRevenue.commission)}</Text>
            </View>
            <View className="w-full h-3 bg-brand-beige rounded-full overflow-hidden">
              <View
                className="h-full bg-brand-green rounded-full"
                style={{ width: `${(currentRevenue.commission / currentRevenue.total) * 100}%` }}
              />
            </View>
            <Text className="text-[10px] text-brand-brownLight mt-1 text-right">
              {((currentRevenue.commission / currentRevenue.total) * 100).toFixed(1)}%
            </Text>
          </View>
          <View>
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 rounded-full bg-[#FFD700]" />
                <Text className="text-xs text-brand-brown">{t.subscriptionRevenue}</Text>
              </View>
              <Text className="text-xs font-bold text-brand-brown">{formatCurrency(currentRevenue.subscriptions)}</Text>
            </View>
            <View className="w-full h-3 bg-brand-beige rounded-full overflow-hidden">
              <View
                className="h-full bg-[#FFD700] rounded-full"
                style={{ width: `${(currentRevenue.subscriptions / currentRevenue.total) * 100}%` }}
              />
            </View>
            <Text className="text-[10px] text-brand-brownLight mt-1 text-right">
              {((currentRevenue.subscriptions / currentRevenue.total) * 100).toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Token Generation */}
      <View className="bg-white rounded-3xl border border-brand-beige p-5">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-sm font-bold text-brand-brown">
              {language === 'fr' ? 'Jetons d\'inscription' : 'Tokana fanidirana'}
            </Text>
            <Text className="text-[10px] text-brand-brownLight">
              {language === 'fr' ? 'Générez des jetons pour les nouveaux utilisateurs' : 'Mamorona tokana ho an\'ny mpampiasa vaovao'}
            </Text>
          </View>
          <Pressable
            onPress={() => setShowTokenForm(!showTokenForm)}
            className="bg-brand-green px-4 py-2 rounded-2xl flex-row items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4 text-white" />
            <Text className="text-white text-xs font-bold">
              {language === 'fr' ? 'Générer' : 'Hamorona'}
            </Text>
          </Pressable>
        </View>

        {showTokenForm && (
          <View className="gap-3 p-4 bg-[#F5F2EB] rounded-2xl border border-[#D7D3C6] mb-4">
            <Text className="text-xs font-bold text-brand-brown">
              {language === 'fr' ? 'Sélectionner le rôle pour ce jeton :' : 'Safidio ny andraikitra ho an\'ity tokana ity :'}
            </Text>
             <View className="flex-row flex-wrap gap-2">
              {(['agriculteur', 'vendeur', 'commercant', 'acheteur', 'association'] as UserRole[]).map((role) => (
                <Pressable
                  key={role}
                  onPress={() => setNewTokenRole(role)}
                  className={`px-3 py-2 rounded-xl border-2 ${
                    newTokenRole === role ? 'border-brand-green bg-emerald-50' : 'border-brand-beige bg-white'
                  }`}
                >
                  <Text className={`text-xs font-bold ${newTokenRole === role ? 'text-brand-green' : 'text-brand-brownLight'}`}>
                    {getRoleLabel(role, language)}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable onPress={handleGenerateToken} className="w-full py-3 bg-brand-green rounded-2xl items-center">
              <Text className="text-white font-black text-sm">
                {language === 'fr' ? 'Générer le jeton' : 'Hamorona ny tokana'}
              </Text>
            </Pressable>
          </View>
        )}

        <View className="gap-2">
          {adminTokens.length === 0 ? (
            <Text className="text-xs text-brand-brownLight text-center py-4">
              {language === 'fr' ? 'Aucun jeton généré' : 'Tsy misy tokana'}
            </Text>
          ) : (
            adminTokens.slice().reverse().map((token) => (
              <View
                key={token.token}
                className={`flex-row items-center justify-between p-3 rounded-2xl border ${
                  token.used ? 'bg-gray-50 border-gray-200' : 'bg-[#F5F2EB] border-brand-beige'
                }`}
              >
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-xs font-mono font-bold text-brand-brown">
                      {token.token}
                    </Text>
                    {copiedToken === token.token && (
                      <Text className="text-[10px] text-brand-green font-bold">
                        {language === 'fr' ? 'Copié !' : 'Nakopiana !'}
                      </Text>
                    )}
                  </View>
                  <View className="flex-row items-center gap-2 mt-1">
                    <Text className="text-[10px] text-brand-brownLight bg-white px-2 py-0.5 rounded-full">
                      {getRoleLabel(token.role, language)}
                    </Text>
                    <Text className="text-[10px] text-brand-brownLight">
                      {token.createdAt}
                    </Text>
                    {token.used && (
                      <Text className="text-[10px] text-red-500 font-bold">
                        {language === 'fr' ? 'Utilisé' : 'Efa nampiasaina'}
                      </Text>
                    )}
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  {!token.used && (
                    <>
                      <Pressable onPress={() => handleCopyToken(token.token)} className="p-2 bg-white rounded-xl border border-brand-beige">
                        <Copy className="w-4 h-4 text-brand-green" />
                      </Pressable>
                      <Pressable onPress={() => handleDeleteToken(token.token)} className="p-2 bg-white rounded-xl border border-red-200">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Pressable>
                    </>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Search & Filter */}
      <View className="gap-3">
        <View className="bg-white rounded-3xl border border-brand-beige flex-row items-center px-4 py-3">
          <Search className="w-4 h-4 text-brand-brownLight mr-2" />
          <TextInput
            className="flex-1 text-sm text-brand-brown"
            placeholder={t.searchUsers}
            placeholderTextColor="#C4BFB1"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <X className="w-4 h-4 text-brand-brownLight" />
            </Pressable>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
          <Pressable
            onPress={() => setRoleFilter('all')}
            className={`px-4 py-2 rounded-2xl border ${
              roleFilter === 'all' ? 'bg-brand-green border-brand-green' : 'bg-white border-brand-beige'
            }`}
          >
            <Text className={`text-xs font-bold ${roleFilter === 'all' ? 'text-white' : 'text-brand-brownLight'}`}>
              {t.allRoles}
            </Text>
          </Pressable>
          {(['agriculteur', 'vendeur', 'commercant', 'acheteur', 'association', 'administrateur'] as UserRole[]).map((role) => (
            <Pressable
              key={role}
              onPress={() => setRoleFilter(role)}
              className={`px-4 py-2 rounded-2xl border ${
                roleFilter === role ? 'bg-brand-green border-brand-green' : 'bg-white border-brand-beige'
              }`}
            >
              <Text className={`text-xs font-bold ${roleFilter === role ? 'text-white' : 'text-brand-brownLight'}`}>
                {getRoleLabel(role, language)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Users List */}
      <View className="gap-3">
        <Text className="text-sm font-bold text-brand-brown">{t.userActivity}</Text>
        {filteredUsers.length === 0 ? (
          <View className="bg-white rounded-3xl border border-brand-beige p-6 items-center">
            <Users className="w-8 h-8 text-brand-brownLight mb-2" />
            <Text className="text-xs text-brand-brownLight text-center">
              {language === 'fr' ? 'Aucun utilisateur enregistré' : 'Tsy misy mpampiasa'}
            </Text>
          </View>
        ) : (
          filteredUsers.map((user) => (
            <Pressable
              key={user.id}
              onPress={() => setSelectedUser(user)}
              className="bg-white rounded-3xl border border-brand-beige p-4 flex-row items-center gap-3 active:bg-brand-beige/50"
            >
              <View className="w-12 h-12 rounded-2xl bg-[#F2F8F1] items-center justify-center border border-brand-green/20">
                <Text className="font-extrabold text-lg text-brand-green">{user.name.charAt(0)}</Text>
              </View>
              <View className="flex-1 min-w-0">
                <Text className="text-sm font-bold text-brand-brown truncate">{user.name}</Text>
                <Text className="text-[11px] text-brand-brownLight">{user.phone}</Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <Text className="text-[10px] text-brand-brownLight bg-brand-beige px-2 py-0.5 rounded-full">
                    {getRoleLabel(user.role, language)}
                  </Text>
                  <Text className="text-[10px] text-brand-brownLight">
                    {user.location}
                  </Text>
                </View>
              </View>
              <View className="items-end gap-1">
                {getStatusBadge(user.status, language)}
                <Text className="text-[10px] text-brand-brownLight">
                  {user.lastActive.split(' ')[0]}
                </Text>
              </View>
              <ChevronRight className="w-4 h-4 text-brand-brownLight ml-1" />
            </Pressable>
          ))
        )}
      </View>

      {/* Recent Activities */}
      <View className="gap-3">
        <Text className="text-sm font-bold text-brand-brown">{t.recentActivity}</Text>
        <View className="bg-white rounded-3xl border border-brand-beige overflow-hidden">
          {mockActivities.map((activity, index) => (
            <View
              key={activity.id}
              className={`flex-row items-center gap-3 p-4 ${
                index !== mockActivities.length - 1 ? 'border-b border-brand-beige' : ''
              }`}
            >
              <View className="w-10 h-10 rounded-xl bg-[#F2F8F1] items-center justify-center border border-brand-green/20">
                {getActivityIcon(activity.type)}
              </View>
              <View className="flex-1 min-w-0">
                <Text className="text-xs font-bold text-brand-brown truncate">{activity.userName}</Text>
                <Text className="text-[11px] text-brand-brownLight truncate">{activity.description}</Text>
              </View>
              <View className="items-end">
                <Text className="text-[10px] text-brand-brownLight">{activity.date.split(' ')[0]}</Text>
                <Text className="text-[10px] text-brand-brownLight">{activity.date.split(' ')[1]}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* User Detail Modal */}
      <Modal visible={!!selectedUser} transparent animationType="fade" onRequestClose={() => setSelectedUser(null)}>
        <View className="flex-1 bg-black/40 items-center justify-center p-6">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm">
            {selectedUser && (
              <>
                <View className="flex-row justify-between items-start mb-4">
                  <Text className="text-lg font-bold text-brand-brown">{selectedUser.name}</Text>
                  <Pressable onPress={() => setSelectedUser(null)}>
                    <X className="w-5 h-5 text-brand-brownLight" />
                  </Pressable>
                </View>
                <View className="gap-3">
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-brand-brownLight">{t.userRole}</Text>
                    <Text className="text-xs font-bold text-brand-brown">{getRoleLabel(selectedUser.role, language)}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-brand-brownLight">Téléphone</Text>
                    <Text className="text-xs font-bold text-brand-brown">{selectedUser.phone}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-brand-brownLight">Localisation</Text>
                    <Text className="text-xs font-bold text-brand-brown">{selectedUser.location}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-brand-brownLight">{t.userStatus}</Text>
                    {getStatusBadge(selectedUser.status, language)}
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-brand-brownLight">{t.userLastActive}</Text>
                    <Text className="text-xs font-bold text-brand-brown">{selectedUser.lastActive}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-brand-brownLight">Inscrit le</Text>
                    <Text className="text-xs font-bold text-brand-brown">{selectedUser.joinDate}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-brand-brownLight">Activités</Text>
                    <Text className="text-xs font-bold text-brand-brown">{selectedUser.activitiesCount}</Text>
                  </View>
                </View>
                <View className="flex-row gap-3 mt-6">
                  {selectedUser.status === 'active' ? (
                    <Pressable className="flex-1 bg-red-500 py-3 rounded-2xl flex-row items-center justify-center gap-2">
                      <Ban className="w-4 h-4 text-white" />
                      <Text className="text-white text-xs font-bold">{t.suspend}</Text>
                    </Pressable>
                  ) : (
                    <Pressable className="flex-1 bg-brand-green py-3 rounded-2xl flex-row items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4 text-white" />
                      <Text className="text-white text-xs font-bold">{t.activate}</Text>
                    </Pressable>
                  )}
                  <Pressable onPress={() => setSelectedUser(null)} className="flex-1 bg-brand-beige py-3 rounded-2xl items-center justify-center">
                    <Text className="text-xs font-bold text-brand-brown">{t.cancel}</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
