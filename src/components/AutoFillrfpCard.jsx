import { useDropzone } from "react-dropzone"
import { useState } from "react"
import axios from "axios"
import { Upload } from "lucide-react" // or your existing icon library

export default function AutoFillRfpCard({ onDataExtracted }) {
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("AI populates every field")
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
    },
    maxFiles: 1,
    onDrop: async (files) => {
      const file = files[0]
      const formData = new FormData()
      formData.append("file", file)

      setMessage("Uploading...")
      setIsProcessing(true)
      setProgress(0)

      try {
        const res = await axios.post("/api/upload-rfp", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            const uploadProgress = Math.round((e.loaded * 100) / e.total)
            setProgress(uploadProgress)
            
            // Simulate field processing as upload progresses
            if (uploadProgress > 25 && !extractedData?.project_title) {
              setExtractedData(prev => ({ ...prev, project_title: "Processing..." }))
            }
            if (uploadProgress > 50 && !extractedData?.budget_range) {
              setExtractedData(prev => ({ ...prev, budget_range: "Processing..." }))
            }
            if (uploadProgress > 75 && !extractedData?.security_clearance) {
              setExtractedData(prev => ({ ...prev, security_clearance: "Processing..." }))
            }
            if (uploadProgress > 90 && !extractedData?.timeline) {
              setExtractedData(prev => ({ ...prev, timeline: "Processing..." }))
            }
          },
        })

        // Extract the actual data from response
        const metadata = res.data.metadata
        const finalData = {
          project_title: metadata.project_title || "Extracted",
          budget_range: metadata.budget_min && metadata.budget_max 
            ? `$${metadata.budget_min.toLocaleString()} - $${metadata.budget_max.toLocaleString()}`
            : "Extracted",
          security_clearance: metadata.security_clearance || "Extracted",
          timeline: metadata.timeline || "Extracted"
        }

        setExtractedData(finalData)
        setMessage("✅ Upload complete. RFP fields extracted.")
        setProgress(100)
        
        // Notify parent component
        if (onDataExtracted) {
          onDataExtracted(finalData)
        }

        // Reset processing state after a delay
        setTimeout(() => {
          setIsProcessing(false)
        }, 200)

      } catch (err) {
        console.error(err)
        setMessage("❌ Upload failed.")
        setIsProcessing(false)
        setProgress(0)
      }
    },
  })

  return (
    <div
      {...getRootProps()}
      className="text-center border border-dashed border-gray-300 rounded-md py-6 px-4 hover:bg-gray-50 cursor-pointer transition"
    >
      <input {...getInputProps()} />
      <Upload className="w-10 h-10 text-accent mx-auto mb-2" />
      <h4 className="font-bold text-gray-900">Auto-Filled RFP Form</h4>
      <p className="text-sm text-gray-600">{message}</p>
      {progress > 0 && progress < 100 && (
        <progress
          max="100"
          value={progress}
          className="mt-2 w-full h-1 appearance-none bg-gray-200 rounded"
        />
      )}
    </div>
  )
}
