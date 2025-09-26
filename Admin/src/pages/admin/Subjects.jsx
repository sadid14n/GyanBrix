import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    classId: "",
  });

  useEffect(() => {
    // Load subjects and classes from localStorage
    const savedSubjects = JSON.parse(
      localStorage.getItem("lms_subjects") || "[]"
    );
    const savedClasses = JSON.parse(
      localStorage.getItem("lms_classes") || "[]"
    );
    setSubjects(savedSubjects);
    setClasses(savedClasses);
  }, []);

  const saveToStorage = (updatedSubjects) => {
    localStorage.setItem("lms_subjects", JSON.stringify(updatedSubjects));
    setSubjects(updatedSubjects);
  };

  const getClassName = (classId) => {
    const foundClass = classes.find((cls) => cls.id === parseInt(classId));
    return foundClass ? foundClass.name : "Unknown Class";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingSubject) {
      // Update existing subject
      const updatedSubjects = subjects.map((subject) =>
        subject.id === editingSubject.id
          ? {
              ...subject,
              ...formData,
              classId: parseInt(formData.classId),
              updatedAt: new Date().toISOString(),
            }
          : subject
      );
      saveToStorage(updatedSubjects);
    } else {
      // Create new subject
      const newSubject = {
        id: Date.now(),
        ...formData,
        classId: parseInt(formData.classId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveToStorage([...subjects, newSubject]);
    }

    setFormData({ name: "", description: "", classId: "" });
    setEditingSubject(null);
    setIsModalOpen(false);
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      description: subject.description,
      classId: subject.classId.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      const updatedSubjects = subjects.filter((subject) => subject.id !== id);
      saveToStorage(updatedSubjects);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = () => {
    setEditingSubject(null);
    setFormData({ name: "", description: "", classId: "" });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-heading">
            Subjects
          </h1>
          <p className="text-text-subtle mt-1">
            Manage subjects for your classes
          </p>
        </div>
        <button
          onClick={openModal}
          className="admin-button-primary flex items-center"
          disabled={classes.length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Subject
        </button>
      </div>

      {/* Warning if no classes */}
      {classes.length === 0 && (
        <div className="admin-card bg-warning/10 border-warning/20">
          <p className="text-warning-foreground">
            You need to create at least one class before adding subjects.{" "}
            <a href="/admin/classes" className="font-medium underline">
              Create a class first
            </a>
          </p>
        </div>
      )}

      {/* Subjects Grid */}
      {subjects.length === 0 ? (
        <div className="admin-card text-center py-12">
          <BookOpen className="h-12 w-12 text-text-subtle mx-auto mb-4" />
          <h3 className="text-lg font-heading font-medium text-text-heading mb-2">
            No subjects yet
          </h3>
          <p className="text-text-subtle mb-4">
            Get started by creating your first subject
          </p>
          <button
            onClick={openModal}
            className="admin-button-primary"
            disabled={classes.length === 0}
          >
            Create First Subject
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div key={subject.id} className="admin-card group">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(subject)}
                    className="p-2 text-text-subtle hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="p-2 text-text-subtle hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-heading font-semibold text-text-heading mb-2">
                {subject.name}
              </h3>
              <p className="text-text-body text-sm mb-3">
                {subject.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {getClassName(subject.classId)}
                </span>
                <div className="text-xs text-text-subtle">
                  {new Date(subject.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* <div
              className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
              onClick={() => setIsModalOpen(false)}
            ></div> */}

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-surface shadow-xl rounded-lg">
              <h3 className="text-lg font-heading font-semibold text-text-heading mb-4">
                {editingSubject ? "Edit Subject" : "Create New Subject"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="classId"
                    className="block text-sm font-medium text-text-body mb-2"
                  >
                    Class
                  </label>
                  <select
                    id="classId"
                    name="classId"
                    value={formData.classId}
                    onChange={handleChange}
                    required
                    className="admin-input"
                  >
                    <option value="">Select a class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-text-body mb-2"
                  >
                    Subject Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="admin-input"
                    placeholder="e.g., Mathematics, Physics, Chemistry"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-text-body mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="admin-input"
                    placeholder="Brief description of the subject"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="admin-button-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-button-primary">
                    {editingSubject ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
