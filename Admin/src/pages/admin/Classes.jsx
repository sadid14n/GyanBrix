import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, GraduationCap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  addClass,
  deleteClass,
  getAllClasses,
  updateClass,
} from "../../services/classManager";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const { user } = useAuth();

  useEffect(() => {
    const fetchClasses = async () => {
      const allClasses = await getAllClasses();
      setClasses(allClasses);
    };
    fetchClasses();
  }, []);
  const saveToStorage = (updatedClasses) => {
    localStorage.setItem("lms_classes", JSON.stringify(updatedClasses));
    setClasses(updatedClasses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingClass) {
        // update existing class
        await updateClass(editingClass.id, formData.name);
      } else {
        // create new class
        await addClass(formData.name, user);
      }

      // reload after save
      const allClasses = await getAllClasses();
      setClasses(allClasses);

      setFormData({ name: "", description: "" });
      setEditingClass(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving class:", err);
    }
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setFormData({ name: cls.name, description: cls.description || "" });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this class?")) {
      try {
        await deleteClass(id);
        setClasses((prev) => prev.filter((cls) => cls.id !== id));
      } catch (err) {
        console.error("Error deleting class:", err);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = () => {
    setEditingClass(null);
    setFormData({ name: "", description: "" });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-heading">
            Classes
          </h1>
          <p className="text-text-subtle mt-1">
            Manage your educational classes
          </p>
        </div>
        <button
          onClick={openModal}
          className="admin-button-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Class
        </button>
      </div>

      {/* Classes Grid */}
      {classes.length === 0 ? (
        <div className="admin-card text-center py-12">
          <GraduationCap className="h-12 w-12 text-text-subtle mx-auto mb-4" />
          <h3 className="text-lg font-heading font-medium text-text-heading mb-2">
            No classes yet
          </h3>
          <p className="text-text-subtle mb-4">
            Get started by creating your first class
          </p>
          <button onClick={openModal} className="admin-button-primary">
            Create First Class
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls.id} className="admin-card group">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(cls)}
                    className="p-2 text-text-subtle hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cls.id)}
                    className="p-2 text-text-subtle hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-heading font-semibold text-text-heading mb-2">
                {cls.name}
              </h3>
              <p className="text-text-body text-sm mb-4">{cls.description}</p>
              <div className="text-xs text-text-subtle">
                Created {cls.createdAt?.toDate().toLocaleDateString()}
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
              className="fixed inset-0 transition-opacity  bg-opacity-50"
              onClick={() => setIsModalOpen(false)}
            ></div> */}

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-surface shadow-xl rounded-lg">
              <h3 className="text-lg font-heading font-semibold text-text-heading mb-4">
                {editingClass ? "Edit Class" : "Create New Class"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-text-body mb-2"
                  >
                    Class Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="admin-input"
                    placeholder="e.g., Class 10, Class 11"
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
                    placeholder="Brief description of the class"
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
                    {editingClass ? "Update" : "Create"}
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

export default Classes;
