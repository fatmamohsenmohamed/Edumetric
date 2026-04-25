import { useState } from "react";

export default function ImportQuestions() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [errors, setErrors] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateProgress = () => {
    let val = 0;
    const interval = setInterval(() => {
      val += 10;
      setProgress(val);
      if (val >= 100) clearInterval(interval);
    }, 100);
  };

  const handleFileUpload = (uploaded) => {
    if (!uploaded || !uploaded.name.endsWith(".csv")) return;

    setFile(uploaded);
    simulateProgress();

    const reader = new FileReader();
    reader.onload = (event) => {
      const rows = event.target.result
        .split("\n")
        .map((r) => r.split(","));

      const data = rows.slice(1).map((row, index) => {
        const hasError = !row[0] || !row[4];

        return {
          id: index,
          question: row[0],
          A: row[1],
          B: row[2],
          C: row[3],
          correct: row[4],
          error: hasError,
        };
      });

      setPreview(data);
      setErrors(data.filter((q) => q.error));
    };

    reader.readAsText(uploaded);
  };

  // ✅ FIX: Import Handler (IMPORTANT)
  const handleImport = () => {
    console.log("Import clicked!");
    console.log("Data to import:", preview);

    alert(`${preview.length} questions imported successfully 🎉`);

    // هنا بعدين توصليها بـ backend أو Question Bank state
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Stepper */}
      <div className="flex items-center gap-4 mb-6 text-sm">
        <span className="font-semibold text-indigo-600">1. Upload</span>
        <span className="text-gray-400">→</span>
        <span className={preview.length ? "text-indigo-600" : "text-gray-400"}>
          2. Preview
        </span>
        <span className="text-gray-400">→</span>
        <span className="text-gray-400">3. Confirm</span>
      </div>

      {/* Upload Area */}
      <div
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFileUpload(e.dataTransfer.files[0]);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        className={`bg-white border-2 border-dashed rounded-2xl p-10 text-center transition
        ${dragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300"}`}
      >
        <p className="text-lg font-medium text-gray-700">
          Drag & Drop your file here
        </p>

        <p className="text-sm text-gray-400 mb-4">
          or click to browse
        </p>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleFileUpload(e.target.files[0])}
          className="hidden"
          id="upload"
        />

        <label
          htmlFor="upload"
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl cursor-pointer hover:bg-indigo-700"
        >
          Browse File
        </label>

        {file && (
          <p className="mt-4 text-sm text-gray-600">
            📂 {file.name}
          </p>
        )}

        {/* Progress */}
        {progress > 0 && (
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Empty State */}
      {preview.length === 0 && (
        <div className="text-center mt-10 text-gray-400">
          No file uploaded yet
        </div>
      )}

      {/* Stats */}
      {preview.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Stat title="Total" value={preview.length} />
          <Stat title="Valid" value={preview.length - errors.length} green />
          <Stat title="Errors" value={errors.length} red />
        </div>
      )}

      {/* Error Panel */}
      {errors.length > 0 && (
        <div className="bg-red-50 p-4 rounded-xl mt-4 text-sm text-red-600">
          <p className="font-semibold mb-2">Errors Found:</p>
          <ul className="list-disc ml-5">
            {errors.slice(0, 3).map((e) => (
              <li key={e.id}>
                Missing data in row {e.id + 1}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Preview Table */}
      {preview.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm mt-6 overflow-hidden">

          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold">Preview</h2>

            {/* ✅ FIXED BUTTON */}
            <button
              onClick={handleImport}
              disabled={errors.length > 0}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
            >
              Import Questions
            </button>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Question</th>
                <th>A</th>
                <th>B</th>
                <th>C</th>
                <th>Correct</th>
              </tr>
            </thead>

            <tbody>
              {preview.map((q) => (
                <tr
                  key={q.id}
                  className={`border-t ${q.error ? "bg-red-50" : ""}`}
                >
                  <td className="p-3">{q.question || "—"}</td>
                  <td className="text-center">{q.A}</td>
                  <td className="text-center">{q.B}</td>
                  <td className="text-center">{q.C}</td>
                  <td className="text-center font-semibold">
                    {q.correct || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Stat component
function Stat({ title, value, green, red }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p
        className={`text-xl font-bold ${
          green ? "text-green-600" : red ? "text-red-500" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}