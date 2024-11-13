'use client'
import React from 'react'
import RegisterForm from '../../components/Registerform'
import { View } from 'tamagui';

const Login = () => {
    const formFields = [
        {
            label: 'First Name',
            type: 'text',
        },
        {
            label: 'Last Name',
            type: 'text',
        },
        {
            label: 'Email',
            type: 'text',
        },
        {
            label: 'Password',
            type: 'text',
        },
        {
            label
                : 'Role',
            type: 'selectbox',
            options: [
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' },
            ],
        },
    ];
    return (
        <View flex={1} flexGrow={1} backgroundColor={'#ffffff'}>
            <RegisterForm formFields={formFields} />
        </View>
    )
}

export default Login