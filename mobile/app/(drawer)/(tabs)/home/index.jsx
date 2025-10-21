import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  getAllClasses,
  getAllSubjects,
} from "../../../../services/dataManager";
import { useAuth } from "../../../../services/userManager";
import COLORS from "./../../../../constants/color";

export default function HomeScreen() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { user, getUserProfile, updateUserSelectedClass } = useAuth();

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

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

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

  // return (
  //   <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.background }}>
  //     <View style={styles.container}>
  //       <Picker
  //         selectedValue={selectedClass}
  //         onValueChange={(value) => handleClassChange(value)}
  //         style={styles.picker}
  //       >
  //         <Picker.Item label="Select Class" value={null} />
  //         {classes.map((cls) => (
  //           <Picker.Item key={cls.id} label={cls.name} value={cls.id} />
  //         ))}
  //       </Picker>
  //     </View>

  //     <View style={styles.subjectContainer}>
  //       {subjects.map((subject, index) => {
  //         const bgColor = SUBJECT_COLORS[index % SUBJECT_COLORS.length]; // cycle colors
  //         return (
  //           <View
  //             key={subject.id}
  //             style={[styles.subjectCard, { backgroundColor: bgColor }]}
  //           >
  //             <Text
  //               onPress={() => {
  //                 router.push(
  //                   `/(drawer)/(tabs)/home/subject/${subject.id}?classId=${selectedClass}`
  //                 );
  //               }}
  //               style={styles.subjectText}
  //             >
  //               {subject.name}
  //             </Text>
  //           </View>
  //         );
  //       })}
  //     </View>
  //   </View>
  // );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>📚 Select Your Class</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedClass}
            onValueChange={(value) => handleClassChange(value)}
            style={styles.picker}
            dropdownIconColor={COLORS.textPrimary}
          >
            <Picker.Item label="Select Class" value={null} />
            {classes.map((cls) => (
              <Picker.Item key={cls.id} label={cls.name} value={cls.id} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Subject Cards */}
      {selectedClass && (
        <View style={styles.subjectContainer}>
          <Text style={styles.subjectHeading}>Subjects</Text>

          <View style={styles.subjectGrid}>
            {subjects.map((subject, index) => {
              const bgColor = SUBJECT_COLORS[index % SUBJECT_COLORS.length];
              return (
                <TouchableOpacity
                  key={subject.id}
                  style={[styles.subjectCard, { backgroundColor: bgColor }]}
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push(
                      `/(drawer)/(tabs)/home/subject/${subject.id}?classId=${selectedClass}`
                    )
                  }
                >
                  <Text style={styles.subjectText}>{subject.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "flex-start", // picker stays on LHS
//     justifyContent: "center",
//     width: "100%",
//   },
//   picker: {
//     width: 180, // adjust as needed
//     height: 50,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     backgroundColor: COLORS.primary,
//   },
//   subjectContainer: {
//     borderBottomColor: "#ccc",
//     paddingVertical: 10,
//     width: "100%",
//   },
//   subjectCard: {
//     backgroundColor: "#f8ceebff",
//     borderRadius: 8,
//     padding: 10,
//     marginVertical: 5,
//     height: 100,
//     justifyContent: "center",
//   },
//   subjectText: {
//     fontSize: 26,
//     paddingLeft: 14,
//     color: COLORS.textPrimary,
//     fontWeight: "bold",
//   },
// });

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: COLORS.textPrimary,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: COLORS.textPrimary,
  },
  subjectContainer: {
    marginTop: 10,
  },
  subjectHeading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
    color: COLORS.textPrimary,
  },
  subjectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  subjectCard: {
    width: "48%",
    borderRadius: 14,
    paddingVertical: 25,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  subjectText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
});
