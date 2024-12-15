import React, { useState, useEffect } from "react";
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
  isSameDay,
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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const { transactions, loading, fetchTransactions } = useTransactions();

  // Cargar transacciones cuando cambie el mes
  useEffect(() => {
    fetchTransactions(currentDate);
  }, [currentDate]);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    setCurrentDate(new Date(newDate));
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    setCurrentDate(new Date(newDate));
  };

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

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const daysInMonth = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const totalMonthlySpend = transactions
    .filter((t) => t.type === "expense")
    .reduce((total, t) => total + t.amount, 0);

  const weekDays = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

  const translateX = useSharedValue(0);

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

  const handleDatePress = (date: Date) => {
    const formattedDate = formatDate(date);
    setSelectedDate(formattedDate);
    setDetailsModalVisible(true);
  };

  return (
    <View className="shadow-lg">
      <View
        className="bg-white p-4 mx-4 rounded-3xl overflow-hidden border border-veryPaleBlue/10"
        style={{
          elevation: 8, // Para Android
          shadowColor: "#755bce",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        }}
      >
        <GestureDetector gesture={swipeGesture}>
          <Animated.View style={animatedStyle}>
            {/* Header */}
            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-textSecondary text-base font-semibold">
                  Gasto mensual
                </Text>
                <Text className="text-textPrimary text-xl font-bold">
                  ${totalMonthlySpend.toLocaleString("es-CL")}
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className="flex-row items-center space-x-2">
                  <Pressable onPress={handlePrevMonth} hitSlop={8}>
                    <ChevronLeft size={24} color="#755bce" />
                  </Pressable>
                  <Pressable onPress={handleNextMonth} hitSlop={8}>
                    <ChevronRight size={24} color="#755bce" />
                  </Pressable>
                </View>
                <Text className="text-textPrimary text-2xl font-bold ml-2">
                  {formatDate(currentDate, DATE_FORMAT.MONTH_YEAR)}
                </Text>
              </View>
            </View>

            {/* Week days */}
            <View className="flex-row justify-between mb-4">
              {weekDays.map((day) => (
                <View key={day} className="flex-1 items-center">
                  <Text className="text-textSecondary font-medium">{day}</Text>
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
                const isToday = isSameDay(date, new Date());

                return (
                  <Pressable
                    key={dateStr}
                    className={`w-[14%] h-12 items-center justify-between rounded-2xl py-1
                      ${isToday ? "bg-moderateBlue/10" : ""}`}
                    onPress={() => handleDatePress(date)}
                  >
                    <Text
                      className={`${
                        isToday
                          ? "text-textSecondary font-bold"
                          : "text-textPrimary"
                      }`}
                    >
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
                              fallbackType={transaction.type}
                              size={16}
                            />
                          </View>
                        ))}
                        {hasMoreTransactions && (
                          <Text className="text-textSecondary text-xs ml-1">
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
              date={selectedDate || ""}
              transactions={
                selectedDate ? getTransactionsForDate(selectedDate) : []
              }
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}
