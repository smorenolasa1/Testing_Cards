// Configuracion de WhatsApp
const whatsappNumber = "+34 654 431 185";
const defaultWhatsappMessage =
  "Hola, me interesa una business card digital personalizada en Madrid por 25 euros. Quiero recibir mas informacion.";

const whatsappBaseUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;

function buildWhatsappUrl(message) {
  return `${whatsappBaseUrl}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll(".whatsapp-link").forEach((link) => {
  link.href = buildWhatsappUrl(defaultWhatsappMessage);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

// Referencias del formulario
const form = document.querySelector("#cardForm");
const finalPreview = document.querySelector("#finalPreview");
const finalActions = document.querySelector("#finalActions");
const finalWhatsappLink = document.querySelector("#finalWhatsappLink");
const previewLabel = document.querySelector(".preview-label");

const fields = {
  backgroundColor: document.querySelector("#backgroundColor"),
  cardColor: document.querySelector("#cardColor"),
  customerName: document.querySelector("#customerName"),
  nameColor: document.querySelector("#nameColor"),
  customerEmail: document.querySelector("#customerEmail"),
  linkedinUrl: document.querySelector("#linkedinUrl"),
  businessName: document.querySelector("#businessName"),
  additionalComments: document.querySelector("#additionalComments"),
};

const logoInput = document.querySelector("#logoUpload");
const logoDropzone = document.querySelector("#logoDropzone");
const logoStatus = document.querySelector("#logoStatus");

// Referencias de la preview basada en card_example
const previewCard = document.querySelector("#customPreview");
const previewName = document.querySelector("#previewName");
const previewEmail = document.querySelector("#previewEmail");
const previewBusiness = document.querySelector("#previewBusiness");
const previewLinkedin = document.querySelector("#previewLinkedin");
const previewLogo = document.querySelector("#previewLogo");
const previewEmailAction = document.querySelector("#previewEmailAction");
const previewLinkedinAction = document.querySelector("#previewLinkedinAction");

let logoFileName = "";
let logoObjectUrl = "";

function getFieldValue(fieldName) {
  return fields[fieldName]?.value.trim() || "";
}

function normalizeHex(value, fallback) {
  return /^#[0-9A-Fa-f]{6}$/.test(value) ? value.toUpperCase() : fallback;
}

function getFormState() {
  return {
    backgroundColor: normalizeHex(getFieldValue("backgroundColor"), "#F7F9FB"),
    cardColor: normalizeHex(getFieldValue("cardColor"), "#F2F4F5"),
    customerName: getFieldValue("customerName"),
    nameColor: normalizeHex(getFieldValue("nameColor"), "#16253A"),
    customerEmail: getFieldValue("customerEmail"),
    linkedinUrl: getFieldValue("linkedinUrl"),
    businessName: getFieldValue("businessName"),
    additionalComments: getFieldValue("additionalComments"),
    logoFileName,
  };
}

// Logica de actualizacion de la tarjeta
function setPreviewCardColor(cardColor) {
  if (!previewCard) return;
  previewCard.style.background = `
    linear-gradient(94deg, rgba(255, 255, 255, 0.16) 0 1px, transparent 1px 8px),
    linear-gradient(4deg, rgba(20, 60, 90, 0.035) 0 1px, transparent 1px 10px),
    linear-gradient(118deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0) 24%),
    repeating-linear-gradient(96deg, rgba(255, 255, 255, 0.16) 0 1px, rgba(84, 93, 101, 0.035) 1px 3px),
    linear-gradient(145deg, ${cardColor} 0%, ${cardColor} 100%)
  `;
}

function setElementVisibility(element, isVisible) {
  if (!element) return;
  element.hidden = !isVisible;
}

function renderCardPreview({ isFinal = false } = {}) {
  const state = getFormState();

  document.body.style.setProperty("--preview-page-bg", state.backgroundColor);
  setPreviewCardColor(state.cardColor);

  if (previewName) {
    previewName.textContent = state.customerName || "Tu nombre";
    previewName.style.color = state.nameColor;
  }

  if (previewEmail) {
    previewEmail.textContent = state.customerEmail || "nombre@email.com";
  }

  const hasBusinessName = Boolean(state.businessName);
  const hasLinkedin = Boolean(state.linkedinUrl);

  if (previewBusiness) {
    previewBusiness.textContent = state.businessName || "Tu marca";
    setElementVisibility(previewBusiness, !isFinal || hasBusinessName);
  }

  if (previewLinkedin) {
    previewLinkedin.textContent = state.linkedinUrl || "LinkedIn opcional";
    setElementVisibility(previewLinkedin, !isFinal || hasLinkedin);
  }

  if (previewEmailAction) {
    setElementVisibility(previewEmailAction, !isFinal || Boolean(state.customerEmail));
  }

  if (previewLinkedinAction) {
    setElementVisibility(previewLinkedinAction, !isFinal || hasLinkedin);
  }
}

function resetFinalPreviewState() {
  if (finalActions) finalActions.hidden = true;
  finalPreview?.classList.remove("is-final");
  if (previewLabel) previewLabel.textContent = "Preview";
  renderCardPreview({ isFinal: false });
}

function buildFinalWhatsappMessage() {
  const state = getFormState();

  return [
    "Hola, quiero solicitar una business card digital personalizada en Madrid por 25 euros.",
    "",
    "Datos de la tarjeta:",
    `Name: ${state.customerName || "-"}`,
    `Email: ${state.customerEmail || "-"}`,
    `LinkedIn: ${state.linkedinUrl || "No indicado"}`,
    `Business name: ${state.businessName || "No indicado"}`,
    `Background color: ${state.backgroundColor}`,
    `Card color: ${state.cardColor}`,
    `Name color: ${state.nameColor}`,
    `Logo: ${state.logoFileName || "No adjuntado en el formulario"}`,
    "",
    `Comentarios adicionales: ${state.additionalComments || "Sin comentarios adicionales"}`,
  ].join("\n");
}

// Logo upload con drag and drop
function handleLogoFile(file) {
  if (!file || !file.type.startsWith("image/")) return;

  logoFileName = file.name;
  if (logoStatus) logoStatus.textContent = `${file.name} seleccionado.`;

  if (previewLogo) {
    if (logoObjectUrl) URL.revokeObjectURL(logoObjectUrl);
    logoObjectUrl = URL.createObjectURL(file);
    previewLogo.innerHTML = "";
    const logoImage = document.createElement("img");
    logoImage.src = logoObjectUrl;
    logoImage.alt = `Logo ${file.name}`;
    previewLogo.append(logoImage);
  }

  resetFinalPreviewState();
}

if (logoInput) {
  logoInput.addEventListener("change", () => handleLogoFile(logoInput.files?.[0]));
}

if (logoDropzone) {
  ["dragenter", "dragover"].forEach((eventName) => {
    logoDropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      logoDropzone.classList.add("is-dragging");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    logoDropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      logoDropzone.classList.remove("is-dragging");
    });
  });

  logoDropzone.addEventListener("drop", (event) => {
    handleLogoFile(event.dataTransfer?.files?.[0]);
  });
}

// Controles de color
function syncColorText(colorInput) {
  const textInput = document.querySelector(`[data-color-text="${colorInput.id}"]`);
  if (textInput) textInput.value = colorInput.value.toUpperCase();
}

function syncColorInput(textInput) {
  const colorInput = document.querySelector(`#${textInput.dataset.colorText}`);
  const value = textInput.value.trim();

  if (colorInput && /^#[0-9A-Fa-f]{6}$/.test(value)) {
    colorInput.value = value;
    resetFinalPreviewState();
  }
}

document.querySelectorAll('input[type="color"]').forEach((input) => {
  input.addEventListener("input", () => {
    syncColorText(input);
    resetFinalPreviewState();
  });
});

document.querySelectorAll(".color-text").forEach((input) => {
  input.addEventListener("input", () => syncColorInput(input));
});

Object.values(fields).forEach((field) => {
  field?.addEventListener("input", resetFinalPreviewState);
});

// Integracion con WhatsApp despues del submit
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    renderCardPreview({ isFinal: true });

    if (finalWhatsappLink) {
      finalWhatsappLink.href = buildWhatsappUrl(buildFinalWhatsappMessage());
    }

    if (finalActions) finalActions.hidden = false;
    finalPreview?.classList.add("is-final");
    if (previewLabel) previewLabel.textContent = "Preview final";

    finalPreview?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

renderCardPreview();
