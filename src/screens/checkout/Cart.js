import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Fieldset, Image, Input, Label, ScrollView, Spinner, Text, XStack, YStack } from 'tamagui';
import NoData from '../../components/NoData';
import { Croissant, Cross, Option, X } from '@tamagui/lucide-icons';
import MTitle from '../../components/MTitle';
import SelectDropdown from '../../components/SelectDropdown';
import BottomDialog from '../../components/MBottomDailog';
import Addresses from '../../components/Addresses';

const Cart = () => {
    const navigation = useNavigation();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const Removeitem = (id) => {
        console.log('Remove item:', id);
        const newItems = items.filter((item) => item.id !== id);
        setItems(newItems);
    };

    const CartGroup = ({ item }) => {
        return (
            <YStack gap={10} flex={1} padding={10} borderColor={'#00000020'} borderRadius={8} borderStyle='solid' borderWidth={1}>
                <XStack gap={10} flex={1} overflow="hidden">
                    <Image borderRadius={8} source={{ uri: item.image }} objectFit='cover' backgroundColor={'white'} width={120} height={140} />
                    <YStack gap={2} flex={1}>
                        <Text color={'grey'}>{item.name}</Text>
                        <Text fontSize={12} color={'green'}>{item.stock}</Text>
                    </YStack>
                    
                    <X size={24} color={'grey'} onPress={() => Removeitem(item.id)} />
                </XStack>
                <XStack gap={10} justifyContent='space-between' alignItems='center'>
                    <XStack gap={10}>
                        {item.options.map((optionGroup, index) => {
                            const selectedValue = item.selectedOption?.[0]?.[optionGroup.label.toLowerCase()];
                            return (
                                <SelectDropdown
                                    key={index}
                                    options={optionGroup.options}
                                    selectedOption={selectedValue}
                                    onSelect={(val) => {
                                        console.log(`Selected ${optionGroup.label}:`, val);
                                        // Update logic for selectedOption if needed
                                    }}
                                />
                            );
                        })}
                    </XStack>
                    <YStack gap={0} >
                        <XStack alignItems='baseline' justifyContent='flex-end' gap={5} flexDirection='row'>
                            <Text fontSize={16}>{item.price}</Text>
                            <Text fontSize={12} color={'grey'} textDecorationLine='line-through' >{item.price + 20}</Text>
                        </XStack>
                        <Text fontSize={13} color={'green'} >You Saved $20</Text>
                    </YStack>
                </XStack>
            </YStack>
        );
    };
    

    const cartItems = [
        {
            id: 1,
            name: 'Anxiety Printed Black Tshirt | Printed Half Sleeve Round Neck Funny Hindi Text Graphic T Shirt/Top for Men and Women',
            price: 100,
            image: 'https://veirdo.in/cdn/shop/files/Artboard8.png?v=1724158576',
            stock: 'In Stock',
            options: [
                {
                    label: 'Size',
                    options: [
                        {
                            value: 'S',
                            label: 'Small',
                            price: 0,
                            prefix: '+',
                        },
                        {
                            value: 'M',
                            label: 'Medium',
                            price: 10,
                            prefix: '+',
                        },
                        {
                            value: 'L',
                            label: 'Large',
                            price: 20,
                            prefix: '+',
                        },
                    ]
                },
                {
                    label: 'Color',
                    options: [
                        {
                            value: 'red',
                            label: 'Red',
                            price: 0,
                            prefix: '+',
                        },
                        {
                            value: 'blue',
                            label: 'Blue',
                            price: 10,
                            prefix: '+',
                        },
                        {
                            value: 'green',
                            label: 'Green',
                            price: 20,
                            prefix: '+',
                        },
                    ]
                }
            ],
            selectedOption: [
                {
                    size: 'M',
                    color: 'blue',
                },
            ],
            quantity: 1,
        },
        {
            id: 2,
            name: 'Awack Stretchable Denim Color Mid Rise Relaxed Fit Curved Pocket Sturdy Stitching Full Length Jeans for Men',
            price: 200,
            image: 'https://m.media-amazon.com/images/I/61IPkgLhpAL._SY741_.jpg',
            options: [
                {
                    label: 'Size',
                    options: [
                        {
                            value: 'S',
                            label: 'Small',
                            price: 0,
                            prefix: '+',
                        },
                        {
                            value: 'M',
                            label: 'Medium',
                            price: 10,
                            prefix: '+',
                        },
                        {
                            value: 'L',
                            label: 'Large',
                            price: 20,
                            prefix: '+',
                        },
                    ]
                },
                {
                    label: 'Color',
                    options: [
                        {
                            value: 'red',
                            label: 'Red',
                            price: 0,
                            prefix: '+',
                        },
                        {
                            value: 'blue',
                            label: 'Blue',
                            price: 10,
                            prefix: '+',
                        },
                        {
                            value: 'green',
                            label: 'Green',
                            price: 20,
                            prefix: '+',
                        },
                    ]
                },
            ],
            selectedOption: [
                {
                    size: 'M',
                    color: 'blue',
                },
            ],
            quantity: 2,
        },
    ];

    useEffect(() => {
        setItems(cartItems);
        setLoading(false);
    }, []);

    const Totals = [
        {
            title: 'Subtotal',
            value: '$300',
        },
        {
            title: 'Shipping',
            value: '$20',
        },
        {
            title: 'Tax',
            value: '$10',
        },
        {
            title: 'Total',
            value: '$330',
        },
    ]
        
    const TotalsItem = ({ title, value }) => {
        return (
            <XStack justifyContent='space-between' borderBottomWidth={1} borderBottomColor={'#00000020'} borderStyle='solid' gap={10} paddingVertical={10}>
                <Text fontSize={14} fontWeight={600}>{ title }</Text>
                <Text fontSize={14} fontWeight={600}>{ value }</Text>
            </XStack>
        );
    }

    return loading ?
            <XStack margin={40} justifyContent='center'>                
                <Spinner size='large' color={"$yellow"} />
            </XStack>
            :
            <>
                <ScrollView>
                    <YStack gap={10}>
                        <Card>
                            <YStack gap={10} padding={10}>
                                {items.length === 0 && <NoData />}
                                {items.map(item => (
                                    <CartGroup key={item.id} item={item} />
                                ))}
                            </YStack>
                        </Card>
                        <Card>
                            <YStack gap={10} padding={10}>
                                <Text fontSize={16}>Price Summary</Text>
                                <View>
                                    {
                                        Totals.map((total, index) => (
                                            <TotalsItem key={index} title={total.title} value={total.value} />
                                        ))
                                    }
                                </View>
                            </YStack>
                        </Card>  
                        <Card>
                            <YStack gap={10} padding={10}>
                                <Text fontSize={16}>Promo Code</Text>
                                <XStack gap={10}>
                                    <Label placeholder='Enter Promo Code' />
                                    <Button>Apply</Button>
                                </XStack>
                            </YStack>
                        </Card>

                        <Card>
                            <YStack gap={10} padding={10}>
                                <XStack gap={10} justifyContent='space-between'>
                                    <Text fontSize={16}>Shipping Address</Text>
                                    <Addresses />
                                </XStack>
                                <SelectDropdown
                                    options={[
                                        {
                                            value: 'home',
                                            label: 'Home',
                                        },
                                        {
                                            value: 'office',
                                            label: 'Office',
                                        },
                                    ]}
                                    selectedOption='home'
                                    onSelect={(val) => {
                                        console.log('Selected Address:', val);
                                    }}
                                />
                            </YStack>
                        </Card>

                        <Card>
                            <YStack gap={10} padding={10}>
                                <XStack gap={10} justifyContent='space-between'>
                                    <Text fontSize={16}>Payment Address</Text>
                                    <Addresses />
                                </XStack>
                                <SelectDropdown
                                    options={[
                                        {
                                            value: 'home',
                                            label: 'Home',
                                        },
                                        {
                                            value: 'office',
                                            label: 'Office',
                                        },
                                    ]}
                                    selectedOption='home'
                                    onSelect={(val) => {
                                        console.log('Selected Address:', val);
                                    }}
                                />
                            </YStack>
                        </Card>

                        <Card>
                            <YStack gap={10} padding={10}>
                                <Text fontSize={16}>Payment Method</Text>
                                <SelectDropdown
                                    options={[
                                        {
                                            value: 'card',
                                            label: 'Credit Card',
                                        },
                                        {
                                            value: 'paypal',
                                            label: 'Paypal',
                                        },
                                    ]}
                                    selectedOption='card'
                                    onSelect={(val) => {
                                        console.log('Selected Payment Method:', val);
                                    }}
                                />
                            </YStack>
                            <YStack gap={10} padding={10}>
                                <Text fontSize={16}>Shipping Method</Text>
                                <SelectDropdown
                                    options={[
                                        {
                                            value: 'card',
                                            label: 'Credit Card',
                                        },
                                        {
                                            value: 'paypal',
                                            label: 'Paypal',
                                        },
                                    ]}
                                    selectedOption='card'
                                    onSelect={(val) => {
                                        console.log('Selected Payment Method:', val);
                                    }}
                                />
                            </YStack>
                        </Card>


                        
                    </YStack>
                </ScrollView>
                <XStack gap={10} padding={10} justifyContent='space-between' alignItems='center' elevation={4} elevationAndroid={4}>
                    <Text fontSize={18}>Total: $330</Text>
                    <Button backgroundColor={'green'} color={'white'} onPress={() => {
                        navigation.navigate('checkoutNavigation', { screen: 'address' });
                    }}>
                        Proceed to Checkout
                    </Button>
                </XStack>
            </>
}

export default Cart