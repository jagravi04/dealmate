
import React from "react";
import { 
  Clock, 
  Download, 
  File, 
  FileImage, 
  FileSpreadsheet, 
  FileText, 
  FileType 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document } from "@/types";
import { format } from "date-fns";

interface DocumentListProps {
  documents: Document[];
}

const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      return <FileType className="h-5 w-5 text-red-500" />;
    } else if (fileType.includes("spreadsheet") || fileType.includes("excel") || fileType.includes("csv")) {
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    } else if (fileType.includes("image")) {
      return <FileImage className="h-5 w-5 text-blue-500" />;
    } else if (fileType.includes("document") || fileType.includes("word")) {
      return <FileText className="h-5 w-5 text-blue-600" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-2">
      {documents.length === 0 ? (
        <div className="text-center py-8 bg-muted/30 rounded-md">
          <p className="text-muted-foreground">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="divide-y">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                {getFileIcon(doc.type)}
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>
                      {format(new Date(doc.uploadedAt), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
