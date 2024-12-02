import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Image } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addDays,
} from "date-fns";
import { es } from "date-fns/locale";
import NetflixLogo from "../assets/NetflixLogo";
import MaxLogo from "../assets/MaxLogo";
import MercadolibreLogo from "../assets/MercadolibreLogo";
import SpotifyLogo from "../assets/SpotifyLogo";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type SubscriptionType = "monthly" | "annual";

interface Subscription {
  id: number;
  name: string;
  icon: any;
  amount: number;
  startDate: string; // formato: "YYYY-MM-DD"
  totalSpent: number;
  type: SubscriptionType;
}

const subscriptions: Subscription[] = [
  {
    id: 1,
    name: "Netflix",
    icon: NetflixLogo,
    amount: 15.0,
    startDate: "2024-03-04",
    totalSpent: 270.0,
    type: "monthly",
  },
  {
    id: 2,
    name: "HBO Max",
    icon: MaxLogo,
    amount: 199.99,
    startDate: "2024-03-16",
    totalSpent: 359.82,
    type: "monthly",
  },
  {
    id: 3,
    name: "Mercado Libre",
    icon: MercadolibreLogo,
    amount: 33.9,
    startDate: "2024-03-07",
    totalSpent: 169.5,
    type: "monthly",
  },
  {
    id: 4,
    name: "Spotify",
    icon: SpotifyLogo,
    amount: 33.9,
    startDate: "2024-03-22",
    totalSpent: 169.5,
    type: "monthly",
  },
  {
    id: 5,
    name: "Spotify",
    icon: SpotifyLogo,
    amount: 33.9,
    startDate: "2024-03-22",
    totalSpent: 169.5,
    type: "monthly",
  },
  {
    id: 6,
    name: "Spotify",
    icon: SpotifyLogo,
    amount: 33.9,
    startDate: "2024-03-22",
    totalSpent: 169.5,
    type: "monthly",
  },
];

const getSubscriptionDates = (
  subscription: Subscription,
  currentMonth: Date
) => {
  const startDate = new Date(subscription.startDate);
  const dates: Date[] = [];

  if (subscription.type === "monthly") {
    // Si es mensual, obtener el día del mes de la fecha de inicio
    const dayOfMonth = startDate.getDate();
    const date = new Date(currentMonth);
    date.setDate(dayOfMonth);
    dates.push(date);
  } else if (subscription.type === "annual") {
    // Si es anual, verificar si el mes y día coinciden
    const monthDay = startDate.getDate();
    const monthNumber = startDate.getMonth();

    if (currentMonth.getMonth() === monthNumber) {
      const date = new Date(currentMonth);
      date.setDate(monthDay);
      dates.push(date);
    }
  }

  return dates;
};

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const translateX = useSharedValue(0);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const daysInMonth = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const totalMonthlySpend = subscriptions.reduce(
    (total, sub) => total + sub.amount,
    0
  );

  const weekDays = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDatePress = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const subscription = subscriptions.find((sub) => sub.startDate === dateStr);
    if (subscription) {
      setSelectedDate(dateStr);
      setModalVisible(true);
    }
  };

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

  const getSubscriptionsForDate = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const subsForDate: Subscription[] = [];

    subscriptions.forEach((subscription) => {
      const subDates = getSubscriptionDates(subscription, date);
      if (
        subDates.some(
          (subDate) => format(subDate, "yyyy-MM-dd") === formattedDate
        )
      ) {
        subsForDate.push(subscription);
      }
    });

    return subsForDate;
  };

  return (
    <View className="bg-black p-4 rounded-3xl overflow-hidden">
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={animatedStyle}>
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center space-x-4">
              <TouchableOpacity onPress={handlePrevMonth}>
                <ChevronLeft size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNextMonth}>
                <ChevronRight size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-white text-3xl font-bold">
                {format(currentDate, "MMMM yyyy", { locale: es })}
              </Text>
            </View>
            <View>
              <Text className="text-white text-lg">Monthly Spend</Text>
              <Text className="text-white text-2xl font-bold">
                ${totalMonthlySpend.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Week days */}
          <View className="flex-row justify-between mb-4">
            {weekDays.map((day) => (
              <View key={day} className="flex-1 items-center">
                <Text className="text-gray-400 font-medium">{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar grid */}
          <View className="flex-row flex-wrap justify-between gap-y-2">
            {daysInMonth.map((date) => {
              const dateStr = format(date, "yyyy-MM-dd");
              const subsForDate = getSubscriptionsForDate(date);
              const hasSubscriptions = subsForDate.length > 0;
              const sortedSubs = [...subsForDate].sort((a, b) =>
                a.name.localeCompare(b.name)
              );
              const displaySubs = sortedSubs.slice(0, 2);
              const hasMoreSubs = sortedSubs.length > 2;

              return (
                <TouchableOpacity
                  key={dateStr}
                  className={`w-[14%] h-12 items-center justify-between rounded-2xl py-1
                    ${hasSubscriptions ? "bg-gray-800" : "bg-gray-900"}`}
                  onPress={() => handleDatePress(date)}
                >
                  <Text className="text-white">{format(date, "d")}</Text>
                  {hasSubscriptions && (
                    <View className="flex-row items-center">
                      {displaySubs.map((sub, index) => (
                        <View
                          key={sub.id}
                          style={{ marginLeft: index > 0 ? -4 : 0 }}
                        >
                          <sub.icon width={16} height={16} />
                        </View>
                      ))}
                      {hasMoreSubs && (
                        <Text className="text-white text-xs ml-1">
                          +{sortedSubs.length - 2}
                        </Text>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Subscription Details Modal */}
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableOpacity
              className="flex-1 bg-black/50"
              activeOpacity={1}
              onPress={() => setModalVisible(false)}
            >
              <View className="m-4 p-4 bg-gray-900 rounded-3xl mt-auto mb-20">
                {selectedDate &&
                  getSubscriptionsForDate(new Date(selectedDate)).map(
                    (subscription) => (
                      <View
                        key={subscription.id}
                        className="flex-row justify-between items-center py-4 border-b border-gray-800"
                      >
                        <View className="flex-row items-center">
                          <View className="w-8 h-8 mr-3">
                            <subscription.icon width={32} height={32} />
                          </View>
                          <View>
                            <Text className="text-white text-lg font-bold">
                              {subscription.name}
                            </Text>
                            <Text className="text-gray-400">
                              {subscription.type === "monthly"
                                ? "Monthly"
                                : "Annual"}{" "}
                              subscription on the{" "}
                              {format(new Date(selectedDate), "do")}
                            </Text>
                          </View>
                        </View>
                        <View className="items-end">
                          <Text className="text-white text-xl font-bold">
                            ${subscription.amount.toFixed(2)}
                          </Text>
                          <Text className="text-gray-400">Next payment</Text>
                          <Text className="text-gray-400 mt-2">
                            Total since {subscription.startDate}
                          </Text>
                          <Text className="text-white font-bold">
                            ${subscription.totalSpent.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    )
                  )}
              </View>
            </TouchableOpacity>
          </Modal>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
