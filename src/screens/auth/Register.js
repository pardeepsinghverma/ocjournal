import React, { useState } from 'react';
import {
    Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
    ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { register } from '../../api/account';

const Field = ({ label, value, onChangeText, secureTextEntry, keyboardType, autoCapitalize }) => (
    <View style={styles.fieldWrap}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType ?? 'default'}
            autoCapitalize={autoCapitalize ?? 'words'}
            autoCorrect={false}
            placeholderTextColor="#9ca3af"
        />
    </View>
);

const Register = () => {
    const navigation = useNavigation();
    const [form, setForm] = useState({
        firstname: '', lastname: '', email: '',
        telephone: '', password: '', confirm: '',
    });
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState(null);

    const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

    const handleRegister = async () => {
        const { firstname, lastname, email, telephone, password, confirm } = form;

        if (!firstname.trim() || !lastname.trim() || !email.trim() || !password) {
            setError('Please fill in all required fields.');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 4) {
            setError('Password must be at least 4 characters.');
            return;
        }

        setError(null);
        setLoading(true);
        const result = await register({ firstname, lastname, email, telephone, password });
        setLoading(false);

        if (!result.success) {
            const msg = typeof result.error === 'string' ? result.error
                : result.error?.warning || result.error?.message || 'Registration failed.';
            setError(msg);
            Alert.alert('Registration Failed', msg, [{ text: 'OK' }]);
            return;
        }

        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate('main');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Create Account</Text>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Field label="First Name *" value={form.firstname} onChangeText={set('firstname')} />
                <Field label="Last Name *"  value={form.lastname}  onChangeText={set('lastname')} />
                <Field label="Email *"      value={form.email}     onChangeText={set('email')}
                    keyboardType="email-address" autoCapitalize="none" />
                <Field label="Telephone"    value={form.telephone} onChangeText={set('telephone')}
                    keyboardType="phone-pad" autoCapitalize="none" />
                <Field label="Password *"   value={form.password}  onChangeText={set('password')}
                    secureTextEntry autoCapitalize="none" />
                <Field label="Confirm Password *" value={form.confirm} onChangeText={set('confirm')}
                    secureTextEntry autoCapitalize="none" />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="#1a1a1a" />
                        : <Text style={styles.buttonText}>Register</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.link}
                    onPress={() => navigation.navigate('login')}
                >
                    <Text style={styles.linkText}>
                        Already have an account?{' '}
                        <Text style={styles.linkBold}>Sign In</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    flex:           { flex: 1, backgroundColor: '#fff' },
    container:      { padding: 24, paddingBottom: 40 },
    title:          { fontSize: 26, fontWeight: '700', marginBottom: 24, color: '#1a1a1a', marginTop: 12 },
    error:          { color: '#e53e3e', marginBottom: 14, fontSize: 14, lineHeight: 20 },
    fieldWrap:      { marginBottom: 14 },
    label:          { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 5 },
    input:          {
        borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10,
        padding: 13, fontSize: 15, color: '#1a1a1a',
    },
    button:         {
        backgroundColor: '#febf00', borderRadius: 10,
        padding: 15, alignItems: 'center', marginTop: 10,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText:     { color: '#1a1a1a', fontWeight: '700', fontSize: 16 },
    link:           { marginTop: 20, alignItems: 'center' },
    linkText:       { color: '#6b7280', fontSize: 14 },
    linkBold:       { color: '#1a1a1a', fontWeight: '600' },
});

export default Register;
