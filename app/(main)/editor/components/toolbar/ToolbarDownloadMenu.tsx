"use client";

import { ChevronDown, Download } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Menu, MenuItem } from "@/components/ui/Menu";

interface ToolbarDownloadMenuProps {
  isDownloadingPdf: boolean;
  onDownloadPdf: () => Promise<void>;
}

const ToolbarDownloadMenu = ({
  isDownloadingPdf,
  onDownloadPdf,
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
        <MenuItem
          disabled={isDownloadingPdf}
          onClick={async () => {
            close();
            await onDownloadPdf();
          }}
        >
          <Download className="h-4 w-4" />
          {isDownloadingPdf ? "Generating PDF..." : "PDF"}
        </MenuItem>
      )}
    </Menu>
  );
};

export default ToolbarDownloadMenu;
