import React, { useState, useRef } from "react";
import { FileText, Upload, Trash2, Loader2, X, Download, Check } from "lucide-react";
import { Attachment, Driver } from "../../../entities/types";
import { supabase } from "../../../supabase/supabase";

interface AttachmentsManagerProps {
  driver: Driver;
  isDarkMode: boolean;
  onAttachmentsChange: () => void;
}

const formatFileSize = (sizeInBytes: number) => {
  if (sizeInBytes < 1024) {
    return sizeInBytes + " B";
  } else if (sizeInBytes < 1024 * 1024) {
    return Math.round(sizeInBytes / 1024) + " KB";
  } else {
    return Math.round((sizeInBytes / (1024 * 1024)) * 10) / 10 + " MB";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("it-IT");
};

const AttachmentsManager: React.FC<AttachmentsManagerProps> = ({
  driver,
  isDarkMode,
  onAttachmentsChange,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Il file è troppo grande. Dimensione massima: 10MB");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `driver-${driver.id}/${timestamp}_${sanitizedFileName}`;

      const { data: storageData, error: storageError } = await supabase.storage
        .from("driver-documents")
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (storageError) throw storageError;

      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from("driver-documents")
        .createSignedUrl(fileName, 31536000);

      if (urlError) throw urlError;

      const { data, error } = await supabase
        .from("attachments")
        .insert([
          {
            driver_id: driver.id,
            nome: file.name,
            tipo: file.type,
            dimensione: file.size,
            url: signedUrlData.signedUrl,
            data_caricamento: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      await onAttachmentsChange();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setUploadSuccess("Documento caricato con successo!");
      setTimeout(() => setUploadSuccess(null), 3000);
    } catch (error: any) {
      console.error("Error uploading file:", error);
      setUploadError(`Errore: ${error.message || "Failed to upload file"}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAttachment = async (attachment: Attachment) => {
    if (!attachment || !attachment.id) return;

    if (!confirm(`Sei sicuro di voler eliminare "${attachment.nome}"?`)) {
      return;
    }

    setIsDeleting(attachment.id);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const timestamp = attachment.url.match(/(\d{13})/)?.[1];
      const sanitizedFileName = attachment.nome.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `driver-${driver.id}/${timestamp}_${sanitizedFileName}`;

      const { error: storageError } = await supabase.storage
        .from("driver-documents")
        .remove([fileName]);

      if (storageError) {
        console.warn("Error deleting file from storage:", storageError);
      }

      const { error: deleteError } = await supabase
        .from("attachments")
        .delete()
        .eq("id", attachment.id);

      if (deleteError) throw deleteError;

      await onAttachmentsChange();

      setUploadSuccess("Documento eliminato con successo!");
      setTimeout(() => setUploadSuccess(null), 3000);
    } catch (error: any) {
      console.error("Error deleting attachment:", error);
      setUploadError(
        `Errore: ${error.message || "Failed to delete attachment"}`
      );
    } finally {
      setIsDeleting(null);
    }
  };

  const getFileIcon = (fileName: string, fileType: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (fileType.includes('image/')) {
      return '🖼️';
    } else if (fileType.includes('pdf') || extension === 'pdf') {
      return '📄';
    } else if (fileType.includes('word') || extension === 'doc' || extension === 'docx') {
      return '📝';
    } else if (fileType.includes('excel') || extension === 'xls' || extension === 'xlsx') {
      return '📊';
    } else {
      return '📎';
    }
  };

  const handleDownloadAttachment = (attachment: Attachment) => {
    if (!attachment.url) {
      setUploadError("URL del documento non disponibile.");
      setTimeout(() => setUploadError(null), 3000);
      return;
    }
    const link = document.createElement("a");
    link.href = attachment.url;
    link.download = attachment.nome;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`mt-6 p-5 rounded-xl ${isDarkMode ? "bg-gray-700" : "bg-gray-50"
        }`}
    >
      <h3
        className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-800"
          }`}
      >
        <FileText className="w-5 h-5" />
        Documenti allegati
      </h3>

      <div className="mb-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${isDarkMode
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
            } transition-colors disabled:opacity-50`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Caricamento...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Carica documento
            </>
          )}
        </button>

        {uploadError && (
          <div
            className={`mt-2 px-3 py-2 rounded-md ${isDarkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"
              }`}
          >
            <div className="flex items-center gap-2">
              <X className="w-4 h-4" />
              {uploadError}
            </div>
          </div>
        )}

        {uploadSuccess && (
          <div
            className={`mt-2 px-3 py-2 rounded-md ${isDarkMode ? "bg-green-900 text-green-200" : "bg-green-100 text-green-800"
              }`}
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              {uploadSuccess}
            </div>
          </div>
        )}
      </div>

      {driver.allegati && driver.allegati.length > 0 ? (
        <div className="space-y-3">
          {driver.allegati.map((doc) => (
            <div
              key={doc.id}
              className={`flex items-center gap-4 p-4 rounded-xl border ${isDarkMode
                ? "bg-gray-600 border-gray-500 hover:bg-gray-550"
                : "bg-white border-gray-200 hover:bg-gray-50"
                } transition-all duration-200 hover:shadow-md`}
            >
              <div className="text-2xl">
                {getFileIcon(doc.nome, doc.tipo || '')}
              </div>

              <div className="flex-1 overflow-hidden">
                <h4
                  className={`font-medium truncate ${isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  title={doc.nome}
                >
                  {doc.nome}
                </h4>
                <div
                  className={`flex items-center gap-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  <span>{formatFileSize(doc.dimensione)}</span>
                  <span>•</span>
                  <span>{formatDate(doc.dataCaricamento)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadAttachment(doc)}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode
                    ? "hover:bg-gray-500 text-blue-400 hover:text-blue-300"
                    : "hover:bg-blue-50 text-blue-500 hover:text-blue-600"
                    }`}
                  title="Scarica documento"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteAttachment(doc)}
                  disabled={isDeleting === doc.id}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode
                    ? "hover:bg-gray-500 text-red-400 hover:text-red-300"
                    : "hover:bg-red-50 text-red-500 hover:text-red-600"
                    } disabled:opacity-50`}
                  title="Elimina documento"
                >
                  {isDeleting === doc.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`p-8 text-center border-2 border-dashed rounded-xl ${isDarkMode
            ? "border-gray-600 text-gray-400 bg-gray-750"
            : "border-gray-300 text-gray-500 bg-gray-25"
            }`}
        >
          <div className="text-4xl mb-3">📁</div>
          <p className="text-lg font-medium">Nessun documento allegato</p>
          <p className="text-sm mt-1">
            Carica documenti come contratti, patenti, o altri file importanti
          </p>
        </div>
      )}
    </div>
  );
};

export default AttachmentsManager;