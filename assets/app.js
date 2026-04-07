const siteData = window.SITE_DATA || {};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createSlug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function renderLinkPill(link, options = {}) {
  const pillClass = options.compact ? " link-pill-compact" : "";
  const icon = options.compact ? '<span class="link-symbol" aria-hidden="true">&#8599;</span>' : "";

  return `
    <a class="link-pill${pillClass}" href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">
      ${icon}
      ${escapeHtml(link.label)}
    </a>
  `;
}

function renderLinkPills(links, options = {}) {
  if (!links || !links.length) {
    return "";
  }

  const compactClass = options.compact ? " link-row-compact" : "";

  return `
    <div class="link-row${compactClass}">
      ${links.map((link) => renderLinkPill(link, options)).join("")}
    </div>
  `;
}

function renderResearchActions(paper) {
  const abstractId = `paper-abstract-${createSlug(`${paper.title}-${paper.year}`)}`;
  const abstractToggle = paper.abstract
    ? `
      <button
        type="button"
        class="link-pill link-pill-compact abstract-toggle"
        data-abstract-target="${escapeHtml(abstractId)}"
        aria-expanded="false"
        aria-controls="${escapeHtml(abstractId)}"
      >
        <span class="link-symbol" aria-hidden="true">&#8595;</span>
        Abstract
      </button>
    `
    : "";
  const abstractPanel = paper.abstract
    ? `
      <div class="paper-abstract" id="${escapeHtml(abstractId)}" data-abstract-id="${escapeHtml(abstractId)}" hidden>
        ${escapeHtml(paper.abstract)}
      </div>
    `
    : "";

  return `
    <div class="link-row link-row-compact">
      ${(paper.links || []).map((link) => renderLinkPill(link, { compact: true })).join("")}
      ${abstractToggle}
    </div>
    ${abstractPanel}
  `;
}

function renderTags(tags, options = {}) {
  if (!tags || !tags.length) {
    return "";
  }

  const rowClass = options.rowClass ? ` ${options.rowClass}` : "";
  const tagClass = options.tagClass ? ` ${options.tagClass}` : "";

  return `
    <div class="badge-row${rowClass}">
      ${tags.map((tag) => `<span class="paper-tag${tagClass}">${escapeHtml(tag)}</span>`).join("")}
    </div>
  `;
}

function renderNotes(notes) {
  if (!notes || !notes.length) {
    return "";
  }

  return `
    <ul class="mini-list">
      ${notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
    </ul>
  `;
}

function renderPaperCard(paper) {
  const coauthors = (paper.coauthors || "").trim();
  const journalParts = [];

  if (paper.journal) {
    journalParts.push(paper.journal);
  }
  if (paper.journalDetail) {
    journalParts.push(paper.journalDetail);
  }

  return `
    <article class="paper-card">
      <div class="paper-card-header">
        <div>
          <p class="paper-title">${escapeHtml(paper.title)}</p>
          ${coauthors ? `<p class="paper-authors">${escapeHtml(coauthors)}</p>` : ""}
        </div>
        <span class="status-pill">${escapeHtml(paper.pubStatus)}</span>
      </div>
      <div class="badge-row">
        <span class="meta-pill">${escapeHtml(paper.year)}</span>
        ${journalParts.length ? `<span class="meta-pill">${escapeHtml(journalParts.join(", "))}</span>` : ""}
      </div>
      ${paper.note ? `<p class="paper-note-text">${escapeHtml(paper.note)}</p>` : ""}
      ${renderNotes(paper.notes)}
      ${renderTags(paper.topics)}
      ${renderTags(paper.methods)}
      ${renderLinkPills(paper.links)}
    </article>
  `;
}

