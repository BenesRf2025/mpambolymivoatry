import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, RefreshControl, ActivityIndicator, Modal, TextInput } from 'react-native';
import {
  Users,
  ShieldCheck,
  UserPlus,
  BadgeCheck,
  Crown,
  LogOut,
  UserMinus,
  Coins,
  Boxes,
  Plus,
  X,
  Star,
  MapPin,
  ChevronRight,
  CheckCircle2,
} from '../lib/icons';
import {
  Language,
  UserRole,
  Association,
  AssociationMember,
  AssociationType,
  AssociationMemberRole,
  CollectiveStock,
} from '../types';
import { translations } from '../data/translations';
import {
  getAllAssociations,
  getMyMemberships,
  getAssociationById,
  getCollectiveStock,
  joinAssociation,
  leaveAssociation,
  createAssociation,
  updateMemberRole,
  updateMemberRevenue,
  removeMember,
} from '../services/apiClient';
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

const ASSOCIATION_TYPES: AssociationType[] = [
  'GROUPEMENT_FAMILIAL',
  'ASSOCIATION_QUARTIER',
  'COOPERATIVE',
  'ENTREPRISE',
];

export const AssociationsScreen: React.FC<AssociationsScreenProps> = ({
  language,
  apiToken,
}) => {
  const t = translations[language];
  const [allAssociations, setAllAssociations] = useState<Association[]>([]);
  const [myAssociations, setMyAssociations] = useState<Association[]>([]);
  const [myRole, setMyRole] = useState<Record<string, AssociationMemberRole>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [detail, setDetail] = useState<Association | null>(null);
  const [stock, setStock] = useState<CollectiveStock | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    type: 'COOPERATIVE' as AssociationType,
    description: '',
    location: '',
    registrationNumber: '',
  });
  const [revenueDrafts, setRevenueDrafts] = useState<Record<string, string>>({});

  const typeLabel = (type: AssociationType) =>
    ({
      GROUPEMENT_FAMILIAL: t.typeGroupementFamilial,
      ASSOCIATION_QUARTIER: t.typeAssociationQuartier,
      COOPERATIVE: t.typeCooperative,
      ENTREPRISE: t.typeEntreprise,
    }[type]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = useCallback(async () => {
    try {
      if (apiToken) setApiAuthToken(apiToken);
      const all = await getAllAssociations();
      setAllAssociations(all);

      if (apiToken) {
        const memberships = await getMyMemberships(apiToken);
        const active = memberships.filter((m) => m.active && m.association);
        const roleMap: Record<string, AssociationMemberRole> = {};
        const assocs: Association[] = [];
        active.forEach((m) => {
          if (m.association) {
            assocs.push(m.association);
            roleMap[m.association.id] = m.memberRole;
          }
        });
        setMyAssociations(assocs);
        setMyRole(roleMap);
      } else {
        setMyAssociations([]);
        setMyRole({});
      }
    } catch (error) {
      console.error('Error loading associations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [apiToken]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const openDetail = async (assoc: Association) => {
    setDetail(assoc);
    setStock(null);
    setRevenueDrafts({});
    setLoadingDetail(true);
    try {
      const [det, st] = await Promise.all([
        getAssociationById(assoc.id),
        getCollectiveStock(assoc.id).catch(() => null),
      ]);
      setDetail(det);
      setStock(st);
      const drafts: Record<string, string> = {};
      (det.members || []).forEach((m) => {
        drafts[m.id] = String(m.revenuePercentage ?? 0);
      });
      setRevenueDrafts(drafts);
    } catch (error) {
      console.error('Error loading association detail:', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const isManager = (assocId: string) => myRole[assocId] === 'GESTIONNAIRE';
  const isMember = (assocId: string) => Boolean(myRole[assocId]);

  const handleJoin = async (associationId: string) => {
    if (!apiToken) return;
    setActionLoading(`join:${associationId}`);
    try {
      await joinAssociation(associationId, apiToken);
      showToast(t.associationJoined);
      await loadData();
      if (detail && detail.id === associationId) await openDetail(detail);
    } catch (error) {
      console.error('Error joining association:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeave = async (associationId: string) => {
    if (!apiToken) return;
    setActionLoading(`leave:${associationId}`);
    try {
      await leaveAssociation(associationId, apiToken);
      showToast(t.associationLeft);
      setDetail(null);
      await loadData();
    } catch (error) {
      console.error('Error leaving association:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreate = async () => {
    if (!apiToken || !form.name.trim()) return;
    setCreating(true);
    try {
      await createAssociation(
        {
          name: form.name.trim(),
          type: form.type,
          description: form.description.trim() || undefined,
          location: form.location.trim() || undefined,
          registrationNumber: form.registrationNumber.trim() || undefined,
        },
        apiToken,
      );
      showToast(t.associationCreated);
      setCreateOpen(false);
      setForm({ name: '', type: 'COOPERATIVE', description: '', location: '', registrationNumber: '' });
      await loadData();
    } catch (error) {
      console.error('Error creating association:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleRole = async (associationId: string, member: AssociationMember) => {
    if (!apiToken) return;
    const next: AssociationMemberRole = member.memberRole === 'GESTIONNAIRE' ? 'MEMBRE' : 'GESTIONNAIRE';
    setActionLoading(`role:${member.id}`);
    try {
      await updateMemberRole(associationId, member.userId, next, apiToken);
      await openDetail(detail as Association);
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevenue = async (associationId: string, member: AssociationMember) => {
    if (!apiToken) return;
    const value = parseFloat(revenueDrafts[member.id]);
    if (isNaN(value)) return;
    setActionLoading(`rev:${member.id}`);
    try {
      await updateMemberRevenue(associationId, member.userId, value, apiToken);
      await openDetail(detail as Association);
    } catch (error) {
      console.error('Error updating revenue:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemove = async (associationId: string, member: AssociationMember) => {
    if (!apiToken) return;
    setActionLoading(`rm:${member.id}`);
    try {
      await removeMember(associationId, member.userId, apiToken);
      await openDetail(detail as Association);
    } catch (error) {
      console.error('Error removing member:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const TypeBadge = ({ type }: { type: AssociationType }) => (
    <View className="px-2 py-0.5 rounded-full bg-brand-green/10">
      <Text className="text-[10px] font-bold text-brand-green">{typeLabel(type)}</Text>
    </View>
  );

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
    <View className="flex-1 bg-brand-cream">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-black text-brand-brown">{t.associationsTitle}</Text>
            <Text className="text-[11px] text-brand-brownLight">{t.associationsSubtitle}</Text>
          </View>
          <Pressable
            onPress={() => setCreateOpen(true)}
            className="flex-row items-center gap-1 px-3 py-2 bg-brand-green rounded-xl"
          >
            <Plus className="w-4 h-4 text-white" />
            <Text className="text-xs font-bold text-white">{t.createAssociation}</Text>
          </Pressable>
        </View>

        {/* My Associations */}
        <View>
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-1.5">
              <Star className="w-4 h-4 text-[#FFD700]" />
              <Text className="text-sm font-black text-brand-brown">{t.myAssociations}</Text>
            </View>
            <Text className="text-[10px] font-bold text-brand-green bg-white px-2 py-1 rounded-full">
              {myAssociations.length}
            </Text>
          </View>

          <View className="gap-2">
            {myAssociations.map((assoc) => (
              <Pressable
                key={assoc.id}
                onPress={() => openDetail(assoc)}
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
                {isManager(assoc.id) && (
                  <View className="flex-row items-center gap-1 px-2 py-1 bg-amber-50 rounded-full">
                    <Crown className="w-3 h-3 text-amber-600" />
                    <Text className="text-[10px] font-bold text-amber-700">{t.manager}</Text>
                  </View>
                )}
                <ChevronRight className="w-4 h-4 text-brand-brownLight" />
              </Pressable>
            ))}
            {myAssociations.length === 0 && (
              <View className="bg-white p-4 rounded-2xl border border-brand-beige items-center py-6">
                <Users className="w-8 h-8 text-brand-brownLight mb-2" />
                <Text className="text-xs text-brand-brownLight">{t.noMyAssociations}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Available Associations */}
        <View>
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-green" />
              <Text className="text-sm font-black text-brand-brown">{t.availableAssociations}</Text>
            </View>
            <Text className="text-[10px] font-bold text-brand-green bg-white px-2 py-1 rounded-full">
              {allAssociations.length}
            </Text>
          </View>

          <View className="gap-2">
            {allAssociations.map((assoc) => {
              const member = isMember(assoc.id);
              return (
                <View key={assoc.id} className="bg-white p-4 rounded-2xl border border-brand-beige">
                  <Pressable onPress={() => openDetail(assoc)} className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-brand-green/10 items-center justify-center">
                      <Users className="w-5 h-5 text-brand-green" />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-sm font-bold text-brand-brown">{assoc.name}</Text>
                        <TypeBadge type={assoc.type} />
                      </View>
                      <Text className="text-[10px] text-brand-brownLight" numberOfLines={2}>
                        {assoc.description || (language === 'fr' ? 'Aucune description' : 'Tsy misy famaritana')}
                      </Text>
                    </View>
                    <ChevronRight className="w-4 h-4 text-brand-brownLight" />
                  </Pressable>

                  <View className="mt-3 flex-row items-center gap-2">
                    {member ? (
                      <View className="flex-1 flex-row items-center justify-center gap-2 py-2.5 bg-brand-cream rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <Text className="text-xs font-bold text-brand-green">{t.memberRole}</Text>
                      </View>
                    ) : (
                      <Pressable
                        onPress={() => handleJoin(assoc.id)}
                        disabled={actionLoading === `join:${assoc.id}`}
                        className="flex-1 flex-row items-center justify-center gap-2 py-2.5 bg-brand-green rounded-xl"
                      >
                        <UserPlus className="w-4 h-4 text-white" />
                        <Text className="text-xs font-bold text-white">{t.joinAssociation}</Text>
                      </Pressable>
                    )}
                    <Pressable
                      onPress={() => openDetail(assoc)}
                      className="px-3 py-2.5 bg-brand-cream rounded-xl items-center"
                    >
                      <Text className="text-xs font-bold text-brand-brown">{t.viewDetails}</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
            {allAssociations.length === 0 && (
              <View className="bg-white p-4 rounded-2xl border border-brand-beige items-center py-6">
                <ShieldCheck className="w-8 h-8 text-brand-brownLight mb-2" />
                <Text className="text-xs text-brand-brownLight">{t.noAssociations}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {toast && (
        <View className="absolute top-4 left-4 right-4 flex-row items-center gap-2 bg-brand-green px-4 py-3 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <Text className="text-xs font-bold text-white flex-1">{toast}</Text>
        </View>
      )}

      {/* Create modal */}
      <Modal visible={createOpen} transparent animationType="fade" onRequestClose={() => setCreateOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setCreateOpen(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} className="bg-white rounded-t-3xl p-5 pb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-black text-brand-brown">{t.createAssociation}</Text>
              <Pressable onPress={() => setCreateOpen(false)}>
                <X className="w-5 h-5 text-brand-brownLight" />
              </Pressable>
            </View>

            <Text className="text-xs font-bold text-brand-brown mb-1">{t.associationName}</Text>
            <TextInput
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
              placeholder="Mpamboly Fiarovana"
              className="mb-3 bg-brand-cream rounded-xl px-3 py-2.5 text-sm text-brand-brown"
            />

            <Text className="text-xs font-bold text-brand-brown mb-1">{t.associationType}</Text>
            <View className="flex-row flex-wrap gap-2 mb-3">
              {ASSOCIATION_TYPES.map((type) => (
                <Pressable
                  key={type}
                  onPress={() => setForm({ ...form, type })}
                  className={`px-3 py-2 rounded-full border ${
                    form.type === type ? 'bg-brand-green border-brand-green' : 'bg-white border-brand-beige'
                  }`}
                >
                  <Text
                    className={`text-[11px] font-bold ${
                      form.type === type ? 'text-white' : 'text-brand-brown'
                    }`}
                  >
                    {typeLabel(type)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text className="text-xs font-bold text-brand-brown mb-1">{t.associationDescription}</Text>
            <TextInput
              value={form.description}
              onChangeText={(v) => setForm({ ...form, description: v })}
              placeholder="..."
              multiline
              className="mb-3 bg-brand-cream rounded-xl px-3 py-2.5 text-sm text-brand-brown"
            />

            <Text className="text-xs font-bold text-brand-brown mb-1">{t.associationLocation}</Text>
            <TextInput
              value={form.location}
              onChangeText={(v) => setForm({ ...form, location: v })}
              placeholder="Antsirabe"
              className="mb-3 bg-brand-cream rounded-xl px-3 py-2.5 text-sm text-brand-brown"
            />

            <Text className="text-xs font-bold text-brand-brown mb-1">{t.registrationNumber}</Text>
            <TextInput
              value={form.registrationNumber}
              onChangeText={(v) => setForm({ ...form, registrationNumber: v })}
              placeholder="REG-2026-00123"
              className="mb-4 bg-brand-cream rounded-xl px-3 py-2.5 text-sm text-brand-brown"
            />

            <Pressable
              onPress={handleCreate}
              disabled={creating || !form.name.trim()}
              className="py-3 bg-brand-green rounded-xl items-center"
            >
              <Text className="text-sm font-bold text-white">{creating ? '...' : t.createAssociation}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Detail modal */}
      <Modal visible={!!detail} transparent animationType="fade" onRequestClose={() => setDetail(null)}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setDetail(null)}>
          <Pressable onPress={(e) => e.stopPropagation()} className="bg-white rounded-t-3xl p-5 pb-8 max-h-[85%]">
            {detail && (
              <ScrollView contentContainerStyle={{ gap: 12 }}>
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="text-lg font-black text-brand-brown">{detail.name}</Text>
                    <View className="flex-row items-center gap-2 mt-1 flex-wrap">
                      <TypeBadge type={detail.type} />
                      {detail.verified ? (
                        <View className="flex-row items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50">
                          <BadgeCheck className="w-3 h-3 text-emerald-600" />
                          <Text className="text-[10px] font-bold text-emerald-700">{t.verified}</Text>
                        </View>
                      ) : (
                        <Text className="text-[10px] font-bold text-brand-brownLight">{t.notVerified}</Text>
                      )}
                    </View>
                  </View>
                  <Pressable onPress={() => setDetail(null)}>
                    <X className="w-5 h-5 text-brand-brownLight" />
                  </Pressable>
                </View>

                {detail.description ? (
                  <Text className="text-xs text-brand-brownLight">{detail.description}</Text>
                ) : null}

                {detail.location ? (
                  <View className="flex-row items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-brownLight" />
                    <Text className="text-[11px] text-brand-brownLight">{detail.location}</Text>
                  </View>
                ) : null}

                {/* Collective stock */}
                <View className="flex-row items-center gap-3 p-3 bg-brand-cream rounded-xl">
                  <Boxes className="w-5 h-5 text-brand-green" />
                  <View className="flex-1">
                    <Text className="text-[10px] font-bold text-brand-brownLight uppercase">{t.collectiveStock}</Text>
                    <Text className="text-sm font-black text-brand-brown">
                      {stock ? `${stock.totalKg} ${t.totalKg}` : (language === 'fr' ? '...' : '...')}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-[10px] font-bold text-brand-brownLight uppercase">{t.members}</Text>
                    <Text className="text-sm font-black text-brand-brown">
                      {stock ? stock.memberCount : (detail.members || []).length}
                    </Text>
                  </View>
                </View>

                {loadingDetail ? (
                  <ActivityIndicator size="small" color="#2D5A27" />
                ) : (
                  <>
                    {/* Members */}
                    <Text className="text-xs font-black text-brand-brown mt-1">{t.members}</Text>
                    {(detail.members || [])
                      .filter((m) => m.active)
                      .map((m) => {
                        const manager = m.memberRole === 'GESTIONNAIRE';
                        return (
                          <View key={m.id} className="p-3 bg-white border border-brand-beige rounded-xl gap-2">
                            <View className="flex-row items-center justify-between">
                              <View className="flex-row items-center gap-1.5">
                                {manager ? (
                                  <Crown className="w-4 h-4 text-amber-600" />
                                ) : (
                                  <Users className="w-4 h-4 text-brand-brownLight" />
                                )}
                                <Text className="text-[11px] font-bold text-brand-brown">
                                  {manager ? t.manager : t.memberRole}
                                </Text>
                              </View>
                              <Text className="text-[10px] text-brand-brownLight" numberOfLines={1}>
                                {m.userId}
                              </Text>
                            </View>

                            {isManager(detail.id) && !manager ? (
                              <View className="flex-row items-center gap-2">
                                <View className="flex-1 flex-row items-center gap-1.5 bg-brand-cream rounded-xl px-2">
                                  <Coins className="w-4 h-4 text-brand-brownLight" />
                                  <TextInput
                                    value={revenueDrafts[m.id] ?? String(m.revenuePercentage)}
                                    onChangeText={(v) => setRevenueDrafts({ ...revenueDrafts, [m.id]: v })}
                                    onEndEditing={() => handleRevenue(detail.id, m)}
                                    keyboardType="numeric"
                                    className="flex-1 py-2 text-sm text-brand-brown"
                                  />
                                  <Text className="text-xs text-brand-brownLight">%</Text>
                                </View>
                                <Pressable
                                  onPress={() => handleToggleRole(detail.id, m)}
                                  disabled={actionLoading === `role:${m.id}`}
                                  className="px-3 py-2 bg-brand-green rounded-xl"
                                >
                                  <Text className="text-[11px] font-bold text-white">{t.manager}</Text>
                                </Pressable>
                                <Pressable
                                  onPress={() => handleRemove(detail.id, m)}
                                  disabled={actionLoading === `rm:${m.id}`}
                                  className="px-3 py-2 bg-red-50 rounded-xl items-center"
                                >
                                  <UserMinus className="w-4 h-4 text-red-600" />
                                </Pressable>
                              </View>
                            ) : null}
                          </View>
                        );
                      })}

                    {/* Actions */}
                    <View className="flex-row gap-3 mt-1">
                      {isMember(detail.id) ? (
                        <Pressable
                          onPress={() => handleLeave(detail.id)}
                          disabled={actionLoading === `leave:${detail.id}`}
                          className="flex-1 flex-row items-center justify-center gap-2 py-3 bg-red-50 rounded-xl"
                        >
                          <LogOut className="w-4 h-4 text-red-600" />
                          <Text className="text-sm font-bold text-red-600">{t.leaveAssociation}</Text>
                        </Pressable>
                      ) : (
                        <Pressable
                          onPress={() => handleJoin(detail.id)}
                          disabled={actionLoading === `join:${detail.id}`}
                          className="flex-1 flex-row items-center justify-center gap-2 py-3 bg-brand-green rounded-xl"
                        >
                          <UserPlus className="w-4 h-4 text-white" />
                          <Text className="text-sm font-bold text-white">{t.joinAssociation}</Text>
                        </Pressable>
                      )}
                    </View>
                  </>
                )}
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
