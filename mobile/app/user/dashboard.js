import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import API, { API_URL } from '../../src/services/api';

export default function UserDashboard() {
    const router = useRouter();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [featuredLoading, setFeaturedLoading] = useState(true);
    const [featuredError, setFeaturedError] = useState('');
    const [upcomingAppointment, setUpcomingAppointment] = useState(null);
    const [latestPetRecords, setLatestPetRecords] = useState([]);
    const [petRecordsLoading, setPetRecordsLoading] = useState(true);

    const loadFeaturedProducts = useCallback(async () => {
        try {
            setFeaturedLoading(true);
            setFeaturedError('');

            const res = await API.get('/products/featured');
            setFeaturedProducts(res.data);
        } catch (error) {
            setFeaturedError(error.response?.data?.msg || 'Failed to load featured products');
        } finally {
            setFeaturedLoading(false);
        }
    }, []);

    const loadUpcomingAppointment = useCallback(async () => {
        try {
            const res = await API.get('/appointments/my-appointments');
            const nextAppointment = getNextUpcomingAppointment(res.data || []);

            setUpcomingAppointment(nextAppointment || null);
        } catch (_error) {
            setUpcomingAppointment(null);
        }
    }, []);

    const loadLatestPetRecords = useCallback(async () => {
        try {
            setPetRecordsLoading(true);
            const res = await API.get('/pets/my-pets');

            setLatestPetRecords(getLatestPetRecords(res.data || []));
        } catch (_error) {
            setLatestPetRecords([]);
        } finally {
            setPetRecordsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadFeaturedProducts();
            loadUpcomingAppointment();
            loadLatestPetRecords();
        }, [loadFeaturedProducts, loadUpcomingAppointment, loadLatestPetRecords])
    );

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Welcome</Text>
                        <Text style={styles.title}>Pets Paradise</Text>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.avatar} onPress={() => router.push('/profile')}>
                            <MaterialIcons name="person" size={28} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.avatar} onPress={() => router.push('/user/cart')}>
                            <Ionicons name="cart-outline" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.banner}>
                    <Text style={styles.bannerTitle}>Everything your pet needs</Text>
                    <Text style={styles.bannerText}>Shop products, book appointments, and manage pet records.</Text>
                    <TouchableOpacity style={styles.bannerButton} onPress={() => router.push('/user/shop')}>
                        <Text style={styles.bannerButtonText}>Shop Now</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.grid}>
                    <Action title="Shop" icon="bag-outline" onPress={() => router.push('/user/shop')} />
                    <Action title="Orders" icon="receipt-outline" onPress={() => router.push('/user/orders')} />
                    <Action title="Appointments" icon="calendar-outline" onPress={() => router.push('/user/appointments')} />
                    <Action title="My Pets" icon="paw-outline" onPress={() => router.push('/user/pets')} />
                </View>

                <Section title="Featured Products" action="See More" onPress={() => router.push('/user/shop')} />

                {featuredLoading ? (
                    <View style={styles.featuredLoading}>
                        <ActivityIndicator color="#2563eb" />
                    </View>
                ) : featuredError ? (
                    <TouchableOpacity style={styles.featuredNotice} onPress={loadFeaturedProducts}>
                        <Text style={styles.featuredNoticeText}>{featuredError}. Tap to retry.</Text>
                    </TouchableOpacity>
                ) : featuredProducts.length === 0 ? (
                    <View style={styles.featuredNotice}>
                        <Text style={styles.featuredNoticeText}>No featured products yet</Text>
                    </View>
                ) : (
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={featuredProducts}
                        keyExtractor={(item) => item._id || item.id}
                        renderItem={({ item }) => (
                            <FeaturedProductCard product={item} onPress={() => router.push('/user/shop')} />
                        )}
                    />
                )}

                <Section title="Upcoming Appointment" action="Book" onPress={() => router.push('/user/appointments')} />
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>{upcomingAppointment?.reason || 'No upcoming appointments'}</Text>
                    <Text style={styles.infoText}>
                        {upcomingAppointment ? `${upcomingAppointment.petName} | ${upcomingAppointment.date} | ${formatTimeLabel(upcomingAppointment.time)}` : 'Book a clinic visit for your pet'}
                    </Text>
                </View>

                <Section title="Pet Records" action="Manage" onPress={() => router.push('/user/pets')} />
                {petRecordsLoading ? (
                    <View style={styles.infoCard}>
                        <ActivityIndicator color="#16a34a" />
                    </View>
                ) : latestPetRecords.length === 0 ? (
                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>No pet records yet</Text>
                        <Text style={styles.infoText}>Latest pet records will appear here</Text>
                    </View>
                ) : (
                    latestPetRecords.map((item) => <PetRecordSummary key={item.key} item={item} />)
                )}
            </ScrollView>
        </View>
    );
}

