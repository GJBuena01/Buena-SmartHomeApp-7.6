import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../context/IoTContext';

export default function SensorsScreen() {
  const { sensors, refreshSensors } = useIoT();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing) {
      return;
    }

    setIsRefreshing(true);

    try {
      await refreshSensors();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Sensors</Text>

        <Pressable
          onPress={handleRefresh}
          disabled={isRefreshing}
          style={({ pressed }) => [
            styles.refreshButton,
            {
              opacity: pressed || isRefreshing ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons
            name={isRefreshing ? 'sync-circle' : 'refresh-circle-outline'}
            size={28}
            color={isRefreshing ? '#0679ca' : '#111'}
          />
          <Text style={styles.refreshButtonText}>
            {isRefreshing ? 'Refreshing...' : 'Refresh Sensors'}
          </Text>
        </Pressable>
      </View>

      {isRefreshing && <Text style={styles.infoText}>Refreshing sensors...</Text>}

      <Text style={styles.subtitle}>Monitor your environment</Text>

      <View style={styles.sensorCard}>
        <View style={styles.sensorHeader}>
          <Ionicons name="thermometer-outline" size={30} color="#000000" />
          <Text style={styles.sensorName}>Temperature</Text>
        </View>

        <Text style={styles.sensorValue}>{sensors.temperature}°C</Text>
        <Text style={styles.sensorDescription}>Current room temperature</Text>
      </View>

      <View style={styles.sensorCard}>
        <View style={styles.sensorHeader}>
          <Ionicons name="water-outline" size={30} color="#000000" />
          <Text style={styles.sensorName}>Humidity</Text>
        </View>

        <Text style={styles.sensorValue}>{sensors.humidity}%</Text>
        <Text style={styles.sensorDescription}>Current relative humidity</Text>
      </View>

      <View style={styles.sensorCard}>
        <View style={styles.sensorHeader}>
          <Ionicons name="sunny-outline" size={30} color="#000000" />
          <Text style={styles.sensorName}>Light Level</Text>
        </View>

        <Text style={styles.sensorValue}>{sensors.lightLevel} lux</Text>
        <Text style={styles.sensorDescription}>Current ambient light</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f7fb',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },

  subtitle: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 25,
    color: '#4b5563',
  },

  infoText: {
    fontSize: 13,
    color: '#0679ca',
    fontWeight: '600',
    marginBottom: 15,
  },

  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dfeafc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 6,
  },

  refreshButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },

  sensorCard: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#cedaf4',
    marginBottom: 15,
  },

  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  sensorName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
  },

  sensorValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#111827',
  },

  sensorDescription: {
    fontSize: 13,
    marginTop: 5,
    color: '#374151',
  },
});