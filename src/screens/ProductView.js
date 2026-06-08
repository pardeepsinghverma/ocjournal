import React, { useEffect, useState, useRef, useMemo, useLayoutEffect } from 'react';
import { Dimensions, Pressable, ScrollView } from 'react-native';
import MTitle from '../components/MTitle';
import Icon from 'react-native-vector-icons/FontAwesome';
import DescriptionAccordion from '../components/DescriptionAccordion';
import { Button, Image, Paragraph, Sheet, Text, View, XStack, YStack } from 'tamagui';
import RenderProductOptions from '../components/options';
import OptionsSelector from '../components/OptionsSelector';
import Confetti from '../components/Confetti';
import { formatPrice, parsePrice } from '../utils/formatPrice';
import { colors } from '../utils/theme';
import ProductImageCarousel from '../components/Slider/ProductImageCarousel';
import productData from './../data/productView.json';
import { Heart, ShoppingBag, Star, TableOfContents, X } from '@tamagui/lucide-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import HeaderActions from '../components/HeaderActions';
import { addToCart } from '../store/cartSlice';

const isOptionRequired = (option) =>
  option?.required === true || option?.required === 1 || option?.required === '1';

const getMissingRequiredOptions = (options, selected) => {
  if (!Array.isArray(options)) return [];
  return options.filter((opt) => {
    if (!isOptionRequired(opt)) return false;
    const value = selected?.[opt.name];
    if (Array.isArray(value)) return value.length === 0;
    return value === undefined || value === null || value === '';
  });
};

// Helper to strip HTML from product descriptions
const stripHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n') // Convert <br> to \n
    .replace(/<\/p>/gi, '\n\n')    // Convert </p> to double \n
    .replace(/<[^>]*>?/gm, '')     // Strip remaining tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\r\n/g, ' ')
    .trim();
};

