const API_URL = "http://localhost:3001/invoices";

export const checkUniqueInvoiceNumber = async (number: string) => {
  const response = await fetch(`${API_URL}?number=${number}`);
  const data = await response.json();

  if (data.length === 0) return true;

  return false;
};
