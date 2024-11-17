'use client';
import React from 'react';
import RegisterForm from '../../components/Registerform';
import { View } from 'tamagui';

const formFields = [
    { label: 'First Name', type: 'text', validation: 'required' },
    { label: 'Last Name', type: 'text', validation: 'required' },
    { label: 'Email', type: 'text', validation: 'required' },
    { label: 'Password', type: 'text', validation: 'required' },
    {
        label: 'Role',
        type: 'selectbox',
        options: [
            { label: 'Admin', value: 'admin' },
            { label: 'User', value: 'user' },
        ],
        validation: 'required',
    },
];

const Login = () => (
    <View flex={1} flexGrow={1} backgroundColor={'#ffffff'} paddingHorizontal="$4">
        <RegisterForm formFields={formFields} />
    </View>
);

export default Login;
