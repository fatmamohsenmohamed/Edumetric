import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Label } from "../components/ui/Label";
import Button from "../components/ui/Button";

/* ───────── PROGRESS BAR ───────── */
const STEP_LABELS = ["Info", "Questions", "Settings", "Preview"];

function ProgressBar({ step, total, maxStep, onStepClick }) {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-3">
        {STEP_LABELS.map((label, index) => {
          const stepNumber = index + 1;

          const isActive = step === stepNumber;
          const isDone = stepNumber < step;
          const isLocked = stepNumber > maxStep;

          return (
            <div key={index} className="flex flex-col items-center">
              <div
                onClick={() => !isLocked && onStepClick(stepNumber)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition
                  ${isDone ? "bg-green-500 text-white" : ""}
                  ${isActive ? "bg-blue-600 text-white scale-110" : ""}
                  ${!isDone && !isActive ? "bg-gray-200 text-gray-600" : ""}
                  ${isLocked ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {isDone ? "✓" : stepNumber}
              </div>
              <span className="text-xs mt-1 text-gray-600">{label}</span>
            </div>
          );
        })}
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-2 bg-blue-600 transition-all duration-500"
          style={{ width: `${((step - 1) / (total - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

/* ───────── DATA ───────── */
const TOTAL_STEPS = 4;

const INITIAL_EXAM_DATA = {
  title: "",
  subject: "",
  duration: 60,
  easy_count: 0,
  medium_count: 0,
  hard_count: 0,
  max_attempts: 1,
  shuffle_questions: false,
  shuffle_choices: false,
};

/* ───────── VALIDATION ───────── */
const validate = (data, step) => {
  const errors = {};

  if (step === 1) {
    if (!data.title) errors.title = "Title is required";
    else if (data.title.length < 3)
      errors.title = "Minimum 3 characters";

    if (!data.subject) errors.subject = "Subject is required";

    if (!data.duration || data.duration <= 0)
      errors.duration = "Duration must be > 0";
  }

  if (step === 2) {
    const total =
      Number(data.easy_count) +
      Number(data.medium_count) +
      Number(data.hard_count);

    if (total === 0)
      errors.questions = "Add at least one question";
  }

  return errors;
};

/* ───────── STEP 1 ───────── */
function Step1({ data, onChange, errors }) {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Basic Info</h3>

      {/* TITLE */}
      <div>
        <Label>Title</Label>
        <input
          name="title"
          value={data.title}
          onChange={onChange}
          className={`w-full h-12 px-4 border rounded-xl
            ${errors.title ? "border-red-500" : data.title ? "border-green-500" : "border-gray-300"}`}
        />
        {errors.title ? (
          <p className="text-red-500 text-xs">{errors.title}</p>
        ) : (
          data.title && (
            <p className="text-green-600 text-xs">Looks good ✓</p>
          )
        )}
      </div>

      {/* SUBJECT */}
      <div>
        <Label>Subject</Label>
        <input
          name="subject"
          value={data.subject}
          onChange={onChange}
          className={`w-full h-12 px-4 border rounded-xl
            ${errors.subject ? "border-red-500" : data.subject ? "border-green-500" : "border-gray-300"}`}
        />
        {errors.subject && (
          <p className="text-red-500 text-xs">{errors.subject}</p>
        )}
      </div>

      {/* DURATION */}
      <div>
        <Label>Duration</Label>
        <input
          type="number"
          name="duration"
          value={data.duration}
          onChange={onChange}
          className={`w-24 h-12 border rounded-xl text-center
            ${errors.duration ? "border-red-500" : data.duration ? "border-green-500" : "border-gray-300"}`}
        />
        {errors.duration && (
          <p className="text-red-500 text-xs">{errors.duration}</p>
        )}
      </div>
    </div>
  );
}

/* ───────── STEP 2 ───────── */
function Step2({ data, onChange, errors }) {
  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg">Questions</h3>

      {["easy", "medium", "hard"].map((lvl) => (
        <div key={lvl}>
          <Label className="capitalize">{lvl}</Label>
          <input
            type="number"
            name={`${lvl}_count`}
            value={data[`${lvl}_count`]}
            onChange={onChange}
            className="w-full h-12 px-4 border rounded-xl"
          />
        </div>
      ))}

      {errors.questions && (
        <p className="text-red-500 text-sm">{errors.questions}</p>
      )}

      <Card className="p-4 bg-blue-50">
        <p className="text-sm">
          Total:{" "}
          <b>
            {data.easy_count + data.medium_count + data.hard_count}
          </b>
        </p>
      </Card>
    </div>
  );
}

/* ───────── STEP 3 ───────── */
function Step3({ data, onChange }) {
  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg">Settings</h3>

       <Label>Max Attempts</Label>
      <input
        type="number"
        name="max_attempts"
        value={data.max_attempts}
        onChange={onChange}
        className="w-full h-12 px-4 border rounded-xl"
      />

      <label className="flex gap-2">
        <input
          type="checkbox"
          name="shuffle_questions"
          checked={data.shuffle_questions}
          onChange={onChange}
        />
        Shuffle Questions
      </label>

      <label className="flex gap-2">
        <input
          type="checkbox"
          name="shuffle_choices"
          checked={data.shuffle_choices}
          onChange={onChange}
        />
        Shuffle Choices
      </label>
    </div>
  );
}

/* ───────── STEP 4 ───────── */
function Step4({ data, errors }) {
  const total =
    Number(data.easy_count) +
    Number(data.medium_count) +
    Number(data.hard_count);

  const isReady =
    data.title &&
    data.subject &&
    data.duration > 0 &&
    total > 0;

  return (
    <div className="space-y-6">

      {/* HEADER STATUS */}
      <Card className="p-6">
        <h3 className="font-bold text-xl">Preview</h3>

        <p
          className={`mt-2 font-semibold ${
            isReady ? "text-green-600" : "text-red-500"
          }`}
        >
          {isReady
            ? "✔ Ready to publish"
            : "⚠ Missing required information"}
        </p>
      </Card>

      {/* BASIC INFO */}
      <Card className="p-5 space-y-2">
        <h4 className="font-semibold text-gray-700">Basic Info</h4>

        <p><b>Title:</b> {data.title || "—"}</p>
        <p><b>Subject:</b> {data.subject || "—"}</p>
        <p><b>Duration:</b> {data.duration || 0} min</p>
      </Card>

      {/* QUESTIONS BREAKDOWN */}
      <Card className="p-5 space-y-3">
        <h4 className="font-semibold text-gray-700">
          Questions Breakdown
        </h4>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Easy</p>
            <p className="font-bold text-green-600">
              {data.easy_count}
            </p>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Medium</p>
            <p className="font-bold text-yellow-600">
              {data.medium_count}
            </p>
          </div>

          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Hard</p>
            <p className="font-bold text-red-600">
              {data.hard_count}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t text-center">
          <p className="text-sm text-gray-600">
            Total Questions:{" "}
            <span className="font-bold">{total}</span>
          </p>
        </div>
      </Card>

      {/* SETTINGS */}
      <Card className="p-5 space-y-2">
        <h4 className="font-semibold text-gray-700">Settings</h4>

        <p>
          <b>Max Attempts:</b> {data.max_attempts}
        </p>

        <p>
          <b>Shuffle Questions:</b>{" "}
          {data.shuffle_questions ? "Yes" : "No"}
        </p>

        <p>
          <b>Shuffle Choices:</b>{" "}
          {data.shuffle_choices ? "Yes" : "No"}
        </p>
      </Card>

      {/* WARNING SECTION */}
      {!isReady && (
        <Card className="p-4 bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">
            Please complete all required fields before publishing.
          </p>
        </Card>
      )}
    </div>
  );
}

/* ───────── MAIN ───────── */
export default function CreateExam() {
  const navigate = useNavigate();


  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);

  const [examData, setExamData] = useState(INITIAL_EXAM_DATA);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const val =
      type === "checkbox"
        ? checked
        : type === "number"
        ? Number(value)
        : value;

    const newData = { ...examData, [name]: val };
    setExamData(newData);

    setErrors(validate(newData, step));
  };

  const next = () => {
    const err = validate(examData, step);
    setErrors(err);

    if (Object.keys(err).length > 0) return;

    setStep((s) => {
      const n = s + 1;
      setMaxStep((m) => Math.max(m, n));
      return n;
    });
  };

  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleStepClick = (n) => {
    if (n <= maxStep) setStep(n);
  };

  const handlePublish = () => {
    const err1 = validate(examData, 1);
    const err2 = validate(examData, 2);

    const all = { ...err1, ...err2 };
    if (Object.keys(all).length > 0) {
      setErrors(all);
      return;
    }
    alert("🎉 Exam created successfully!");
    navigate("/instructordashboard");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <ProgressBar
        step={step}
        total={TOTAL_STEPS}
        maxStep={maxStep}
        onStepClick={handleStepClick}
      />

      <Card className="p-6">

        {step === 1 && (
          <Step1 data={examData} onChange={handleChange} errors={errors} />
        )}

        {step === 2 && (
          <Step2 data={examData} onChange={handleChange} errors={errors} />
        )}

        {step === 3 && (
          <Step3 data={examData} onChange={handleChange} />
        )}

        {step === 4 && <Step4 data={examData} />}

        <div className="flex justify-between mt-6">
          {step > 1 && <Button onClick={back}>Back</Button>}

          {step < TOTAL_STEPS && (
            <Button onClick={next}>Next</Button>
          )}

          {step === TOTAL_STEPS && (
            <Button onClick={handlePublish}>
              Publish
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}