import { useState, useEffect } from "react";

export default function CreateExamWizard() {
  const [step, setStep] = useState(1);

  const [examData, setExamData] = useState({
    title: "",
    duration: "",
    questions: [],
    randomize: false,
  });

  /* =========================
     FAKE QUESTION BANK (replace later with your real page)
  ========================= */
  const [questionBank] = useState([
    { id: 1, title: "What is DBMS?", subject: "DB" },
    { id: 2, title: "Explain normalization", subject: "DB" },
    { id: 3, title: "What is AES encryption?", subject: "Security" },
    { id: 4, title: "What is CPU?", subject: "Hardware" },
  ]);

  /* =========================
     LOAD DRAFT (optional)
  ========================= */
  useEffect(() => {
    const saved = localStorage.getItem("examDraft");
    if (saved) setExamData(JSON.parse(saved));
  }, []);

  /* =========================
     SAVE DRAFT AUTOMATICALLY
  ========================= */
  useEffect(() => {
    localStorage.setItem("examDraft", JSON.stringify(examData));
  }, [examData]);

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* STEP INDICATOR */}
      <div className="flex gap-3 mb-6 text-sm">
        <Step label="Info" active={step === 1} />
        <Step label="Questions" active={step === 2} />
        <Step label="Settings" active={step === 3} />
        <Step label="Review" active={step === 4} />
      </div>

      {/* CONTENT */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">

        {step === 1 && (
          <Step1 examData={examData} setExamData={setExamData} />
        )}

        {step === 2 && (
          <Step2
            examData={examData}
            setExamData={setExamData}
            questionBank={questionBank}
          />
        )}

        {step === 3 && (
          <Step3 examData={examData} setExamData={setExamData} />
        )}

        {step === 4 && (
          <Step4 examData={examData} />
        )}

      </div>

      {/* NAV */}
      <div className="flex justify-between mt-6">
        <button
          onClick={back}
          disabled={step === 1}
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          Back
        </button>

        <button
          onClick={next}
          disabled={step === 4}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Next
        </button>
      </div>

    </div>
  );
}

/* =========================
   STEP INDICATOR
========================= */
function Step({ label, active }) {
  return (
    <div className={`px-3 py-1 rounded-full text-xs ${
      active ? "bg-indigo-600 text-white" : "bg-gray-200"
    }`}>
      {label}
    </div>
  );
}

/* =========================
   STEP 1
========================= */
function Step1({ examData, setExamData }) {
  return (
    <div>
      <h2 className="font-semibold mb-4">Exam Info</h2>

      <input
        placeholder="Exam Title"
        className="border p-2 w-full rounded mb-3"
        value={examData.title}
        onChange={(e) =>
          setExamData({ ...examData, title: e.target.value })
        }
      />

      <input
        placeholder="Duration"
        className="border p-2 w-full rounded"
        value={examData.duration}
        onChange={(e) =>
          setExamData({ ...examData, duration: e.target.value })
        }
      />
    </div>
  );
}

/* =========================
   STEP 2 (REAL QUESTION BANK)
========================= */
function Step2({ examData, setExamData, questionBank }) {

  const toggle = (q) => {
    const exists = examData.questions.find((x) => x.id === q.id);

    if (exists) {
      setExamData({
        ...examData,
        questions: examData.questions.filter((x) => x.id !== q.id),
      });
    } else {
      setExamData({
        ...examData,
        questions: [...examData.questions, q],
      });
    }
  };

  return (
    <div>
      <h2 className="font-semibold mb-4">Select Questions</h2>

      <div className="grid gap-3">
        {questionBank.map((q) => (
          <div
            key={q.id}
            className="flex justify-between items-center border p-3 rounded-lg hover:bg-gray-50"
          >
            <div>
              <p className="font-medium">{q.title}</p>
              <p className="text-xs text-gray-500">{q.subject}</p>
            </div>

            <input
              type="checkbox"
              checked={examData.questions.some((x) => x.id === q.id)}
              onChange={() => toggle(q)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================
   STEP 3
========================= */
function Step3({ examData, setExamData }) {
  return (
    <div>
      <h2 className="font-semibold mb-4">Settings</h2>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={examData.randomize}
          onChange={(e) =>
            setExamData({
              ...examData,
              randomize: e.target.checked,
            })
          }
        />
        Randomize Questions
      </label>
    </div>
  );
}

/* =========================
   STEP 4 (REAL PREVIEW)
========================= */
function Step4({ examData }) {
  return (
    <div>
      <h2 className="font-semibold mb-4">Review Exam</h2>

      <div className="space-y-2 text-sm">
        <p><b>Title:</b> {examData.title}</p>
        <p><b>Duration:</b> {examData.duration}</p>
        <p><b>Total Questions:</b> {examData.questions.length}</p>
        <p><b>Random:</b> {examData.randomize ? "Yes" : "No"}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-medium mb-2">Questions:</h3>
        {examData.questions.map((q) => (
          <p key={q.id} className="text-sm text-gray-600">
            • {q.title}
          </p>
        ))}
      </div>
    </div>
  );
}