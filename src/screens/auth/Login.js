'use client';
import React from 'react';
import RegisterForm from '../../components/Registerform';
import { View } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/authSlice';

const formFields = [
    { label: 'First Name', type: 'text', validation: 'required' },
    { label: 'Last Name', type: 'text', validation: 'required' },
    { label: 'Email', type: 'text', validation: 'required' },
    { label: 'Password', type: 'text', validation: 'required' },
    // {
    //     label: 'Role',
    //     type: 'selectbox',
    //     options: [
    //         { label: 'Admin', value: 'admin' },
    //         { label: 'User', value: 'user' },
    //     ],
    //     validation: 'required',
    // },
];

const Login = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const handleSuccess = (values) => {
        dispatch(setUser({
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
        }));
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate('main');
        }
    };

    return (
        <View flex={1} flexGrow={1} backgroundColor={'#ffffff'} paddingHorizontal="$4">
            <RegisterForm formFields={formFields} onSuccess={handleSuccess} />
        </View>
    );
};

export default Login;
