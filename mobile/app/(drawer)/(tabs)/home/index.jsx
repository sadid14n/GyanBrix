import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import {
  getAllClasses,
  getAllSubjects,
} from "../../../../services/dataManager";
import { useAuth } from "../../../../services/userManager";

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
    <View style={{ flex: 1, padding: 16 }}>
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

      {subjects.map((subject) => (
        <Text
          key={subject.id}
          onPress={() =>
            router.push(`/home/subject/${subject.id}?classId=${selectedClass}`)
          }
          style={{ marginVertical: 8, fontSize: 16 }}
        >
          📘 {subject.name}
        </Text>
      ))}
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
    backgroundColor: "#f9f9f9",
  },
});
