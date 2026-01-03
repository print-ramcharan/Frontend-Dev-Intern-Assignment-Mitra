import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useSignIn, useOAuth } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { useWarmUpBrowser } from '../utils/useWarmUpBrowser';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FadeInView from '../components/FadeInView';
import GradientButton from '../components/GradientButton';

WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
    const { signIn, setActive, isLoaded } = useSignIn();

    useWarmUpBrowser();

    const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const onSignInPress = async () => {
        if (!isLoaded) return;
        setLoading(true);
        setError('');

        try {
            const completeSignIn = await signIn.create({
                identifier: email,
                password,
            });

            await setActive({ session: completeSignIn.createdSessionId });
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
            setError(err.errors ? err.errors[0].message : 'Failed to sign in');
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
                <FadeInView>
                    {/* Header with Icon */}
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <MaterialCommunityIcons name="school" size={40} color="#6c5ce7" />
                        </View>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue your journey</Text>
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <View style={styles.form}>
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
                                    placeholder="Enter your password"
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
                            title={loading ? 'Signing In...' : 'Sign In'}
                            onPress={onSignInPress}
                            loading={loading}
                            disabled={loading}
                        />

                        <View style={styles.divider}>
                            <View style={styles.line} />
                            <Text style={styles.orText}>OR</Text>
                            <View style={styles.line} />
                        </View>

                        <TouchableOpacity
                            style={[styles.googleButton]}
                            onPress={onGoogleSignInPress}
                        >
                            <MaterialCommunityIcons name="google" size={20} color="#000" style={{ marginRight: 10 }} />
                            <Text style={styles.googleButtonText}>Continue with Google</Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                <Text style={styles.linkHighlight}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </FadeInView>
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
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: 'rgba(108, 92, 231, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
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
    googleButton: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
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
        marginBottom: 24,
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
    errorText: {
        color: '#FF4757',
        marginBottom: 20,
        textAlign: 'center',
        backgroundColor: 'rgba(255, 71, 87, 0.1)',
        padding: 10,
        borderRadius: 8,
        overflow: 'hidden',
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
    linkHighlight: {
        color: '#6c5ce7',
        fontWeight: 'bold',
    },
});
