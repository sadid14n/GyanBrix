import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "@react-native-firebase/firestore";
import {
  getAllClasses,
  getAllSubjects,
} from "../../../../services/dataManager";
import { firestoreDB } from "../../../../services/firebaseConfig";
import { useAuth } from "../../../../services/userManager";
import COLORS from "./../../../../constants/color";

const { width } = Dimensions.get("window");
const BANNER_HEIGHT = 180;

// const adUnitId = __DEV__
//   ? TestIds.REWARDED
//   : "ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy";

// const rewarded = RewardedAd.createForAdRequest(adUnitId, {
//   keywords: ["fashion", "clothing"],
// });

export default function HomeScreen() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const router = useRouter();
  const { user, getUserProfile, updateUserSelectedClass } = useAuth();
  const scrollViewRef = useRef(null);
  const bannerScrollRef = useRef(null);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const q = query(
          collection(firestoreDB, "banners"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBanners(data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setBannersLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-scroll banners
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
        bannerScrollRef.current?.scrollToOffset({
          offset: nextIndex * width,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000); // Change banner every 3 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  // const [loaded, setLoaded] = useState(false);

  // useEffect(() => {
  //   const unsubscribeLoaded = rewarded.addAdEventListener(
  //     RewardedAdEventType.LOADED,
  //     () => {
  //       setLoaded(true);
  //       rewarded.show();
  //     }
  //   );
  //   const unsubscribeEarned = rewarded.addAdEventListener(
  //     RewardedAdEventType.EARNED_REWARD,
  //     (reward) => {
  //       console.log("User earned reward of ", reward);
  //     }
  //   );

  //   // Start loading the rewarded ad straight away
  //   rewarded.load();

  //   // Unsubscribe from events on unmount
  //   return () => {
  //     unsubscribeLoaded();
  //     unsubscribeEarned();
  //   };
  // }, []);

  // Fetch user profile and load classes

  useEffect(() => {
    const init = async () => {
      const cls = await getAllClasses();
      setClasses(cls);

      if (user) {
        const profile = await getUserProfile(user.uid);
        if (profile?.selectedClass) {
          setSelectedClass(profile.selectedClass);
          const subs = await getAllSubjects(profile.selectedClass);
          setSubjects(subs);
        }
      }

      setLoading(false);
    };
    init();
  }, []);

  // Handle class change
  const handleClassChange = async (classId) => {
    setSelectedClass(classId);
    const subs = await getAllSubjects(classId);
    setSubjects(subs);
    if (user) await updateUserSelectedClass(user.uid, classId);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your courses...</Text>
      </View>
    );
  }
  const SUBJECT_COLORS = [
    "#FAD4D8", // soft pink
    "#CDE7FF", // light sky blue
    "#D6F5D6", // pastel green
    "#FFF3B0", // warm yellow
    "#E3D4FF", // soft lavender
    "#FFD8B5", // light orange/peach
    "#C8FFF4", // mint aqua
    "#FFB3B3", // standard pink
    "#A7C7E7", // standard blue
    "#B2E0B2", // standard green
    "#FFE699", // standard yellow
    "#D0A8FF", // standard purple
  ];

  const renderBannerItem = ({ item }) => (
    <View style={styles.bannerSlide}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.bannerImage}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Banner Carousel */}
      {!bannersLoading && banners.length > 0 && (
        <View style={styles.bannerContainer}>
          <Animated.FlatList
            ref={bannerScrollRef}
            data={banners}
            renderItem={renderBannerItem}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setCurrentBannerIndex(index);
            }}
            decelerationRate="fast"
            snapToInterval={width}
            snapToAlignment="center"
          />

          {/* Pagination Dots */}
          {banners.length > 1 && (
            <View style={styles.pagination}>
              {banners.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentBannerIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      )}

      {/* Banner Loading State */}
      {bannersLoading && (
        <View style={styles.bannerLoadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      )}

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>Welcome Back! 👋</Text>
        <Text style={styles.welcomeSubtext}>
          Let`s continue your learning journey
        </Text>
      </View>

      {/* Class Selector */}
      <View style={styles.classSelector}>
        <Text style={styles.sectionTitle}>📚 Select Your Class</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedClass}
            onValueChange={(value) => handleClassChange(value)}
            style={styles.picker}
            dropdownIconColor={COLORS.textPrimary}
          >
            <Picker.Item label="Choose a class..." value={null} />
            {classes.map((cls) => (
              <Picker.Item key={cls.id} label={cls.name} value={cls.id} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Subjects Section */}
      {selectedClass ? (
        <View style={styles.subjectsSection}>
          <View style={styles.subjectHeader}>
            <Text style={styles.sectionTitle}>📖 Your Subjects</Text>
            <Text style={styles.subjectCount}>{subjects.length} subjects</Text>
          </View>

          <View style={styles.subjectGrid}>
            {subjects.map((subject, index) => {
              const bgColor = SUBJECT_COLORS[index % SUBJECT_COLORS.length];
              return (
                <TouchableOpacity
                  key={subject.id}
                  style={[styles.subjectCard, { backgroundColor: bgColor }]}
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push(
                      `/(drawer)/(tabs)/home/subject/${subject.id}?classId=${selectedClass}`
                    )
                  }
                >
                  <View style={styles.subjectIconContainer}>
                    <Text style={styles.subjectIcon}>
                      {getSubjectIcon(subject.name)}
                    </Text>
                  </View>
                  <Text style={styles.subjectText} numberOfLines={2}>
                    {subject.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🎯</Text>
          <Text style={styles.emptyStateText}>
            Select a class to view subjects
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

// Helper function to get subject icons
function getSubjectIcon(subjectName) {
  const name = subjectName.toLowerCase();
  if (name.includes("math")) return "🔢";
  if (name.includes("science")) return "🔬";
  if (name.includes("english")) return "📝";
  if (name.includes("history")) return "📜";
  if (name.includes("geography")) return "🌍";
  if (name.includes("physics")) return "⚛️";
  if (name.includes("chemistry")) return "🧪";
  if (name.includes("biology")) return "🧬";
  if (name.includes("computer")) return "💻";
  if (name.includes("art")) return "🎨";
  if (name.includes("music")) return "🎵";
  if (name.includes("physical")) return "⚽";
  return "📚";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  contentContainer: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },

  // Banner Styles
  bannerContainer: {
    height: BANNER_HEIGHT + 40,
    marginBottom: 10,
  },
  bannerLoadingContainer: {
    height: BANNER_HEIGHT + 40,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerSlide: {
    width: width,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  bannerImage: {
    width: width - 32,
    height: BANNER_HEIGHT,
    borderRadius: 16,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DDD",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.primary || "#4A90E2",
    width: 24,
  },

  // Welcome Section
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 15,
    color: "#666",
    fontWeight: "400",
  },

  // Class Selector
  classSelector: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    overflow: "hidden",
  },
  picker: {
    height: 52,
    color: "#1A1A1A",
  },

  // Subjects Section
  subjectsSection: {
    paddingHorizontal: 16,
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  subjectCount: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subjectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  subjectCard: {
    width: "48%",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    minHeight: 130,
    justifyContent: "space-between",
  },
  subjectIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  subjectIcon: {
    fontSize: 24,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    lineHeight: 22,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    fontWeight: "500",
  },
});
