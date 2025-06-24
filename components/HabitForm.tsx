import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from "react-native";

interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: "day" | "week" | "month";
  goal: number;
  unit: string;
}

interface HabitFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (habit: Omit<Habit, "id">) => void;
}

const HabitForm = ({ visible, onClose, onSave }: HabitFormProps) => {
  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [frequency, setFrequency] = useState<"day" | "week" | "month">("day");
  const [goal, setGoal] = useState<number>(1);
  const [unit, setUnit] = useState<string>("");

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const toggleAnim = useRef(new Animated.Value(0)).current; // 0 for day, 1 for week, 2 for month

  useEffect(() => {
    if (visible) {
      // Animate modal entry
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations when modal is hidden
      slideAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible]);

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
  }, [frequency]);

  // Update goal defaults when frequency changes
  useEffect(() => {
    // Set sensible defaults based on frequency
    if (frequency === "day") {
      setGoal(1); // Default to once per day
    } else if (frequency === "week") {
      setGoal(3); // Default to 3 times per week
    } else if (frequency === "month") {
      setGoal(8); // Default to 8 times per month
    }
  }, [frequency]);

  const handleCloseModal = () => {
    // Animate modal exit
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setHabitName("");
      setHabitDescription("");
      setFrequency("day");
      setGoal(1);
      setUnit("");
      onClose();
    });
  };

  const handleSaveHabit = () => {
    if (habitName.trim()) {
      onSave({
        name: habitName,
        description: habitDescription,
        frequency: frequency,
        goal: goal,
        unit: unit.trim(),
      });
      setHabitName("");
      setHabitDescription("");
      setFrequency("day");
      setGoal(1);
      setUnit("");
    }
  };

  // Calculate toggle position for the animated slider
  const togglePosition = toggleAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ["0%", "33.33%", "66.66%"],
  });

  // Calculate modal slide-in transform
  const modalTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <Modal
      animationType="none" // We'll handle animation ourselves
      transparent={true}
      visible={visible}
      onRequestClose={handleCloseModal}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animated.View style={[styles.modalOverlay, { opacity: opacityAnim }]}>
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: modalTranslateY }] },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Habit</Text>
            </View>
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Drink water, Read, Exercise"
                placeholderTextColor="#666666"
                value={habitName}
                onChangeText={setHabitName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Description (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add some details about your habit"
                placeholderTextColor="#666666"
                value={habitDescription}
                onChangeText={setHabitDescription}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Unit (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., pages, cups, kilometers"
                placeholderTextColor="#666666"
                value={unit}
                onChangeText={setUnit}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Frequency</Text>
              <View style={styles.toggleContainer}>
                <View style={styles.toggleBackground}>
                  {/* Animated slider that moves with the selected option */}
                  <Animated.View
                    style={[styles.toggleSlider, { left: togglePosition }]}
                  />

                  <TouchableOpacity
                    style={styles.toggleOption}
                    onPress={() => setFrequency("day")}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        frequency === "day" && styles.activeToggleText,
                      ]}
                    >
                      Day
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.toggleOption}
                    onPress={() => setFrequency("week")}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        frequency === "week" && styles.activeToggleText,
                      ]}
                    >
                      Week
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.toggleOption}
                    onPress={() => setFrequency("month")}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        frequency === "month" && styles.activeToggleText,
                      ]}
                    >
                      Month
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>
                {frequency === "day"
                  ? "Day Goal"
                  : frequency === "week"
                  ? "Week Goal"
                  : "Month Goal"}
              </Text>
              <View style={styles.goalContainer}>
                <TouchableOpacity
                  style={styles.goalButton}
                  onPress={() => setGoal(Math.max(1, goal - 1))}
                  disabled={goal <= 1}
                >
                  <Text
                    style={[
                      styles.goalButtonText,
                      goal <= 1 && styles.goalButtonDisabled,
                    ]}
                  >
                    -
                  </Text>
                </TouchableOpacity>

                <View style={styles.goalValueContainer}>
                  <Text style={styles.goalValue}>{goal}</Text>
                  <Text style={styles.goalLabel}>
                    {unit
                      ? `${unit}${goal > 1 ? "s" : ""} per ${frequency.slice(
                          0,
                          -2
                        )}`
                      : frequency === "day"
                      ? goal === 1
                        ? "time per day"
                        : "times per day"
                      : frequency === "week"
                      ? goal === 1
                        ? "time per week"
                        : "times per week"
                      : goal === 1
                      ? "time per month"
                      : "times per month"}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.goalButton}
                  onPress={() => {
                    // Set reasonable max values based on frequency
                    const maxValue =
                      frequency === "day" ? 10 : frequency === "week" ? 7 : 31;
                    setGoal(Math.min(maxValue, goal + 1));
                  }}
                  disabled={
                    goal >=
                    (frequency === "day" ? 10 : frequency === "week" ? 7 : 31)
                  }
                >
                  <Text
                    style={[
                      styles.goalButtonText,
                      goal >=
                        (frequency === "day"
                          ? 10
                          : frequency === "week"
                          ? 7
                          : 31) && styles.goalButtonDisabled,
                    ]}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCloseModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  !habitName.trim() && styles.saveButtonDisabled,
                ]}
                onPress={handleSaveHabit}
                disabled={!habitName.trim()}
              >
                <Text style={styles.saveButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default HabitForm;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    backgroundColor: "#0a0a0a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 15,
    borderWidth: 1,
    borderColor: "#00ff88",
    borderBottomWidth: 0,
    maxHeight: Dimensions.get('window').height * 0.8, // Set max height to 80% of screen height
  },
  scrollContent: {
    flexGrow: 0,
  },
  modalHeader: {
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "left",
  },
  formGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#999999",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    color: "#ffffff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333333",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  weekdaysContainer: {
    marginBottom: 24,
  },
  weekdayButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  weekdayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  activeWeekday: {
    backgroundColor: "#00ff88",
  },
  weekdayText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  activeWeekdayText: {
    color: "#000000",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    marginRight: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  cancelButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#00ff88",
    marginLeft: 10,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#1a1a1a",
    opacity: 0.5,
    borderWidth: 1,
    borderColor: "#333",
  },
  saveButtonText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 16,
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
  goalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  goalButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  goalButtonText: {
    color: "#00ff88",
    fontSize: 20,
    fontWeight: "700",
  },
  goalButtonDisabled: {
    color: "#555",
  },
  goalValueContainer: {
    flex: 1,
    alignItems: "center",
  },
  goalValue: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
  },
  goalLabel: {
    color: "#999",
    fontSize: 14,
    marginTop: 4,
  },
});
