import React, { useState } from 'react';
import {
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { login } from '../../api/account';

// Converts whatever the API returns into a clean, displayable string.
// Guards against HTML error pages (OC 500/404 returns HTML, not JSON).
const toMessage = (err) => {
    if (!err) return 'Something went wrong. Please try again.';
    if (typeof err === 'object') return err.warning || err.message || 'Login failed.';
    if (typeof err === 'string') {
        if (err.includes('<html') || err.includes('<!DOCTYPE')) return 'Server error. Please try again.';
        return err;
    }
    return 'Login failed.';
};

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading]   = useState(false);
    const [inlineError, setInlineError] = useState(null);

    const handleLogin = async () => {
        // Field validation — show inline so user can fix immediately
        if (!email.trim() || !password.trim()) {
            setInlineError('Email and password are required.');
            return;
        }
        setInlineError(null);
        setLoading(true);
        const result = await login(email.trim(), password);
        setLoading(false);

        if (!result.success) {
            const msg = toMessage(result.error);
            setInlineError(msg);
            // Alert guarantees visibility regardless of keyboard / layout state
            Alert.alert('Login Failed', msg, [{ text: 'OK' }]);
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
            <View style={styles.container}>
                <Text style={styles.title}>Sign In</Text>

                {/* Inline error — visible before keyboard opens */}
                {inlineError ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{inlineError}</Text>
                    </View>
                ) : null}

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={(v) => { setEmail(v); setInlineError(null); }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={(v) => { setPassword(v); setInlineError(null); }}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="#1a1a1a" />
                        : <Text style={styles.buttonText}>Login</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.link}
                    onPress={() => navigation.navigate('register')}
                >
                    <Text style={styles.linkText}>
                        Don't have an account?{' '}
                        <Text style={styles.linkBold}>Register</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    flex:         { flex: 1, backgroundColor: '#fff' },
    container:    { flex: 1, padding: 24, justifyContent: 'center' },
    title:        { fontSize: 26, fontWeight: '700', marginBottom: 24, color: '#1a1a1a' },
    errorBox:     {
        backgroundColor: '#fff5f5',
        borderWidth: 1,
        borderColor: '#fed7d7',
        borderRadius: 8,
        padding: 12,
        marginBottom: 14,
    },
    errorText:    { color: '#c53030', fontSize: 14, lineHeight: 20 },
    input:        {
        borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10,
        padding: 14, marginBottom: 14, fontSize: 15, color: '#1a1a1a',
    },
    button:       {
        backgroundColor: '#febf00', borderRadius: 10,
        padding: 15, alignItems: 'center', marginTop: 6,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText:   { color: '#1a1a1a', fontWeight: '700', fontSize: 16 },
    link:         { marginTop: 20, alignItems: 'center' },
    linkText:     { color: '#6b7280', fontSize: 14 },
    linkBold:     { color: '#1a1a1a', fontWeight: '600' },
});

export default Login;
