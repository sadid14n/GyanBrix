import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import RenderHtml from "react-native-render-html";
import {
  getChapter,
  submitFeedback,
} from "../../../../../../services/dataManager";
import { useAuth } from "../../../../../../services/userManager";

export default function ChapterContent() {
  const { subjectId, chapterId, classId } = useLocalSearchParams();
  const { width } = useWindowDimensions();

  const { getUserName, user, profile } = useAuth();

  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState("Loading...");

  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  // Fetch single chapter details from Firestore
  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const data = await getChapter(classId, subjectId, chapterId);
        setChapter(data);

        // 2️⃣ Fetch author name using userId from chapter.createdBy
        if (data?.createdBy) {
          const name = await getUserName(data.createdBy);
          setAuthorName(name);
        } else {
          setAuthorName("Unknown Author");
        }
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

  const handleSubmitFeedback = async () => {
    if (!feedbackText.trim()) {
      Alert.alert("Error", "Please enter your feedback before submitting.");
      return;
    }

    try {
      await submitFeedback({
        userId: user?.uid || "guest",
        userName: profile?.name || "Anonymous",
        chapterId,
        subjectId,
        classId,
        message: feedbackText,
      });
      Alert.alert("Success", "Your feedback has been submitted!");
      setFeedbackText("");
      setFeedbackModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to send feedback. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff6600" />
      </View>
    );
  }

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
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Chapter Title */}
        <Text style={styles.title}>{chapter.title}</Text>

        {/* Author & Date */}
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>Author: {authorName}</Text>
          <Text style={styles.metaText}>Updated: {formattedDate}</Text>
        </View>

        {/* HTML Content */}
        <View style={styles.contentContainer}>
          <RenderHtml
            contentWidth={width - 40}
            source={{ html: chapter.content || "<p>No content available.</p>" }}
            tagsStyles={htmlStyles}
          />
        </View>

        {/* Feedback Button */}
        {/* <TouchableOpacity
        style={styles.feedbackButton}
        onPress={() => setFeedbackModalVisible(true)}
      >
        <Text style={styles.feedbackButtonText}>Send Feedback</Text>
      </TouchableOpacity> */}

        {/* Feedback Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={feedbackModalVisible}
          onRequestClose={() => setFeedbackModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Send Feedback</Text>
              <TextInput
                style={styles.input}
                placeholder="Write your message..."
                multiline
                value={feedbackText}
                onChangeText={setFeedbackText}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setFeedbackModalVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmitFeedback}
                >
                  <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>

      {/* Floating button placed AFTER ScrollView */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setFeedbackModalVisible(true)}
      >
        <Ionicons name="chatbubble-ellipses" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
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
  feedbackButton: {
    marginTop: 20,
    backgroundColor: "#ff6600",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  feedbackButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    height: 100,
    textAlignVertical: "top",
    padding: 10,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelButton: {
    padding: 10,
  },
  cancelText: {
    color: "#555",
  },
  submitButton: {
    backgroundColor: "#ff6600",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  floatingButton: {
    position: "absolute",
    bottom: 25,
    right: 20,
    backgroundColor: "#ff6600",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
});

// /* ---------------------- 🧾 HTML STYLES ---------------------- */
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
