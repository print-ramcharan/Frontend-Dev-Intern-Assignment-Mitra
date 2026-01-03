import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import FadeInView from '../components/FadeInView';

const { width } = Dimensions.get('window');

const ServiceTile = ({ title, icon, color, onPress }) => (
    <TouchableOpacity style={styles.tile} onPress={onPress}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <MaterialCommunityIcons name={icon} size={32} color={color} />
        </View>
        <Text style={styles.tileTitle}>{title}</Text>
    </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
    const { user } = useUser();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Good Morning,</Text>
                        <Text style={styles.userName}>
                            {user?.firstName || 'Student'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        {user?.imageUrl ? (
                            <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
                        ) : (
                            <View style={styles.placeholderAvatar}>
                                <Text style={styles.avatarText}>
                                    {user?.firstName ? user.firstName[0] : 'S'}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Banner/Card */}
                <FadeInView delay={300}>
                    <View style={styles.banner}>
                        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                        <View style={styles.bannerContent}>
                            <Text style={styles.bannerTitle}> Semester 6 </Text>
                            <Text style={styles.bannerSubtitle}> Computer Science & Engineering </Text>
                            <Text style={styles.bannerStatus}> • Active System </Text>
                        </View>
                        <MaterialCommunityIcons name="school-outline" size={80} color="rgba(255,255,255,0.2)" style={styles.bannerIcon} />
                    </View>
                </FadeInView>

                {/* Dashboard Title */}
                <FadeInView delay={500}>
                    <Text style={styles.sectionTitle}>Quick Access</Text>

                    {/* Tiles Grid */}
                    <View style={styles.grid}>
                        <ServiceTile title="Notices" icon="bullhorn-outline" color="#2F80ED" />
                        <ServiceTile title="Events" icon="calendar-month-outline" color="#9C27B0" />
                        <ServiceTile title="Results" icon="chart-bar" color="#27AE60" />
                        <ServiceTile title="Library" icon="book-open-page-variant" color="#E67E22" />
                        <ServiceTile title="Transport" icon="bus" color="#F1C40F" />
                        <ServiceTile title="Support" icon="headset" color="#34495E" />
                    </View>
                </FadeInView>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA', // Light bg
    },
    content: {
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    greeting: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    userName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 4,
    },
    profileButton: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#fff',
    },
    placeholderAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#6c5ce7',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    banner: {
        backgroundColor: '#333', // Dark card for contrast
        borderRadius: 20,
        padding: 24,
        marginBottom: 30,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    bannerContent: {
        zIndex: 1,
    },
    bannerTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    bannerSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 12,
    },
    bannerStatus: {
        color: '#4ADE80',
        fontSize: 12,
        fontWeight: 'bold',
        backgroundColor: 'rgba(74, 222, 128, 0.15)',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    bannerIcon: {
        position: 'absolute',
        right: -10,
        bottom: -10,
        transform: [{ rotate: '-15deg' }],
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        marginLeft: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    tile: {
        width: (width - 64) / 2, // 24 padding * 2 = 48 + 16 gap = 64 approx
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    tileTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
});
