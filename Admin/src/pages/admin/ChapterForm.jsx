import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
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
  const [isUploading, setIsUploading] = useState(false); // 🆕 prevent typing

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState("");

  /* ------------------ PDF Upload ------------------ */

  const handlePdfUpload = () => {
    if (!pdfFile) return alert("Please select a PDF first");

    setIsUploading(true);

    const path = `chapterPDF/${Date.now()}-${pdfFile.name}`;
    const pdfRef = ref(firebaseStorage, path);

    const uploadTask = uploadBytesResumable(pdfRef, pdfFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress.toFixed(0));
      },
      (error) => {
        console.error("❌ PDF upload error:", error);
        alert("PDF upload failed!");
        setIsUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData({ ...formData, pdfUrl: downloadURL });
        setUploadProgress(null);
        setIsUploading(false);
        alert("PDF uploaded successfully!");
      }
    );
  };

  const handlePdfSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please select a valid PDF file");
      return;
    }

    setPdfFile(file);
    setPdfPreviewUrl(URL.createObjectURL(file));
  };

  /* ------------------ Quill Image Handler ------------------ */
  const imageHandler = () => {
    if (formData.chapterType === "pdf") {
      alert("PDF chapter type selected. Switch to text mode to use editor.");
      return;
    }

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      setIsUploading(true);
      setUploadProgress(0);

      const imageRef = ref(
        firebaseStorage,
        `chapterImages/${Date.now()}-${file.name}`
      );
      const uploadTask = uploadBytesResumable(imageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress.toFixed(0));
        },
        () => {
          alert("Image upload failed");
          setIsUploading(false);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, "image", url);
          quill.setSelection(range.index + 1);

          setIsUploading(false);
        }
      );
    };
  };

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

    if (formData.chapterType === "pdf" && !formData.pdfUrl) {
      alert("Upload PDF before submitting.");
      return;
    }

    onSubmit(formData); // send formData back to parent
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl bg-surface p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4">
            {editingChapter ? "Edit Chapter" : "Create Chapter"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject */}
            <select
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              className="admin-input"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {classes.find((c) => c.id === s.classId)?.name} — {s.name}
                </option>
              ))}
            </select>

            {/* Title */}
            <input
              type="text"
              name="title"
              className="admin-input"
              placeholder="Chapter Title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            {/* Chapter Type */}
            <div className="flex gap-6">
              <label>
                <input
                  type="radio"
                  name="chapterType"
                  value="text"
                  checked={formData.chapterType === "text"}
                  onChange={handleChange}
                />{" "}
                Text (Quill)
              </label>
              <label>
                <input
                  type="radio"
                  name="chapterType"
                  value="pdf"
                  checked={formData.chapterType === "pdf"}
                  onChange={handleChange}
                />{" "}
                PDF Upload
              </label>
            </div>

            {/* Show Quill Editor if chapter type = text */}
            {formData.chapterType === "text" && (
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={formData.content}
                onChange={handleQuillChange}
                modules={quillModules}
                formats={quillFormats}
                readOnly={isUploading}
                placeholder="Enter the chapter content, solutions, or study material..."
                style={{ minHeight: "200px", opacity: isUploading ? 0.6 : 1 }}
              />
            )}

            {/* Show PDF Upload if type = pdf */}
            {formData.chapterType === "pdf" && (
              <div className="space-y-3">
                {/* Select PDF Button */}
                <label className="inline-block cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
                  Select PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handlePdfSelect}
                  />
                </label>

                {/* Preview */}
                {pdfPreviewUrl && (
                  <div className="border rounded-lg overflow-hidden h-64">
                    <iframe
                      src={pdfPreviewUrl}
                      className="w-full h-full"
                      title="PDF Preview"
                    />
                  </div>
                )}

                {/* Upload button */}
                {pdfFile && !formData.pdfUrl && (
                  <button
                    type="button"
                    onClick={handlePdfUpload}
                    disabled={isUploading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 disabled:opacity-50"
                  >
                    {isUploading ? "Uploading..." : "Upload PDF"}
                  </button>
                )}

                {/* Progress */}
                {uploadProgress && <p>Uploading: {uploadProgress}%</p>}

                {/* Uploaded indicator */}
                {formData.pdfUrl && (
                  <p className="text-green-600 font-medium mt-2">
                    📌 PDF uploaded successfully
                  </p>
                )}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3">
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
