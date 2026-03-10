import { useState, useEffect } from "react";

const STEPS = [
  // 1. "All tasks" harf harf (Hızlı: 80ms)
  ...Array.from("All tasks").map((_, i) => ({
    text: "All tasks".slice(0, i + 1),
    dots: "",
    doneText: "",
  })),
  // 2. Nokta Turu 1 (Yavaş: 800ms)
  { text: "All tasks ", dots: "", doneText: "" },
  { text: "All tasks ", dots: ". ", doneText: "" },
  { text: "All tasks ", dots: "..", doneText: "" },
  { text: "All tasks ", dots: "...", doneText: "" },
  { text: "All tasks ", dots: "...?", doneText: "", hold: true },
  { text: "All tasks ", dots: "", doneText: "", hold: true },
  // 3. Nokta Turu 2 (Yavaş: 800ms)
  { text: "All tasks ", dots: "", doneText: "" },
  { text: "All tasks ", dots: ".", doneText: "" },
  { text: "All tasks ", dots: "..", doneText: "" },
  { text: "All tasks ", dots: "...", doneText: "" },
  { text: "All tasks ", dots: "...?", doneText: "", hold: true },
  { text: "All tasks ", dots: "", doneText: "", hold: true },
  // 4. " done!" harf harf (Yeşil ve Ünlemli: 100ms)
  ...Array.from(" done! ✅").map((_, i) => ({
    text: "All tasks ",
    dots: "",
    doneText: "done! ✅".slice(0, i + 1),
  })),
];

function LogoAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= STEPS.length - 1) return;

    const current = STEPS[step];
    // Noktalar için 800ms, harfler için 80ms-100ms bekleme
    const delay = current.hold
      ? 600
      : current.dots !== ""
        ? 400
        : current.doneText !== ""
          ? 100
          : 80;

    const timer = setTimeout(() => setStep((s) => s + 1), delay);
    return () => clearTimeout(timer);
  }, [step]);

  const current = STEPS[step];

  return (
    <div
      className="login-logo"
      style={{
        fontSize: "2.4rem",
        fontFamily: "'Chelsea Market', sans-serif",
        textAlign: "center",
        marginBottom: "2rem",
      }}
    >
      <span style={{ color: "#ff0099" }}>{current.text}</span>
      <span style={{ color: "#3e3e3e" }}>{current.dots}</span>
      <span style={{ color: "#047d30" }}>{current.doneText}</span>
    </div>
  );
}

export default LogoAnimation;
