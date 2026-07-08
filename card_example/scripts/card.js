const profile = {
  // Update this object if contact details change.
  name: "Pablo Moreno Lasa",
  role: "Investment Banking Analyst",
  company: "Evercore",
  tagline: "Utilities, Infrastructure & Transport M&A",
  location: "London, United Kingdom",
  companyPage: "https://www.linkedin.com/company/163732/",
  linkedin: "https://www.linkedin.com/in/pablo-moreno-lasa-924890254/",
  vcard: "assets/pablo-moreno.vcf",
};

const card = document.querySelector("#businessCard");
const shareButton = document.querySelector("#shareButton");
const saveContact = document.querySelector("#saveContact");

document.querySelector("#personName").textContent = profile.name;
document.querySelector("#roleText").textContent = profile.role;
document.querySelector("#taglineText").textContent = profile.tagline;
document.querySelector("#locationText").textContent = profile.location;
saveContact.href = profile.vcard;
document.querySelector("#linkedinLink").href = profile.linkedin;
document.querySelector("#companyLink").href = profile.companyPage;

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setTilt(xRatio, yRatio, strength = 5) {
  if (!card || prefersReducedMotion) return;
  const rotateY = (xRatio - 0.5) * strength;
  const rotateX = (0.5 - yRatio) * strength;
  card.style.setProperty("--rx", `${rotateX.toFixed(2)}deg`);
  card.style.setProperty("--ry", `${rotateY.toFixed(2)}deg`);
  card.style.setProperty("--shine-x", `${Math.round(xRatio * 100)}%`);
  card.style.setProperty("--shine-y", `${Math.round(yRatio * 100)}%`);
}

function resetTilt() {
  if (!card || prefersReducedMotion) return;
  card.style.setProperty("--rx", "0deg");
  card.style.setProperty("--ry", "0deg");
  card.style.setProperty("--shine-x", "50%");
  card.style.setProperty("--shine-y", "18%");
}

if (card && !prefersReducedMotion) {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    setTilt((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height, 6);
  });

  card.addEventListener("pointerleave", resetTilt);

  card.addEventListener(
    "touchmove",
    (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      const rect = card.getBoundingClientRect();
      setTilt((touch.clientX - rect.left) / rect.width, (touch.clientY - rect.top) / rect.height, 3);
    },
    { passive: true },
  );

  window.addEventListener("deviceorientation", (event) => {
    if (event.gamma == null || event.beta == null) return;
    const xRatio = Math.min(Math.max((event.gamma + 18) / 36, 0), 1);
    const yRatio = Math.min(Math.max((event.beta - 20) / 50, 0), 1);
    setTilt(xRatio, yRatio, 3.4);
  });
}

if (saveContact) {
  saveContact.addEventListener("click", () => {
    window.setTimeout(() => saveContact.blur(), 160);
  });

  window.addEventListener("pageshow", () => {
    saveContact.blur();
  });
}

if (shareButton && navigator.share) {
  shareButton.hidden = false;
  shareButton.addEventListener("click", async () => {
    try {
      await navigator.share({
        title: `${profile.name} | ${profile.company}`,
        text: `${profile.role} at ${profile.company}`,
        url: window.location.href,
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        window.location.href = `mailto:?subject=${encodeURIComponent(profile.name)}&body=${encodeURIComponent(window.location.href)}`;
      }
    }
  });
} else if (shareButton) {
  shareButton.hidden = true;
}
