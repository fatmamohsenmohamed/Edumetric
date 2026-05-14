import { useLocation, useNavigate } from "react-router-dom";
import { MdCheckCircle, MdWorkspacePremium } from "react-icons/md";
import logoWatermark from "../../images/home/logo1.png";
import sealImg from "../../images/seal.png";
import signatureImg from "../../images/signature.png";

/* ── HELPERS ── */

const gradeLabel = (score) => {
  const s = Number(score);
  if (s >= 90) return "A+";
  if (s >= 80) return "A";
  if (s >= 70) return "B";
  if (s >= 60) return "C";
  if (s >= 50) return "D";
  return "F";
};

const formatDate = (str) => {
  if (!str) return "";
  const date = str instanceof Date ? str : new Date(str);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const makeCertId = (student, score) => {
  const initials = (student || "").slice(0, 3).toUpperCase();
  const ts = Date.now().toString(36).toUpperCase();
  return `EDM-${score}-${initials}-${ts}`;
};

export default function CertificatePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const result = {
    student: "",
    subject: "",
    score: 0,
    correct: 0,
    total: 0,
    instructor: "",
    institution: "",
    date: "",
    ...location.state,
  };

  const score = Number(result.score);
  const certId = makeCertId(result.student, score);

  return (
    <div className="cert-wrap min-h-screen bg-white p-6 md:p-10">

      {/* HEADER (no-print from index.css) */}
      <div className="no-print max-w-6xl mx-auto flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold text-[#1e3a8a]">
            Student Certificate
          </h1>
          <p className="text-slate-500 mt-1">
            Official Edumetric Certificate
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-6 py-3 rounded-xl bg-[#1d4ed8] text-white hover:bg-[#1e40af] transition"
          >
            Print Certificate
          </button>
        </div>

      </div>

      {/* CERTIFICATE */}
      <div className="flex justify-center">

        <div className="cert relative bg-white w-full max-w-6xl min-h-[850px] rounded-[32px] overflow-hidden shadow-2xl border border-blue-100 px-10 md:px-20 py-12">

          {/* TOP LINE */}
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#1e3a8a] via-[#1d4ed8] to-cyan-500" />

          {/* SHAPES */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-cyan-100 rounded-full opacity-20 blur-3xl" />

          {/* WATERMARK */}
          <img
            src={logoWatermark}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 m-auto w-[350px] opacity-[0.07] pointer-events-none"
          />

          {/* BORDER */}
          <div className="absolute inset-5 border-2 border-[#1d4ed8]/10 rounded-[28px]" />

          {/* CORNERS */}
          {[
            "top-8 left-8 border-t-[3px] border-l-[3px]",
            "top-8 right-8 border-t-[3px] border-r-[3px]",
            "bottom-8 left-8 border-b-[3px] border-l-[3px]",
            "bottom-8 right-8 border-b-[3px] border-r-[3px]",
          ].map((cls, i) => (
            <div
              key={i}
              className={`absolute w-10 h-10 border-[#1d4ed8] opacity-30 ${cls}`}
            />
          ))}

          {/* CONTENT */}
          <div className="relative z-10 h-full flex flex-col">

            {/* TOP */}
            <div className="flex items-center justify-between">

              <img
                src={logoWatermark}
                alt="logo"
                className="w-40 h-24 object-contain"
              />

              <img
                src={sealImg}
                alt="seal"
                className="w-24 h-24 object-contain"
              />

            </div>

            {/* TITLE */}
            <div className="text-center mt-6">

              <p className="uppercase tracking-[8px] text-sm text-blue-400 font-medium">
                Certificate
              </p>

              <h1 className="text-5xl md:text-6xl font-serif text-[#1e3a8a] mt-3">
                of Achievement
              </h1>

              <div className="w-40 h-1 bg-gradient-to-r from-[#1e3a8a] to-cyan-500 mx-auto rounded-full mt-6" />

            </div>

            {/* STUDENT */}
            <div className="text-center mt-10">

              <p className="uppercase tracking-[5px] text-slate-400 text-sm">
                This certificate is proudly presented to
              </p>

              <div className="mt-5">
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium bg-blue-100 text-[#1d4ed8]">
                  <MdCheckCircle />
                  Certified Student
                </span>
              </div>

              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mt-6 border-b-4 border-[#1d4ed8] inline-block pb-2 px-4">
                {result.student}
              </h2>

              <p className="max-w-3xl mx-auto text-slate-600 text-lg leading-relaxed mt-8">
                For successfully completing the{" "}
                <span className="font-bold text-[#1e3a8a]">
                  {result.subject}
                </span>{" "}
                examination and demonstrating outstanding academic achievement.
              </p>

            </div>

            {/* SCORE */}
            <div className="grid grid-cols-3 gap-5 max-w-3xl mx-auto w-full mt-12">

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center">
                <div className="text-3xl font-bold text-[#1d4ed8]">{score}%</div>
                <div className="text-sm text-slate-400 mt-2">Final Score</div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center">
                <div className="text-3xl font-bold text-[#1d4ed8]">
                  {result.correct}/{result.total}
                </div>
                <div className="text-sm text-slate-400 mt-2">Correct Answers</div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center">
                <div className="text-3xl font-bold text-[#1d4ed8]">
                  {gradeLabel(score)}
                </div>
                <div className="text-sm text-slate-400 mt-2">Grade</div>
              </div>

            </div>

            {/* FOOTER */}
            <div className="pt-12 flex items-end justify-between mt-10">

              <div className="text-center">
                <img
                  src={signatureImg}
                  alt="signature"
                  className="h-16 object-contain mx-auto mb-2"
                />
                <div className="w-44 border-t border-slate-300" />
                <h4 className="text-sm font-semibold text-slate-700 mt-2">
                  {result.instructor}
                </h4>
                <p className="text-xs text-slate-400">Course Instructor</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-[3px] border-[#1d4ed8] flex items-center justify-center">
                  <MdWorkspacePremium className="text-5xl text-[#1d4ed8]" />
                </div>
                <p className="text-xs text-slate-400 mt-2">Official Certificate</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-400 mb-4">
                  {formatDate(result.date)}
                </p>
                <div className="w-44 border-t border-slate-300 ml-auto" />
                <h4 className="text-sm font-semibold text-slate-700 mt-2">
                  {result.institution}
                </h4>
                <p className="text-xs text-slate-400">
                  Institution Director
                </p>
                <p className="text-[11px] text-slate-400 mt-4">
                  Certificate ID: {certId}
                </p>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}