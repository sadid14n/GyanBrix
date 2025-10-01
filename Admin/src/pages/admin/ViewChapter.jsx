import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  FileText,
  Calendar,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import {
  deleteChapter,
  getChapter,
  updateChapter,
} from "../../services/chapterManager";
import { getSubject } from "../../services/subjectManager";
import { getClass } from "../../services/classManager";
import ChapterForm from "./ChapterForm";

const ViewChapter = () => {
  const { classId, subjectId, chapterId } = useParams();
  const navigate = useNavigate();

  const [chapter, setChapter] = useState(null);
  const [subject, setSubject] = useState(null);
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    subjectId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const chapterData = await getChapter(classId, subjectId, chapterId);
        setChapter(chapterData);

        if (chapterData) {
          const subjectData = await getSubject(classId, subjectId);
          setSubject(subjectData);

          const classData = await getClass(classId);
          setClassInfo(classData);
        }
      } catch (error) {
        console.error("Error fetching chapter:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [classId, subjectId, chapterId]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this chapter?")) {
      await deleteChapter(classId, subjectId, chapterId);
      navigate("/admin/chapters");
    }
  };

  const openEditModal = () => {
    if (!chapter) return;

    setFormData({
      title: chapter.title || "",
      content: chapter.content || "",
      subjectId: chapter.subjectId || "",
    });

    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data) => {
    try {
      await updateChapter(
        classId,
        subjectId,
        chapterId,
        data.title,
        data.content
      );
      setIsModalOpen(false);

      // Refresh chapter data
      const updatedChapter = await getChapter(classId, subjectId, chapterId);
      setChapter(updatedChapter);
    } catch (error) {
      console.error("Error updating chapter:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-text-subtle">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="admin-card text-center py-12">
        <FileText className="h-12 w-12 text-text-subtle mx-auto mb-4" />
        <h3 className="text-lg font-heading font-medium text-text-heading mb-2">
          Chapter not found
        </h3>
        <p className="text-text-subtle mb-4">
          The chapter you're looking for doesn't exist or has been deleted.
        </p>
        <Link to="/admin/chapters" className="admin-button-primary">
          Back to Chapters
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/chapters"
            className="p-2 text-text-subtle hover:text-text-heading hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-text-heading">
              {chapter.title}
            </h1>
            <div className="flex items-center space-x-4 mt-1">
              {classInfo && (
                <span className="inline-flex items-center text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  {classInfo.name}
                </span>
              )}
              {subject && (
                <span className="inline-flex items-center text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {subject.name}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={openEditModal}
            className="admin-button-secondary flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-error text-error-foreground hover:bg-error/90 rounded-lg font-medium transition-colors flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="admin-card">
            <div className="mb-6">
              <h2 className="text-xl font-heading font-semibold text-text-heading mb-4">
                Chapter Content
              </h2>
              <div className="prose prose-slate max-w-none">
                <div
                  className="text-text-body leading-relaxed ql-editor"
                  dangerouslySetInnerHTML={{ __html: chapter.content }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Chapter Info */}
            <div className="admin-card">
              <h3 className="text-lg font-heading font-semibold text-text-heading mb-4">
                Chapter Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-subtle">
                    Title
                  </label>
                  <p className="text-text-body mt-1">{chapter.title}</p>
                </div>

                {subject && (
                  <div>
                    <label className="text-sm font-medium text-text-subtle">
                      Subject
                    </label>
                    <p className="text-text-body mt-1">{subject.name}</p>
                  </div>
                )}

                {classInfo && (
                  <div>
                    <label className="text-sm font-medium text-text-subtle">
                      Class
                    </label>
                    <p className="text-text-body mt-1">{classInfo.name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="admin-card">
              <h3 className="text-lg font-heading font-semibold text-text-heading mb-4">
                Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-4 w-4 text-success mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-body">
                      Created
                    </p>
                    <p className="text-xs text-text-subtle">
                      {chapter.createdAt?.toDate
                        ? chapter.createdAt.toDate().toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {chapter.updatedAt !== chapter.createdAt && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-4 w-4 text-warning mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-text-body">
                        Last Updated
                      </p>
                      <p className="text-xs text-text-subtle">
                        {chapter.updatedAt?.toDate
                          ? chapter.updatedAt.toDate().toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="admin-card">
              <h3 className="text-lg font-heading font-semibold text-text-heading mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={openEditModal}
                  className="w-full admin-button-secondary flex items-center justify-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Chapter
                </button>
                <Link
                  to="/admin/chapters"
                  className="w-full admin-button-secondary flex items-center justify-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  All Chapters
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChapterForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingChapter={chapter}
        subjects={[subject]} // only current subject
        classes={[classInfo]} // only current class
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default ViewChapter;