function renderResearchPaperCard(paper) {
  const coauthors = (paper.coauthors || "").trim();
  const combinedTags = [...new Set([...(paper.topics || []), ...(paper.methods || [])])];
  const journalDetail = (paper.journalDetail || "").trim();
  const year = (paper.year || "").trim();
  const metaLine = `${paper.journal ? `<span class="paper-journal">${escapeHtml(paper.journal)}</span>` : ""}${journalDetail ? `<span class="paper-journal-detail">${paper.journal ? ", " : ""}${escapeHtml(journalDetail)}</span>` : ""}${year ? `<span class="paper-journal-detail">${paper.journal || journalDetail ? ", " : ""}${escapeHtml(year)}</span>` : ""}`;

  return `
    <article class="paper-card paper-card-compact">
      <div class="paper-card-header paper-card-header-compact">
        <p class="paper-citation">
          <span class="paper-title">${escapeHtml(paper.title)}</span>${coauthors ? `<span class="paper-inline-authors"> (${escapeHtml(coauthors)})</span>` : ""}
        </p>
        <span class="status-pill">${escapeHtml(paper.statusLabel || paper.pubStatus)}</span>
      </div>
      ${metaLine ? `<p class="paper-meta-line">${metaLine}</p>` : ""}
      ${renderTags(combinedTags, { rowClass: "badge-row-compact", tagClass: "paper-tag-compact" })}
      ${renderResearchActions(paper)}
    </article>
  `;
}

function renderPolicyCard(item) {
  return `
    <article class="policy-card">
      <div class="paper-card-header">
        <div>
          <p class="paper-title">${escapeHtml(item.title)}</p>
          <p class="paper-authors">${escapeHtml(item.context)}</p>
        </div>
        <span class="meta-pill">${escapeHtml(item.year)}</span>
      </div>
      <p>${escapeHtml(item.summary)}</p>
      ${item.summaryExtra ? `<p>${escapeHtml(item.summaryExtra)}</p>` : ""}
      ${renderLinkPills(item.links, { compact: true })}
    </article>
  `;
}

function renderMediaGroup(group, index) {
  return `
    <details class="media-group" ${index < 2 ? "open" : ""}>
      <summary>
        <div class="media-summary">
          <div>
            <h2>${escapeHtml(group.title)}</h2>
            <p class="media-meta">${escapeHtml(group.items.length)} coverage items</p>
          </div>
          <a class="text-link" href="${escapeHtml(group.paperUrl)}" target="_blank" rel="noreferrer">Paper link</a>
        </div>
      </summary>
      <div class="media-link-list">
        ${group.items.map((item) => `
          <a class="media-link-item" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">
            <span>${escapeHtml(item.outlet)}</span>
            <span>Open source</span>
          </a>
        `).join("")}
      </div>
    </details>
  `;
}

function setCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
}

function renderHome() {
  const statsContainer = document.querySelector("#home-stats");
  if (!statsContainer) {
    return;
  }

  const publicationCount = (siteData.selectedPublications?.length || 0) + (siteData.additionalPublications?.length || 0);
  const stats = [
    { value: publicationCount, label: "Publications", href: "research.html?status=published" },
    { value: siteData.workingPapers.length, label: "Working papers", href: "research.html?status=working" },
    { value: siteData.policyItems.length, label: "Policy contributions", href: "policy.html" },
  ];

  statsContainer.innerHTML = stats.map((stat) => `
    <a class="stat-card stat-card-link" href="${escapeHtml(stat.href)}">
      <strong>${escapeHtml(stat.value)}</strong>
      <span>${escapeHtml(stat.label)}</span>
    </a>
  `).join("");
}

