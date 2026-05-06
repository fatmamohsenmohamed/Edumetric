import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";

/* SAMPLE DATA */
const INITIAL_EXAMS = [
  {
    id: 1,
    title: "React Basics",
    subject: "Web",
    duration: 60,
    questions: 20,
    status: "Published",
  },
  {
    id: 2,
    title: "Database Intro",
    subject: "CS",
    duration: 90,
    questions: 25,
    status: "Draft",
  },
];

export default function ExamsManagement() {
  const [exams, setExams] = useState(INITIAL_EXAMS);

  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [openForm, setOpenForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("");
  const [questions, setQuestions] = useState("");
  const navigate = useNavigate();

  /* FILTER */
  const filtered = exams
    .filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((e) => subjectFilter === "all" || e.subject === subjectFilter)
    .filter((e) => statusFilter === "all" || e.status === statusFilter);

  /* STATS */
  const total = exams.length;
  const published = exams.filter((e) => e.status === "Published").length;
  const draft = exams.filter((e) => e.status === "Draft").length;

  /* RESET */
  const reset = () => {
    setTitle("");
    setSubject("");
    setDuration("");
    setQuestions("");
    setEditId(null);
  };

  /* SAVE */
  const handleSave = () => {
    if (!title || !subject) return;

    const newExam = {
      id: editId || Date.now(),
      title,
      subject,
      duration,
      questions,
      status: "Draft",
    };

    if (editId) {
      setExams((prev) =>
        prev.map((e) => (e.id === editId ? newExam : e))
      );
    } else {
      setExams((prev) => [newExam, ...prev]);
    }

    setOpenForm(false);
    reset();
  };

  /* EDIT */
  const handleEdit = (exam) => {
    setEditId(exam.id);
    setTitle(exam.title);
    setSubject(exam.subject);
    setDuration(exam.duration);
    setQuestions(exam.questions);
    setOpenForm(true);
  };

  /* DELETE */
  const handleDelete = (id) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
  };

  /* PUBLISH */
  const togglePublish = (id) => {
    setExams((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: e.status === "Published" ? "Draft" : "Published" }
          : e
      )
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* HEADER */}
      <Card className="p-5 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-[#1e3a8a]">
            Exams Management
          </h1>
          <p className="text-sm text-slate-500">
            Create, edit and manage exams
          </p>
        </div>

        <Button onClick={() => navigate("/createexam")}>
          + Create Exam
        </Button>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500">Total Exams</p>
          <p className="text-xl font-bold">{total}</p>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500">Published</p>
          <p className="text-xl font-bold text-green-600">{published}</p>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500">Draft</p>
          <p className="text-xl font-bold text-yellow-600">{draft}</p>
        </Card>
      </div>

      {/* FILTERS */}
      <Card className="p-4 flex flex-wrap gap-3">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exams..."
          className="border px-3 py-2 rounded-xl text-sm"
        />

        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="border px-3 py-2 rounded-xl text-sm"
        >
          <option value="all">All Subjects</option>
          <option value="Web">Web</option>
          <option value="CS">CS</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-xl text-sm"
        >
          <option value="all">All Status</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>

      </Card>

      {/* LIST */}
      {filtered.length === 0 ? (
        <Card className="p-6 text-center text-slate-500">
          No exams yet — create your first exam 
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((exam) => (
            <Card
              key={exam.id}
              className="p-4 flex justify-between items-center"
            >

              <div>
                <h2 className="font-bold text-[#1e3a8a]">
                  {exam.title}
                </h2>

                <p className="text-sm text-slate-500">
                  {exam.subject} • {exam.duration} min • {exam.questions} Qs
                </p>

                <span
                  className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                    exam.status === "Published"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {exam.status}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 flex-wrap">

                <Button onClick={() => navigate(`/createexam/${exam.id}`)}>
                  Edit
                </Button>

                <Button onClick={() => handleDelete(exam.id)}>
                  Delete
                </Button>

                <Button onClick={() => togglePublish(exam.id)}>
                  {exam.status === "Published" ? "Unpublish" : "Publish"}
                </Button>

                <Button>
                  View Results
                </Button>

              </div>

            </Card>
          ))}
        </div>
      )}

      {/* FORM */}
      {openForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="p-6 w-full max-w-lg space-y-3">

            <h2 className="text-lg font-bold text-[#1e3a8a]">
              {editId ? "Edit Exam" : "Create Exam"}
            </h2>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Exam Title"
              className="w-full border p-2 rounded-lg"
            />

            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full border p-2 rounded-lg"
            />

            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Duration"
              className="w-full border p-2 rounded-lg"
            />

            <input
              type="number"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              placeholder="Number of Questions"
              className="w-full border p-2 rounded-lg"
            />

            <div className="flex justify-end gap-2 pt-2">

              <Button
                onClick={() => {
                  setOpenForm(false);
                  reset();
                }}
              >
                Cancel
              </Button>

              <Button onClick={handleSave}>
                {editId ? "Update" : "Create"}
              </Button>

            </div>

          </Card>
        </div>
      )}

    </div>
  );
}