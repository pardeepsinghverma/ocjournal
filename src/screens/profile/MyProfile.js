import React, { useLayoutEffect } from 'react';
import { View, Button, Text, YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import RegisterForm from '../../components/Registerform';
import { logout, updateUser } from '../../store/authSlice';

const formFields = [
    { label: 'First Name', type: 'text', validation: 'required' },
    { label: 'Last Name', type: 'text', validation: 'required' },
    { label: 'Email', type: 'text', validation: 'required' },
    { label: 'Password', type: 'text' },
];

const MyProfile = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    useLayoutEffect(() => {
        if (!isAuthenticated) {
            navigation.replace ? navigation.replace('login') : navigation.navigate('login');
        }
    }, [isAuthenticated, navigation]);

    if (!isAuthenticated) {
        return (
            <View flex={1} padding={20} backgroundColor="#ffffff">
                <Text>Redirecting to login...</Text>
            </View>
        );
    }

    const initialValues = {
        first_name: user?.first_name ?? '',
        last_name: user?.last_name ?? '',
        email: user?.email ?? '',
        password: '',
    };

    const handleSave = (values) => {
        dispatch(updateUser({
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
        }));
        alert('Profile updated');
    };

    const handleLogout = () => {
        dispatch(logout());
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate('main');
        }
    };

    return (
        <View flex={1} backgroundColor="#ffffff">
            <RegisterForm
                formFields={formFields}
                initialValues={initialValues}
                onSuccess={handleSave}
                submitLabel="Save Changes"
            />
            <YStack paddingHorizontal="$4" paddingBottom="$4">
                <Button backgroundColor="#d32f2f" color="#ffffff" onPress={handleLogout}>Logout</Button>
            </YStack>
        </View>
    );
};

export default MyProfile;