function Action({ title, icon, onPress }) {
    return (
        <TouchableOpacity style={styles.actionCard} onPress={onPress}>
            <Ionicons name={icon} size={28} color="#2563eb" style={styles.actionIcon} />
            <Text style={styles.actionText}>{title}</Text>
        </TouchableOpacity>
    );
}

function Section({ title, action, onPress }) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <TouchableOpacity onPress={onPress}>
                <Text style={styles.sectionAction}>{action}</Text>
            </TouchableOpacity>
        </View>
    );
}

function FeaturedProductCard({ product, onPress }) {
    return (
        <TouchableOpacity style={styles.productCard} onPress={onPress}>
            <ProductImage imageUrl={product.imageUrl} />
            <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
            <Text style={styles.productCategory} numberOfLines={1}>{product.category}</Text>
            <Text style={styles.productPrice}>Rs. {Number(product.price || 0).toLocaleString()}</Text>
        </TouchableOpacity>
    );
}

function ProductImage({ imageUrl }) {
    const [hasError, setHasError] = useState(false);
    const uri = normalizeImageUrl(imageUrl);

    useEffect(() => {
        setHasError(false);
    }, [uri]);

    if (!uri || hasError) {
        return (
            <View style={styles.productImagePlaceholder}>
                <Ionicons name="image-outline" size={28} color="#6b7280" />
            </View>
        );
    }

    return (
        <Image
            source={{ uri, headers: { Accept: 'image/*,*/*' } }}
            style={styles.productImage}
            contentFit="cover"
            onError={() => setHasError(true)}
        />
    );
}

function PetRecordSummary({ item }) {
    return (
        <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>{item.petName}</Text>
            <Text style={styles.petRecordMeta}>
                {item.record.date || 'No date'} | {item.record.title}
            </Text>
            <Text style={styles.infoText} numberOfLines={2}>
                {item.record.notes || 'No notes added'}
            </Text>
        </View>
    );
}

function normalizeImageUrl(value) {
    let imageUrl = String(value || '').trim();

    if (!imageUrl) {
        return '';
    }

    if (imageUrl.startsWith('www.')) {
        imageUrl = `https://${imageUrl}`;
    }

    if (imageUrl.startsWith('data:image/')) {
        return encodeURI(imageUrl);
    }

    if (/^https?:\/\//i.test(imageUrl)) {
        return `${API_URL}/images/product?url=${encodeURIComponent(imageUrl)}`;
    }

    return '';
}

function getNextUpcomingAppointment(appointments) {
    return appointments
        .filter(isUpcomingAppointment)
        .sort((first, second) => parseAppointmentDateTime(first) - parseAppointmentDateTime(second))[0];
}

function isUpcomingAppointment(appointment) {
    if (['Completed', 'Cancelled'].includes(appointment.status)) {
        return false;
    }

    const appointmentDateTime = parseAppointmentDateTime(appointment);

    return appointmentDateTime && appointmentDateTime >= new Date();
}