const ProductView = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const productId = route.params?.productId;
  const product = productData;
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isWishlist, setIsWishlist] = useState(false);
  const [optionsSheetOpen, setOptionsSheetOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [addedSignature, setAddedSignature] = useState(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [barSize, setBarSize] = useState({ width: 0, height: 0 });

  const hasSale = !!product.special && product.special !== product.price;
  const saleValue = parsePrice(hasSale ? product.special : product.price);
  const listValue = hasSale ? parsePrice(product.price) : 0;
  const savings = listValue > saleValue ? listValue - saleValue : 0;

  const optionSignature = useMemo(() => {
    const keys = Object.keys(selectedOptions || {}).sort();
    return keys.map((k) => {
      const value = selectedOptions[k];
      return `${k}:${Array.isArray(value) ? value.sort().join(',') : value ?? ''}`;
    }).join('|');
  }, [selectedOptions]);

  const justAdded = addedSignature !== null && addedSignature === optionSignature;

  useEffect(() => {
    if (!confettiTrigger) return undefined;
    const t = setTimeout(() => setConfettiTrigger(0), 2600);
    return () => clearTimeout(t);
  }, [confettiTrigger]);

  const commitAddToCart = (options, signature) => {
    dispatch(addToCart({
      productId: productId ?? product.product_id,
      name: product.heading_title,
      subtitle: product.model || product.sku || null,
      image: product.images?.[0]?.image || product.images?.[0]?.popup,
      price: hasSale ? product.special : product.price,
      listPrice: hasSale ? product.price : null,
      selectedOptions: options,
      quantity: 1,
    }));
    setAddedSignature(signature);
    setConfettiTrigger(Date.now());
  };

  const handleAddToCart = () => {
    if (justAdded) {
      navigation.navigate('cart');
      return;
    }
    const missing = getMissingRequiredOptions(product.options, selectedOptions);
    if (missing.length > 0) {
      setPendingAction({});
      setOptionsSheetOpen(true);
      return;
    }
    commitAddToCart(selectedOptions, optionSignature);
  };

  const handleSheetConfirm = () => {
    commitAddToCart(selectedOptions, optionSignature);
    setOptionsSheetOpen(false);
    setPendingAction(null);
  };

  const missingInSheet = getMissingRequiredOptions(product.options, selectedOptions);
  const canConfirmInSheet = missingInSheet.length === 0;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderActions 
          actions={['share', 'wishlist', 'cart']}
          shareData={{
            title: product.heading_title,
            message: `Check out ${product.heading_title} on OC Journal`,
            url: `https://yourstore.com/product/${productId || product.product_id || ''}`
          }}
        />
      ),
    });
  }, [navigation, isWishlist, product.heading_title]);

  // Memoize slides to prevent unnecessary carousel re-renders
  const slides = useMemo(() => {
    if (product.images && product.images.length > 0) {
      return product.images.map(img => ({ 
        image: img.image || img.popup, 
        text: product.heading_title 
      }));
    }
    return [{ 
      image: 'https://img-cdn.pixlr.com/image-generator/demo/pixlr-image-generator-example-3.webp', 
      text: product.heading_title 
    }];
  }, [product.images, product.heading_title]);

  // Function to handle option selection
  const handleOptionChange = (optionLabel, value) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [optionLabel]: value,
    }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView style={{ flex: 1 }}>
        <ProductImageCarousel slides={slides} />

        <XStack gap={5} justifyContent="flex-end" marginBottom={26} marginTop={-90} paddingRight={20} zIndex={20}>
          <Pressable
            onPress={() => setIsWishlist(!isWishlist)}
            style={{ padding: 8, borderRadius: 20 }}
          >
            <View width={26} height={26}>
              <View position="absolute" top={-0.5} left={-0.5} opacity={0.5}>
                <Heart size={28} color="#000000" />
              </View>
              <Heart
                size={26}
                fill={isWishlist ? '#ff0000' : 'transparent'}
                color={isWishlist ? '#ff0000' : '#ffffff'}
              />
            </View>
          </Pressable>
        </XStack>


        <YStack padding={14} marginTop={0}>
          <XStack gap={5} justifyContent="space-between" marginBottom={10}>
            <MTitle title={product.heading_title} marginBottom={0} />
          </XStack>

          <YStack gap={5}>
            {/* <Paragraph fontSize={12} lineHeight={16}>
              {stripHtml(product.description)}
            </Paragraph> */}
            <XStack gap={5} alignItems="center">
              <Paragraph
                mb={6}
                numberOfLines={1}
                fontSize={18}
                fontWeight="bold"
                color="#000000"
              >
                {product.special ? product.special : product.price}
              </Paragraph>

              {product.special && (
                <Paragraph
                  mb={6}
                  numberOfLines={1}
                  fontSize={18}
                  textDecorationLine="line-through"
                  color="#888"
                >
                  {product.price}
                </Paragraph>
              )}
            </XStack>
            <Paragraph fontSize={12} lineHeight={12}>Inclusive All taxes</Paragraph>
          </YStack>
        </YStack>

        <YStack padding={14} marginBottom={10}>
          <OptionsSelector
            options={product.options}
            selectedOptions={selectedOptions}
            handleOptionChange={handleOptionChange}
            onSizeGuidePress={() => console.log('Open size guide')}
            onNotifyPress={() => console.log('Notify me tapped')}
          />
        </YStack>
        
        <YStack padding={14} marginBottom={0}>
          <DescriptionAccordion 
            title={
              <XStack alignItems="center" gap={12}>
                <View
                  padding={4}
                  backgroundColor="#00000010"
                  borderRadius={4}
                >
                  <TableOfContents size={20} />
                </View>
                <Text fontSize={16}>Product Description</Text>
              </XStack>
            } 
            content={stripHtml(product.description)} 
          />
        </YStack>

        {/* Product Reviews Section */}
        <YStack padding={14} marginBottom={0} gap={20}>
          <XStack justifyContent="space-between" alignItems="center">
            <MTitle title="Product Reviews" marginBottom={0} />
            <XStack alignItems="center" gap={4}>
              <Star size={16} fill="#febf00" color="#febf00" />
              <Text fontWeight="bold">{product.rating || '4.5'}</Text>
              <Text color="#888">({product.reviews?.length || 0})</Text>
            </XStack>
          </XStack>

          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((item, index) => (
              <YStack key={item.id} gap={10} borderBottomWidth={index === product.reviews.length - 1 ? 0 : 1} borderBottomColor="#f0f0f0" paddingBottom={15}>
                <XStack alignItems="center" gap={10}>
                  <Image 
                    src={item.avatar} 
                    style={{ width: 40, height: 40, borderRadius: 20 }} 
                  />
                  <YStack>
                    <Text fontWeight="bold">{item.author}</Text>
                    <XStack gap={2}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={12} 
                          fill={star <= item.rating ? "#febf00" : "transparent"} 
                          color="#febf00" 
                        />
                      ))}
                    </XStack>
                  </YStack>
                </XStack>

                <Paragraph numberOfLines={2} fontSize={14} color="#333">
                  {item.text}
                </Paragraph>

                {item.images && item.images.length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                    {item.images.map((img, imgIndex) => (
                      <Image 
                        key={imgIndex}
                        src={img}
                        style={{ 
                          width: (Dimensions.get('window').width - 68) / 3.4, 
                          height: 100, 
                          borderRadius: 8,
                          backgroundColor: '#f5f5f5'
                        }} 
                      />
                    ))}
                  </ScrollView>
                )}
              </YStack>
            ))
          ) : (
            <Text color="#888">No reviews yet.</Text>
          )}
        </YStack>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View
        backgroundColor={justAdded ? colors.coupon : colors.surface}
        borderTopWidth={justAdded ? 0 : 1}
        borderTopColor={colors.borderSoft}
        borderTopLeftRadius={justAdded ? 16 : 0}
        borderTopRightRadius={justAdded ? 16 : 0}
        elevation={10}
        shadowColor="#000"
        shadowOffset={{ width: 0, height: -2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        paddingTop={justAdded ? 14 : 10}
        paddingHorizontal={12}
        paddingBottom={12}
        overflow="hidden"
        onLayout={(e) => setBarSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
      >
        {justAdded ? (
          <View alignItems="center" marginBottom={10}>
            <Text color="#ffffff" fontSize={16} fontWeight="800">
              Yay! FREE shipping unlocked
            </Text>
            {savings > 0 ? (
              <Text color="#ffffff" fontSize={13} marginTop={2}>
                You are saving {formatPrice(savings)} on this item
              </Text>
            ) : null}
          </View>
        ) : null}

        <Button
          height={52}
          backgroundColor={colors.brand}
          color={colors.text}
          borderRadius={6}
          fontWeight="800"
          icon={<ShoppingBag size={18} color={colors.text} />}
          onPress={handleAddToCart}
        >
          {justAdded ? 'ITEM ADDED TO BAG' : 'ADD TO BAG'}
        </Button>

        <Confetti
          trigger={confettiTrigger}
          width={barSize.width}
          height={barSize.height}
        />
      </View>

      <Sheet
        modal
        open={optionsSheetOpen}
        onOpenChange={(open) => {
          setOptionsSheetOpen(open);
          if (!open) setPendingAction(null);
        }}
        snapPointsMode="fit"
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame padding="$4" backgroundColor={colors.surface}>
          <XStack justifyContent="space-between" alignItems="center" marginBottom={16}>
            <Text fontSize={16} fontWeight="700" color={colors.text}>
              {missingInSheet.length > 0
                ? `Select ${missingInSheet[0].name}`
                : 'Confirm options'}
            </Text>
            <View onPress={() => setOptionsSheetOpen(false)}>
              <X size={22} color={colors.text} />
            </View>
          </XStack>

          <View
            height={1}
            backgroundColor={colors.borderSoft}
            marginBottom={16}
          />

          <ScrollView style={{ maxHeight: 420 }}>
            <OptionsSelector
              options={product.options}
              selectedOptions={selectedOptions}
              handleOptionChange={(name, value) =>
                setSelectedOptions((prev) => ({ ...prev, [name]: value }))
              }
              onSizeGuidePress={() => console.log('Open size guide')}
              onNotifyPress={() => console.log('Notify me tapped')}
            />
          </ScrollView>

          <View
            height={1}
            backgroundColor={colors.borderSoft}
            marginVertical={16}
          />

          <Button
            backgroundColor={canConfirmInSheet ? colors.brand : colors.brandSoft}
            color={colors.text}
            borderRadius={8}
            fontWeight="700"
            height={52}
            disabled={!canConfirmInSheet}
            onPress={handleSheetConfirm}
          >
            {`ADD TO BAG ${formatPrice(product.special || product.price)}`}
          </Button>
        </Sheet.Frame>
      </Sheet>
    </View>
  );
};

export default ProductView;
