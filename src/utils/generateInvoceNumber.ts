import { checkUniqueInvoiceNumber } from "../features/invoices/services/api";

export default async function generateInvoiceNumber(): Promise<string> {
  let isUnique: boolean = false;
  let generatedNumber: string = "";

  while (!isUnique) {
    const random = Math.floor(1000 + Math.random() * 9000);
    generatedNumber = `INV${new Date().getDate()}${random}`

    isUnique = await checkUniqueInvoiceNumber(generatedNumber);
  }
  return generatedNumber;
}
