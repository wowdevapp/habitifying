import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { Control, Controller, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { HabitFormData } from '../form/types';

interface GoalSelectorProps {
  control: Control<HabitFormData>;
  watch: UseFormWatch<HabitFormData>;
  setValue: UseFormSetValue<HabitFormData>;
}

const GoalSelector = ({ control, watch, setValue }: GoalSelectorProps) => {
  const frequency = watch('frequency');
  const goal = watch('goal');

  return (
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
          onPress={() => setValue("goal", Math.max(1, goal - 1))}
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
          <Controller
            control={control}
            name="unit"
            render={({ field: { value } }) => (
              <Text style={styles.goalLabel}>
                {value
                  ? `${value}${goal > 1 ? "s" : ""} per ${frequency.slice(
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
            )}
          />
        </View>

        <TouchableOpacity
          style={styles.goalButton}
          onPress={() => setValue("goal", goal + 1)}
          activeOpacity={0.7}
        >
          <Text style={styles.goalButtonText}>+</Text>
        </TouchableOpacity>
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

export default GoalSelector;
