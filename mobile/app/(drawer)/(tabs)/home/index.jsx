import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

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

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: COLORS.background }}>
      <View style={styles.container}>
        <Picker
          selectedValue={selectedClass}
          onValueChange={(value) => handleClassChange(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Class" value={null} />
          {classes.map((cls) => (
            <Picker.Item key={cls.id} label={cls.name} value={cls.id} />
          ))}
        </Picker>
      </View>

      <Text style={{ fontSize: 20, marginTop: 20, fontWeight: "bold" }}>
        Subjects:
      </Text>

      <View style={styles.subjectContainer}>
        {subjects.map((subject) => (
          <View key={subject.id} style={styles.subjectCard}>
            <Text
              // onPress={() =>
              //   router.push(
              //     `/home/subject/${subject.id}?classId=${selectedClass}`
              //   )
              // }
              onPress={() => {
                router.push(
                  `/(drawer)/(tabs)/home/subject/${subject.id}?classId=${selectedClass}`
                );
              }}
              style={styles.subjectText}
            >
              📘 {subject.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start", // picker stays on LHS
    justifyContent: "center",
    width: "100%",
  },
  picker: {
    width: 180, // adjust as needed
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  subjectContainer: {
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    width: "100%",
  },
  subjectCard: {
    backgroundColor: "#f9cfe0ff",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    height: 100,
    justifyContent: "center",
  },
  subjectText: { fontSize: 22, color: COLORS.textPrimary, fontWeight: "bold" },
});
