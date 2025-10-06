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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📘 Chapters for {subjectId}</Text>

      {chapters.length > 0 ? (
        chapters.map((chapter) => (
          <TouchableOpacity
            key={chapter.id}
            onPress={() =>
              router.push(
                `/home/subject/${subjectId}/${chapter.id}?classId=${classId}`
              )
            }
            style={styles.chapterButton}
            activeOpacity={0.8}
          >
            <Text style={styles.chapterText}>{chapter.title}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noChapters}>No chapters found.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#222",
  },
  chapterButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  chapterText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  noChapters: {
    fontSize: 16,
    color: "#777",
  },
});
