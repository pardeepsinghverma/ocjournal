import React, { memo, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Plus } from '@tamagui/lucide-icons';
import { useNavigation } from '@react-navigation/native';
import { RichText } from './RichText';
import { getColorScheme } from './colorSchemes';

// The slide data carries hotspots but no x/y coordinates (the web theme positions
// them in the admin). We distribute up to three across the image at sensible spots
// that echo the web reference (top-centre, lower-left, lower-right).
const HOTSPOT_POS = [
  { top: '40%', left: '52%' },
  { top: '72%', left: '24%' },
  { top: '70%', left: '72%' },
];

const navigateTo = (navigation, { link, productId, categoryId } = {}) => {
  if (productId) return navigation.navigate('productView', { productId });
  if (categoryId) return navigation.navigate('catalog', { categoryId });
  if (link && typeof link === 'object') {
    if (link.type === 'product' && link.id) {
      return navigation.navigate('productView', { productId: link.id });
    }
    if (link.type === 'category' && link.id) {
      return navigation.navigate('catalog', { categoryId: link.id });
    }
  }
};

const Hotspot = ({ spot, position, scheme, open, onToggle }) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.hotspotWrap, position]} pointerEvents="box-none">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onToggle}
        style={[styles.hotspot, { borderColor: scheme.accent }]}
      >
        <Plus size={14} color={scheme.accent} />
      </TouchableOpacity>
      {open && !!spot.content && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            navigateTo(navigation, { productId: spot.product, link: spot.link })
          }
          style={styles.tooltip}
        >
          <RichText html={spot.content} color="#fff" muted="#cfcfcf" fontSize={12} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const ContentLayer = ({ layer, scheme }) => {
  const navigation = useNavigation();

  if (layer.kind === 'label') {
    return (
      <View style={styles.labelWrap}>
        <RichText
          html={layer.html}
          color={scheme.text}
          fontSize={13}
          fontWeight="600"
          style={styles.label}
        />
        <View style={[styles.divider, { backgroundColor: scheme.accent }]} />
      </View>
    );
  }

  if (layer.kind === 'heading') {
    return (
      <RichText
        html={layer.html}
        color={scheme.text}
        fontSize={26}
        fontWeight="800"
        numberOfLines={2}
        lineHeight={30}
        style={styles.heading}
      />
    );
  }

  if (layer.kind === 'price') {
    return (
      <RichText
        html={layer.html}
        color={scheme.text}
        muted={scheme.muted}
        fontSize={24}
        fontWeight="800"
        strikeSize={13}
        style={styles.price}
      />
    );
  }

  if (layer.kind === 'buttons') {
    return (
      <View style={styles.buttonRow}>
        {layer.buttons.map((button, i) => {
          const outline = String(button.variant || '').includes('OUTLINE');
          return (
            <TouchableOpacity
              key={i}
              activeOpacity={0.85}
              onPress={() => navigateTo(navigation, { link: button.link })}
              style={[
                styles.button,
                outline
                  ? { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: scheme.text }
                  : { backgroundColor: scheme.accent },
              ]}
            >
              <RichText
                html={button.text}
                color={outline ? scheme.text : '#FFFFFF'}
                fontSize={14}
                fontWeight="700"
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  // caption / generic text
  return <RichText html={layer.html} color={scheme.text} fontSize={14} style={styles.text} />;
};

export const SlideItem = memo(({ slide, imageHeight }) => {
  const navigation = useNavigation();
  const scheme = getColorScheme(slide.colorScheme);
  const [openHotspot, setOpenHotspot] = useState(null);
  const hotspots = slide.image?.hotspots || [];

  return (
    <View style={[styles.card, { backgroundColor: scheme.surface }]}>
      <View style={[styles.imageWrap, { height: imageHeight }]}>
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => navigateTo(navigation, { link: slide.link })}
          style={styles.imageTouch}
        >
          <Image
            source={{ uri: slide.image?.uri }}
            style={styles.image}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {hotspots.map((spot, i) => (
          <Hotspot
            key={i}
            spot={spot}
            position={HOTSPOT_POS[i] || HOTSPOT_POS[0]}
            scheme={scheme}
            open={openHotspot === i}
            onToggle={() => setOpenHotspot(openHotspot === i ? null : i)}
          />
        ))}
      </View>

      <View style={styles.content}>
        {slide.content.map((layer, i) => (
          <ContentLayer key={i} layer={layer} scheme={scheme} />
        ))}
      </View>
    </View>
  );
});

const RADIUS = 14;

const styles = StyleSheet.create({
  card: {
    height: '100%',
    width: '100%',
    borderRadius: RADIUS,
  },
  imageWrap: {
    width: '100%',
    zIndex: 2,
  },
  imageTouch: {
    flex: 1,
    borderTopLeftRadius: RADIUS,
    borderTopRightRadius: RADIUS,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  hotspotWrap: {
    position: 'absolute',
    width: 28,
    height: 28,
    marginLeft: -14,
    marginTop: -14,
    alignItems: 'center',
    zIndex: 10,
  },
  hotspot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  tooltip: {
    position: 'absolute',
    top: 34,
    width: 150,
    marginLeft: -61, // centre the 150-wide bubble on the 28-wide marker
    backgroundColor: 'rgba(20,20,20,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 30,
    elevation: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
    justifyContent: 'center',
  },
  labelWrap: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  label: {
    letterSpacing: 0.5,
  },
  divider: {
    marginTop: 6,
    width: 34,
    height: 2,
    borderRadius: 2,
  },
  heading: {
    marginBottom: 8,
  },
  price: {
    marginBottom: 16,
  },
  text: {
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  button: {
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
