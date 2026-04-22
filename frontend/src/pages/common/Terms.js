import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Terms() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-textMain">

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-border z-50">
        <div
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
        <p className="text-textSoft mb-10">
          Last updated: April 2026
        </p>

        {/* Sections */}
        <div className="space-y-10">

          {/* Section 1 */}
          <section className="opacity-0 animate-fadeInUp">
            <h2 className="text-xl font-semibold mb-2">1. Acceptance</h2>
            <p className="text-textSoft leading-7">
              By using EduMetric, you agree to follow all platform rules and
              policies. If you do not agree, you should stop using the service.
            </p>
          </section>

          {/* Section 2 */}
          <section className="opacity-0 animate-fadeInUp">
            <h2 className="text-xl font-semibold mb-2">2. User Accounts</h2>
            <p className="text-textSoft leading-7">
              You are responsible for maintaining the confidentiality of your
              account credentials and activities.
            </p>
          </section>

          {/* Section 3 */}
          <section className="opacity-0 animate-fadeInUp">
            <h2 className="text-xl font-semibold mb-2">3. Data & Privacy</h2>
            <p className="text-textSoft leading-7">
              We protect your personal data and do not share it without consent,
              except when required by law.
            </p>
          </section>

          {/* Section 4 */}
          <section className="opacity-0 animate-fadeInUp">
            <h2 className="text-xl font-semibold mb-2">4. Platform Usage</h2>
            <p className="text-textSoft leading-7">
              Any misuse of the platform, cheating, or abuse may result in
              account suspension or termination.
            </p>
          </section>

          {/* Section 5 */}
          <section className="opacity-0 animate-fadeInUp">
            <h2 className="text-xl font-semibold mb-2">5. Updates</h2>
            <p className="text-textSoft leading-7">
              We may update these terms at any time. Continued use means
              acceptance of the updated version.
            </p>
          </section>
        </div>

        {/* Bottom Action */}
        <div className="mt-16 border-t border-border pt-6 flex justify-between items-center">

          <Link
            to="/register"
            className="text-primary hover:underline text-sm"
          >
            ← Back to Register
          </Link>

          <button
            className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primaryLight shadow-soft transition"
            onClick={() => {
                localStorage.setItem("acceptedTerms", "true");
                window.history.back(); 
            }}
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
}