function parseAppointmentDateTime(appointment) {
    const date = appointment?.date;
    const time = appointment?.time;

    if (!date || !time) {
        return null;
    }

    const appointmentDateTime = new Date(`${date}T${time}:00`);

    return Number.isNaN(appointmentDateTime.getTime()) ? null : appointmentDateTime;
}

function getLatestPetRecords(pets) {
    return pets
        .map((pet) => {
            const latestRecord = getLatestRecord(pet.records || []);

            if (!latestRecord) {
                return null;
            }

            return {
                key: `${pet._id || pet.id || pet.name}-${latestRecord._id || latestRecord.id || latestRecord.createdAt || latestRecord.date}`,
                petName: pet.name || 'Pet',
                record: latestRecord
            };
        })
        .filter(Boolean);
}

function getLatestRecord(records) {
    return records
        .filter((record) => record?.title)
        .sort((first, second) => parseRecordDate(second) - parseRecordDate(first))[0];
}

function parseRecordDate(record) {
    const value = record.date || record.createdAt || record.updatedAt;
    const date = new Date(value ? String(value) : 0);

    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function formatTimeLabel(value) {
    if (!value) {
        return '';
    }

    const [hourText, minuteText] = value.split(':');
    const hour = Number(hourText);
    const minute = Number(minuteText);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;

    return `${displayHour}.${String(minute).padStart(2, '0')} ${suffix}`;
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f7fb' },
    scroll: { flex: 1 },
    content: { padding: 18, paddingBottom: 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    greeting: { color: '#6b7280' },
    title: { fontSize: 28, fontWeight: '900', color: '#111827' },
    avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center' },
    banner: { backgroundColor: '#2563eb', padding: 22, borderRadius: 24, marginBottom: 20 },
    bannerTitle: { color: '#fff', fontSize: 24, fontWeight: '900', marginBottom: 8 },
    bannerText: { color: '#dbeafe', marginBottom: 16 },
    bannerButton: { backgroundColor: '#fff', padding: 12, borderRadius: 14, alignSelf: 'flex-start' },
    bannerButtonText: { color: '#2563eb', fontWeight: '900' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    actionCard: { width: '48%', backgroundColor: '#fff', padding: 18, borderRadius: 18, marginBottom: 14 },
    actionIcon: { marginBottom: 8 },
    actionText: { fontWeight: '800', fontSize: 16 },
    section: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 14, alignItems: 'center' },
    sectionTitle: { fontSize: 21, fontWeight: '900' },
    sectionAction: { color: '#2563eb', fontWeight: '800' },
    featuredLoading: { height: 198, alignItems: 'center', justifyContent: 'center' },
    featuredNotice: { backgroundColor: '#fff', padding: 16, borderRadius: 18 },
    featuredNoticeText: { color: '#6b7280', fontWeight: '800' },
    productCard: { width: 170, backgroundColor: '#fff', padding: 12, borderRadius: 18, marginRight: 14 },
    productImage: { width: '100%', aspectRatio: 1, borderRadius: 14, marginBottom: 10, backgroundColor: '#e5e7eb' },
    productImagePlaceholder: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 14,
        marginBottom: 10,
        backgroundColor: '#e5e7eb',
        alignItems: 'center',
        justifyContent: 'center'
    },
    productName: { fontWeight: '900', color: '#111827', minHeight: 38 },
    productCategory: { color: '#6b7280', marginTop: 4 },
    productPrice: { color: '#2563eb', fontWeight: '900', marginTop: 8 },
    infoCard: { backgroundColor: '#fff', padding: 16, borderRadius: 18, marginBottom: 10 },
    infoTitle: { fontWeight: '900', fontSize: 17 },
    infoText: { color: '#6b7280', marginTop: 4 },
    petRecordMeta: { color: '#16a34a', fontWeight: '900', marginTop: 4 }
});
