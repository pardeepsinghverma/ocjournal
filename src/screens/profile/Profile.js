import { Text, View } from 'tamagui';
import { ChevronRight } from '@tamagui/lucide-icons';
import { useNavigation } from '@react-navigation/native';

const links = [
    {
        id: 1,
        name: 'My Orders',
        description: 'View your orders',
        icon: 'user',
        screen: 'myorders',
    },
    {
        id: 2,
        name: 'My Addresses',
        description: 'View your addresses',
        icon: 'user',
        screen: 'myaddresses',
    },
    {
        id: 3,
        name: 'My Profile',
        description: 'View your profile',
        icon: 'user',
        screen: 'myprofile',
    }
];

const Element = ({ link, OnPress }) => {
    return (
        <View onPress={() => {OnPress(link?.screen)}} flexDirection="column" paddingVertical={10} borderBottomColor={'#00000040'} borderBottomWidth={0.5}>
            <View flexDirection="row" alignItems='center' gap={10}>
                <Text fontSize={18}>{link?.name}</Text>
                <ChevronRight size={16} opacity={0.6} />
            </View>
            <Text fontSize={12}>{link?.description}</Text>
        </View>
    );
};

const Profile = () => {
    const navigation = useNavigation();
    const OnPress = (screen) => {
        navigation.navigate(screen);
    };
    return (
        <View flex={1} gap={0} flexDirection="column" justifyContent='start' paddingHorizontal={16} paddingVertical={10}>
            {links.map((link) => (
                <Element key={link.id} OnPress={OnPress} link={link} />
            ))}
        </View>
    );
};

export default Profile;
