import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";

// Import the database directly
import dbData from "../../db.json";

// Define types for the JSON data structure
interface JsonHabit {
  id: string;
  name: string;
  description: string;
  streak: number;
  longestStreak: number;
  completedToday: boolean;
  color: string;
  icon: string;
  completedDates: string[];
  frequency: string;
  goal: number;
  unit?: string;
}

// Define types
interface HabitDetail {
  id: string;
  name: string;
  description: string;
  streak: number;
  longestStreak: number;
  completedToday: boolean;
  color: string;
  icon: string;
  completedDates: string[];
  frequency: "day" | "week" | "month";
  goal: number;
  unit?: string;
}

const HabitDetailScreen: React.FC = () => {
  // Get the habit ID from the URL params
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Animation values
  const [scrollY] = useState(new Animated.Value(0));

  // Current date for calendar
  const [currentDate, setCurrentDate] = useState(new Date());

  // State for habit data
  const [habit, setHabit] = useState<HabitDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load habit data from the imported JSON
  useEffect(() => {
    try {
      setLoading(true);
      // Find the habit with matching ID
      const foundHabit = dbData.habits.find((h: JsonHabit) => h.id === id);

      if (foundHabit) {
        // Validate the frequency value before setting it
        const validFrequency = ["day", "week", "month"].includes(
          foundHabit.frequency
        )
          ? (foundHabit.frequency as "day" | "week" | "month")
          : "day";

        // Convert JsonHabit to HabitDetail with proper typing
        setHabit({
          ...foundHabit,
          frequency: validFrequency,
        });
      } else {
        setError(`Habit with ID ${id} not found`);
      }
    } catch (err) {
      setError("Failed to load habit data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Helper functions for date formatting and checking
  const formatDate = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const isFutureDate = (date: string): boolean => {
    const today = new Date();
    const checkDate = new Date(date);
    return checkDate > today;
  };

  // Function to get today's date in YYYY-MM-DD format
  const getTodayString = (): string => {
    const today = new Date();
    return formatDate(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
  };

  const toggleDateCompletion = (dateString: string): void => {
    if (!habit || isFutureDate(dateString)) return;

    const newCompletedDates = [...habit.completedDates];
    
    // Check if the date is already completed
    const dateIsCompleted = newCompletedDates.includes(dateString);
    
    // Toggle the completion status
    if (dateIsCompleted) {
      const index = newCompletedDates.indexOf(dateString);
      newCompletedDates.splice(index, 1);
    } else {
      newCompletedDates.push(dateString);
    }

    // Check if the toggled date is today
    const todayString = getTodayString();
    const isToday = dateString === todayString;
    
    // Update habit state with new completion status
    setHabit((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        completedDates: newCompletedDates,
        // If the toggled date is today, update completedToday accordingly
        completedToday: isToday ? !dateIsCompleted : prev.completedToday,
      };
    });
  };

  // Function to generate marked dates for the calendar
  const getMarkedDates = (): MarkedDates => {
    if (!habit) return {};
    
    const markedDates: MarkedDates = {};
    const todayString = getTodayString();
    
    // Mark completed dates
    habit.completedDates.forEach(date => {
      markedDates[date] = {
        selected: true,
        selectedColor: habit.color || '#00D4AA',
      };
    });
    
    // Mark today if not completed
    if (!habit.completedDates.includes(todayString)) {
      markedDates[todayString] = {
        selected: true,
        selectedColor: '#2C2C2E',
        selectedTextColor: habit.color || '#00D4AA',
        dotColor: habit.color || '#00D4AA',
      };
    }
    
    return markedDates;
  };
  
  // Handle date selection in calendar
  const handleDayPress = (day: DateData) => {
    if (!isFutureDate(day.dateString)) {
      toggleDateCompletion(day.dateString);
    }
  };
  
  // Render the calendar component
  const renderCalendar = () => {
    if (!habit) return null;
    
    return (
      <View style={styles.calendarContainer}>
        <Calendar
          current={currentDate.toISOString().split('T')[0]}
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
          onMonthChange={(month) => {
            const newDate = new Date(month.timestamp);
            setCurrentDate(newDate);
          }}
          hideExtraDays={true}
          disableAllTouchEventsForDisabledDays={true}
          enableSwipeMonths={true}
          theme={{
            backgroundColor: '#1C1C1E',
            calendarBackground: '#1C1C1E',
            textSectionTitleColor: '#8E8E93',
            selectedDayBackgroundColor: habit.color || '#00D4AA',
            selectedDayTextColor: '#000000',
            todayTextColor: habit.color || '#00D4AA',
            dayTextColor: '#FFFFFF',
            textDisabledColor: '#48484A',
            monthTextColor: '#FFFFFF',
            indicatorColor: habit.color || '#00D4AA',
            arrowColor: '#FFFFFF',
          }}
        />
      </View>
    );
  };

  // Render frequency text based on habit frequency
  const renderFrequencyText = (): string => {
    if (!habit) return "";

    switch (habit.frequency) {
      case "day":
        return "Daily Goal";
      case "week":
        return "Weekly Goal";
      case "month":
        return "Monthly Goal";
      default:
        return "Goal";
    }
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00D4AA" />
          <Text style={styles.loadingText}>Loading habit details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !habit) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || "Habit not found"}</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Habit Card */}
        <View
          style={[
            styles.habitCard,
            { borderLeftColor: habit?.color || "#00D4AA", borderLeftWidth: 4 },
          ]}
        >
          <View style={styles.habitHeader}>
            <View style={styles.habitInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.habitIcon}>{habit.icon}</Text>
                <Text style={styles.habitName}>{habit.name}</Text>
              </View>
              <Text style={styles.habitDescription}>{habit.description}</Text>
              <Text style={styles.habitStreak}>{habit.streak} day streak</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.completionButton,
                habit.completedToday && styles.completedButton,
                {
                  backgroundColor: habit.completedToday
                    ? habit.color || "#00D4AA"
                    : "#2C2C2E",
                },
              ]}
              onPress={() => {
                toggleDateCompletion(getTodayString());
              }}
            >
              {habit.completedToday ? (
                <Text style={styles.checkmark}>✓</Text>
              ) : (
                <View style={styles.emptyCircle} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <Text style={styles.statsValue}>{habit.streak}</Text>
            <Text style={styles.statsLabel}>Current Streak</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsValue}>{habit.longestStreak}</Text>
            <Text style={styles.statsLabel}>Best Streak</Text>
          </View>
          <View style={styles.statsCard}>
            <View style={styles.goalContainer}>
              <Text style={styles.statsValue}>{habit.goal}</Text>
              {habit.unit && <Text style={styles.unitText}>{habit.unit}</Text>}
            </View>
            <Text style={styles.statsLabel}>{renderFrequencyText()}</Text>
          </View>
        </View>

        {/* Full Calendar Section */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Monthly Progress</Text>
          {renderCalendar()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "300",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  habitCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  habitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  habitInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  habitIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  habitName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
  },
  habitDescription: {
    fontSize: 14,
    color: "#AEAEB2",
    marginBottom: 8,
  },
  habitStreak: {
    fontSize: 14,
    color: "#8E8E93",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#ffffff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  errorButton: {
    backgroundColor: "#2C2C2E",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  completionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
  },
  completedButton: {
    backgroundColor: "#00D4AA",
  },
  checkmark: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#48484A",
  },
  weeklyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weekDayContainer: {
    alignItems: "center",
  },
  weekDayLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 8,
    fontWeight: "500",
  },
  weekDayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2C2C2E",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsCard: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
  },
  goalContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  unitText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
    marginLeft: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  calendarSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 16,
  },
  calendarContainer: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 10,
    overflow: "hidden",
  },
});

export default HabitDetailScreen;
