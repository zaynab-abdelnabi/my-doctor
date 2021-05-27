import React from 'react';
import { Modal, View, Text } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Button from '../components/Button';
import { transformName } from '../config/helpers';
import styles from './styles/profileStyles';

const DoctorDetails = ({ selectedDoctor, closeModal }) => {
    if (!selectedDoctor) return null;
    return (
        <Modal
            visible={selectedDoctor !== null}
            animationType="slide"
            onRequestClose={closeModal}
        >
            <View style={styles.container}>
                <View style={styles.userMetaContainer}>
                    <View style={styles.userAvtar}>
                        <Text style={styles.userAvtarText}>
                            {transformName(selectedDoctor.name)}
                        </Text>
                    </View>
                    <View style={styles.userMeta}>
                        <Text>{selectedDoctor.name}</Text>
                        <Text>{selectedDoctor.email}</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.doctorInfo}>
                        <View style={styles.infoCell}>
                            <Text style={styles.infoTitle}>الأختصاص</Text>
                            <Text style={styles.infoText}>
                                {selectedDoctor.profile.specialization}
                            </Text>
                        </View>
                        <View style={styles.infoCell}>
                            <Text style={styles.infoTitle}>العنوان</Text>
                            <Text style={styles.infoText}>
                                {selectedDoctor.profile.address}
                            </Text>
                        </View>
                        <View style={styles.infoCell}>
                            <Text style={styles.infoTitle}>ساعات العمل</Text>
                            <Text style={styles.infoText}>
                                {selectedDoctor.profile.workingHours}
                            </Text>
                        </View>
                        <View style={styles.lastCell}>
                            <Text style={styles.infoTitle}>رقم الهاتف</Text>
                            <Text style={styles.infoText}>
                                {selectedDoctor.profile.phone}
                            </Text>
                        </View>
                    </View>

                </View>
                {selectedDoctor.latitude && (
                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            region={{
                                latitude: selectedDoctor.latitude,
                                longitude: selectedDoctor.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: selectedDoctor.latitude,
                                    longitude: selectedDoctor.longitude
                                }}
                            />
                        </MapView>
                    </View>
                )}
                <Button
                    buttonStyles={styles.backButton}
                    text="عودة"
                    onPress={closeModal}
                />
            </View>
        </Modal>
    );
}

export default DoctorDetails;
