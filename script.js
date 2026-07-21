// Configuración de WhatsApp
const whatsappNumber = "+34 654 431 185";
const defaultWhatsappMessage =
  "Hola, me interesa una tarjeta física NFC personalizada. Quiero recibir más información.";

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

const fields = {
  customerName: document.querySelector("#customerName"),
  customerEmail: document.querySelector("#customerEmail"),
  linkedinUrl: document.querySelector("#linkedinUrl"),
  instagramUrl: document.querySelector("#instagramUrl"),
  businessName: document.querySelector("#businessName"),
  customerLocation: document.querySelector("#customerLocation"),
  googleMapsUrl: document.querySelector("#googleMapsUrl"),
  googleReviewsUrl: document.querySelector("#googleReviewsUrl"),
  additionalComments: document.querySelector("#additionalComments"),
};

const logoInput = document.querySelector("#logoUpload");
const logoDropzone = document.querySelector("#logoDropzone");
const logoStatus = document.querySelector("#logoStatus");

// Referencias de la preview basada en card_example
const previewName = document.querySelector("#previewName");
const previewEmail = document.querySelector("#previewEmail");
const previewBusiness = document.querySelector("#previewBusiness");
const previewLocation = document.querySelector("#previewLocation");
const previewLinkedin = document.querySelector("#previewLinkedin");
const previewLogoWrap = document.querySelector("#previewLogoWrap");
const previewLogo = document.querySelector("#previewLogo");
const previewEmailAction = document.querySelector("#previewEmailAction");
const previewLinkedinAction = document.querySelector("#previewLinkedinAction");
const previewInstagramAction = document.querySelector("#previewInstagramAction");
const previewGoogleMapsAction = document.querySelector("#previewGoogleMapsAction");
const previewGoogleReviewsAction = document.querySelector("#previewGoogleReviewsAction");
const shareCardButton = document.querySelector("#shareCardButton");

let logoFileName = "";
let logoObjectUrl = "";

function getFieldValue(fieldName) {
  return fields[fieldName]?.value.trim() || "";
}

function getFormState() {
  return {
    customerName: getFieldValue("customerName"),
    customerEmail: getFieldValue("customerEmail"),
    linkedinUrl: getFieldValue("linkedinUrl"),
    instagramUrl: getFieldValue("instagramUrl"),
    businessName: getFieldValue("businessName"),
    customerLocation: getFieldValue("customerLocation"),
    googleMapsUrl: getFieldValue("googleMapsUrl"),
    googleReviewsUrl: getFieldValue("googleReviewsUrl"),
    additionalComments: getFieldValue("additionalComments"),
    logoFileName,
  };
}

function setElementVisibility(element, isVisible) {
  if (!element) return;
  element.hidden = !isVisible;
}

function renderCardPreview({ isFinal = false } = {}) {
  const state = getFormState();

  if (previewName) {
    previewName.textContent = state.customerName || "Tu nombre";
  }

  if (previewEmail) {
    previewEmail.textContent = state.customerEmail || "nombre@email.com";
  }

  const hasBusinessName = Boolean(state.businessName);
  const hasLinkedin = Boolean(state.linkedinUrl);
  const hasInstagram = Boolean(state.instagramUrl);
  const hasLocation = Boolean(state.customerLocation);
  const hasGoogleMaps = Boolean(state.googleMapsUrl);
  const hasGoogleReviews = Boolean(state.googleReviewsUrl);

  if (previewLocation) {
    previewLocation.textContent = state.customerLocation || "Madrid, España";
    setElementVisibility(previewLocation, !isFinal || hasLocation);
  }

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

  if (previewInstagramAction) {
    setElementVisibility(previewInstagramAction, !isFinal || hasInstagram);
  }

  if (previewGoogleMapsAction) {
    setElementVisibility(previewGoogleMapsAction, !isFinal || hasGoogleMaps);
  }

  if (previewGoogleReviewsAction) {
    setElementVisibility(previewGoogleReviewsAction, !isFinal || hasGoogleReviews);
  }
}

function resetFinalPreviewState() {
  if (finalActions) finalActions.hidden = true;
  finalPreview?.classList.remove("is-final");
  renderCardPreview({ isFinal: false });
}

function buildFinalWhatsappMessage() {
  const state = getFormState();

  return [
    "Hola, quiero solicitar este diseño de tarjeta física NFC.",
    "",
    "Datos de la tarjeta:",
    `Name: ${state.customerName || "-"}`,
    `Email: ${state.customerEmail || "-"}`,
    `LinkedIn: ${state.linkedinUrl || "No indicado"}`,
    `Instagram: ${state.instagramUrl || "No indicado"}`,
    `Business name: ${state.businessName || "No indicado"}`,
    `Ubicación: ${state.customerLocation || "No indicado"}`,
    `Google Maps: ${state.googleMapsUrl || "No indicado"}`,
    `Reseñas de Google: ${state.googleReviewsUrl || "No indicado"}`,
    `Logo: ${state.logoFileName || "No adjuntado en el formulario"}`,
    "",
    `Comentarios adicionales: ${state.additionalComments || "Sin comentarios adicionales"}`,
    "",
  ].join("\n");
}

function buildShareText() {
  const state = getFormState();
  return [
    state.customerName || "Business card NFC",
    state.businessName || "",
    state.customerLocation || "",
    state.customerEmail || "",
    state.linkedinUrl || "",
    state.instagramUrl || "",
    state.googleMapsUrl ? `Google Maps: ${state.googleMapsUrl}` : "",
    state.googleReviewsUrl ? `Reseñas de Google: ${state.googleReviewsUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

// Logo upload con drag and drop
function handleLogoFile(file) {
  if (!file || !file.type.startsWith("image/")) return;

  logoFileName = file.name;
  if (logoStatus) logoStatus.textContent = `${file.name} seleccionado.`;

  if (previewLogo) {
    if (logoObjectUrl) URL.revokeObjectURL(logoObjectUrl);
    logoObjectUrl = URL.createObjectURL(file);
    if (previewLogoWrap) previewLogoWrap.hidden = false;
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

Object.values(fields).forEach((field) => {
  field?.addEventListener("input", resetFinalPreviewState);
});

if (shareCardButton) {
  shareCardButton.addEventListener("click", async () => {
    const shareText = buildShareText();

    if (navigator.share) {
      await navigator.share({
        title: getFieldValue("customerName") || "Business card NFC",
        text: shareText,
      });
      return;
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      shareCardButton.textContent = "Tarjeta copiada";
      window.setTimeout(() => {
        shareCardButton.innerHTML = '<span class="button-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4" /><path d="m15.4 6.5-6.8 4" /></svg></span>Compartir tarjeta';
      }, 1800);
    }
  });
}

// Integración con WhatsApp después del submit
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    renderCardPreview({ isFinal: true });

    const whatsappUrl = buildWhatsappUrl(buildFinalWhatsappMessage());

    if (finalWhatsappLink) {
      finalWhatsappLink.href = whatsappUrl;
    }

    if (finalActions) finalActions.hidden = false;
    finalPreview?.classList.add("is-final");

    finalPreview?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
}

renderCardPreview();
