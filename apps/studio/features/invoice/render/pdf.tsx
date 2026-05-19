import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

import type { InvoiceContent } from "@/features/invoice/types";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10 },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E7",
    paddingVertical: 6,
  },
  colDesc: { width: "50%" },
  colQty: { width: "15%", textAlign: "right" },
  colPrice: { width: "15%", textAlign: "right" },
  colTotal: { width: "20%", textAlign: "right" },
  heading: { fontSize: 16, marginBottom: 12 },
});

export function InvoicePdf({ content }: { content: InvoiceContent }) {
  const subtotal = content.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>Invoice #{content.invoiceNumber}</Text>
        <View style={styles.row}>
          <Text style={styles.colDesc}>Description</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colPrice}>Unit</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>
        {content.items.map((item) => (
          <View style={styles.row} key={item.id}>
            <Text style={styles.colDesc}>{item.description}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colPrice}>{item.unitPrice.toFixed(2)}</Text>
            <Text style={styles.colTotal}>{(item.quantity * item.unitPrice).toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.row}>
          <Text style={styles.colDesc}>Subtotal</Text>
          <Text style={styles.colQty} />
          <Text style={styles.colPrice} />
          <Text style={styles.colTotal}>{subtotal.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
}
