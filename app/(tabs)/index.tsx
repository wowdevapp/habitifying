import HabitForm from "@/components/HabitForm";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnimatedHabitCard } from "../../components/AnimatedHabitCard";
import { FloatingAddButton } from "../../components/FloatingAddButton";
import { HabitCard } from "../../components/HabitCard";

// Define the Habit type
interface Habit {
  id: string;
  name: string;
  description: string;
  streak: number;
  isCompleted: boolean;
  isNew?: boolean;
  frequency?: "day" | "week" | "month";
  goal?: number;
  unit?: string;
  color?: string;
  icon?: string;
}

// API base URL - using computer's IP address instead of localhost for mobile access
const API_URL = "http://192.168.100.67:3000";

const HabitTrackerApp = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [overallProgress, setOverallProgress] = useState(0); // Overall completion percentage

  // Fetch habits from the API
  const fetchHabits = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/habits`);
      setHabits(response.data);
      fetchStats();
      setLoading(false);
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching habits:", err);
      setError("Failed to load habits. Please try again.");
      setLoading(false);
    }
  };

  // Fetch stats from the API
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`);
      setOverallProgress(response.data.overallProgress);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // Load habits when component mounts
  useEffect(() => {
    fetchHabits();
  }, []);

  const handleAddHabit = () => {
    console.log("Add habit pressed");
    setModalVisible(true);
  };

  const handleSaveHabit = async (data: any) => {
    try {
      // Create a new habit object
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description || "",
        streak: 0,
        isCompleted: false,
        frequency: data.frequency,
        goal: data.goal,
        unit: data.unit,
      };

      // Save the habit to the server
      const response = await axios.post(`${API_URL}/habits`, newHabit);

      // Add the new habit with isNew flag for animation
      const savedHabit = { ...response.data, isNew: true };
      setHabits([savedHabit, ...habits]);

      // Update stats
      await fetchStats();

      // Close the modal
      setModalVisible(false);

      // Scroll to the top to see the newly created habit
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }

      // Remove the isNew flag after animation completes (3 seconds)
      setTimeout(() => {
        setHabits((currentHabits) =>
          currentHabits.map((habit) =>
            habit.id === savedHabit.id ? { ...habit, isNew: false } : habit
          )
        );
      }, 3000);
    } catch (err) {
      console.error("Error saving habit:", err);
      setError("Failed to save habit. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Function to toggle habit completion
  const handleToggleHabit = async (habitId: string) => {
    try {
      // Find the habit to toggle
      const habitToToggle = habits.find((habit) => habit.id === habitId);
      if (!habitToToggle) return;

      // Optimistically update UI
      setHabits(
        habits.map((habit) =>
          habit.id === habitId
            ? { ...habit, isCompleted: !habit.isCompleted }
            : habit
        )
      );

      // Update on the server
      await axios.patch(`${API_URL}/habits/${habitId}`, {
        isCompleted: !habitToToggle.isCompleted,
      });

      // Update stats
      await fetchStats();
    } catch (err) {
      console.error("Error toggling habit:", err);
      // Revert the optimistic update if there's an error
      fetchHabits();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      {/* Main Content Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.title}>Habits</Text>
        </View>

        {/* Loading and Error States */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00ff88" />
            <Text style={styles.loadingText}>Loading habits...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        {/* Habit Cards */}
        <View style={styles.habitsList}>
          {habits.map((habit) =>
            habit.isNew ? (
              <AnimatedHabitCard
                key={habit.id}
                id={habit.id}
                name={habit.name}
                streak={habit.streak}
                isCompleted={habit.isCompleted}
                onToggleComplete={() => handleToggleHabit(habit.id)}
                isNew={true}
              />
            ) : (
              <HabitCard
                key={habit.id}
                id={habit.id}
                name={habit.name}
                streak={habit.streak}
                isCompleted={habit.isCompleted}
                onToggleComplete={() => handleToggleHabit(habit.id)}
                color={habit.color}
                icon={habit.icon}
              />
            )
          )}
          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <FloatingAddButton onPress={handleAddHabit} />

      {/* Add Habit Modal */}
      <HabitForm
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveHabit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
  },
  header: {
    marginTop: 40,
    marginBottom: 32,
  },
  greeting: {
    fontSize: 17,
    color: "#666666",
    marginBottom: 8,
    fontWeight: "400",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -1,
  },
  habitsList: {
    flex: 1,
    marginTop: 20,
  },
  bottomPadding: {
    height: 80,
  },
  progressContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  progressCircleContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: "#222",
    position: "absolute",
  },
  progressArc: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: "#00ff88",
    position: "absolute",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    transform: [{ rotate: "0deg" }],
  },
  progressInnerCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
  },
  progressLabel: {
    color: "#666666",
    fontSize: 14,
  },
  floatingButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: "#00ff88",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  buttonTouchable: {
    width: "100%",
    height: "100%",
    borderRadius: 28,
    backgroundColor: "#00ff88",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#666666",
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderRadius: 8,
    marginVertical: 10,
  },
  errorText: {
    color: "#ff5555",
    textAlign: "center",
  },
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
  weekdayText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
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
});

export default HabitTrackerApp;
