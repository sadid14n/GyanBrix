import { useState } from "react";
import {
  Upload,
  Image,
  Check,
  AlertCircle,
  X,
  CheckCircle,
} from "lucide-react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { firebaseStorage, firestoreDB } from "../../firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

export default function BannerUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      setImage(file);
      setError("");
      setSuccess(false);
      setUploadProgress(0);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError("Please select an image first");
      return;
    }

    setUploading(true);
    setError("");
    setUploadProgress(0);

    try {
      const imageRef = ref(
        firebaseStorage,
        `banners/${Date.now()}_${image.name}`
      );

      // Use uploadBytesResumable for progress tracking
      const uploadTask = uploadBytesResumable(imageRef, image);

      // Listen to upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          // Handle upload error
          console.error("Upload error:", error);
          setError(error.message || "Upload failed. Please try again.");
          setUploading(false);
          setUploadProgress(0);

          // Show error alert
          showAlert(
            "Upload Failed",
            error.message || "Something went wrong",
            "error"
          );
        },
        async () => {
          // Upload completed successfully
          try {
            const url = await getDownloadURL(imageRef);

            await addDoc(collection(firestoreDB, "banners"), {
              imageUrl: url,
              createdAt: new Date().toISOString(),
              storagePath: imageRef.fullPath,
              fileName: image.name,
              fileSize: image.size,
            });

            setSuccess(true);
            setUploading(false);

            // Show success alert
            showAlert(
              "Upload Successful!",
              `${image.name} has been uploaded successfully`,
              "success"
            );

            // Reset after 3 seconds
            setTimeout(() => {
              setImage(null);
              setPreview(null);
              setSuccess(false);
              setUploadProgress(0);
            }, 3000);
          } catch (err) {
            console.error("Firestore error:", err);
            setError("Failed to save banner details");
            setUploading(false);
            showAlert(
              "Database Error",
              "Failed to save banner details",
              "error"
            );
          }
        }
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Upload failed. Please try again.");
      setUploading(false);
      setUploadProgress(0);
      showAlert(
        "Upload Failed",
        err.message || "Something went wrong",
        "error"
      );
    }
  };

  const showAlert = (title, message, type) => {
    // Browser native alert (you can replace with a custom modal)
    if (type === "success") {
      alert(`✅ ${title}\n\n${message}`);
    } else {
      alert(`❌ ${title}\n\n${message}`);
    }
  };

  const handleRemove = () => {
    setImage(null);
    setPreview(null);
    setError("");
    setSuccess(false);
    setUploadProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <Image className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Banner Management
          </h1>
          <p className="text-gray-600">
            Upload promotional banners for your educational platform
          </p>
        </div>

        {/* Main Upload Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Upload Area */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Banner Image
            </label>

            {!preview ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-3 border-dashed border-indigo-300 rounded-xl cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 text-indigo-400 mb-4" />
                  <p className="mb-2 text-sm text-gray-700 font-medium">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WEBP (MAX. 5MB)
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Recommended: 1920x600px for best results
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={uploading}
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-xl border-2 border-indigo-200"
                />
                {!uploading && (
                  <button
                    onClick={handleRemove}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                    type="button"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg text-sm">
                  {image?.name}
                </div>
              </div>
            )}
          </div>

          {/* Upload Progress Bar */}
          {uploading && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Uploading...
                </span>
                <span className="text-sm font-semibold text-indigo-600">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                >
                  <div className="h-full w-full bg-white opacity-20 animate-pulse"></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Please wait while we upload your banner...
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && !uploading && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Upload Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-pulse">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Success!</p>
                <p className="text-sm text-green-600">
                  Banner uploaded successfully
                </p>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!image || uploading}
            type="button"
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading {uploadProgress}%
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Uploaded!
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload Banner
              </>
            )}
          </button>
        </div>

        {/* Guidelines Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-indigo-600" />
            Upload Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">•</span>
              <span>Use high-resolution images (minimum 1920x600px)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">•</span>
              <span>Keep file size under 5MB for optimal loading</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">•</span>
              <span>
                Ensure important content is centered for mobile compatibility
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 mt-1">•</span>
              <span>
                Use educational themes that align with your platform's branding
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
