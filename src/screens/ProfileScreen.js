import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const InfoCard = ({ title, children, showEdit }) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{title}</Text>
            {showEdit && (
                <TouchableOpacity>
                    <MaterialCommunityIcons name="pencil-outline" size={20} color="#666" />
                </TouchableOpacity>
            )}
        </View>
        <View style={styles.cardContent}>
            {children}
        </View>
    </View>
);

const InfoItem = ({ label, value }) => (
    <View style={styles.infoItem}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

export default function ProfileScreen({ navigation }) {
    const { signOut } = useAuth();
    const { user } = useUser();

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (err) {
            console.error("Logout error", err);
        }
    };

    const getInitials = () => {
        if (!user?.firstName) return 'S';
        return user.firstName[0];
    }

    // Determine connected accounts
    const isGoogleConnected = user?.externalAccounts.some(acc => acc.verification.strategy === 'oauth_google');

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Navbar */}
                <View style={styles.navbar}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.screenTitle}>Profile</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        {user?.imageUrl ? (
                            <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
                        ) : (
                            <View style={styles.placeholderAvatar}>
                                <Text style={styles.avatarText}>{getInitials()}</Text>
                            </View>
                        )}
                        <View style={styles.editBadge}>
                            <MaterialCommunityIcons name="camera" size={14} color="#fff" />
                        </View>
                    </View>

                    <Text style={styles.name}>
                        {user?.fullName || user?.firstName || 'Student Name'}
                    </Text>
                    <Text style={styles.email}>
                        {user?.primaryEmailAddress?.emailAddress}
                    </Text>
                </View>

                {/* Info Cards */}
                <InfoCard title="Profile Information" showEdit>
                    <InfoItem label="Full Name" value={user?.fullName || user?.firstName || 'Not set'} />
                    <InfoItem label="Email" value={user?.primaryEmailAddress?.emailAddress} />
                    <InfoItem label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} />
                    <InfoItem label="User ID" value={user?.id} />
                </InfoCard>

                <InfoCard title="Connected Accounts">
                    <View style={styles.accountItem}>
                        <View style={styles.accountLeft}>
                            <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
                            <Text style={styles.accountName}>Google</Text>
                        </View>
                        <View style={styles.statusIndicator}>
                            <View style={[styles.dot, { backgroundColor: isGoogleConnected ? '#4CAF50' : '#ccc' }]} />
                        </View>
                    </View>
                </InfoCard>

                <InfoCard title="Settings">
                    <TouchableOpacity style={styles.settingItem}>
                        <Text style={styles.settingText}>Notifications</Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                        <Text style={styles.settingText}>Privacy & Security</Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
                    </TouchableOpacity>
                </InfoCard>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <MaterialCommunityIcons name="logout" size={20} color="#FF4757" style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>
            {/* Bottom spacing */}
            <View style={{ height: 20 }} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        padding: 20,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    screenTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#fff',
    },
    placeholderAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#6c5ce7',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    avatarText: {
        fontSize: 40,
        color: '#fff',
        fontWeight: 'bold',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#333',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#888',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    infoItem: {
        marginBottom: 16,
    },
    label: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    accountItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    accountLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    accountName: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    settingText: {
        fontSize: 16,
        color: '#333',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFEEF0',
        marginBottom: 10,
    },
    logoutText: {
        color: '#FF4757',
        fontWeight: '600',
        fontSize: 16,
    }
});
