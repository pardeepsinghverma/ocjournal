import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Clock,
  Gift,
  Headphones,
  RefreshCw,
  ShieldCheck,
  Star,
  Truck,
  Zap,
} from '@tamagui/lucide-icons';
import { useNavigation } from '@react-navigation/native';
import { RichText } from '../Slider/RichText';

// Map common Journal3 "Site Features" titles to a recognisable Lucide icon.
// The schema carries no icon-image URL — the web theme uses admin-chosen SVGs.
// We keyword-match on the item title so the four demo blocks get sensible icons,
// and fall back to Star for anything unrecognised.
const ICON_MAP = [
  { re: /ship|deliver|truck|dispatch/i, Icon: Truck },
  { re: /secur|safe|protect|payment/i, Icon: ShieldCheck },
  { re: /return|refund|exchange|easy/i, Icon: RefreshCw },
  { re: /24h|support|service|help|headphone|contact/i, Icon: Headphones },
  { re: /gift|reward|bonus/i, Icon: Gift },
  { re: /fast|speed|quick|express/i, Icon: Zap },
  { re: /clock|time|hour/i, Icon: Clock },
];

const resolveIcon = (title) => {
  if (!title) {
    return Star;
  }
  for (const entry of ICON_MAP) {
    if (entry.re.test(title)) {
      return entry.Icon;
    }
  }
  return Star;
};

// Mirror navigateTo from SlideItem.js — resolve link objects to named routes.
const navigateTo = (navigation, link) => {
  if (!link || !link.type || !link.id) {
    return;
  }
  if (link.type === 'product' && link.id) {
    navigation.navigate('productView', { productId: link.id });
  } else if (link.type === 'category' && link.id) {
    navigation.navigate('catalog', { categoryId: link.id });
  }
  // External href URLs are a no-op — no deep-link handler wired yet.
};

const InfoBlockItem = ({ item, scheme, style: styleProp }) => {
  const navigation = useNavigation();
  const Icon = resolveIcon(item.title);

  const hasLink = !!(
    item.link &&
    (item.link.type || item.link.href)
  );
  const hasButton = !!(item.button && item.buttonTextNew);

  const handlePress = () => navigateTo(navigation, item.link);
  const handleButtonPress = () => navigateTo(navigation, item.buttonLink);

  return (
    <TouchableOpacity
      activeOpacity={hasLink ? 0.75 : 1}
      onPress={hasLink ? handlePress : undefined}
      style={[styles.container, { backgroundColor: scheme.surface }, styleProp]}
    >
      {/* Icon circle */}
      <View style={[styles.iconWrap, { borderColor: scheme.accent }]}>
        <Icon size={28} color={scheme.accent} />
      </View>

      {/* Text content */}
      <View style={styles.textWrap}>
        {!!item.title && (
          <RichText
            html={item.title}
            color={scheme.text}
            fontSize={14}
            fontWeight="700"
          />
        )}
        {!!item.content && (
          <RichText
            html={item.content}
            color={scheme.muted}
            fontSize={12}
            fontWeight="400"
            style={styles.description}
          />
        )}
        {!!item.counter && (
          <RichText
            html={item.counter}
            color={scheme.accent}
            fontSize={11}
            fontWeight="600"
            style={styles.counter}
          />
        )}
        {hasButton && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleButtonPress}
            style={[styles.button, { borderColor: scheme.accent }]}
          >
            <RichText
              html={item.buttonTextNew}
              color={scheme.accent}
              fontSize={12}
              fontWeight="600"
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  textWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    marginTop: 4,
  },
  counter: {
    marginTop: 4,
  },
  button: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
});

export default InfoBlockItem;