function renderResearch() {
  const researchShell = document.querySelector(".research-shell");
  const resultsContainer = document.querySelector("#research-results");
  const resultCount = document.querySelector("#research-result-count");
  const topicFilters = document.querySelector("#topic-filters");
  const methodFilters = document.querySelector("#method-filters");
  const statusFilters = document.querySelector("#status-filters");
  const clearButton = document.querySelector("#clear-research-filters");

  if (!researchShell || !resultsContainer || !resultCount || !topicFilters || !methodFilters || !statusFilters || !clearButton) {
    return;
  }

  const selectedPublications = (siteData.selectedPublications || []).map((paper) => ({
    ...paper,
    statuses: ["selected", "published"],
  }));
  const additionalPublications = (siteData.additionalPublications || []).map((paper) => ({
    ...paper,
    statuses: ["published"],
    statusLabel: paper.pubStatus || "Published",
  }));
  const workingPapers = (siteData.workingPapers || []).map((paper) => ({
    ...paper,
    statuses: ["working"],
  }));
  const papers = [...selectedPublications, ...additionalPublications, ...workingPapers];
  const state = {
    statuses: new Set(["selected", "working"]),
    topics: new Set(),
    methods: new Set(),
  };

  const topicOptions = [...new Set(papers.flatMap((paper) => paper.topics))].sort();
  const methodOptions = [...new Set(papers.flatMap((paper) => paper.methods))].sort();
  const statusOptions = [
    { value: "selected", label: "Selected publications" },
    { value: "published", label: "All publications" },
    { value: "working", label: "Working papers" },
  ];
  const allStatusValues = statusOptions.map((option) => option.value);
  const statusParams = new URLSearchParams(window.location.search).get("status");

  if (statusParams) {
    const requestedStatuses = statusParams
      .split(",")
      .map((value) => value.trim())
      .filter((value) => allStatusValues.includes(value));

    if (requestedStatuses.length) {
      state.statuses = new Set(requestedStatuses);
    }
  }

  function getYearSortValue(paper) {
    const year = String(paper.year || "").trim().toLowerCase();
    if (year === "forthcoming") {
      return 9999;
    }

    const match = year.match(/\d{4}/);
    return match ? Number(match[0]) : 0;
  }

  function sortPapersByYear(a, b) {
    const yearDifference = getYearSortValue(b) - getYearSortValue(a);
    if (yearDifference !== 0) {
      return yearDifference;
    }

    return String(a.title || "").localeCompare(String(b.title || ""));
  }

  function renderChips(container, options, group) {
    container.innerHTML = options.map((option) => {
      const value = typeof option === "string" ? option : option.value;
      const label = typeof option === "string" ? option : option.label;
      const isActive = group === "status"
        ? state.statuses.has(value)
        : group === "topics"
          ? state.topics.has(value)
          : state.methods.has(value);

      return `
        <button
          type="button"
          class="filter-chip filter-list-item ${isActive ? "is-active" : ""}"
          data-filter-group="${group}"
          data-filter-value="${escapeHtml(value)}"
          aria-pressed="${isActive ? "true" : "false"}"
        >
          ${escapeHtml(label)}
        </button>
      `;
    }).join("");
  }

  function updateResults() {
    renderChips(statusFilters, statusOptions, "status");
    renderChips(topicFilters, topicOptions, "topics");
    renderChips(methodFilters, methodOptions, "methods");

    const visible = papers.filter((paper) => {
      const matchesStatus = state.statuses.size === 0 || (paper.statuses || []).some((status) => state.statuses.has(status));
      const matchesTopics = state.topics.size === 0 || paper.topics.some((topic) => state.topics.has(topic));
      const matchesMethods = state.methods.size === 0 || paper.methods.some((method) => state.methods.has(method));
      return matchesStatus && matchesTopics && matchesMethods;
    });
    const orderedVisible = [
      ...visible.filter((paper) => (paper.statuses || []).includes("published")).sort(sortPapersByYear),
      ...visible.filter((paper) => (paper.statuses || []).includes("working")).sort(sortPapersByYear),
    ];

    let statusScope = "all publications";
    const activeStatuses = allStatusValues.filter((value) => state.statuses.has(value));

    if (activeStatuses.length === 1) {
      statusScope = activeStatuses[0] === "selected"
        ? "selected publications"
        : activeStatuses[0] === "published"
          ? "publications only"
          : "working papers only";
    } else if (activeStatuses.length === 2) {
      if (state.statuses.has("selected") && state.statuses.has("working")) {
        statusScope = "selected publications + working papers";
      } else if (state.statuses.has("selected") && state.statuses.has("published")) {
        statusScope = "publications";
      } else if (state.statuses.has("published") && state.statuses.has("working")) {
        statusScope = "publications + working papers";
      }
    } else if (activeStatuses.length === 3) {
      statusScope = "publications + working papers";
    } else if (activeStatuses.length === 0) {
      statusScope = "all publications";
    }

    resultCount.textContent = `${orderedVisible.length} article${orderedVisible.length === 1 ? "" : "s"} shown (${statusScope})`;
    resultsContainer.innerHTML = orderedVisible.length
      ? orderedVisible.map(renderResearchPaperCard).join("")
      : `<div class="no-results">No articles match the current filter combination.</div>`;
  }

  function toggleValue(group, value) {
    if (group === "status") {
      if (state.statuses.has(value)) {
        state.statuses.delete(value);
      } else {
        state.statuses.add(value);
      }
      return;
    }

    const targetSet = group === "topics" ? state.topics : state.methods;
    if (targetSet.has(value)) {
      targetSet.delete(value);
    } else {
      targetSet.add(value);
    }
  }

  function setAbstractExpanded(targetId, expanded) {
    const toggle = researchShell.querySelector(`[data-abstract-target="${targetId}"]`);
    const panel = researchShell.querySelector(`[data-abstract-id="${targetId}"]`);
    if (!toggle || !panel) {
      return;
    }

    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    panel.hidden = !expanded;
    panel.classList.toggle("is-open", expanded);
  }

  researchShell.addEventListener("click", (event) => {
    const abstractToggle = event.target.closest("[data-abstract-target]");
    if (abstractToggle) {
      const targetId = abstractToggle.dataset.abstractTarget;
      const isExpanded = abstractToggle.getAttribute("aria-expanded") === "true";
      setAbstractExpanded(targetId, !isExpanded);
      return;
    }

    const abstractPanel = event.target.closest(".paper-abstract");
    if (abstractPanel) {
      setAbstractExpanded(abstractPanel.dataset.abstractId, false);
      return;
    }

    const button = event.target.closest("[data-filter-group]");
    if (!button) {
      return;
    }

    toggleValue(button.dataset.filterGroup, button.dataset.filterValue);
    updateResults();
  });

  clearButton.addEventListener("click", () => {
    state.statuses.clear();
    state.topics.clear();
    state.methods.clear();
    updateResults();
  });

  updateResults();
}

