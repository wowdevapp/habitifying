import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const HabitDetailScreen = () => {
  // Get the habit ID from the URL params
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Animation values
  const [scrollY] = useState(new Animated.Value(0));

  // Mock habit data - in a real app, you'd fetch this based on the ID
  const [habit, setHabit] = useState({
    id: id as string,
    name: "Morning Meditation",
    description: "Start each day with mindfulness",
    streak: 7,
    longestStreak: 14,
    completedToday: false,
    completionRate: 85,
    color: "#00B2FF",
    icon: "water-outline",
  });

  // Calculate header opacity based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // Calculate title opacity based on scroll
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  });

  // Calculate hero section height based on scroll
  const heroHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 100],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View>
        <Text style={{ color: "white" }}>{"Habit Detail"}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "rgba(10, 10, 10, 0.9)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: "#151515",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: "flex-end",
  },
  heroContent: {
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  habitName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
  },
  habitDescription: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  statsCard: {
    flex: 1,
    backgroundColor: "#151515",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 5,
    alignItems: "center",
  },
  statsValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
    color: "#888888",
  },
  todayContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 16,
  },
  completionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 16,
    padding: 16,
  },
  completedButton: {
    backgroundColor: "rgba(0, 178, 255, 0.2)",
  },
  completionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 12,
  },
  placeholderSection: {
    padding: 20,
    marginBottom: 40,
  },
  placeholderText: {
    fontSize: 16,
    color: "#888888",
  },
});

export default HabitDetailScreen;
