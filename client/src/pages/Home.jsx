import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const {token} = useAuth()
  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Welcome Section */}
        <section className="text-center">
          <div className="flex justify-center items-center gap-3 mb-4 flex-wrap">
            <h1 className="text-4xl font-bold">Welcome to</h1>
            <div className="flex items-center gap-2">
              <img
                src="/LOGO2.png"
                alt="ChartMate Logo"
                className="h-10 w-auto"
              />
              <span className="text-4xl font-bold">ChartMate</span>
            </div>
          </div>

          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Upload Excel files, generate smart interactive charts, and export
            intelligent reports — all in one place.
          </p>
        </section>

        {/* How it Works */}
        <section className="bg-[var(--card)] rounded-xl shadow-md p-6 border border-[var(--border)]">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ol className="space-y-4 list-decimal list-inside">
            <li>
              <strong>Create an account or log in:</strong> You must{" "}
              <Link to="/auth" className="text-blue-600 underline">
                Sign Up
              </Link>{" "}
              or{" "}
              <Link to="/auth" className="text-blue-600 underline">
                Log In
              </Link>{" "}
              to use upload and charting features.
            </li>
            <li>
              <strong>Upload Excel files:</strong> Visit the{" "}
              <Link to="/upload" className="text-blue-600 underline">
                Upload page
              </Link>{" "}
              and select any .xls or .xlsx file.
            </li>
            <li>
              <strong>Create Charts:</strong> Use your uploaded data to build
              charts like Bar, Line, Pie, Scatter, etc.
            </li>
            <li>
              <strong>Smart Summary & Export:</strong> Select a chart to
              generate an AI-powered summary and export it as an image or
              downloadable PDF.
            </li>
            <li>
              <strong>Access Your Charts:</strong> Go to{" "}
              <Link to="/profile" className="text-blue-600 underline">
                Profile
              </Link>{" "}
              to manage your uploads and saved charts.
            </li>
          </ol>
        </section>

        {/* Features */}
        <section className="bg-[var(--card)] rounded-xl shadow-md p-6 border border-[var(--border)]">
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Secure user login/signup system (required to access chart tools).
            </li>
            <li>
              Upload and parse multiple Excel sheets into chart-ready data.
            </li>
            <li>Create Bar, Line, Pie, Doughnut, and Scatter charts.</li>
            <li>AI-generated smart summaries for reports.</li>
            <li>Download charts as high-quality images.</li>
            <li>Export entire reports (with AI content) as PDFs.</li>
            <li>
              Clean dashboard for admins to view user analytics and charts.
            </li>
            <li>Fully responsive and accessible on all devices.</li>
          </ul>
        </section>

        {/* Navigation Help */}
        <section className="bg-[var(--card)] rounded-xl shadow-md p-6 border border-[var(--border)]">
          <h2 className="text-2xl font-semibold mb-4">Navigation Guide</h2>
          <ul className="space-y-3">
            <li>
              <strong>🔐 Login / Signup:</strong>{" "}
              <Link to="/auth" className="text-blue-600 underline">
                /auth
              </Link>{" "}
              — Register or log in to access the platform.
            </li>
            <li>
              <strong>📁 Upload:</strong>{" "}
              <Link to="/upload" className="text-blue-600 underline">
                /upload
              </Link>{" "}
              — Upload and manage Excel files.
            </li>
            <li>
              <strong>📊 Charts:</strong>{" "}
              <Link to="/profile" className="text-blue-600 underline">
                /profile
              </Link>{" "}
              — View and export your saved charts.
            </li>
            {/* <li>
              <strong>🛡️ Dashboard (Admins Only):</strong>{" "}
              <Link to="/dashboard" className="text-blue-600 underline">
                /dashboard
              </Link>{" "}
              — Admins can monitor users, uploads, and usage stats.
            </li> */}
          </ul>
        </section>

        {/* Call to Action */}
        {!token && (
          <section className="text-center">
            <Link
              to="/auth"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-lg"
            >
              Get Started – Sign Up & Upload Your File
            </Link>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
