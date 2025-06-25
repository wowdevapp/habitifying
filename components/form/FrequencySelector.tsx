import React, { useEffect, useRef } from 'react';
import { 
  Animated, 
  Easing, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { Control, Controller, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { HabitFormData } from '../form/types';

interface FrequencySelectorProps {
  control: Control<HabitFormData>;
  watch: UseFormWatch<HabitFormData>;
  setValue: UseFormSetValue<HabitFormData>;
}

const FrequencySelector = ({ control, watch, setValue }: FrequencySelectorProps) => {
  const frequency = watch('frequency');
  const toggleAnim = useRef(new Animated.Value(0)).current; // 0 for day, 1 for week, 2 for month

  // Update toggle animation when frequency changes
  useEffect(() => {
    let toValue = 0;
    if (frequency === "week") toValue = 1;
    if (frequency === "month") toValue = 2;

    Animated.timing(toggleAnim, {
      toValue,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [frequency, toggleAnim]);

  // Calculate toggle position for the animated slider
  const togglePosition = toggleAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ["0%", "33.33%", "66.66%"],
  });

  return (
    <View style={styles.formGroup}>
      <Text style={styles.inputLabel}>Frequency</Text>
      <View style={styles.toggleContainer}>
        <View style={styles.toggleBackground}>
          <Animated.View
            style={[
              styles.toggleSlider,
              { left: togglePosition },
            ]}
          />

          <TouchableOpacity
            style={[styles.toggleOption]}
            onPress={() => setValue("frequency", "day")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.toggleText,
                frequency === "day" && styles.activeToggleText,
              ]}
            >
              Daily
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleOption]}
            onPress={() => setValue("frequency", "week")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.toggleText,
                frequency === "week" && styles.activeToggleText,
              ]}
            >
              Weekly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleOption]}
            onPress={() => setValue("frequency", "month")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.toggleText,
                frequency === "month" && styles.activeToggleText,
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#999999",
    marginBottom: 10,
  },
  toggleContainer: {
    marginTop: 8,
  },
  toggleBackground: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#333",
    position: "relative", // For absolute positioning of slider
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    zIndex: 1, // Ensure buttons are above the slider
  },
  toggleSlider: {
    position: "absolute",
    top: 4,
    bottom: 4,
    width: "33.33%",
    backgroundColor: "#00ff88",
    borderRadius: 8,
    zIndex: 0,
  },
  toggleText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  activeToggleText: {
    color: "#000000",
  },
});

export default FrequencySelector;
