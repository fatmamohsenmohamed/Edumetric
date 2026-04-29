import React, { useState, useRef, useEffect } from "react";
import {
  MdAddCircleOutline,
  MdSearch,
  MdEdit,
  MdDelete,
  MdLibraryBooks,
  MdCheckCircle,
  MdCancel,
  MdUploadFile,
  MdClose,
  MdCloudUpload,
  MdTableChart,
  MdDescription,
} from "react-icons/md";
import * as XLSX from "xlsx";
import mammoth from "mammoth";

// ─── Upload Modal ─────────────────────────────────────────────
function UploadModal({ open, onClose, onConfirm }) {
  const fileRef = useRef();
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setPreview([]);
    setError("");
    setFileName("");
    setLoading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const processFile = async (file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    setLoading(true);
    setError("");
    setPreview([]);
    setFileName(file.name);

    try {
      let parsed = [];

      // ── CSV ──────────────────────────────────────────────
      if (ext === "csv") {
        const text = await file.text();
        const rows = text.split("\n").filter((r) => r.trim());
        const headers = rows[0].split(",").map((h) => h.trim().toLowerCase());

        parsed = rows
          .slice(1)
          .map((row, i) => {
            const cols = row.split(",");
            const get = (key) => cols[headers.indexOf(key)]?.trim() || "";
            return {
              id: Date.now() + i,
              question: get("question"),
              type: get("type") || "MCQ",
              difficulty: get("difficulty") || "Easy",
              chapter: get("chapter") || "",
              subject: get("subject") || "",
              answer: get("answer") || "",
              options: get("options") ? get("options").split("|") : [],
            };
          })
          .filter((q) => q.question);
      }

      // ── XLSX / XLS ────────────────────────────────────────
      else if (ext === "xlsx" || ext === "xls") {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        parsed = json
          .map((row, i) => ({
            id: Date.now() + i,
            question: String(row.question || row.Question || ""),
            type: String(row.type || row.Type || "MCQ"),
            difficulty: String(row.difficulty || row.Difficulty || "Easy"),
            chapter: String(row.chapter || row.Chapter || ""),
            subject: String(row.subject || row.Subject || ""),
            answer: String(row.answer || row.Answer || ""),
            options: row.options ? String(row.options).split("|") : [],
          }))
          .filter((q) => q.question);
      }

      // ── DOCX ──────────────────────────────────────────────
      else if (ext === "docx") {
        const buffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: buffer });
        const blocks = result.value.split("---").filter((b) => b.trim());

        parsed = blocks
          .map((block, i) => {
            const lines = block.split("\n").filter((l) => l.includes(":"));
            const data = {};
            lines.forEach((line) => {
              const [key, ...rest] = line.split(":");
              data[key.trim().toLowerCase()] = rest.join(":").trim();
            });
            return {
              id: Date.now() + i,
              question: data.question || "",
              type: data.type || "TF",
              difficulty: data.difficulty || "Easy",
              chapter: data.chapter || "",
              subject: data.subject || "",
              answer: data.correct || data.answer || "",
              options: data.choice1
                ? [
                    data.choice1,
                    data.choice2,
                    data.choice3,
                    data.choice4,
                  ].filter(Boolean)
                : [],
            };
          })
          .filter((q) => q.question);
      } else {
        setError(
          "Unsupported file type. Please upload CSV, Excel, or Word files.",
        );
        setLoading(false);
        return;
      }

      if (parsed.length === 0) {
        setError("No valid questions found. Check your file format.");
      } else {
        setPreview(parsed);
      }
    } catch (err) {
      console.error(err);
      setError("Error processing file. Please check the format and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleConfirm = () => {
    onConfirm(preview);
    handleClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div className="flex items-center gap-2">
            <MdCloudUpload className="text-[#1e3a8a] text-2xl" />
            <h2 className="text-lg font-bold text-[#1e3a8a]">
              Import Questions
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <MdClose className="text-slate-500" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-auto flex-1">
          {/* Supported formats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                icon: <MdTableChart className="text-green-600 text-xl" />,
                label: "Excel",
                ext: ".xlsx, .xls",
                color: "bg-green-50 border-green-200",
              },
              {
                icon: <MdDescription className="text-blue-600 text-xl" />,
                label: "CSV",
                ext: ".csv",
                color: "bg-blue-50 border-blue-200",
              },
              {
                icon: <MdDescription className="text-indigo-600 text-xl" />,
                label: "Word",
                ext: ".docx",
                color: "bg-indigo-50 border-indigo-200",
              },
            ].map(({ icon, label, ext, color }) => (
              <div
                key={label}
                className={`flex items-center gap-2 p-3 rounded-xl border ${color}`}
              >
                {icon}
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-slate-500">{ext}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileRef.current.click()}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1e3a8a] text-white rounded-xl hover:bg-[#1e40af] transition font-medium"
            >
              <MdUploadFile />
              Choose File
            </button>

            {fileName && (
              <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                📄 {fileName}
              </span>
            )}

            <input
              type="file"
              ref={fileRef}
              accept=".csv,.xlsx,.xls,.docx"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Format hint */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-xs font-semibold text-amber-700 mb-1">
              📋 Required Format
            </p>
            <p className="text-xs text-slate-600">
              <strong>CSV/Excel columns:</strong> question, type (MCQ/TF),
              difficulty, chapter, subject, answer, options (separated by |)
            </p>
            <p className="text-xs text-slate-600 mt-1">
              <strong>Word:</strong> Use the format: Question: ... / Type: ... /
              Difficulty: ... separated by ---
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <div className="w-4 h-4 border-2 border-[#1e3a8a] border-t-transparent rounded-full animate-spin" />
              Processing file...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">
                  Preview — {preview.length} question
                  {preview.length !== 1 ? "s" : ""} found
                </p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Ready to import
                </span>
              </div>

              <div className="max-h-64 overflow-auto space-y-2 pr-1">
                {preview.map((q, i) => (
                  <div
                    key={q.id}
                    className="border border-slate-200 rounded-xl p-3 bg-slate-50"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm font-medium text-slate-800">
                        {i + 1}. {q.question}
                      </p>
                      <div className="flex gap-1 shrink-0">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            q.type === "MCQ"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {q.type}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            q.difficulty === "Easy"
                              ? "bg-green-100 text-green-700"
                              : q.difficulty === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </div>
                    </div>
                    {q.answer && (
                      <p className="text-xs text-emerald-600 mt-1">
                        ✓ Answer: {q.answer}
                      </p>
                    )}
                    {q.chapter && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        {q.chapter} — {q.subject}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-5 border-t bg-slate-50 rounded-b-2xl">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={preview.length === 0}
            className="px-5 py-2 bg-[#1e3a8a] text-white rounded-xl hover:bg-[#1e40af] transition disabled:opacity-40 disabled:cursor-not-allowed font-medium"
          >
            Import {preview.length > 0 ? `(${preview.length})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────
export default function QuestionBank() {
  const [questions, setQuestions] = useState([]); // ← empty, loads from API
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [loading, setLoading] = useState(true);

  // ── Load questions from backend ──
  useEffect(() => {
    fetch("http://localhost:8000/api/questions/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Form state
  const [editId, setEditId] = useState(null);
  const [text, setText] = useState("");
  const [type, setType] = useState("MCQ");
  const [chapter, setChapter] = useState("");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [choices, setChoices] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [tfAnswer, setTfAnswer] = useState("True");

  const filtered = questions.filter((q) => {
    const s = search.toLowerCase();

    return (
      q.question.toLowerCase().includes(s) ||
      q.subject.toLowerCase().includes(s) ||
      q.difficulty.toLowerCase().includes(s)
    );
  });

  const resetForm = () => {
    setText("");
    setType("MCQ");
    setChapter("");
    setSubject("");
    setDifficulty("Easy");
    setChoices(["", "", "", ""]);
    setCorrectIndex(0);
    setTfAnswer("True");
  };

  const handleEdit = (q) => {
    setEditId(q.id);
    setText(q.question);
    setType(q.type);
    setChapter(q.chapter);
    setSubject(q.subject);
    setDifficulty(q.difficulty);
    if (q.type === "MCQ") {
      setChoices(
        q.options.length === 4
          ? q.options
          : [...q.options, "", "", "", ""].slice(0, 4),
      );
      setCorrectIndex(q.options.indexOf(q.answer));
    } else {
      setTfAnswer(q.answer);
    }
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;

    await fetch(`http://localhost:8000/api/questions/${id}/delete/`, {
      method: "DELETE",
      credentials: "include",
    });

    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSave = async () => {
    if (!text.trim()) return;

    const payload = {
      question: text,
      type: type,
      difficulty: difficulty,
      chapter: chapter,
      subject: subject,
      options: type === "MCQ" ? choices : [],
      correctIndex: type === "MCQ" ? correctIndex : 0,
      answer: type === "TF" ? tfAnswer : choices[correctIndex],
    };

    const url = editId
      ? `http://localhost:8000/api/questions/${editId}/update/`
      : `http://localhost:8000/api/questions/create/`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      // Reload questions from backend
      const updated = await fetch("http://localhost:8000/api/questions/", {
        credentials: "include",
      }).then((r) => r.json());
      setQuestions(updated);
    }

    setOpenModal(false);
    setEditId(null);
    resetForm();
  };

  const handleImport = async (imported) => {
    // Send each question to backend
    for (const q of imported) {
      await fetch("http://localhost:8000/api/questions/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          question: q.question,
          type: q.type,
          difficulty: q.difficulty,
          chapter: q.chapter,
          subject: q.subject,
          options: q.options,
          correctIndex: q.options?.indexOf(q.answer) ?? 0,
          answer: q.answer,
        }),
      });
    }

    // Reload from backend
    const updated = await fetch("http://localhost:8000/api/questions/", {
      credentials: "include",
    }).then((r) => r.json());

    setQuestions(updated);
  };
  return (
    <div className="p-6 bg-white min-h-screen space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1e3a8a] flex items-center gap-2">
            <MdLibraryBooks /> Question Bank
          </h1>
          <p className="text-sm text-slate-500">
            {questions.length} question{questions.length !== 1 ? "s" : ""} total
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setOpenUpload(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-[#1e3a8a] hover:bg-slate-200 transition font-medium"
          >
            <MdUploadFile />
            Import
          </button>

          <button
            onClick={() => {
              setOpenModal(true);
              setEditId(null);
              resetForm();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1e3a8a] text-white hover:bg-[#1e40af] transition font-medium"
          >
            <MdAddCircleOutline />
            Add Question
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 w-full md:w-1/3">
        <MdSearch className="text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions..."
          className="w-full bg-transparent outline-none text-sm text-[#1e3a8a]"
        />
      </div>

      {/* QUESTIONS LIST */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">
          <div className="w-8 h-8 border-2 border-[#1e3a8a] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p>Loading questions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <MdLibraryBooks className="text-5xl mx-auto mb-2 opacity-30" />
          <p>No questions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((q) => (
            <div
              key={q.id}
              className="border border-slate-200 rounded-2xl p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-[#1e3a8a] flex-1 pr-4">
                  {q.question}
                </h3>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(q)}
                    className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                  >
                    <MdEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {[q.type, q.chapter, q.subject].filter(Boolean).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 bg-slate-100 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    q.difficulty === "Easy"
                      ? "bg-emerald-100 text-emerald-700"
                      : q.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {q.difficulty}
                </span>
              </div>

              <div className="mt-3 text-sm">
                <span className="font-medium">Correct Answer: </span>
                <span className="text-emerald-600 font-medium">{q.answer}</span>
              </div>

              {q.type === "MCQ" && q.options?.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {q.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`p-2 border rounded-lg text-sm flex items-center gap-1 ${
                        opt === q.answer
                          ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      {opt === q.answer ? (
                        <MdCheckCircle className="shrink-0" />
                      ) : (
                        <MdCancel className="shrink-0 text-slate-400" />
                      )}
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-3 max-h-[90vh] overflow-auto shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1e3a8a]">
                {editId ? "Edit Question" : "Add New Question"}
              </h2>
              <button
                onClick={() => {
                  setOpenModal(false);
                  setEditId(null);
                  resetForm();
                }}
                className="p-1 hover:bg-slate-100 rounded-lg"
              >
                <MdClose className="text-slate-500" />
              </button>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Question text"
              rows={2}
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="grid grid-cols-2 gap-3">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MCQ">MCQ</option>
                <option value="TF">True / False</option>
              </select>

              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="Chapter"
                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {type === "MCQ" && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  {choices.map((c, i) => (
                    <input
                      key={i}
                      value={c}
                      onChange={(e) => {
                        const copy = [...choices];
                        copy[i] = e.target.value;
                        setChoices(copy);
                      }}
                      placeholder={`Choice ${i + 1}`}
                      className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                </div>
                <select
                  value={correctIndex}
                  onChange={(e) => setCorrectIndex(Number(e.target.value))}
                  className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {choices.map((c, i) => (
                    <option key={i} value={i}>
                      Correct: Choice {i + 1}
                      {c ? ` — ${c}` : ""}
                    </option>
                  ))}
                </select>
              </>
            )}

            {type === "TF" && (
              <select
                value={tfAnswer}
                onChange={(e) => setTfAnswer(e.target.value)}
                className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>True</option>
                <option>False</option>
              </select>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setOpenModal(false);
                  setEditId(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-slate-200 rounded-xl hover:bg-slate-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#1e3a8a] text-white rounded-xl hover:bg-[#1e40af] transition"
              >
                {editId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      <UploadModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onConfirm={handleImport}
      />
    </div>
  );
}
