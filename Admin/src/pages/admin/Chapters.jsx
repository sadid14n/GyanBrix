import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FileText, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useAuth } from "./../../context/AuthContext";
import { getAllClasses } from "../../services/classManager";
import { getAllSubjects } from "../../services/subjectManager";
import {
  addChapter,
  deleteChapter,
  getAllChapters,
  updateChapter,
} from "../../services/chapterManager";

const Chapters = () => {
  const [chapters, setChapters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    classId: "",
    subjectId: "",
  });

  const { user } = useAuth();

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["code-block"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const quillFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "indent",
    "link",
    "image",
    "video",
    "color",
    "background",
    "align",
    "script",
    "code-block",
  ];

  const fetchData = async () => {
    const cls = await getAllClasses();
    setClasses(cls);

    let allSubjects = [];
    for (const c of cls) {
      const subj = await getAllSubjects(c.id);
      allSubjects = [...allSubjects, ...subj];
    }
    setSubjects(allSubjects);

    let allChapters = [];
    for (const s of allSubjects) {
      const chaps = await getAllChapters(s.classId, s.id);
      allChapters = [...allChapters, ...chaps];
    }
    setChapters(allChapters);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveToStorage = (updatedChapters) => {
    localStorage.setItem("lms_chapters", JSON.stringify(updatedChapters));
    setChapters(updatedChapters);
  };

  // const getSubjectInfo = (subjectId) => {
  //   const subject = subjects.find((sub) => sub.id === parseInt(subjectId));
  //   if (!subject)
  //     return { subjectName: "Unknown Subject", className: "Unknown Class" };

  //   const className =
  //     classes.find((cls) => cls.id === subject.classId)?.name ||
  //     "Unknown Class";
  //   return { subjectName: subject.name, className };
  // };

  const getSubjectInfo = (classId, subjectId) => {
    const classInfo = classes.find((cls) => cls.id === classId);
    if (!classInfo) return { classname: "Unknown Class" };

    const subjectInfo = subjects.find((sub) => sub.id === subjectId);
    if (!subjectInfo) return { subjectname: "Unknown Subject" };

    return { classname: classInfo.name, subjectname: subjectInfo.name };
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (editingChapter) {
  //     // Update existing chapter
  //     const updatedChapters = chapters.map((chapter) =>
  //       chapter.id === editingChapter.id
  //         ? {
  //             ...chapter,
  //             ...formData,
  //             subjectId: parseInt(formData.subjectId),
  //             updatedAt: new Date().toISOString(),
  //           }
  //         : chapter
  //     );
  //     saveToStorage(updatedChapters);
  //   } else {
  //     // Create new chapter
  //     const newChapter = {
  //       id: Date.now(),
  //       ...formData,
  //       subjectId: parseInt(formData.subjectId),
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //     };
  //     saveToStorage([...chapters, newChapter]);
  //   }

  //   setFormData({ title: "", content: "", subjectId: "" });
  //   setEditingChapter(null);
  //   setIsModalOpen(false);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subjectId) return;

    const subject = subjects.find((s) => s.id === formData.subjectId);
    if (!subject) return;

    if (editingChapter) {
      // 🔥 Update chapter in Firestore
      await updateChapter(
        subject.classId,
        subject.id,
        editingChapter.id,
        formData.title,
        formData.content
      );
    } else {
      // 🔥 Add new chapter in Firestore
      await addChapter(
        subject.classId,
        subject.id,
        formData.title,
        formData.content,
        user
      );
    }

    await fetchData();

    setFormData({ title: "", content: "", subjectId: "" });
    setEditingChapter(null);
    setIsModalOpen(false);
  };

  const handleEdit = (chapter) => {
    setEditingChapter(chapter);
    setFormData({
      title: chapter.title,
      content: chapter.content,
      subjectId: chapter.subjectId,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (chapter) => {
    if (confirm("Are you sure you want to delete this chapter?")) {
      await deleteChapter(chapter.classId, chapter.subjectId, chapter.id);
      await fetchData();
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = () => {
    setEditingChapter(null);
    setFormData({ title: "", content: "", subjectId: "" });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-heading">
            Chapters
          </h1>
          <p className="text-text-subtle mt-1">
            Manage chapter solutions for your subjects
          </p>
        </div>
        <button
          onClick={openModal}
          className="admin-button-primary flex items-center"
          disabled={subjects.length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Chapter
        </button>
      </div>

      {/* Warning if no subjects */}
      {subjects.length === 0 && (
        <div className="admin-card bg-warning/10 border-warning/20">
          <p className="text-warning-foreground">
            You need to create at least one subject before adding chapters.{" "}
            <a href="/admin/subjects" className="font-medium underline">
              Create a subject first
            </a>
          </p>
        </div>
      )}

      {/* Chapters Grid */}
      {chapters.length === 0 ? (
        <div className="admin-card text-center py-12">
          <FileText className="h-12 w-12 text-text-subtle mx-auto mb-4" />
          <h3 className="text-lg font-heading font-medium text-text-heading mb-2">
            No chapters yet
          </h3>
          <p className="text-text-subtle mb-4">
            Get started by creating your first chapter solution
          </p>
          <button
            onClick={openModal}
            className="admin-button-primary"
            disabled={subjects.length === 0}
          >
            Create First Chapter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chapters.map((chapter) => {
            const { subjectname, classname } = getSubjectInfo(
              chapter.classId,
              chapter.subjectId
            );
            return (
              <div key={chapter.id} className="admin-card group">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-success" />
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/admin/chapters/${chapter.id}`}
                      className="p-2 text-text-subtle hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleEdit(chapter)}
                      className="p-2 text-text-subtle hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(chapter)}
                      className="p-2 text-text-subtle hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <Link to={`/admin/chapters/${chapter.id}`}>
                  <h3 className="text-lg font-heading font-semibold text-text-heading mb-2 hover:text-primary transition-colors cursor-pointer">
                    {chapter.title}
                  </h3>
                </Link>
                <div
                  className="text-text-body text-sm mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: chapter.content }}
                />
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full w-fit">
                      {subjectname}
                    </span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full w-fit">
                      {classname}
                    </span>
                  </div>
                  <div className="text-xs text-text-subtle">
                    {new Date(chapter.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center  min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* <div
              className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
              onClick={() => setIsModalOpen(false)}
            ></div> */}

            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-surface shadow-xl rounded-lg">
              <h3 className="text-lg font-heading font-semibold text-text-heading mb-4">
                {editingChapter ? "Edit Chapter" : "Create New Chapter"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="subjectId"
                    className="block text-sm font-medium text-text-body mb-2"
                  >
                    Subject
                  </label>
                  <select
                    id="subjectId"
                    name="subjectId"
                    value={formData.subjectId}
                    onChange={handleChange}
                    required
                    className="admin-input"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject) => {
                      const className =
                        classes.find((cls) => cls.id === subject.classId)
                          ?.name || "";
                      return (
                        <option key={subject.id} value={subject.id}>
                          {className} - {subject.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-text-body mb-2"
                  >
                    Chapter Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="admin-input"
                    placeholder="e.g., Acid Base and Salt, Thermodynamics"
                  />
                </div>

                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-text-body mb-2"
                  >
                    Chapter Content/Solution
                  </label>
                  <div className="bg-surface border border-border rounded-lg">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(content) =>
                        setFormData({ ...formData, content })
                      }
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Enter the chapter content, solutions, or study material..."
                      style={{ minHeight: "200px" }}
                    />
                  </div>
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
                    {editingChapter ? "Update" : "Create"}
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

export default Chapters;
