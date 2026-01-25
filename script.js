document.addEventListener("DOMContentLoaded", () => {
  // ----- Contribution slider + projection update -----
  const slider = document.getElementById("contributionSlider");
  const monthlyDisplay = document.getElementById("currentMonthlyDisplay");
  const projectedSpan = document.getElementById("projectedAmount");

  const formatRand = (amount) => {
    
    const rounded = Math.round(amount);
    return (
      "R" +
      rounded
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
  };

  if (slider && monthlyDisplay && projectedSpan) {
    const baseProjection = Number(
      projectedSpan.dataset.baseProjection || "0"
    );
    const baseMonthly = Number(projectedSpan.dataset.baseMonthly || "1");

    const updateProjection = () => {
      const newMonthly = Number(slider.value);
      const factor = newMonthly / baseMonthly;
      const newProjection = baseProjection * factor;

      monthlyDisplay.textContent = formatRand(newMonthly);
      projectedSpan.textContent = formatRand(newProjection);
    };

    slider.addEventListener("input", updateProjection);
    // Initialise
    updateProjection();
  }

  // ----- Parent / Child view toggle -----
  const toggleViewBtn = document.getElementById("toggleViewBtn");
  const parentViewBtn = document.getElementById("parentViewBtn");

  let isChildView = false;

  const setChildView = (value) => {
    isChildView = value;
    document.body.classList.toggle("child-view", isChildView);

    if (toggleViewBtn) {
      toggleViewBtn.textContent = isChildView
        ? "Child View (active)"
        : "Child View (18+)";
    }
  };

  if (toggleViewBtn) {
    toggleViewBtn.addEventListener("click", () => {
      setChildView(!isChildView);
    });
  }

  if (parentViewBtn) {
    parentViewBtn.addEventListener("click", () => {
      setChildView(false);
    });
  }

  // ----- Add contributor modal & demo add -----
  const openModalBtn = document.getElementById("openContributorModalBtn");
  const modal = document.getElementById("contributorModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const closeModalBtn = document.getElementById("closeContributorModalBtn");
  const cancelBtn = document.getElementById("cancelContributorBtn");
  const form = document.getElementById("contributorForm");
  const contributorsList = document.getElementById("contributorsList");

  const openModal = () => {
    if (!modal) return;
    modal.classList.add("modal--open");
    modal.setAttribute("aria-hidden", "false");
    const firstInput = document.getElementById("contribName");
    if (firstInput) firstInput.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("modal--open");
    modal.setAttribute("aria-hidden", "true");
    if (form) form.reset();
  };

  if (openModalBtn && modal) {
    openModalBtn.addEventListener("click", openModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", closeModal);
  }
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }
  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeModal);
  }

  if (form && contributorsList) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameInput = document.getElementById("contribName");
      const relationshipInput = document.getElementById(
        "contribRelationship"
      );
      const detailInput = document.getElementById("contribDetail");

      const name = nameInput?.value.trim() || "New contributor";
      const relationship = relationshipInput?.value.trim();
      const detail =
        detailInput?.value.trim() || "Contribution details to be confirmed";

      // Create new contributor card
      const card = document.createElement("div");
      card.className = "contributor";

      const initials =
        name
          .split(" ")
          .map((part) => part.charAt(0).toUpperCase())
          .slice(0, 2)
          .join("") || "NC";

      const avatar = document.createElement("div");
      avatar.className = "avatar";
      avatar.textContent = initials;

      const nameEl = document.createElement("p");
      nameEl.className = "contributor__name";
      nameEl.textContent = name + (relationship ? ` (${relationship})` : "");

      const detailEl = document.createElement("p");
      detailEl.className = "contributor__detail";
      detailEl.textContent = detail;

      card.appendChild(avatar);
      card.appendChild(nameEl);
      card.appendChild(detailEl);

      const addButton = document.getElementById("openContributorModalBtn");
      if (addButton) {
        contributorsList.insertBefore(card, addButton);
      } else {
        contributorsList.appendChild(card);
      }

      closeModal();
    });
  }
});
