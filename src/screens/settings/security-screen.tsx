import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { ThemedRefreshControl } from '@/components/ui/themed-refresh-control';
import { AppText } from '@/components/ui/text';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Container from '@/components/layout/container';
import { GetRequest } from '@/utils/requests';
import { useDataContext } from '@/store/useDataContext';
import { useTheme } from '@/theme/ThemeProvider';
import type { ThemeColors } from '@/theme/types';

interface Session {
  id: string;
  user_id: string;
  access_token_id: string;
  login_at: string;
  ip_address: string;
  location: string;
  device: string;
  created_at: string;
  is_live: boolean;
}

const SkeletonBox = ({
  width,
  height,
  style,
  skeletonStyle,
}: {
  width: number | string;
  height: number;
  style?: object;
  skeletonStyle: object;
}) => <View style={[{ width, height }, skeletonStyle, style]} />;

const SecuritySkeleton = ({
  styles,
}: {
  styles: ReturnType<typeof createStyles>;
}) => (
  <View style={styles.scrollContent}>
    <View style={styles.sectionHeaderContainer}>
      <SkeletonBox
        width="65%"
        height={22}
        skeletonStyle={styles.skeleton}
        style={styles.skeletonMarginBottom8}
      />
      <SkeletonBox
        width="95%"
        height={14}
        skeletonStyle={styles.skeleton}
        style={styles.skeletonMarginBottom4}
      />
      <SkeletonBox width="80%" height={14} skeletonStyle={styles.skeleton} />
    </View>
    {[1, 2, 3].map(i => (
      <View key={i} style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          <SkeletonBox
            width={44}
            height={44}
            skeletonStyle={styles.skeleton}
            style={styles.skeletonAvatar}
          />
          <View style={styles.skeletonMeta}>
            <SkeletonBox
              width="50%"
              height={16}
              skeletonStyle={styles.skeleton}
              style={styles.skeletonMarginBottom6}
            />
            <SkeletonBox
              width="70%"
              height={13}
              skeletonStyle={styles.skeleton}
            />
          </View>
        </View>
        <View style={styles.cardDivider} />
        <View style={styles.sessionFooter}>
          <View style={styles.skeletonFooterLeft}>
            <SkeletonBox
              width="35%"
              height={11}
              skeletonStyle={styles.skeleton}
              style={styles.skeletonMarginBottom4}
            />
            <SkeletonBox
              width="60%"
              height={13}
              skeletonStyle={styles.skeleton}
            />
          </View>
          <SkeletonBox
            width={64}
            height={24}
            skeletonStyle={styles.skeleton}
            style={styles.skeletonStatusPill}
          />
        </View>
      </View>
    ))}
  </View>
);

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    backButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: -8,
    },
    headerTitle: {
      fontSize: 18,
      color: colors.textPrimary,
      marginLeft: 4,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 40,
    },
    sectionHeaderContainer: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      color: colors.textPrimary,
      marginBottom: 6,
    },
    sectionSubtitle: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.textSecondary,
    },
    sessionCard: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 1,
    },
    sessionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 10,
      backgroundColor: colors.categoryChip || '#F4F4F6',
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconContainerHighlight: {
      backgroundColor: colors.surfaceElevated || '#F3F0FF',
    },
    sessionMeta: {
      flex: 1,
      marginLeft: 12,
      justifyContent: 'center',
    },
    deviceName: {
      fontSize: 15,
      color: colors.textPrimary,
      marginBottom: 2,
    },
    locationText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    cardDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
      marginVertical: 14,
    },
    sessionFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    detailItem: {
      flex: 1,
    },
    detailLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    detailValue: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 14,
    },
    activePill: {
      backgroundColor: '#E8F8F0',
    },
    inactivePill: {
      backgroundColor: colors.categoryChip || '#F3F4F6',
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 6,
    },
    activeDot: {
      backgroundColor: '#10B981',
    },
    inactiveDot: {
      backgroundColor: '#9CA3AF',
    },
    statusPillText: {
      fontSize: 12,
      fontWeight: '600',
    },
    activePillText: {
      color: '#059669',
    },
    inactivePillText: {
      color: colors.textSecondary,
    },
    emptyState: {
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      marginTop: 12,
      fontSize: 14,
      color: colors.textSecondary,
    },
    loadMoreBtn: {
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    loadMoreText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    skeleton: {
      backgroundColor: colors.skeleton || '#E1E9EE',
      borderRadius: 6,
    },
    skeletonMarginBottom8: { marginBottom: 8 },
    skeletonMarginBottom6: { marginBottom: 6 },
    skeletonMarginBottom4: { marginBottom: 4 },
    skeletonAvatar: { borderRadius: 10 },
    skeletonMeta: { flex: 1, marginLeft: 12 },
    skeletonFooterLeft: { flex: 1 },
    skeletonStatusPill: { borderRadius: 12 },
  });

const SecurityScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const { state } = useDataContext();
  const { user } = state;

  const fetchSessions = async (pageNum: number, isRefresh: boolean = false) => {
    if (pageNum > 1) setLoadingMore(true);

    const limit = 10;
    const { data, error } = await GetRequest(
      `/users/${user?.user_id}/login-audit?page=${pageNum}&limit=${limit}`,
    );

    if (!error && data?.data) {
      if (isRefresh) {
        setSessions(data.data);
      } else {
        setSessions(prev => [...prev, ...data.data]);
      }

      // Check if there are more pages
      const pagination = data.pagination;
      setHasMore(pagination.current_page < pagination.total_pages_count);
    }

    setLoading(false);
    setRefreshing(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchSessions(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchSessions(1, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchSessions(nextPage);
    }
  };

  const formatDeviceName = (device: string | null | undefined) => {
    if (
      !device ||
      device.trim() === '' ||
      device.trim().toLowerCase() === 'unknown'
    ) {
      return 'Unknown device';
    }
    return device;
  };

  const formatLocationAndIp = (location?: string, ip?: string) => {
    const loc = (location || '').trim();
    const ipAddr = (ip || '').trim();
    if (loc && ipAddr) {
      return `${loc} · ${ipAddr}`;
    }
    return loc || ipAddr || 'Unknown location';
  };

  const getDeviceIcon = (device: string) => {
    const d = (device || '').toLowerCase();
    if (
      d.includes('chrome') ||
      d.includes('safari') ||
      d.includes('browser') ||
      d.includes('edge') ||
      d.includes('firefox')
    ) {
      return 'monitor';
    }
    if (
      d.includes('iphone') ||
      d.includes('android') ||
      d.includes('phone') ||
      d.includes('mobile')
    ) {
      return 'cellphone';
    }
    if (d.includes('tablet') || d.includes('ipad')) {
      return 'tablet';
    }
    return 'laptop';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Container>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={28} color={colors.iconDefault} />
        </TouchableOpacity>
        <AppText variant="bold" style={styles.headerTitle}>
          Account Security
        </AppText>
      </View>

      {loading ? (
        <SecuritySkeleton styles={styles} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <ThemedRefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
        >
          <View style={styles.sectionHeaderContainer}>
            <AppText variant="bold" style={styles.sectionTitle}>
              Where you are logged in
            </AppText>
            <AppText style={styles.sectionSubtitle}>
              Review the devices and browsers that have logged in to your
              account. If you do not recognize one, end that session and change
              your password.
            </AppText>
          </View>

          {sessions.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={48}
                color={colors.iconMuted}
              />
              <AppText style={styles.emptyText}>
                No active sessions found.
              </AppText>
            </View>
          ) : (
            <>
              {sessions.map((session, index) => {
                const isPrimary = index === 0 && session.is_live;
                const iconColor = isPrimary
                  ? colors.primary
                  : colors.iconDefault;
                const deviceName = formatDeviceName(session.device);
                const locationAndIp = formatLocationAndIp(
                  session.location,
                  session.ip_address,
                );

                return (
                  <View key={session.id} style={styles.sessionCard}>
                    <View style={styles.sessionHeader}>
                      <View
                        style={[
                          styles.iconContainer,
                          isPrimary && styles.iconContainerHighlight,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={getDeviceIcon(session.device) as any}
                          size={22}
                          color={iconColor}
                        />
                      </View>
                      <View style={styles.sessionMeta}>
                        <AppText variant="bold" style={styles.deviceName}>
                          {deviceName}
                        </AppText>
                        <AppText style={styles.locationText}>
                          {locationAndIp}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.cardDivider} />

                    <View style={styles.sessionFooter}>
                      <View style={styles.detailItem}>
                        <AppText style={styles.detailLabel}>LOGGED IN</AppText>
                        <AppText style={styles.detailValue}>
                          {formatDate(session.login_at)}
                        </AppText>
                      </View>
                      <View
                        style={[
                          styles.statusPill,
                          session.is_live
                            ? styles.activePill
                            : styles.inactivePill,
                        ]}
                        accessibilityRole="text"
                        accessibilityLabel={`Session status: ${
                          session.is_live ? 'Active' : 'Expired'
                        }`}
                      >
                        <View
                          style={[
                            styles.statusDot,
                            session.is_live
                              ? styles.activeDot
                              : styles.inactiveDot,
                          ]}
                        />
                        <AppText
                          variant="medium"
                          style={[
                            styles.statusPillText,
                            session.is_live
                              ? styles.activePillText
                              : styles.inactivePillText,
                          ]}
                        >
                          {session.is_live ? 'Active' : 'Expired'}
                        </AppText>
                      </View>
                    </View>
                  </View>
                );
              })}

              {hasMore && (
                <TouchableOpacity
                  style={styles.loadMoreBtn}
                  onPress={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <AppText style={styles.loadMoreText}>
                      Load More Sessions
                    </AppText>
                  )}
                </TouchableOpacity>
              )}
            </>
          )}
        </ScrollView>
      )}
    </Container>
  );
};

export default SecurityScreen;
