import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../../../../../constants/color";
import { getAllChapters } from "../../../../../../services/dataManager";

export default function Chapters() {
  const router = useRouter();
  const { subjectId, classId } = useLocalSearchParams();

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch chapters from Firestore
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const data = await getAllChapters(classId, subjectId);
        setChapters(data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      } finally {
        setLoading(false);
      }
    };

    if (classId && subjectId) {
      fetchChapters();
    } else {
      console.warn("Missing classId or subjectId in route params");
      setLoading(false);
    }
  }, [classId, subjectId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#ff6600" />
      </View>
    );
  }

  // return (
  //   <ScrollView style={styles.container}>
  //     <Text style={styles.title}>📘 Chapters for {subjectId}</Text>

  //     {chapters.length > 0 ? (
  //       chapters.map((chapter) => (
  //         <TouchableOpacity
  //           key={chapter.id}
  //           onPress={() =>
  //             router.push(
  //               `/home/subject/${subjectId}/${chapter.id}?classId=${classId}`
  //             )
  //           }
  //           style={styles.chapterButton}
  //           activeOpacity={0.8}
  //         >
  //           <Text style={styles.chapterText}>{chapter.title}</Text>
  //         </TouchableOpacity>
  //       ))
  //     ) : (
  //       <Text style={styles.noChapters}>No chapters found.</Text>
  //     )}
  //   </ScrollView>
  // );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      {/* <View style={styles.headerCard}>
        <Text style={styles.headerIcon}>📘</Text>
        <View>
          <Text style={styles.headerTitle}>Chapters</Text>
          <Text style={styles.headerSubtitle}>for {subjectId}</Text>
        </View>
      </View> */}

      {/* Chapter List */}
      {chapters.length > 0 ? (
        <View style={styles.chapterList}>
          {chapters.map((chapter, index) => (
            <TouchableOpacity
              key={chapter.id}
              onPress={() =>
                router.push(
                  `/home/subject/${subjectId}/${chapter.id}?classId=${classId}`
                )
              }
              style={[
                styles.chapterCard,
                {
                  backgroundColor:
                    index % 2 === 0
                      ? COLORS.cardBackground
                      : COLORS.inputBackground,
                },
              ]}
              activeOpacity={0.85}
            >
              <Text style={styles.chapterNumber}>Chapter {index + 1}</Text>
              <Text style={styles.chapterTitle}>{chapter.title}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📖</Text>
          <Text style={styles.emptyText}>No chapters available yet.</Text>
        </View>
      )}
    </ScrollView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#222",
//   },
//   chapterButton: {
//     backgroundColor: "#007BFF",
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   chapterText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   noChapters: {
//     fontSize: 16,
//     color: "#777",
//   },
// });

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  headerIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  chapterList: {
    marginTop: 10,
  },
  chapterCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  chapterNumber: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  chapterTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginLeft: 10,
  },
  arrow: {
    fontSize: 28,
    color: COLORS.primary,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
});
