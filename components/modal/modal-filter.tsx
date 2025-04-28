import React, { useState } from 'react';
import { Modal, View, Pressable, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';

export default function FilterComponent({ isDarkMode, filter, setFilter }: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(filter.status);

  return (
    <View>
      {/* Icon to open the modal */}
      <Pressable
        style={[{ marginRight: 20 }]}
        onPress={() => setModalVisible(true)}
      >
        <IconSymbol
          lib="Feather"
          name="filter"
          size={24}
          color={isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray}
        />
      </Pressable>

      {/* Modal containing the Picker */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? Colors.secondary : Colors.primary }]}>
              Choose a Filter
            </Text>
            <Picker
                selectedValue={selectedFilter}
                onValueChange={(itemValue) => {
                    setSelectedFilter(itemValue);
                    if (itemValue === 'all' || itemValue === 'open' || itemValue === 'completed') {
                        setFilter({ ...filter, status: itemValue });
                    } else if (itemValue === 'newest' || itemValue === 'oldest') {
                        setFilter({ ...filter, order: itemValue });
                    }
                    setModalVisible(false); // Close the modal after selecting a filter
                }}
                style={{ height: 50, width: 200, color: isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray }}
                >
                <Picker.Item label="All" value="all" />
                <Picker.Item label="Open" value="open" />
                <Picker.Item label="Completed" value="completed" />
                <Picker.Item label="Newest" value="newest" />
                <Picker.Item label="Oldest" value="oldest" />
            </Picker>
            <Pressable
              style={[styles.modalButton, { backgroundColor: isDarkMode ? Colors.secondary : Colors.primary }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: Colors.background,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    modalButton: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    modalButtonText: {
      color: Colors.background,
      fontWeight: 'bold',
    },
});