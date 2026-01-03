import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { useSignUp, useOAuth } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { useWarmUpBrowser } from '../utils/useWarmUpBrowser';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FadeInView from '../components/FadeInView';
import GradientButton from '../components/GradientButton';

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen({ navigation }) {
    const { isLoaded, signUp, setActive } = useSignUp();
    useWarmUpBrowser();
    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const onSignUpPress = async () => {
        if (!isLoaded) return;
        setLoading(true);
        setError('');

        try {
            await signUp.create({
                firstName,
                lastName,
                emailAddress: email,
                password,
            });

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
            setError(err.errors ? err.errors[0].message : 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };

    const onVerifyPress = async () => {
        if (!isLoaded) return;
        setLoading(true);
        setError('');

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            await setActive({ session: completeSignUp.createdSessionId });
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
            setError(err.errors ? err.errors[0].message : 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const onGoogleSignInPress = React.useCallback(async () => {
        try {
            const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();

            if (createdSessionId) {
                setActive({ session: createdSessionId });
            }
        } catch (err) {
            console.error('OAuth error', err);
        }
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <FadeInView>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
                                <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
                            </TouchableOpacity>
                            <View style={{ alignItems: 'center', marginTop: 10 }}>
                                <Text style={styles.title}>Create Account</Text>
                                <Text style={styles.subtitle}>
                                    {pendingVerification ? 'Verify your email to continue' : 'Join Mitra Student Hub today'}
                                </Text>
                            </View>
                            {!pendingVerification && (
                                <View style={{ marginTop: 30, width: '100%' }}>
                                    <TouchableOpacity
                                        style={[styles.googleButton]}
                                        onPress={onGoogleSignInPress}
                                    >
                                        <MaterialCommunityIcons name="google" size={20} color="#000" style={{ marginRight: 10 }} />
                                        <Text style={styles.googleButtonText}>Sign up with Google</Text>
                                    </TouchableOpacity>

                                    <View style={styles.divider}>
                                        <View style={styles.line} />
                                        <Text style={styles.orText}>OR</Text>
                                        <View style={styles.line} />
                                    </View>
                                </View>
                            )}
                        </View>

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        {!pendingVerification ? (
                            <View style={styles.form}>
                                <View style={styles.row}>
                                    <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                                        <Text style={styles.label}>First Name</Text>
                                        <TextInput
                                            value={firstName}
                                            placeholder="John"
                                            placeholderTextColor="#aaa"
                                            onChangeText={setFirstName}
                                            style={styles.input}
                                        />
                                    </View>
                                    <View style={[styles.inputContainer, { flex: 1 }]}>
                                        <Text style={styles.label}>Last Name</Text>
                                        <TextInput
                                            value={lastName}
                                            placeholder="Doe"
                                            placeholderTextColor="#aaa"
                                            onChangeText={setLastName}
                                            style={styles.input}
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Email Address</Text>
                                    <TextInput
                                        autoCapitalize="none"
                                        value={email}
                                        placeholder="student@example.com"
                                        placeholderTextColor="#aaa"
                                        onChangeText={setEmail}
                                        style={styles.input}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Password</Text>
                                    <View style={styles.passwordContainer}>
                                        <TextInput
                                            value={password}
                                            placeholder="Create a password"
                                            placeholderTextColor="#aaa"
                                            secureTextEntry={secureTextEntry}
                                            onChangeText={setPassword}
                                            style={styles.passwordInput}
                                        />
                                        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                                            <MaterialCommunityIcons name={secureTextEntry ? "eye-off" : "eye"} size={20} color="#aaa" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <GradientButton
                                    title={loading ? 'Creating Account...' : 'Sign Up'}
                                    onPress={onSignUpPress}
                                    loading={loading}
                                    disabled={loading}
                                />

                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>Already have an account?</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                        <Text style={styles.linkHighlight}>Log In</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.form}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Verification Code</Text>
                                    <TextInput
                                        value={code}
                                        placeholder="Enter code"
                                        placeholderTextColor="#aaa"
                                        onChangeText={setCode}
                                        style={styles.input}
                                        keyboardType="number-pad"
                                    />
                                </View>

                                <GradientButton
                                    title={loading ? 'Verifying...' : 'Verify Email'}
                                    onPress={onVerifyPress}
                                    loading={loading}
                                    disabled={loading}
                                />

                                <TouchableOpacity onPress={() => setPendingVerification(false)} style={styles.linkButton}>
                                    <Text style={styles.linkText}>Back to Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </FadeInView>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        marginBottom: 30,
    },
    backButton: {
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
    },
    form: {
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: '#333',
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        color: '#333',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#eee',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#eee',
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 16,
        color: '#333',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#6c5ce7',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        shadowColor: "#6c5ce7",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorText: {
        color: '#FF4757',
        marginBottom: 20,
        textAlign: 'center',
        backgroundColor: 'rgba(255, 71, 87, 0.1)',
        padding: 10,
        borderRadius: 8,
        overflow: 'hidden',
    },
    linkButton: {
        alignItems: 'center',
        marginTop: 10,
    },
    linkText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
    },
    linkHighlight: {
        color: '#6c5ce7',
        fontWeight: 'bold',
    },
    googleButton: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    googleButtonText: {
        color: '#333',
        fontWeight: '600',
        fontSize: 16,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#eee',
    },
    orText: {
        color: '#aaa',
        marginHorizontal: 10,
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#888',
        marginRight: 5,
    },
});
