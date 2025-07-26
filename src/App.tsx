import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NewInvoices from "./pages/NewInvoices";
import MainLayout from "./components/layouts/MainLayout";
import EditInvoicePage from "./pages/EditInvoice";
import InvoiceView from "./pages/InvoiceView";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="invoices">
          <Route path="new" element={<NewInvoices />} />
          <Route path="edit" element={<EditInvoicePage />} />
          <Route path="view" element={<InvoiceView />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
