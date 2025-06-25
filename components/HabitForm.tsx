import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Animated,
  Easing,
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from "react-native";

// Import subcomponents
import FormInput from "./form/FormInput";
import FrequencySelector from "./form/FrequencySelector";
import GoalSelector from "./form/GoalSelector";
import FormButtons from "./form/FormButtons";
import { HabitFormProps, HabitFormData } from "./form/types";

// Types moved to ./form/types.ts

const HabitForm = ({ visible, onClose, onSave }: HabitFormProps) => {
  // React Hook Form setup
  const { control, handleSubmit, watch, setValue, reset } = useForm<HabitFormData>({ 
    defaultValues: {
      name: "",
      description: "",
      frequency: "day",
      goal: 1,
      unit: ""
    }
  });
  
  // Watch values for reactive updates
  const frequency = watch("frequency");
  const goal = watch("goal");

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
      setValue("goal", 1); // Default to once per day
    } else if (frequency === "week") {
      setValue("goal", 3); // Default to 3 times per week
    } else if (frequency === "month") {
      setValue("goal", 8); // Default to 8 times per month
    }
  }, [frequency, setValue]);

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
      reset({
        name: "",
        description: "",
        frequency: "day",
        goal: 1,
        unit: ""
      });
      onClose();
    });
  };

  const onSubmit = (data: HabitFormData) => {
    if (data.name.trim()) {
      // Ensure unit is trimmed
      data.unit = data.unit.trim();
      onSave(data);
      reset({
        name: "",
        description: "",
        frequency: "day",
        goal: 1,
        unit: ""
      });
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

            <FormInput 
              control={control}
              name="name"
              label="Habit Name"
              placeholder="Enter habit name"
            />

            <FormInput 
              control={control}
              name="description"
              label="Description"
              placeholder="Enter description"
              multiline={true}
              numberOfLines={3}
              optional={true}
            />

            <FormInput 
              control={control}
              name="unit"
              label="Unit"
              placeholder="e.g., glass, mile, page"
              optional={true}
            />

            <FrequencySelector 
              control={control}
              watch={watch}
              setValue={setValue}
            />

            <GoalSelector 
              control={control}
              watch={watch}
              setValue={setValue}
            />

            <FormButtons 
              onCancel={handleCloseModal}
              onSubmit={handleSubmit(onSubmit)}
              watch={watch}
            />
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
  }
});
