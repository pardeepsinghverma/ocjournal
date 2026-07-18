import React, { useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Text, View, YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../store/authSlice';
import { logout as apiLogout, updateProfile } from '../../api/account';

const Field = ({ label, value, onChangeText, secureTextEntry, keyboardType }) => (
    <View style={styles.fieldWrap}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType ?? 'default'}
            autoCorrect={false}
            placeholderTextColor="#9ca3af"
        />
    </View>
);

const MyProfile = () => {
    const navigation = useNavigation();
    const dispatch   = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const [form, setForm] = useState({
        firstname: user?.firstname ?? user?.first_name ?? '',
        lastname:  user?.lastname  ?? user?.last_name  ?? '',
        email:     user?.email     ?? '',
        telephone: user?.telephone ?? '',
    });
    const [saving,  setSaving]  = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [saveError, setSaveError] = useState(null);

    useLayoutEffect(() => {
        if (!isAuthenticated) {
            navigation.replace ? navigation.replace('login') : navigation.navigate('login');
        }
    }, [isAuthenticated, navigation]);

    if (!isAuthenticated) {
        return (
            <View flex={1} padding={20} backgroundColor="#ffffff">
                <Text>Redirecting to login…</Text>
            </View>
        );
    }

    const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

    const handleSave = async () => {
        setSaveError(null);
        setSaving(true);
        const result = await updateProfile({
            firstname: form.firstname,
            lastname:  form.lastname,
            email:     form.email,
            telephone: form.telephone,
        });
        setSaving(false);
        if (!result.success) {
            setSaveError(result.error || 'Could not save changes.');
            return;
        }
        // Sync Redux with the saved values
        dispatch(updateUser({
            firstname: form.firstname, first_name: form.firstname,
            lastname:  form.lastname,  last_name:  form.lastname,
            email:     form.email,
            telephone: form.telephone,
        }));
        Alert.alert('Saved', 'Profile updated successfully.');
    };

    const handleLogout = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: async () => {
                        setLoggingOut(true);
                        await apiLogout();
                        setLoggingOut(false);
                        Alert.alert('Signed Out', 'You have been logged out successfully.', [
                            { text: 'OK', onPress: () => navigation.navigate('main') },
                        ]);
                    },
                },
            ],
        );
    };

    return (
        <View flex={1} backgroundColor="#ffffff">
            <YStack flex={1} padding={20} gap={4}>
                <Text style={styles.heading}>My Profile</Text>

                {saveError ? <Text style={styles.error}>{saveError}</Text> : null}

                <Field label="First Name" value={form.firstname} onChangeText={set('firstname')} />
                <Field label="Last Name"  value={form.lastname}  onChangeText={set('lastname')} />
                <Field label="Email"      value={form.email}     onChangeText={set('email')}
                    keyboardType="email-address" />
                <Field label="Telephone"  value={form.telephone} onChangeText={set('telephone')}
                    keyboardType="phone-pad" />

                <TouchableOpacity
                    style={[styles.saveBtn, saving && styles.disabled]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving
                        ? <ActivityIndicator color="#1a1a1a" />
                        : <Text style={styles.saveBtnText}>Save Changes</Text>}
                </TouchableOpacity>
            </YStack>

            <YStack paddingHorizontal={20} paddingBottom={24}>
                <TouchableOpacity
                    style={[styles.logoutBtn, loggingOut && styles.disabled]}
                    onPress={handleLogout}
                    disabled={loggingOut}
                >
                    {loggingOut
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={styles.logoutBtnText}>Logout</Text>}
                </TouchableOpacity>
            </YStack>
        </View>
    );
};

const styles = StyleSheet.create({
    heading:       { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 16 },
    error:         { color: '#e53e3e', fontSize: 13, marginBottom: 10 },
    fieldWrap:     { marginBottom: 14 },
    label:         { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 5 },
    input:         {
        borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10,
        padding: 13, fontSize: 15, color: '#1a1a1a',
    },
    saveBtn:       {
        backgroundColor: '#febf00', borderRadius: 10,
        padding: 14, alignItems: 'center', marginTop: 8,
    },
    saveBtnText:   { color: '#1a1a1a', fontWeight: '700', fontSize: 15 },
    logoutBtn:     {
        backgroundColor: '#d32f2f', borderRadius: 10,
        padding: 14, alignItems: 'center',
    },
    logoutBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    disabled:      { opacity: 0.6 },
});

export default MyProfile;
