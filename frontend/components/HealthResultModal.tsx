import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './ui/Text';
import Button from './ui/Button';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

interface HealthResultModalProps {
  visible: boolean;
  onClose: () => void;
  onDone: () => void;
  result: {
    is_healthy: boolean;
    disease_name?: string;
    probability?: number;
    description?: string;
    treatment?: string;
  } | null;
}

const HealthResultModal: React.FC<HealthResultModalProps> = ({
  visible,
  onClose,
  onDone,
  result,
}) => {
  if (!result) return null;

  const { is_healthy, disease_name, description, treatment } = result;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text weight="bold" style={styles.headerTitle}>
              Health Analysis
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
              <Ionicons name="close" size={wp(6)} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, { backgroundColor: is_healthy ? '#E8F5E9' : '#FFF1F0' }]}>
                <Ionicons 
                  name={is_healthy ? "checkmark-circle" : "warning"} 
                  size={wp(8)} 
                  color={is_healthy ? "#4CAF50" : "#FF4D4F"} 
                />
                <Text weight="bold" style={[styles.statusText, { color: is_healthy ? "#2E7D32" : "#D32F2F" }]}>
                  {is_healthy ? "Healthy Plant" : "Action Required"}
                </Text>
              </View>
            </View>

            {!is_healthy && disease_name && (
              <View style={styles.section}>
                <Text weight="bold" style={styles.sectionTitle}>Detected Issue</Text>
                <Text style={styles.diseaseName}>{disease_name}</Text>
              </View>
            )}

            {description && (
              <View style={styles.section}>
                <Text weight="bold" style={styles.sectionTitle}>Description</Text>
                <Text style={styles.bodyText}>{description}</Text>
              </View>
            )}

            {treatment && (
              <View style={styles.section}>
                <Text weight="bold" style={styles.sectionTitle}>Recommended Treatment</Text>
                <View style={styles.treatmentCard}>
                  <Text style={styles.bodyText}>{treatment}</Text>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Button title="Done" onPress={onDone} style={styles.doneButton} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: wp(8),
    borderTopRightRadius: wp(8),
    height: hp(80),
    paddingBottom: Platform.OS === 'ios' ? hp(4) : hp(2),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(6),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: rf(2.4),
    color: '#1A1A1A',
  },
  closeIcon: {
    padding: wp(1),
  },
  scrollBody: {
    padding: wp(6),
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: hp(3),
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: wp(10),
    gap: wp(3),
  },
  statusText: {
    fontSize: rf(2.2),
  },
  section: {
    marginBottom: hp(3),
  },
  sectionTitle: {
    fontSize: rf(1.8),
    color: '#666',
    marginBottom: hp(1),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  diseaseName: {
    fontSize: rf(2.2),
    color: '#1A1A1A',
    fontWeight: '600',
  },
  bodyText: {
    fontSize: rf(1.8),
    color: '#4A4A4A',
    lineHeight: rf(2.6),
  },
  treatmentCard: {
    backgroundColor: '#F9FBF9',
    padding: wp(4),
    borderRadius: wp(4),
    borderLeftWidth: 4,
    borderLeftColor: '#4AA88B',
  },
  footer: {
    paddingHorizontal: wp(6),
    paddingTop: hp(1),
  },
  doneButton: {
    width: '100%',
  },
});

export default HealthResultModal;
