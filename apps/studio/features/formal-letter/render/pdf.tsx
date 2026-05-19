import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

import type { FormalLetterContent } from "@/features/formal-letter/types";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, lineHeight: 1.5 },
  paragraph: { marginBottom: 10 },
});

export function FormalLetterPdf({ content }: { content: FormalLetterContent }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          {[content.greeting, content.body, content.closing, content.signature]
            .filter(Boolean)
            .map((line, index) => (
              <Text key={index} style={styles.paragraph}>
                {line}
              </Text>
            ))}
        </View>
      </Page>
    </Document>
  );
}
