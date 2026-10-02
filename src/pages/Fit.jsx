import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowLeft, Check, RotateCcw } from "lucide-react";
import Layout from "../components/Layout";
import { QUIZ_QUESTIONS, scoreQuiz } from "../data/quiz";

export default function Fit() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  const result = useMemo(() => scoreQuiz(answers), [answers]);
  const question = QUIZ_QUESTIONS[step];

  useEffect(() => {
    document.title = "Find Your Growth Path | Veteran Webworks";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        "Answer six concise questions to find the right website design, website care, local growth, lead automation, AI front office, or revenue protection path.",
      );
  }, []);

  function pick(value) {
    setAnswers((a) => ({ ...a, [question.key]: value }));
  }

  function next() {
    if (!answers[question.key]) return;
    if (step === QUIZ_QUESTIONS.length - 1) {
      setDone(true);
    } else {
      setStep((s) => s + 1);
    }
  }

  function startOver() {
    setStep(0);
    setAnswers({});
    setDone(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Layout>
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-24 sm:px-10 sm:pt-32">
        <div className="max-w-3xl">
          <p className="eyebrow text-primary">A clearer next step</p>
          <h1 className="display mt-5 text-5xl font-semibold leading-[.94] sm:text-7xl">
            Find the right growth path.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
            Six quick questions connect your current situation to the service layer that can help most. Your answers
            become a useful starting point for a real conversation.
          </p>
        </div>

        {done ? (
          <section aria-labelledby="fit-result" className="mt-14 grid gap-8 lg:grid-cols-[1fr_.85fr]">
            <div className="rounded-2xl border border-primary/40 bg-primary/10 p-7 sm:p-10">
              <p className="eyebrow text-primary">Your recommended growth path</p>
              <h2 id="fit-result" className="display mt-5 text-4xl font-semibold sm:text-6xl">
                Start with {result.name}.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">{result.why}</p>
              <div className="mt-8 rounded-xl border border-border bg-background/80 p-5">
                <p className="text-sm text-muted-foreground">Starting point</p>
                <p className="mt-2 text-2xl font-semibold text-primary">{result.price}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Published starting pricing is shown here. We will confirm the right scope before any work begins.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/book"
                  className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground"
                >
                  Schedule my appointment <ArrowUpRight className="ml-2 size-4" />
                </a>
                <Link
                  to={`/services/${result.slug}`}
                  className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm font-medium"
                >
                  Explore this service
                </Link>
                <button
                  type="button"
                  onClick={startOver}
                  className="inline-flex h-10 items-center rounded-md px-5 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="mr-2 size-4" />
                  Start over
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-7 sm:p-10">
              <p className="eyebrow text-primary">What this path includes</p>
              <p className="mt-5 text-lg leading-8">{result.includes}</p>
              <p className="mt-10 text-sm font-semibold uppercase tracking-[.14em] text-muted-foreground">
                Next in sequence
              </p>
              <ul className="mt-4 space-y-3">
                {result.support.map((item) => (
                  <li key={item} className="flex gap-3 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-10 text-sm font-semibold uppercase tracking-[.14em] text-muted-foreground">
                Likely outcome
              </p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{result.outcome}</p>
            </div>
          </section>
        ) : (
          <section
            aria-labelledby="fit-question"
            className="mt-14 max-w-4xl rounded-2xl border border-border bg-card p-6 sm:p-10"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="eyebrow text-primary">
                Step {step + 1} of {QUIZ_QUESTIONS.length}
              </p>
              <span className="text-sm text-muted-foreground">
                {Math.round(((step + 1) / QUIZ_QUESTIONS.length) * 100)}%
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${((step + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
            <h2 id="fit-question" className="display mt-12 text-3xl font-semibold sm:text-5xl">
              {question.title}
            </h2>
            <p className="mt-4 text-muted-foreground">{question.hint}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {question.answers.map((a) => (
                <label
                  key={a.label}
                  className={`group flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors hover:border-primary/60 ${
                    answers[question.key] === a.value ? "border-primary bg-primary/10" : "border-border bg-background"
                  }`}
                >
                  <input
                    type="radio"
                    name={question.key}
                    value={a.value}
                    checked={answers[question.key] === a.value}
                    onChange={() => pick(a.value)}
                    className="mt-1 size-4 accent-[var(--color-primary)]"
                  />
                  <span className="text-sm leading-6">{a.label}</span>
                </label>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
              <button
                type="button"
                onClick={() => step && setStep((s) => s - 1)}
                disabled={step === 0}
                className="inline-flex h-10 items-center rounded-md px-5 text-sm font-medium text-muted-foreground disabled:opacity-40 hover:text-foreground"
              >
                <ArrowLeft className="mr-2 size-4" />
                Back
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!answers[question.key]}
                className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-40"
              >
                {step === QUIZ_QUESTIONS.length - 1 ? "See my recommendation" : "Next question"}
                <ArrowUpRight className="ml-2 size-4" />
              </button>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
