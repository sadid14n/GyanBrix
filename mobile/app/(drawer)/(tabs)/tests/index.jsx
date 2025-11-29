import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../../../constants/color";

export default function TestHome() {
  const Card = ({ title, description, path, icon, gradient }) => (
    <TouchableOpacity
      onPress={() => router.push(path)}
      style={styles.card}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: gradient }]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <View style={styles.arrowContainer}>
        <Text style={styles.arrowText}>→</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Text style={styles.headerIcon}>📝</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Tests</Text>
          <Text style={styles.headerSubtitle}>
            Choose your test type to begin
          </Text>
        </View>
      </View>

      {/* Cards Section */}
      <View style={styles.cardsContainer}>
        <Card
          title="Class Tests"
          description="Full class-level mock tests to evaluate overall performance"
          path="/(drawer)/(tabs)/tests/class-tests"
          icon="🎓"
          gradient="#E3F2FD"
        />

        <Card
          title="Subject Tests"
          description="Select any subject to start focused practice tests"
          path="/(drawer)/(tabs)/tests/subject-tests"
          icon="📚"
          gradient="#F3E5F5"
        />

        <Card
          title="Chapter Tests"
          description="Select subject & chapter for targeted learning"
          path="/(drawer)/(tabs)/tests/chapter-tests"
          icon="📖"
          gradient="#E8F5E9"
        />
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <View style={styles.infoBannerIcon}>
          <Text style={styles.infoBannerIconText}>💡</Text>
        </View>
        <View style={styles.infoBannerContent}>
          <Text style={styles.infoBannerTitle}>Pro Tip</Text>
          <Text style={styles.infoBannerText}>
            Start with chapter tests to build confidence, then move to subject
            and class tests
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    paddingVertical: 8,
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  headerIcon: {
    fontSize: 32,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.textDark,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: "500",
    letterSpacing: 0.1,
  },

  // Cards Container
  cardsContainer: {
    gap: 16,
  },

  // Card Styles
  card: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(25, 118, 210, 0.08)",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconText: {
    fontSize: 28,
  },
  cardContent: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontWeight: "500",
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: "bold",
  },

  // Info Banner
  infoBanner: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 20,
    marginTop: 24,
    borderWidth: 2,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoBannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoBannerIconText: {
    fontSize: 24,
  },
  infoBannerContent: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  infoBannerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    fontWeight: "500",
  },
});
