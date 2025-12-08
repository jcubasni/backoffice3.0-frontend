// src/app/pdf/components/pdf-base.tsx
import { Document, Page, PageProps } from "@react-pdf/renderer"
import { PropsWithChildren } from "react"
import { styles } from "../styles/pdf-base"

interface PdfViewerProps extends PropsWithChildren {
  orientation?: PageProps["orientation"]
  size?: PageProps["size"]
}

export const PdfBase = ({ orientation, size, children }: PdfViewerProps) => {
  return (
    <Document>
      <Page
        orientation={orientation ?? "landscape"}
        size={size ?? "A4"}
        style={styles.viewer}
      >
        {children}
      </Page>
    </Document>
  )
}

export const formatDate = (dateString: string): string => {
  if (!dateString) return ""
  return dateString.split("T")[0]
}
