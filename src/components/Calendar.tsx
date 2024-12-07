import React, { useState } from "react";
import { View, Pressable, Text } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { TransactionDetails } from "./TransactionDetails";
import { DATE_FORMAT, formatDate } from "../utils/dateFormat";
import { useTransactions } from "../hooks/useTransactions";
import { DynamicIcon } from "./DynamicIcon";

export function Calendar() {
  const { transactions, loading } = useTransactions();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const translateX = useSharedValue(0);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const daysInMonth = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const totalMonthlySpend = transactions
    .filter((t) => t.category === "subscription")
    .reduce((total, t) => total + t.amount, 0);

  const weekDays = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const swipeGesture = Gesture.Pan()
    .runOnJS(true)
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (e.translationX > 100) {
        handlePrevMonth();
      } else if (e.translationX < -100) {
        handleNextMonth();
      }
      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const getTransactionsForDate = (dateInput: Date | string) => {
    try {
      const targetDate =
        typeof dateInput === "string"
          ? (() => {
              const [day, month, year] = dateInput.split("/");
              return new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day)
              );
            })()
          : dateInput;

      if (!(targetDate instanceof Date) || isNaN(targetDate.getTime())) {
        throw new Error("Invalid date");
      }

      return transactions.filter((transaction) => {
        try {
          const [day, month, year] = transaction.date.split("/");
          const transactionDate = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day)
          );

          return (
            transactionDate.getDate() === targetDate.getDate() &&
            transactionDate.getMonth() === targetDate.getMonth() &&
            transactionDate.getFullYear() === targetDate.getFullYear()
          );
        } catch {
          return false;
        }
      });
    } catch (error) {
      console.error("Error en getTransactionsForDate:", error);
      return [];
    }
  };

  const handleDatePress = (date: Date) => {
    const formattedDate = formatDate(date);
    setSelectedDate(formattedDate);
    setDetailsModalVisible(true);
  };

  return (
    <View className="bg-teal/5 p-4 rounded-3xl overflow-hidden border border-teal/10">
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={animatedStyle}>
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center space-x-4">
              <Pressable onPress={handlePrevMonth}>
                <ChevronLeft size={24} color="#F6DCAC" />
              </Pressable>
              <Pressable onPress={handleNextMonth}>
                <ChevronRight size={24} color="#F6DCAC" />
              </Pressable>
              <Text className="text-sand text-3xl font-bold">
                {formatDate(currentDate, DATE_FORMAT.MONTH_YEAR)}
              </Text>
            </View>
            <View>
              <Text className="text-coral text-lg">Monthly Spend</Text>
              <Text className="text-sand text-2xl font-bold">
                ${totalMonthlySpend.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Week days */}
          <View className="flex-row justify-between mb-4">
            {weekDays.map((day) => (
              <View key={day} className="flex-1 items-center">
                <Text className="text-teal font-medium">{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar grid */}
          <View className="flex-row flex-wrap justify-between gap-y-2">
            {daysInMonth.map((date) => {
              const dateStr = formatDate(date, DATE_FORMAT.API);
              const transactionsForDate = getTransactionsForDate(date);
              const hasTransactions = transactionsForDate.length > 0;
              const displayTransactions = transactionsForDate.slice(0, 2);
              const hasMoreTransactions = transactionsForDate.length > 2;

              return (
                <Pressable
                  key={dateStr}
                  className={`w-[14%] h-12 items-center justify-between rounded-2xl py-1
                    ${hasTransactions ? "bg-teal/20" : "bg-oxfordBlue/50"}`}
                  onPress={() => handleDatePress(date)}
                >
                  <Text className="text-sand">
                    {formatDate(date, DATE_FORMAT.DAY)}
                  </Text>
                  {hasTransactions && (
                    <View className="flex-row items-center">
                      {displayTransactions.map((transaction, index) => (
                        <View
                          key={transaction.id}
                          style={{ marginLeft: index > 0 ? -4 : 0 }}
                        >
                          <DynamicIcon
                            svgPath={transaction.icon_data?.svg_path}
                            fallbackType={transaction.type}
                            size={16}
                          />
                        </View>
                      ))}
                      {hasMoreTransactions && (
                        <Text className="text-white text-xs ml-1">
                          +{transactionsForDate.length - 2}
                        </Text>
                      )}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          <TransactionDetails
            visible={detailsModalVisible}
            onClose={() => setDetailsModalVisible(false)}
            selectedDate={selectedDate}
            transactions={
              selectedDate ? getTransactionsForDate(selectedDate) : []
            }
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
