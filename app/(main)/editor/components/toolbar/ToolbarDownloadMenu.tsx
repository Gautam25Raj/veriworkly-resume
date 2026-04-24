"use client";

import {
  Files,
  Code2,
  FileText,
  FileJson,
  Download,
  FileCode2,
  FileImage,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Menu, MenuItem } from "@/components/ui/Menu";

interface ToolbarDownloadMenuProps {
  activeDownload: string | null;
  onDownloadPdf: () => Promise<void>;
  onDownloadPng: () => Promise<void>;
  onDownloadJpg: () => Promise<void>;
  onDownloadDocx: () => Promise<void>;
  onDownloadMarkdown: () => void;
  onDownloadHtml: () => void;
  onDownloadText: () => void;
  onDownloadJson: () => void;
}

const ToolbarDownloadMenu = ({
  activeDownload,
  onDownloadPdf,
  onDownloadPng,
  onDownloadJpg,
  onDownloadDocx,
  onDownloadMarkdown,
  onDownloadHtml,
  onDownloadText,
  onDownloadJson,
}: ToolbarDownloadMenuProps) => {
  return (
    <Menu
      panelClassName="min-w-56"
      trigger={({ menuId, open, toggle }) => (
        <Button
          size="sm"
          onClick={toggle}
          className="gap-2"
          variant="secondary"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
        >
          <Download className="h-4 w-4" />
          Download
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}
    >
      {({ close }) => (
        <>
          <MenuItem
            disabled={Boolean(activeDownload)}
            onClick={async () => {
              close();
              await onDownloadPdf();
            }}
          >
            <Download className="h-4 w-4" />
            {activeDownload === "pdf" ? "Rendering PDF..." : "PDF"}
          </MenuItem>

          <MenuItem
            disabled={Boolean(activeDownload)}
            onClick={async () => {
              close();
              await onDownloadPng();
            }}
          >
            <FileImage className="h-4 w-4" />
            {activeDownload === "png" ? "Rendering PNG..." : "PNG Image"}
          </MenuItem>

          <MenuItem
            disabled={Boolean(activeDownload)}
            onClick={async () => {
              close();
              await onDownloadJpg();
            }}
          >
            <FileImage className="h-4 w-4" />
            {activeDownload === "jpg" ? "Rendering JPG..." : "JPG Image"}
          </MenuItem>

          <MenuItem
            disabled={Boolean(activeDownload)}
            onClick={async () => {
              close();
              await onDownloadDocx();
            }}
          >
            <Files className="h-4 w-4" />
            {activeDownload === "docx" ? "Generating DOCX..." : "DOCX"}
          </MenuItem>

          <MenuItem
            disabled={Boolean(activeDownload)}
            onClick={() => {
              close();
              onDownloadMarkdown();
            }}
          >
            <FileCode2 className="h-4 w-4" />
            Markdown
          </MenuItem>

          <MenuItem
            disabled={Boolean(activeDownload)}
            onClick={() => {
              close();
              onDownloadHtml();
            }}
          >
            <Code2 className="h-4 w-4" />
            HTML
          </MenuItem>

          <MenuItem
            disabled={Boolean(activeDownload)}
            onClick={() => {
              close();
              onDownloadText();
            }}
          >
            <FileText className="h-4 w-4" />
            Plain Text
          </MenuItem>

          <MenuItem
            disabled={Boolean(activeDownload)}
            onClick={() => {
              close();
              onDownloadJson();
            }}
          >
            <FileJson className="h-4 w-4" />
            JSON
          </MenuItem>
        </>
      )}
    </Menu>
  );
};

export default ToolbarDownloadMenu;
