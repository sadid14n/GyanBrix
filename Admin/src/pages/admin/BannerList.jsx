import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { firestoreDB, firebaseStorage } from "../../firebase/firebaseConfig";
import {
  Trash2,
  Image,
  AlertCircle,
  Loader2,
  Calendar,
  FileText,
} from "lucide-react";

export default function BannerList() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError("");
      const snapshot = await getDocs(collection(firestoreDB, "banners"));
      const bannersData = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setBanners(bannersData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bannerId, storagePath, fileName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${
        fileName || "this banner"
      }"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(bannerId);
      setError("");

      // Delete from storage
      await deleteObject(ref(firebaseStorage, storagePath));

      // Delete from Firestore
      await deleteDoc(doc(firestoreDB, "banners", bannerId));

      // Update local state
      setBanners((prev) => prev.filter((b) => b.id !== bannerId));

      // Show success alert
      alert(
        `✅ Banner Deleted Successfully!\n\n"${
          fileName || "Banner"
        }" has been removed from storage and database.`
      );
    } catch (error) {
      console.error("Delete error:", error);
      setError(`Failed to delete banner: ${error.message}`);
      alert(`❌ Delete Failed\n\n${error.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <Image className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Banner Gallery
          </h1>
          <p className="text-gray-600">
            Manage all uploaded promotional banners
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 max-w-2xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading banners...</p>
          </div>
        ) : banners.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Image className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Banners Yet
            </h3>
            <p className="text-gray-600">
              Upload your first banner to get started with promotional content.
            </p>
          </div>
        ) : (
          /* Banners Grid */
          <>
            <div className="mb-4 text-center">
              <p className="text-gray-600">
                Total Banners:{" "}
                <span className="font-semibold text-indigo-600">
                  {banners.length}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                >
                  {/* Banner Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={banner.imageUrl}
                      alt={banner.fileName || "Banner"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Banner Info */}
                  <div className="p-5">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 truncate flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                        {banner.fileName || "Untitled Banner"}
                      </h3>

                      {/* Metadata */}
                      <div className="space-y-1 text-xs text-gray-500">
                        {banner.createdAt && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>{formatDate(banner.createdAt)}</span>
                          </div>
                        )}
                        {banner.fileSize && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-gray-400" />
                            <span>{formatFileSize(banner.fileSize)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <a
                        href={banner.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium py-2 px-4 rounded-lg transition-colors text-sm text-center"
                      >
                        View Full
                      </a>
                      <button
                        onClick={() =>
                          handleDelete(
                            banner.id,
                            banner.storagePath,
                            banner.fileName
                          )
                        }
                        disabled={deleting === banner.id}
                        className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        type="button"
                      >
                        {deleting === banner.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Deleting...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Info Card */}
        {!loading && banners.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-indigo-600" />
              Management Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>Click "View Full" to open the banner in a new tab</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>
                  Deleting a banner removes it from both storage and database
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>
                  All delete actions require confirmation to prevent accidents
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>
                  Keep your banner gallery organized by removing outdated
                  content
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
