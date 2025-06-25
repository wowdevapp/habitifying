import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Animated, Easing } from "react-native";
import { useRouter } from "expo-router";

interface AnimatedHabitCardProps {
  id: string;
  name: string;
  streak: number;
  isCompleted: boolean;
  onToggleComplete: () => void;
  isActive?: boolean;
  isNew?: boolean;
}

export const AnimatedHabitCard: React.FC<AnimatedHabitCardProps> = ({
  id,
  name,
  streak,
  isCompleted,
  onToggleComplete,
  isActive = false,
  isNew = false,
}) => {
  const router = useRouter();
  
  const handleCardPress = () => {
    router.push(`/habit/${id}`);
  };
  // Animation refs
  const scaleAnim = useRef(new Animated.Value(isNew ? 0.8 : 1)).current;
  const opacityAnim = useRef(new Animated.Value(isNew ? 0 : 1)).current;
  const translateYAnim = useRef(new Animated.Value(isNew ? 50 : 0)).current;

  // Days of the week
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  // Run entrance animation when a new habit card is added
  useEffect(() => {
    if (isNew) {
      Animated.sequence([
        // Wait a moment for the modal to close
        Animated.delay(300),
        // Then run the entrance animation
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.back(1.5)),
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
          }),
        ]),
        // Slightly bounce back to normal size
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.cubic),
        }),
      ]).start();
    }
  }, [isNew]);

  return (
    <Animated.View
      style={[
        styles.container,
        isActive && styles.activeContainer,
        {
          opacity: opacityAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim }
          ],
        },
      ]}
    >
      <TouchableOpacity 
        style={styles.touchableContainer}
        onPress={handleCardPress}
        activeOpacity={0.8}
      >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.streak}>{streak} day streak</Text>
      </View>

      <TouchableOpacity
        style={[styles.checkButton, isCompleted && styles.completedButton]}
        onPress={onToggleComplete}
      >
        {isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      <View style={styles.weekContainer}>
        {daysOfWeek.map((day, index) => (
          <View key={index} style={styles.dayColumn}>
            <Text style={styles.dayText}>{day}</Text>
            <View
              style={[
                styles.dayIndicator,
                true && styles.completedDay,
                index === 6 && styles.todayIndicator, // Assuming Sunday is today
              ]}
            />
          </View>
        ))}
      </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: "relative",
    borderWidth: 1,
    borderColor: "#333",
  },
  touchableContainer: {
    flex: 1,
  },
  activeContainer: {
    borderColor: "#00ff88",
    backgroundColor: "rgba(0, 255, 136, 0.1)",
  },
  contentContainer: {
    flexDirection: "column",
    marginBottom: 16,
    paddingRight: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  streak: {
    fontSize: 14,
    color: "#666666",
  },
  checkButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  completedButton: {
    backgroundColor: "#00ff88",
    borderColor: "#00ff88",
  },
  checkmark: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  dayColumn: {
    alignItems: "center",
    width: 24,
  },
  dayText: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 6,
  },
  dayIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#333",
  },
  completedDay: {
    backgroundColor: "#00ff88",
  },
  todayIndicator: {
    borderWidth: 1,
    borderColor: "#ffffff",
  },
});
