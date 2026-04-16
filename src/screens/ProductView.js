import React, { useState, useRef, useMemo, useLayoutEffect } from 'react';
import { Dimensions, ScrollView } from 'react-native';
import MTitle from '../components/MTitle';
import Icon from 'react-native-vector-icons/FontAwesome';
import DescriptionAccordion from '../components/DescriptionAccordion';
import { Button, Image, Paragraph, Sheet, Text, View, XStack, YStack } from 'tamagui';
import RenderProductOptions from '../components/options';
import Carousel from 'react-native-reanimated-carousel';
import productData from './../data/productView.json';
import { Heart, Star, TableOfContents, X } from '@tamagui/lucide-icons';
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

// Component for the Product Image Carousel to isolate re-renders and fix Reanimated warnings
const ProductImageCarousel = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  return (
    <>
      <Carousel
        ref={carouselRef}
        loop={true}
        width={Dimensions.get('window').width}
        height={540}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 10,
          parallaxAdjacentItemScale: 1,
        }}
        spacing={10}
        snapEnabled={true}
        pagingEnabled={true}
        autoPlayInterval={2000}
        autoPlay={false}
        quickSnap={true}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        onSnapToItem={(index) => setActiveIndex(index)}
        windowSize={3}
        data={slides}
        renderItem={({ item }) => (
          <Image 
            src={item.image} 
            style={{ width: Dimensions.get('window').width, height: '100%' }} 
          />
        )}
      />

      {/* Pagination Dots */}
      <XStack 
        width="100%" 
        justifyContent="center" 
        gap={6}
        paddingVertical={15}
        backgroundColor="#ffffff"
      >
        {slides.map((_, index) => (
          <View 
            key={index}
            onPress={() => carouselRef.current?.scrollTo({ index, animated: true })}
            width={activeIndex === index ? 20 : 8}
            height={8}
            borderRadius={4}
            backgroundColor={activeIndex === index ? '#000000' : '#00000040'}
          />
        ))}
      </XStack>
    </>
  );
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

  const commitAddToCart = (options, { goToCart = false } = {}) => {
    dispatch(addToCart({
      productId: productId ?? product.product_id,
      name: product.heading_title,
      image: product.images?.[0]?.image || product.images?.[0]?.popup,
      price: product.special || product.price,
      selectedOptions: options,
      quantity: 1,
    }));
    if (goToCart) {
      navigation.navigate('cart');
    }
  };

  const handleAddToCart = ({ goToCart = false } = {}) => {
    const missing = getMissingRequiredOptions(product.options, selectedOptions);
    if (missing.length > 0) {
      setPendingAction({ goToCart });
      setOptionsSheetOpen(true);
      return;
    }
    commitAddToCart(selectedOptions, { goToCart });
  };

  const handleSheetConfirm = () => {
    commitAddToCart(selectedOptions, pendingAction || {});
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
          <View 
            padding={8} 
            borderRadius={20} 
            onPress={() => setIsWishlist(!isWishlist)}
          >
            <Heart 
              size={26} 
              fill={isWishlist ? '#ff0000' : 'transparent'} 
              color={isWishlist ? '#ff0000' : '#000000'} 
            />
          </View>
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
          <RenderProductOptions
            options={product.options}
            selectedOptions={selectedOptions}
            handleOptionChange={handleOptionChange}
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
      <XStack 
        paddingHorizontal={14} 
        paddingVertical={12} 
        backgroundColor={'#ffffff'} 
        borderTopWidth={1} 
        borderTopColor={'#eeeeee'}
        justifyContent="space-between" 
        alignItems="center"
        gap={12}
        elevation={10}
        shadowColor="#000"
        shadowOffset={{ width: 0, height: -2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
      >
        <Button 
          icon={<Heart size={20} fill={isWishlist ? '#ff0000' : 'transparent'} color={isWishlist ? '#ff0000' : '#000000'} />} 
          circular 
          backgroundColor={'#f5f5f5'} 
          borderWidth={0}
          onPress={() => setIsWishlist(!isWishlist)}
        />
        <XStack flex={1} gap={10}>
          <Button
            flex={1}
            backgroundColor={'#000000'}
            color="#ffffff"
            borderRadius={10}
            fontWeight="600"
            onPress={() => handleAddToCart()}
          >
            Add to Cart
          </Button>
          <Button
            flex={1}
            backgroundColor={'#febf00'}
            color="#000000"
            borderRadius={10}
            fontWeight="600"
            onPress={() => handleAddToCart({ goToCart: true })}
          >
            Buy Now
          </Button>
        </XStack>
      </XStack>

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
        <Sheet.Frame padding="$4" backgroundColor="#ffffff">
          <XStack justifyContent="space-between" alignItems="center" marginBottom={10}>
            <Text fontSize={16} fontWeight="700">
              {missingInSheet.length > 0
                ? `Select ${missingInSheet.map((o) => o.name).join(' & ')}`
                : 'Confirm options'}
            </Text>
            <View onPress={() => setOptionsSheetOpen(false)}>
              <X size={22} color="#000" />
            </View>
          </XStack>

          <ScrollView style={{ maxHeight: 360 }}>
            <RenderProductOptions
              options={product.options}
              selectedOptions={selectedOptions}
              handleOptionChange={(name, value) => setSelectedOptions((prev) => ({ ...prev, [name]: value }))}
            />
          </ScrollView>

          <Button
            marginTop={16}
            backgroundColor={canConfirmInSheet ? '#febf00' : '#f0e1a8'}
            color="#000000"
            borderRadius={10}
            fontWeight="700"
            disabled={!canConfirmInSheet}
            onPress={handleSheetConfirm}
          >
            {`ADD TO BAG ${product.special || product.price}`}
          </Button>
        </Sheet.Frame>
      </Sheet>
    </View>
  );
};

export default ProductView;
