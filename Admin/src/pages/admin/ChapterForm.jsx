import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { firebaseStorage } from "../../firebase/firebaseConfig";

const ChapterForm = ({
  isOpen,
  onClose,
  onSubmit,
  editingChapter,
  subjects,
  classes,
  formData,
  setFormData,
}) => {
  const quillRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(null);

  // Custom Image Upload Handler
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const imageRef = ref(
        firebaseStorage,
        `chapterImages/${Date.now()}-${file.name}`
      );

      const uploadTask = uploadBytesResumable(imageRef, file);
      setUploadProgress(0);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress.toFixed(0));
        },
        (error) => {
          console.error("Image upload failed:", error);
          setUploadProgress(null);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, "image", downloadURL);
          setUploadProgress(null);
        }
      );
    };
  };

  // const quillModules = {
  //   toolbar: [
  //     [{ header: [1, 2, 3, 4, 5, 6, false] }],
  //     [{ font: [] }],
  //     [{ size: ["small", false, "large", "huge"] }],
  //     ["bold", "italic", "underline", "strike"],
  //     [{ color: [] }, { background: [] }],
  //     [{ script: "sub" }, { script: "super" }],
  //     [{ list: "ordered" }, { list: "bullet" }],
  //     [{ indent: "-1" }, { indent: "+1" }],
  //     [{ direction: "rtl" }],
  //     [{ align: [] }],
  //     ["link", "image", "video"],
  //     ["code-block"],
  //     ["clean"],
  //   ],
  //   clipboard: {
  //     matchVisual: false,
  //   },
  //   handlers: {
  //     image: imageHandler, // custom handler
  //   },
  // };

  const quillModules = {
    toolbar: {
      container: [
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
      handlers: {
        image: imageHandler,
      },
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuillChange = (content) => {
    setFormData({ ...formData, content });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // send formData back to parent
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-surface shadow-xl rounded-lg">
          <h3 className="text-lg font-heading font-semibold text-text-heading mb-4">
            {editingChapter ? "Edit Chapter" : "Create New Chapter"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject */}
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
                    classes.find((cls) => cls.id === subject.classId)?.name ||
                    "";
                  return (
                    <option key={subject.id} value={subject.id}>
                      {className} - {subject.name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Title */}
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

            {/* Content */}
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
                  onChange={handleQuillChange}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Enter the chapter content, solutions, or study material..."
                  style={{ minHeight: "200px" }}
                />
              </div>
              {uploadProgress !== null && (
                <div className="mt-2 text-sm text-blue-600">
                  Uploading Image... {uploadProgress}%
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
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
  );
};

export default ChapterForm;
