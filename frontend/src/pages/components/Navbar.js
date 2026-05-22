import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import logoImg from "../../images/home/logo1.png";

export default function Navbar({ user, onLogout, activePage }) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("features");
  const [scrolled, setScrolled] = useState(false);

  const isHome = activePage === "home";

  const navItems = useMemo(
    () => [
      { label: "Exams", href: "exams" },
      { label: "Features", href: "features" },
      { label: "How it works", href: "how-it-works" },
    ],
    []
  );

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      setScrolled(scrollY > 20);

      let current = "features";

      navItems.forEach((item) => {
        const section = document.getElementById(item.href);
        if (section) {
          const top = section.offsetTop - 120;
          const bottom = top + section.offsetHeight;

          if (scrollY >= top && scrollY < bottom) {
            current = item.href;
          }
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems, isHome]);

  function handleNavClick(href) {
    if (isHome) {
      document.getElementById(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      sessionStorage.setItem("scrollTo", href);
      navigate("/");
    }
  }

  return (
    <header
      className={`
        fixed top-0 w-full z-30 transition-all duration-300
        ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-md py-2"
            : "bg-white/60 backdrop-blur-md py-4"
        }
        border-b border-slate-200
      `}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300">

        {/* LOGO */}
        <div className="flex items-center justify-center gap-3 h-18 w-40">
          <button
            onClick={() => navigate("/")}
            className="focus:outline-none"
          >
            <img
              src={logoImg}
              alt="EduMetric Logo"
              className="h-full w-full object-contain"
            />
          </button>
        </div>

        {/* NAV */}
        <nav className="hidden md:flex items-center gap-1 relative">

          {navItems.map((item) => {
            const isActive = isHome && activeSection === item.href;

            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`
                  relative px-4 py-2 rounded-xl transition-all duration-300
                  ${
                    isActive
                      ? "text-blue-900 font-semibold"
                      : "text-slate-600 hover:text-blue-900"
                  }
                `}
              >
                {item.label}

                {/* sliding underline */}
                <span
                  className={`
                    absolute left-1/2 -translate-x-1/2 bottom-0 h-[2px]
                    bg-blue-900 rounded-full transition-all duration-300
                    ${isActive ? "w-4/5 opacity-100" : "w-0 opacity-0"}
                  `}
                />

                {/* glow effect */}
                {isActive && (
                  <span className="absolute inset-0 bg-blue-100/40 blur-xl rounded-xl -z-10" />
                )}
              </button>
            );
          })}

          {/* PRICING BUTTON */}
          <button
            onClick={() => navigate("/pricing")}
            className={`
              relative px-4 py-2 rounded-xl transition-all duration-300
              ${
                activePage === "pricing"
                  ? "text-blue-900 font-semibold"
                  : "text-slate-600 hover:text-blue-900"
              }
            `}
          >
            Pricing

            {/* sliding underline */}
            <span
              className={`
                absolute left-1/2 -translate-x-1/2 bottom-0 h-[2px]
                bg-blue-900 rounded-full transition-all duration-300
                ${activePage === "pricing" ? "w-4/5 opacity-100" : "w-0 opacity-0"}
              `}
            />

            {/* glow effect */}
            {activePage === "pricing" && (
              <span className="absolute inset-0 bg-blue-100/40 blur-xl rounded-xl -z-10" />
            )}
          </button>

        </nav>

        {/* USER */}
        {user ? (
          <UserMenu user={user} onLogout={onLogout} navigate={navigate} />
        ) : (
          <GuestMenu navigate={navigate} />
        )}

      </div>
    </header>
  );
}
/* ================= USER MENU ================= */
 function UserMenu({ user, onLogout, navigate }) {

  if (!user) return null;


  const initial =
    user.full_name?.charAt(0).toUpperCase() || "U";

  /* dashboard route */
  const getDashboardRoute = (user) => {

    // admin
    if (user.user_type === "admin") {
      return "/admindashboard";
    }

    // teacher
    if (user.user_type === "teacher") {
      return "/instructordashboard";
    }

    // institutional student
    if (
      user.user_type === "student" &&
      user.is_institutional
    ) {
      return "/student";
    }

    // free user
    return null;
  };

  const dashboardRoute = getDashboardRoute(user);

  const handleClick = () => {
    if (dashboardRoute) {
      navigate(dashboardRoute);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">

        {/* USER */}
        <div
          onClick={dashboardRoute ? handleClick : undefined}
          className={`
            px-3 py-1.5 rounded-full
            flex items-center gap-2
            transition
            ${
              dashboardRoute
                ? "cursor-pointer hover:bg-blue-50"
                : "cursor-default"
            }
          `}
        >
          {/* AVATAR */}
          <div className="
            w-8 h-8 rounded-full
            bg-blue-900 text-white
            flex items-center justify-center
            text-xs
          ">
            {initial}
          </div>

          {/* NAME */}
          <span className="text-sm text-blue-900 font-medium">
            {user.full_name}
          </span>
        </div>

        {/* LOGOUT */}
        <button
          onClick={onLogout}
          className="
            p-2 rounded-xl
            hover:bg-red-50
            hover:text-red-600
          "
        >
          <MdLogout size={18} />
        </button>

      </div>
    </>
  );
}

/* ================= GUEST MENU ================= */

function GuestMenu({ navigate }) {
  return (
    <div className="flex items-center gap-2">

      <button
        onClick={() => navigate("/login")}
        className="
          px-4 py-2
          text-blue-900
          hover:bg-blue-50
          rounded-xl
        "
      >
        Login
      </button>

      <button
        onClick={() => navigate("/register")}
        className="
          px-4 py-2
          bg-blue-900 text-white
          rounded-xl
        "
      >
        Sign Up
      </button>

    </div>
  );
}