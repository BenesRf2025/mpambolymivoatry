import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, RefreshControl, ActivityIndicator, Modal } from 'react-native';
import {
  Users,
  ShieldCheck,
  UserPlus,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Info,
  Star,
} from '../lib/icons';
import { Language, UserRole, Association, AssociationMember } from '../types';
import { translations } from '../data/translations';
import { getAllAssociations, getMyAssociations, joinAssociation, getPendingRequests, approveMember } from '../services/apiClient';
import { setApiAuthToken } from '../services/reactQueryHooks';

interface AssociationsScreenProps {
  language: Language;
  activeRole: UserRole;
  onNavigate: (screen: any) => void;
  onToggleLanguage: () => void;
  apiBaseURL?: string;
  apiToken?: string;
  onLogin?: (profile: any, role: UserRole, destinationScreen: any) => void;
}

export const AssociationsScreen: React.FC<AssociationsScreenProps> = ({
  language,
  activeRole,
  onNavigate,
  onToggleLanguage,
  apiToken,
}) => {
  const [allAssociations, setAllAssociations] = useState<Association[]>([]);
  const [myAssociations, setMyAssociations] = useState<Association[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAssociation, setSelectedAssociation] = useState<Association | null>(null);
  const [joining, setJoining] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<AssociationMember[]>([]);
  const [showPendingModal, setShowPendingModal] = useState(false);

  const loadData = async () => {
    if (!apiToken) {
      setLoading(false);
      return;
    }

    try {
      setApiAuthToken(apiToken);
      const [all, my] = await Promise.all([
        getAllAssociations(),
        getMyAssociations(apiToken),
      ]);
      setAllAssociations(all);
      setMyAssociations(my);
    } catch (error) {
      console.error('Error loading associations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [apiToken]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleJoin = async (associationId: string) => {
    if (!apiToken) return;
    setJoining(true);
    try {
      await joinAssociation(associationId, apiToken);
      setSelectedAssociation(null);
      await loadData();
    } catch (error) {
      console.error('Error joining association:', error);
    } finally {
      setJoining(false);
    }
  };

  const handleViewPending = async (associationId: string) => {
    if (!apiToken) return;
    try {
      const pending = await getPendingRequests(associationId, apiToken);
      setPendingRequests(pending);
      setShowPendingModal(true);
    } catch (error) {
      console.error('Error loading pending requests:', error);
    }
  };

  const handleApprove = async (memberId: string, approved: boolean) => {
    if (!apiToken) return;
    try {
      await approveMember(memberId, approved, apiToken, approved ? undefined : 'Non approuvé');
      const updated = pendingRequests.filter((r) => r.id !== memberId);
      setPendingRequests(updated);
      await loadData();
    } catch (error) {
      console.error('Error approving member:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <View className="flex-row items-center gap-1 px-2 py-1 bg-emerald-50 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <Text className="text-[10px] font-bold text-emerald-700">
              {language === 'fr' ? 'Approuvé' : 'Efa nety'}
            </Text>
          </View>
        );
      case 'PENDING':
        return (
          <View className="flex-row items-center gap-1 px-2 py-1 bg-amber-50 rounded-full">
            <Clock className="w-3 h-3 text-amber-600" />
            <Text className="text-[10px] font-bold text-amber-700">
              {language === 'fr' ? 'En attente' : 'Miandry'}
            </Text>
          </View>
        );
      case 'REJECTED':
        return (
          <View className="flex-row items-center gap-1 px-2 py-1 bg-red-50 rounded-full">
            <XCircle className="w-3 h-3 text-red-600" />
            <Text className="text-[10px] font-bold text-red-700">
              {language === 'fr' ? 'Rejeté' : 'Nolavina'}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-cream">
        <ActivityIndicator size="large" color="#2D5A27" />
        <Text className="text-brand-brown mt-3 text-sm font-medium">
          {language === 'fr' ? 'Chargement...' : 'Mamokatra...'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-brand-cream"
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* My Associations */}
      <View>
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-1.5">
            <Star className="w-4 h-4 text-[#FFD700]" />
            <Text className="text-sm font-black text-brand-brown">
              {language === 'fr' ? 'Mes associations' : 'Fikambananay'}
            </Text>
          </View>
          <Text className="text-[10px] font-bold text-brand-green bg-brand-cream px-2 py-1 rounded-full">
            {myAssociations.length}
          </Text>
        </View>

        <View className="gap-2">
          {myAssociations.map((assoc) => (
            <Pressable
              key={assoc.id}
              className="bg-white p-4 rounded-2xl border border-brand-beige flex-row items-center gap-3"
            >
              <View className="w-10 h-10 rounded-full bg-brand-green items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-brand-brown">{assoc.name}</Text>
                <Text className="text-[10px] text-brand-brownLight" numberOfLines={1}>
                  {assoc.description || (language === 'fr' ? 'Aucune description' : 'Tsy misy famaritana')}
                </Text>
              </View>
              <ChevronRight className="w-4 h-4 text-brand-brownLight" />
            </Pressable>
          ))}
          {myAssociations.length === 0 && (
            <View className="bg-white p-4 rounded-2xl border border-brand-beige items-center py-6">
              <Users className="w-8 h-8 text-brand-brownLight mb-2" />
              <Text className="text-xs text-brand-brownLight">
                {language === 'fr' ? 'Vous n\'êtes membre d\'aucune association' : 'Tsy mpiombana amin\'ny fikambanana ianao'}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Available Associations */}
      <View>
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-brand-green" />
            <Text className="text-sm font-black text-brand-brown">
              {language === 'fr' ? 'Associations disponibles' : 'Fikambanana misy'}
            </Text>
          </View>
          <Text className="text-[10px] font-bold text-brand-green bg-brand-cream px-2 py-1 rounded-full">
            {allAssociations.length}
          </Text>
        </View>

        <View className="gap-2">
          {allAssociations.map((assoc) => (
            <Pressable
              key={assoc.id}
              onPress={() => setSelectedAssociation(assoc)}
              className="bg-white p-4 rounded-2xl border border-brand-beige"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-brand-green/10 items-center justify-center">
                  <Users className="w-5 h-5 text-brand-green" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-brand-brown">{assoc.name}</Text>
                  <Text className="text-[10px] text-brand-brownLight" numberOfLines={2}>
                    {assoc.description || (language === 'fr' ? 'Aucune description' : 'Tsy misy famaritana')}
                  </Text>
                </View>
              </View>

              {assoc.rules && (
                <View className="mt-2 p-2 bg-brand-cream rounded-xl">
                  <View className="flex-row items-center gap-1 mb-1">
                    <Info className="w-3 h-3 text-brand-brownLight" />
                    <Text className="text-[10px] font-bold text-brand-brown uppercase tracking-wider">
                      {language === 'fr' ? 'Règles' : 'Fitsipika'}
                    </Text>
                  </View>
                  <Text className="text-[10px] text-brand-brownLight" numberOfLines={3}>
                    {assoc.rules}
                  </Text>
                </View>
              )}

              <Pressable
                onPress={() => handleJoin(assoc.id)}
                disabled={joining}
                className="mt-3 flex-row items-center justify-center gap-2 py-2.5 bg-brand-green rounded-xl"
              >
                <UserPlus className="w-4 h-4 text-white" />
                <Text className="text-xs font-bold text-white">
                  {language === 'fr' ? 'Rejoindre' : 'Hiditra'}
                </Text>
              </Pressable>
            </Pressable>
          ))}
          {allAssociations.length === 0 && (
            <View className="bg-white p-4 rounded-2xl border border-brand-beige items-center py-6">
              <ShieldCheck className="w-8 h-8 text-brand-brownLight mb-2" />
              <Text className="text-xs text-brand-brownLight">
                {language === 'fr' ? 'Aucune association disponible' : 'Tsy misy fikambanana'}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Join Confirmation Modal */}
      <Modal visible={!!selectedAssociation} transparent animationType="fade" onRequestClose={() => setSelectedAssociation(null)}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setSelectedAssociation(null)}>
          <Pressable onPress={(e) => e.stopPropagation()} className="bg-white rounded-t-3xl p-5 pb-8">
            <Text className="text-lg font-black text-brand-brown mb-2">
              {language === 'fr' ? 'Rejoindre l\'association' : 'Hiditra amin\'ny fikambanana'}
            </Text>
            <Text className="text-sm text-brand-brownLight mb-4">
              {language === 'fr'
                ? `Voulez-vous rejoindre "${selectedAssociation?.name}" ? Votre demande sera soumise à l'approbation.`
                : `Te haniditra amin'ny "${selectedAssociation?.name}" ? Hangataka fanekena ianao.`}
            </Text>

            {selectedAssociation?.rules && (
              <View className="p-3 bg-brand-cream rounded-xl mb-4">
                <Text className="text-xs font-bold text-brand-brown mb-1">
                  {language === 'fr' ? 'Règles' : 'Fitsipika'}
                </Text>
                <Text className="text-xs text-brand-brownLight">{selectedAssociation.rules}</Text>
              </View>
            )}

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setSelectedAssociation(null)}
                className="flex-1 py-3 bg-brand-cream rounded-xl items-center"
              >
                <Text className="text-sm font-bold text-brand-brown">
                  {language === 'fr' ? 'Annuler' : 'Aoka'}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => selectedAssociation && handleJoin(selectedAssociation.id)}
                disabled={joining}
                className="flex-1 py-3 bg-brand-green rounded-xl items-center"
              >
                <Text className="text-sm font-bold text-white">
                  {joining ? '...' : (language === 'fr' ? 'Confirmer' : 'Hankato')}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
};