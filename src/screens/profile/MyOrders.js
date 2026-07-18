import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { Image, Text, View, XStack, YStack } from 'tamagui';
import { useSelector } from 'react-redux';
import NoData from '../../components/NoData';
import { getOrders } from '../../api/account';

// ── Formatters ──────────────────────────────────────────────────────────────

const formatLocalDate = (ts) => {
  const d = new Date(ts);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// ── Server order card (shape from account/order JSON response) ───────────────
const ServerOrderCard = ({ order }) => (
  <View
    backgroundColor="#ffffff" borderRadius={8}
    borderWidth={1} borderColor="#e0e0e0"
    padding={12} marginBottom={12}
  >
    <XStack justifyContent="space-between" alignItems="center" marginBottom={8}>
      <YStack>
        <Text fontWeight="700" fontSize={14}>Order #{order.order_id}</Text>
        <Text fontSize={11} color="#888">{order.date_added}</Text>
      </YStack>
      <View backgroundColor="#e8f5e9" paddingHorizontal={8} paddingVertical={2} borderRadius={12}>
        <Text fontSize={11} fontWeight="600" color="#2e7d32">{order.status || 'Processing'}</Text>
      </View>
    </XStack>
    <XStack justifyContent="space-between" paddingTop={8} borderTopWidth={1} borderTopColor="#f0f0f0">
      <Text fontSize={13} color="#666">
        {order.product_total} item{order.product_total === 1 ? '' : 's'}
      </Text>
      <Text fontSize={14} fontWeight="700">{order.total}</Text>
    </XStack>
  </View>
);

// ── Local (Redux) order card (shape from cartSlice/authSlice) ─────────────
const LocalOrderLineRow = ({ item }) => (
  <XStack gap={10} alignItems="center">
    {item.image
      ? <Image source={{ uri: item.image }} width={48} height={48} borderRadius={6} objectFit="cover" />
      : <View width={48} height={48} backgroundColor="#eee" borderRadius={6} />}
    <YStack flex={1}>
      <Text fontSize={13} numberOfLines={1}>{item.name}</Text>
      <Text fontSize={12} color="#666">Qty {item.quantity} · {item.price}</Text>
    </YStack>
  </XStack>
);

const LocalOrderCard = ({ order }) => (
  <View
    backgroundColor="#ffffff" borderRadius={8}
    borderWidth={1} borderColor="#e0e0e0"
    padding={12} marginBottom={12}
  >
    <XStack justifyContent="space-between" alignItems="center" marginBottom={8}>
      <YStack>
        <Text fontWeight="700" fontSize={14}>Order #{String(order.id).slice(0, 8)}</Text>
        <Text fontSize={11} color="#888">{formatLocalDate(order.createdAt)}</Text>
      </YStack>
      <View backgroundColor="#e8f5e9" paddingHorizontal={8} paddingVertical={2} borderRadius={12}>
        <Text fontSize={11} fontWeight="600" color="#2e7d32">{order.status}</Text>
      </View>
    </XStack>
    <YStack gap={8} marginBottom={8}>
      {(order.items || []).map((item) => (
        <LocalOrderLineRow key={item.key} item={item} />
      ))}
    </YStack>
    {order.address ? (
      <Text fontSize={12} color="#555" marginBottom={6}>
        Deliver to: {order.address.full_name}, {[order.address.address_1, order.address.city].filter(Boolean).join(', ')}
      </Text>
    ) : null}
    <XStack justifyContent="space-between" marginTop={6} paddingTop={6} borderTopWidth={1} borderTopColor="#f0f0f0">
      <Text fontSize={13} color="#666">
        {(order.items || []).length} item{(order.items || []).length === 1 ? '' : 's'}
      </Text>
      <Text fontSize={14} fontWeight="700">{order.total ?? ''}</Text>
    </XStack>
  </View>
);

// ── Main screen ─────────────────────────────────────────────────────────────
const MyOrders = () => {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const localOrders     = useSelector((state) => state.auth?.orders ?? []);
  const [serverOrders, setServerOrders] = useState(null); // null = not yet fetched
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const result = await getOrders();
      if (cancelled) return;
      if (result.success && Array.isArray(result.orders)) {
        setServerOrders(result.orders);
      } else {
        setServerOrders(null);
      }
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  // Decide which data to show:
  //  - authenticated + server fetch succeeded → server orders
  //  - otherwise → local Redux orders (offline / not authenticated)
  const useServer  = serverOrders !== null;
  const orders     = useServer ? serverOrders : localOrders;
  const isEmpty    = orders.length === 0;

  if (loading) {
    return (
      <View flex={1} alignItems="center" justifyContent="center" backgroundColor="#f7f7f7">
        <ActivityIndicator size="large" color="#febf00" />
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View flex={1} justifyContent="center" alignItems="center" backgroundColor="#f7f7f7">
        <NoData text="No orders yet" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: '#f7f7f7', flexGrow: 1 }}>
      {useServer
        ? orders.map((order) => <ServerOrderCard key={order.order_id} order={order} />)
        : orders.map((order) => <LocalOrderCard  key={order.id}       order={order} />)}
    </ScrollView>
  );
};

export default MyOrders;