function renderPolicy() {
  const container = document.querySelector("#policy-list");
  if (!container) {
    return;
  }

  const sortedPolicyItems = [...siteData.policyItems].sort((a, b) => Number(b.year) - Number(a.year));
  container.innerHTML = sortedPolicyItems.map(renderPolicyCard).join("");
}

function renderMedia() {
  const container = document.querySelector("#media-groups");
  const searchInput = document.querySelector("#media-search");
  const resultCount = document.querySelector("#media-result-count");
  if (!container || !searchInput || !resultCount) {
    return;
  }

  function updateMedia() {
    const query = searchInput.value.trim().toLowerCase();
    const visible = siteData.mediaGroups.filter((group) => {
      if (!query) {
        return true;
      }

      const haystack = [group.title, ...group.items.map((item) => item.outlet)].join(" ").toLowerCase();
      return haystack.includes(query);
    });

    resultCount.textContent = `${visible.length} paper group${visible.length === 1 ? "" : "s"}`;
    container.innerHTML = visible.length
      ? visible.map(renderMediaGroup).join("")
      : `<div class="no-results">No media entries match the current search.</div>`;
  }

  searchInput.addEventListener("input", updateMedia);
  updateMedia();
}

function renderTeaching() {
  const modulesContainer = document.querySelector("#teaching-modules");
  const guideCard = document.querySelector("#teaching-guide-card");
  if (!modulesContainer || !guideCard) {
    return;
  }

  guideCard.innerHTML = `
    <article class="guide-card">
      <p class="eyebrow">Student guidance</p>
      <h2>Writing guidelines</h2>
      <p>${escapeHtml(siteData.teaching.guideNote)}</p>
      <a class="button button-primary" href="${escapeHtml(siteData.teaching.guideUrl)}" target="_blank" rel="noreferrer">Open guidelines</a>
    </article>
  `;

  modulesContainer.innerHTML = siteData.teaching.modules.map((module) => `
    <article class="module-card">
      <p class="eyebrow">${escapeHtml(module.level)}</p>
      <h2>${escapeHtml(module.code)}</h2>
      <p>${escapeHtml(module.title)}</p>
      <p>${escapeHtml(module.institution)}</p>
    </article>
  `).join("");
}

function init() {
  setCurrentYear();
  renderHome();
  renderResearch();
  renderPolicy();
  renderMedia();
  renderTeaching();
}

document.addEventListener("DOMContentLoaded", init);
