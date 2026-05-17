import { StyleSheet } from "@react-pdf/renderer";

export const pdfTypography = StyleSheet.create({
  h1: { fontSize: 18, fontWeight: 700 },
  h2: { fontSize: 14, fontWeight: 600 },
  body: { fontSize: 10, lineHeight: 1.5 },
  muted: { fontSize: 9, color: "#52525B" },
});

export const pdfSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const pdfBlocks = StyleSheet.create({
  page: { padding: 32 },
  section: { marginBottom: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
    paddingVertical: 6,
  },
});
