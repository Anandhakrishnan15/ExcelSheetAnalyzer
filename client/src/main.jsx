import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ExcelUploadProvider } from './context/excelUploadcontext.jsx';
import { FileDataProvider } from './context/FileDataContext.jsx';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FileDataProvider>
      <BrowserRouter>
        <AuthProvider>
          <ExcelUploadProvider>
            <App />
          </ExcelUploadProvider>
        </AuthProvider>
      </BrowserRouter>
    </FileDataProvider>
  </StrictMode>
);
