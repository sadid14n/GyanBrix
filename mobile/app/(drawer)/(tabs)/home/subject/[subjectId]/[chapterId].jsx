import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { getChapter } from "../../../../../../services/dataManager";

export default function ChapterContent() {
  const { subjectId, chapterId, classId } = useLocalSearchParams();
  const { width } = useWindowDimensions();

  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch single chapter details from Firestore
  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const data = await getChapter(classId, subjectId, chapterId);
        setChapter(data);
      } catch (error) {
        console.error("Error fetching chapter content:", error);
      } finally {
        setLoading(false);
      }
    };

    if (classId && subjectId && chapterId) {
      fetchChapter();
    } else {
      console.warn("Missing classId, subjectId, or chapterId");
      setLoading(false);
    }
  }, [classId, subjectId, chapterId]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff6600" />
      </View>
    );
  }

  if (!chapter) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16 }}>No chapter content found.</Text>
      </View>
    );
  }

  const formattedDate = chapter.createdAt
    ? new Date(chapter.createdAt.seconds * 1000).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Unknown Date";

  return (
    <ScrollView style={styles.container}>
      {/* Chapter Title */}
      <Text style={styles.title}>{chapter.title}</Text>

      {/* Author & Date */}
      <View style={styles.metaContainer}>
        <Text style={styles.metaText}>✍️ Author: {chapter.createdBy}</Text>
        <Text style={styles.metaText}>📅 Updated: {formattedDate}</Text>
      </View>

      {/* HTML Content */}
      <View style={styles.contentContainer}>
        <RenderHtml
          contentWidth={width - 40}
          source={{ html: chapter.content || "<p>No content available.</p>" }}
          tagsStyles={htmlStyles}
        />
      </View>
    </ScrollView>
  );
}

/* ---------------------- 🎨 STYLES ---------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 10,
  },
  metaContainer: {
    marginBottom: 20,
  },
  metaText: {
    fontSize: 14,
    color: "#666",
  },
  contentContainer: {
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
});

/* ---------------------- 🧾 HTML STYLES ---------------------- */
const htmlStyles = {
  p: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 10,
  },
  h1: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  h2: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  h3: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  strong: {
    fontWeight: "bold",
  },
  em: {
    fontStyle: "italic",
  },
  u: {
    textDecorationLine: "underline",
  },
  ul: {
    marginVertical: 10,
    paddingLeft: 20,
  },
  ol: {
    marginVertical: 10,
    paddingLeft: 20,
  },
  li: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
};
