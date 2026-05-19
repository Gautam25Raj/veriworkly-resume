export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceContent {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  fromName: string;
  fromAddress: string;
  billToName: string;
  billToAddress: string;
  currency: string;
  notes: string;
  items: InvoiceLineItem[];
}
