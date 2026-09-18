import { Link } from "react-router-dom";
import {
  Users,
  UserRoundSearch,
  BriefcaseBusiness,
  CheckSquare,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Zap,
  LayoutDashboard,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Users,
      title: "Customer Management",
      description:
        "Keep all your customer information organized and easily accessible in one place.",
    },
    {
      icon: UserRoundSearch,
      title: "Lead Management",
      description:
        "Track leads, follow-ups, and customer opportunities throughout your sales process.",
    },
    {
      icon: BriefcaseBusiness,
      title: "Deal Management",
      description:
        "Manage your sales pipeline and track deals from new opportunities to successful closures.",
    },
    {
      icon: CheckSquare,
      title: "Task Management",
      description:
        "Create, organize, and track tasks so your team stays productive and focused.",
    },
    {
      icon: BarChart3,
      title: "Reports & Analytics",
      description:
        "Understand your business performance with simple reports and useful analytics.",
    },
    {
      icon: LayoutDashboard,
      title: "Smart Dashboard",
      description:
        "Get a quick overview of customers, leads, deals, revenue, and activities.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/home" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <LayoutDashboard size={22} />
            </div>

            <span className="text-xl font-bold text-slate-900">SmartCRM</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              to="/home"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600"
            >
              Home
            </Link>

            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600"
            >
              Features
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600"
            >
              About
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:block"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section id="home" className="relative overflow-hidden bg-slate-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
              <Zap size={16} />
              Simple. Powerful. Organized.
            </div>

            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Manage your business
              <span className="text-indigo-600"> smarter.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              SmartCRM helps you manage customers, leads, deals, tasks, and
              business performance from one simple and powerful platform.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
              >
                Start for Free
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Login to Dashboard
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-green-600" />
                Organized Data
              </div>

              <div className="flex items-center gap-2">
                <Zap size={18} className="text-indigo-600" />
                Easy to Use
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-indigo-100/60 blur-2xl" />

            <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
              <div className="rounded-xl bg-slate-50 p-5">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Welcome back</p>
                    <h3 className="text-xl font-bold text-slate-900">
                      Dashboard
                    </h3>
                  </div>

                  <div className="h-10 w-10 rounded-full bg-indigo-100" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <p className="text-xs text-slate-500">Total Customers</p>
                    <p className="mt-2 text-2xl font-bold">1,248</p>
                  </div>

                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <p className="text-xs text-slate-500">Active Leads</p>
                    <p className="mt-2 text-2xl font-bold">326</p>
                  </div>

                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <p className="text-xs text-slate-500">Active Deals</p>
                    <p className="mt-2 text-2xl font-bold">84</p>
                  </div>

                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <p className="text-xs text-slate-500">Revenue</p>
                    <p className="mt-2 text-2xl font-bold">₹24.8L</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Revenue Overview</p>
                    <BarChart3 size={20} className="text-indigo-600" />
                  </div>

                  <div className="mt-5 flex h-28 items-end gap-3">
                    {[35, 50, 42, 70, 60, 85, 72, 95].map((height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-md bg-indigo-500"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Powerful Features
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to manage your CRM
            </h2>

            <p className="mt-4 text-slate-600">
              Keep your customers, sales pipeline, tasks, and business insights
              organized in one place.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="about" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Why SmartCRM?
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                One place for your entire customer journey
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                From the first lead to a successful deal, SmartCRM gives you the
                tools to organize and monitor your business activities without
                unnecessary complexity.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  "Manage customers and contacts efficiently",
                  "Track leads and sales opportunities",
                  "Monitor deals through different pipeline stages",
                  "Stay organized with tasks and reports",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                      <span className="text-sm font-bold text-green-600">
                        ✓
                      </span>
                    </div>

                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-indigo-600 p-8 text-white shadow-xl sm:p-10">
              <LayoutDashboard size={42} />

              <h3 className="mt-6 text-2xl font-bold">
                Your business at a glance
              </h3>

              <p className="mt-4 leading-7 text-indigo-100">
                Access important CRM information through a clean dashboard
                designed to help you make better decisions faster.
              </p>

              <Link
                to="/signup"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-indigo-600 transition hover:bg-indigo-50"
              >
                Create Your Account
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-900 px-6 py-14 text-center sm:px-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to organize your business?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Start managing your customers, leads, deals, and tasks from one
              simple CRM platform.
            </p>

            <Link
              to="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold text-white transition hover:bg-indigo-500"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <LayoutDashboard size={17} />
            </div>

            <span className="font-bold">SmartCRM</span>
          </div>

          <p className="text-sm text-slate-500">
            © 2026 SmartCRM. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
