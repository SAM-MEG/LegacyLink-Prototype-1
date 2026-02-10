document.addEventListener("DOMContentLoaded", () => {
  // ===== Auth & user context =====
  const userRaw = sessionStorage.getItem("legacyLinkCurrentUser");

  if (!userRaw) {
    window.location.href = "auth.html";
    return;
  }

  const user = JSON.parse(userRaw || "{}");
  const fullName = user.name || "Legacy Member";
  const role = user.role || "individual";

  const roleMap = {
    individual: "Individual member",
    family: "Family organiser",
    advisor: "Advisor / Planner",
  };

  const parts = fullName.trim().split(/\s+/);
  const initials =
    parts
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join("") || "LL";

  const hour = new Date().getHours();
  let greeting = "Welcome back,";
  if (hour < 12) greeting = "Good morning,";
  else if (hour < 18) greeting = "Good afternoon,";
  else greeting = "Good evening,";

  const greetingLabelEl = document.querySelector(".ll-profile-label");
  const profileNameEl = document.querySelector(".ll-profile-name");
  const profileRoleEl = document.querySelector(".ll-profile-role");
  const avatarEl = document.querySelector(".ll-profile-avatar");

  if (greetingLabelEl) greetingLabelEl.textContent = greeting;
  if (profileNameEl) profileNameEl.textContent = fullName;
  if (profileRoleEl)
    profileRoleEl.textContent = roleMap[role] || "Legacy Member";
  if (avatarEl) avatarEl.textContent = initials;

  // ===== Profile dropdown menu =====
  const profileToggle = document.getElementById("llProfileToggle");
  const profileMenu = document.getElementById("llProfileMenu");

  if (profileToggle && profileMenu) {
    profileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = profileMenu.style.display === "block";
      profileMenu.style.display = isOpen ? "none" : "block";
    });

    document.addEventListener("click", () => {
      profileMenu.style.display = "none";
    });

    profileMenu.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const action = btn.dataset.action;

      if (action === "logout" || action === "switch-user") {
        sessionStorage.removeItem("legacyLinkCurrentUser");
        sessionStorage.removeItem("legacyLinkIsFresh");
        window.location.href = "auth.html";
      } else if (action === "view-profile") {
        alert(
          "In a full version, this would open profile settings for this account."
        );
      }
    });
  }

  // ===== Onboarding checklist =====
  const onboardingEl = document.getElementById("llOnboarding");
  const onboardingDismiss = document.getElementById("llOnboardingDismiss");
  const isFresh = sessionStorage.getItem("legacyLinkIsFresh") === "1";

  if (onboardingEl && isFresh) {
    onboardingEl.style.display = "flex";
  }

  if (onboardingDismiss && onboardingEl) {
    onboardingDismiss.addEventListener("click", () => {
      onboardingEl.style.display = "none";
      sessionStorage.removeItem("legacyLinkIsFresh");
    });
  }

  const stepCheckboxes = document.querySelectorAll(
    ".ll-onboarding-step input[type='checkbox']"
  );

  if (stepCheckboxes.length && onboardingEl) {
    stepCheckboxes.forEach((cb) => {
      cb.addEventListener("change", () => {
        const allDone = Array.from(stepCheckboxes).every((x) => x.checked);
        if (allDone) {
          onboardingEl.style.display = "none";
          sessionStorage.removeItem("legacyLinkIsFresh");
        }
      });
    });
  }

  // ===== Contribution slider + projection update =====
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

  // ===== Parent / Child view toggle =====
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

  // ===== contributor modal & demo add =====
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
        detailInput?.value.trim() ||
        "Contribution details to be confirmed";

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
      nameEl.textContent =
        name + (relationship ? ` (${relationship})` : "");

      const detailEl = document.createElement("p");
      detailEl.className = "contributor__detail";
      detailEl.textContent = detail;

      card.appendChild(avatar);
      card.appendChild(nameEl);
      card.appendChild(detailEl);

      const addButton = document.getElementById(
        "openContributorModalBtn"
      );
      if (addButton) {
        contributorsList.insertBefore(card, addButton);
      } else {
        contributorsList.appendChild(card);
      }

      closeModal();
    });
  }
});
