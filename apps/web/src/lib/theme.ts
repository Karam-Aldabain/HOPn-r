export function setTheme(next: "light" | "dark") {
  const root = document.documentElement;
  root.classList.remove("theme-light", "theme-dark");
  root.classList.add(next === "light" ? "theme-light" : "theme-dark");
  localStorage.setItem("theme", next);
}

export function initTheme() {
  const saved = localStorage.getItem("theme") as "light" | "dark" | null;
  const initial = saved ?? "dark";
  setTheme(initial);
}
