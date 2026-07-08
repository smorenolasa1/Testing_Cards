const STYLE_STORAGE_KEY = "business-card-style";
const DEFAULT_STYLE = "style-1";
const AVAILABLE_STYLES = new Set(["style-1", "style-2"]);
const STYLE_THEME_COLORS = {
  "style-1": "#071421",
  "style-2": "#262c67",
};

const stylesheetLink = document.querySelector("#themeStylesheet");
const styleButtons = document.querySelectorAll("[data-style-option]");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

function getStoredStyle() {
  const storedStyle = localStorage.getItem(STYLE_STORAGE_KEY);
  return AVAILABLE_STYLES.has(storedStyle) ? storedStyle : DEFAULT_STYLE;
}

function updateThemeColor(styleName) {
  if (!themeColorMeta) return;
  themeColorMeta.setAttribute("content", STYLE_THEME_COLORS[styleName] || STYLE_THEME_COLORS[DEFAULT_STYLE]);
}

function updateButtonState(activeStyle) {
  styleButtons.forEach((button) => {
    const isActive = button.dataset.styleOption === activeStyle;
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function applyStyle(styleName) {
  if (!stylesheetLink || !AVAILABLE_STYLES.has(styleName)) return;
  stylesheetLink.href = `styles/${styleName}.css`;
  document.documentElement.setAttribute("data-selected-style", styleName);
  localStorage.setItem(STYLE_STORAGE_KEY, styleName);
  updateThemeColor(styleName);
  updateButtonState(styleName);
}

const initialStyle = getStoredStyle();
updateThemeColor(initialStyle);
updateButtonState(initialStyle);

styleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyStyle(button.dataset.styleOption);
    button.blur();
  });
});
