import React, { useState, useEffect } from "react";
import { View, Pressable, Text, Dimensions } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isToday,
} from "date-fns";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { TransactionDetails } from "./TransactionDetails";
import { DATE_FORMAT, formatDate } from "../../utils/dateFormat";
import { useTransactions } from "../../hooks/useTransactions";
import { DynamicIcon } from "../DynamicIcon";
import { useTransactionContext } from "../../context/TransactionContext";
import { es } from "date-fns/locale";

interface CalendarProps {
  onMonthChange?: (date: Date) => void;
}

export function Calendar({ onMonthChange }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const { transactions, loading, fetchTransactions } = useTransactions();
  const { refreshCount } = useTransactionContext();

  useEffect(() => {
    fetchTransactions(currentDate);
  }, [currentDate, refreshCount]);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    setCurrentDate(new Date(newDate));
    onMonthChange?.(new Date(newDate));
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    setCurrentDate(new Date(newDate));
    onMonthChange?.(new Date(newDate));
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

  const translateX = useSharedValue(0);
  const screenWidth = Dimensions.get("window").width;
  const swipeThreshold = screenWidth * 0.2;

  const swipeGesture = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX([-10, 10])
    .failOffsetY([-5, 5])
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (e.translationX > swipeThreshold) {
        handlePrevMonth();
      } else if (e.translationX < -swipeThreshold) {
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
    <View className="border-b border-gray-100">
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={animatedStyle}>
          {/* Header del Mes */}
          <View className="flex-row items-center justify-between px-4 py-3">
            <Pressable
              onPress={handlePrevMonth}
              className="w-10 h-10 items-center justify-center rounded-full active:bg-black/5"
            >
              <ChevronLeft size={24} color="black" />
            </Pressable>
            <Text className="text-black text-lg font-medium">
              {formatDate(currentDate, DATE_FORMAT.MONTH_YEAR)}
            </Text>
            <Pressable
              onPress={handleNextMonth}
              className="w-10 h-10 items-center justify-center rounded-full active:bg-black/5"
            >
              <ChevronRight size={24} color="black" />
            </Pressable>
          </View>

          {/* Días de la semana */}
          <View className="flex-row px-2 py-2">
            {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => (
              <View key={index} className="flex-1 items-center">
                <Text className="text-gray-500 text-sm">{day}</Text>
              </View>
            ))}
          </View>

          {/* Grid de días */}
          <View className="px-2 pb-2">
            {Array.from({ length: Math.ceil(daysInMonth.length / 7) }).map(
              (_, weekIndex) => (
                <View key={weekIndex} className="flex-row">
                  {daysInMonth
                    .slice(weekIndex * 7, weekIndex * 7 + 7)
                    .map((date, dayIndex) => {
                      const isCurrentMonth =
                        date.getMonth() === currentDate.getMonth();
                      const transactionsForDate = getTransactionsForDate(date);
                      const hasTransactions = transactionsForDate.length > 0;
                      const displayTransactions = transactionsForDate.slice(
                        0,
                        2
                      );
                      const hasMoreTransactions =
                        transactionsForDate.length > 2;
                      const isCurrentDay = isToday(date);
                      const isSelected = selectedDate === formatDate(date);

                      return (
                        <Pressable
                          key={dayIndex}
                          onPress={() => handleDatePress(date)}
                          className="flex-1 aspect-square items-center py-1.5"
                        >
                          <View className="relative flex items-center">
                            {/* Número del día */}
                            <View
                              className={`w-9 h-9 items-center justify-center rounded-full
                                ${isSelected ? "bg-black" : ""}
                                ${
                                  isCurrentDay && !isSelected
                                    ? "border border-black"
                                    : ""
                                }
                              `}
                            >
                              <Text
                                className={`text-sm
                                  ${
                                    isSelected
                                      ? "text-white font-medium"
                                      : isCurrentMonth
                                      ? "text-black"
                                      : "text-gray-400"
                                  }
                                  ${
                                    isCurrentDay && !isSelected
                                      ? "font-medium"
                                      : ""
                                  }
                                `}
                              >
                                {formatDate(date, DATE_FORMAT.DAY)}
                              </Text>
                            </View>

                            {/* Contenedor para iconos */}
                            <View className="absolute -bottom-2">
                              {hasTransactions && isCurrentMonth && (
                                <View className="flex-row items-center">
                                  {displayTransactions.map(
                                    (transaction, index) => (
                                      <View
                                        key={transaction.id}
                                        style={{
                                          marginLeft: index > 0 ? -6 : 0,
                                        }}
                                      >
                                        <DynamicIcon
                                          fallbackType={transaction.type}
                                          size={14}
                                          subscriptionName={
                                            transaction.category ===
                                            "subscriptions"
                                              ? transaction.name
                                              : undefined
                                          }
                                          color="black"
                                        />
                                      </View>
                                    )
                                  )}
                                  {hasMoreTransactions && (
                                    <Text className="text-gray-500 text-[10px] ml-0.5">
                                      +{transactionsForDate.length - 2}
                                    </Text>
                                  )}
                                </View>
                              )}
                            </View>
                          </View>
                        </Pressable>
                      );
                    })}
                </View>
              )
            )}
          </View>
        </Animated.View>
      </GestureDetector>

      <TransactionDetails
        visible={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        date={selectedDate || ""}
        transactions={selectedDate ? getTransactionsForDate(selectedDate) : []}
      />
    </View>
  );
}
