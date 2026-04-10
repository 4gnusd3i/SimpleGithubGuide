const FALLBACK_SITE_DATA = {
  branch: "main",
  commits: [
    { sha: "7443395", author: "4gnusd3i", time: "2025-02-06T09:43:11+01:00", message: "Initial commit", labels: [] },
    { sha: "1e6764e", author: "4gnusd3i", time: "2025-02-06T10:03:07+01:00", message: "Added files for webpage and readme", labels: [] },
    { sha: "61997e7", author: "4gnusd3i", time: "2025-02-06T10:16:53+01:00", message: "Updated ReadMe", labels: [] },
    { sha: "a526fbe", author: "4gnusd3i", time: "2025-02-06T10:30:04+01:00", message: "Readme guide finished", labels: [] },
    { sha: "879da65", author: "4gnusd3i", time: "2025-02-06T11:00:04+01:00", message: "Updated Readme", labels: [] },
    { sha: "09eb4b0", author: "4gnusd3i", time: "2025-02-06T11:00:46+01:00", message: "Update readme formatting", labels: [] },
    { sha: "37d2ff2", author: "4gnusd3i", time: "2025-02-06T11:02:20+01:00", message: "small changes to readme", labels: [] },
    { sha: "23bfbcb", author: "4gnusd3i", time: "2025-02-06T11:04:01+01:00", message: "formatting", labels: [] },
    { sha: "5499e23", author: "4gnusd3i", time: "2025-02-06T11:11:17+01:00", message: "hopefully final version of guide", labels: [] },
    { sha: "d50e26d", author: "4gnusd3i", time: "2025-02-06T11:13:09+01:00", message: "Reeee", labels: [] },
    { sha: "2f1fcf4", author: "4gnusd3i", time: "2025-02-06T11:19:41+01:00", message: "Update README.md", labels: [] },
    { sha: "f7800e2", author: "4gnusd3i", time: "2026-04-09T14:24:01+02:00", message: "changed content of readme", labels: [] },
    { sha: "a285001", author: "4gnusd3i", time: "2026-04-09T14:27:10+02:00", message: "Enhance README with GitHub actions information", labels: [] },
    { sha: "53f232d", author: "Excellence308", time: "2026-04-10T00:16:49+02:00", message: "Changed README.md to explicitly mention the fork", labels: [] },
    { sha: "78054a8", author: "Excellence308", time: "2026-04-10T09:16:11+02:00", message: "Cleaned up comments for clarity", labels: [] },
    { sha: "70d66ac", author: "Excellence308", time: "2026-04-10T09:35:00+02:00", message: "Cleaned up the graphic. Added personalized title.", labels: [] },
    { sha: "fb1f35a", author: "Excellence308", time: "2026-04-10T09:40:14+02:00", message: "Simplified title", labels: [] },
    { sha: "9ca9d38", author: "4gnusd3i", time: "2026-04-10T09:49:00+02:00", message: "added visitor folder", labels: [] },
    { sha: "139179d", author: "Excellence308", time: "2026-04-10T10:09:29+02:00", message: "Add Feature: Interactive commit history", labels: ["Interactive-Viewer"] },
    { sha: "4af2e5e", author: "Excellence308", time: "2026-04-10T10:13:31+02:00", message: "Fix Bug: Added a script.js for the interactive commit viewer", labels: [] },
    { sha: "4d2f1d2", author: "RefridgeRaider", time: "2026-04-10T10:34:00+02:00", message: "added RefridgeRaider.bmp to 'Visitors' folder", labels: [] },
    { sha: "98b5e5b", author: "Excellence308", time: "2026-04-10T10:34:56+02:00", message: "Fix: Commit Viewer is now fully dynamic and supports tags", labels: [] },
    { sha: "7f17670", author: "Excellence308", time: "2026-04-10T10:40:30+02:00", message: "Merge remote-tracking branch 'upstream/main'", labels: [] },
    { sha: "8079032", author: "Excellence308", time: "2026-04-10T10:44:22+02:00", message: "Fix: Tags are now vertically stacked and fully dynamic", labels: [] },
    { sha: "cdbc81d", author: "4gnusd3i", time: "2026-04-10T10:54:53+02:00", message: "added file with my username", labels: [] },
    { sha: "51de936", author: "oksnoopy", time: "2026-04-10T10:55:03+02:00", message: "added username file", labels: [] },
    { sha: "c9f9c18", author: "Puze87", time: "2026-04-10T10:55:10+02:00", message: "Ny file", labels: [] },
    { sha: "ef1340e", author: "Excellence308", time: "2026-04-10T10:55:11+02:00", message: "Add File: Visitor Excellence308", labels: [] },
    { sha: "840d909", author: "4gnusd3i", time: "2026-04-10T11:04:43+02:00", message: "Merge pull request #4 from RefridgeRaider/dev", labels: [] },
    { sha: "df7bf6f", author: "4gnusd3i", time: "2026-04-10T11:05:14+02:00", message: "Merge pull request #7 from Puze87/main", labels: [] },
    { sha: "3e7b1a9", author: "4gnusd3i", time: "2026-04-10T11:05:37+02:00", message: "Merge pull request #6 from oksnoopy/main", labels: [] },
    { sha: "85bc6cc", author: "4gnusd3i", time: "2026-04-10T11:07:07+02:00", message: "Merge branch 'main' of https://github.com/4gnusd3i/SimpleGithubGuide", labels: [] },
    { sha: "7330fd4", author: "Excellence308", time: "2026-04-10T11:11:50+02:00", message: "Add Feature: Starchart visualizer for students", labels: ["Visitors-Starchart"] },
    { sha: "2eeaf04", author: "Hisham611", time: "2026-04-10T11:13:31+02:00", message: "i did file with my name  (#8)", labels: [] },
    { sha: "c9325cf", author: "Excellence308", time: "2026-04-10T11:18:05+02:00", message: "Add File: Visitor Excellence308", labels: [] },
    { sha: "28af704", author: "AOR90", time: "2026-04-10T11:23:30+02:00", message: "Txt added. (#9)", labels: [] },
    { sha: "6efd364", author: "4gnusd3i", time: "2026-04-10T11:24:03+02:00", message: "Merge pull request #10 from Excellence308/visitors", labels: [] },
    { sha: "9900170", author: "Excellence308", time: "2026-04-10T11:25:44+02:00", message: "Merge remote-tracking branch 'origin/visitors'", labels: [] },
    { sha: "125e384", author: "Excellence308", time: "2026-04-10T11:41:53+02:00", message: "Make visualizers work without GitHub API", labels: ["HEAD", "main"] }
  ],
  visitors: [
    { file: "4gnusd3i", name: "4gnusd3i", verified: true },
    { file: "AOR90.txt", name: "AOR90.txt", verified: false },
    { file: "Excellence308", name: "Excellence308", verified: true },
    { file: "Puze87", name: "Puze87", verified: true },
    { file: "RefridgeRaider.bmp", name: "RefridgeRaider.bmp", verified: false },
    { file: "hisham611.txt", name: "hisham611.txt", verified: false },
    { file: "oksnoopy", name: "oksnoopy", verified: true }
  ]
};

const graph = document.getElementById("commit-graph");
const visitorMap = document.getElementById("visitor-map");
const siteDataPromise = loadSiteData();

async function loadSiteData() {
  try {
    const response = await fetch("data/site-data.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      return FALLBACK_SITE_DATA;
    }

    return response.json();
  } catch {
    return FALLBACK_SITE_DATA;
  }
}

if (graph) {
  initCommitGraph(graph);
}

if (visitorMap) {
  initVisitorMap(visitorMap);
}

async function initCommitGraph(graphElement) {
  const nodeLayer = document.getElementById("commit-nodes");
  const tooltip = document.getElementById("commit-tooltip");
  const tooltipAuthor = document.getElementById("tooltip-author");
  const tooltipTime = document.getElementById("tooltip-time");
  const path = document.getElementById("commit-path");

  const inspectorMessage = document.getElementById("inspector-message");
  const inspectorAuthor = document.getElementById("inspector-author");
  const inspectorTime = document.getElementById("inspector-time");
  const inspectorSha = document.getElementById("inspector-sha");

  try {
    const siteData = await siteDataPromise;
    const limit = Number.parseInt(graphElement.dataset.commitLimit || String(siteData.commits.length), 10);
    const commits = siteData.commits.slice(-limit);

    renderCommitGraph(
      commits,
      graphElement,
      nodeLayer,
      tooltip,
      tooltipAuthor,
      tooltipTime,
      path,
      inspectorMessage,
      inspectorAuthor,
      inspectorTime,
      inspectorSha
    );
  } catch (error) {
    showGraphError(
      "Commit history could not be loaded.",
      error instanceof Error ? error.message : "The local site data is unavailable.",
      inspectorMessage,
      inspectorAuthor,
      inspectorTime,
      inspectorSha
    );
  }
}

async function initVisitorMap(visitorElement) {
  const nodeLayer = document.getElementById("visitor-nodes");
  const tooltip = document.getElementById("visitor-tooltip");
  const tooltipName = document.getElementById("visitor-tooltip-name");

  try {
    const siteData = await siteDataPromise;
    renderVisitorMap(
      siteData.visitors,
      visitorElement,
      nodeLayer,
      tooltip,
      tooltipName
    );
  } catch (error) {
    tooltipName.textContent = error instanceof Error ? error.message : "Visitors could not be loaded.";
    tooltip.classList.add("is-visible");
  }
}

function renderCommitGraph(
  commits,
  graphElement,
  nodeLayer,
  tooltip,
  tooltipAuthor,
  tooltipTime,
  path,
  inspectorMessage,
  inspectorAuthor,
  inspectorTime,
  inspectorSha
) {
  nodeLayer.replaceChildren();

  const viewport = { width: 1000, height: 420, padding: 72 };
  const canvasWidth = Math.max(graphElement.clientWidth, commits.length * 120 + viewport.padding * 2);
  const span = canvasWidth - viewport.padding * 2;

  const points = commits.map((commit, index) => {
    const progress = commits.length === 1 ? 0.5 : index / (commits.length - 1);
    const x = viewport.padding + span * progress;
    const y =
      210 +
      Math.sin(index * 0.85) * 76 +
      Math.cos(index * 0.46) * 28;

    return {
      ...commit,
      x,
      y
    };
  });

  path.parentElement.setAttribute("viewBox", `0 0 ${canvasWidth} ${viewport.height}`);
  path.parentElement.style.width = `${canvasWidth}px`;
  path.parentElement.style.height = `${viewport.height}px`;
  nodeLayer.style.width = `${canvasWidth}px`;
  nodeLayer.style.height = `${viewport.height}px`;
  path.setAttribute("d", buildPath(points));

  let activeNode = null;
  let activeCommit = null;

  points.forEach((commit, index) => {
    const node = document.createElement("button");
    node.type = "button";
    node.className = "commit-node";
    node.style.left = `${commit.x}px`;
    node.style.top = `${commit.y}px`;
    node.dataset.author = commit.author;
    node.setAttribute(
      "aria-label",
      `${commit.message} by ${commit.author} on ${formatLongDate(commit.time)}`
    );

    if (Array.isArray(commit.labels) && commit.labels.length > 0) {
      const badges = document.createElement("span");
      badges.className = "commit-node-badges";

      commit.labels.forEach((label) => {
        const pill = document.createElement("span");
        pill.className = "commit-node-label";
        pill.textContent = label;
        badges.appendChild(pill);
      });

      node.appendChild(badges);
    }

    node.addEventListener("mouseenter", () => activateCommit(node, commit));
    node.addEventListener("focus", () => activateCommit(node, commit));
    node.addEventListener("click", () => activateCommit(node, commit));

    nodeLayer.appendChild(node);

    if (index === points.length - 1) {
      activateCommit(node, commit, false);
    }
  });

  graphElement.addEventListener("pointermove", (event) => {
    const bounds = graphElement.getBoundingClientRect();
    graphElement.style.setProperty("--glow-x", `${event.clientX - bounds.left}px`);
    graphElement.style.setProperty("--glow-y", `${event.clientY - bounds.top}px`);
  });

  graphElement.addEventListener("pointerleave", () => {
    tooltip.classList.remove("is-visible");
    graphElement.style.setProperty("--glow-x", "50%");
    graphElement.style.setProperty("--glow-y", "50%");
  });

  graphElement.addEventListener("scroll", () => {
    if (activeCommit) {
      positionCommitTooltip(activeCommit);
    }
  });

  graphElement.scrollLeft = Math.max(graphElement.scrollWidth - graphElement.clientWidth, 0);

  function activateCommit(node, commit, showTooltip = true) {
    if (activeNode) {
      activeNode.classList.remove("is-active");
    }

    activeNode = node;
    activeCommit = commit;
    activeNode.classList.add("is-active");

    inspectorMessage.textContent = commit.message;
    inspectorAuthor.textContent = commit.author;
    inspectorTime.textContent = formatLongDate(commit.time);
    inspectorSha.textContent = commit.sha;

    tooltipAuthor.textContent = commit.author;
    tooltipTime.textContent = formatShortDate(commit.time);

    positionCommitTooltip(commit);

    if (showTooltip) {
      tooltip.classList.add("is-visible");
    }
  }

  function positionCommitTooltip(commit) {
    const visibleX = commit.x - graphElement.scrollLeft;
    tooltip.style.left = `${clamp(visibleX, 110, graphElement.clientWidth - 110)}px`;
    tooltip.style.top = `${clamp(commit.y - 18, 86, viewport.height - 30)}px`;
  }
}

function renderVisitorMap(
  visitors,
  visitorElement,
  nodeLayer,
  tooltip,
  tooltipName
) {
  nodeLayer.replaceChildren();

  if (visitors.length === 0) {
    tooltipName.textContent = "No visitors yet.";
    tooltip.style.left = "50%";
    tooltip.style.top = "50%";
    tooltip.classList.add("is-visible");
    return;
  }

  const points = createVisitorLayout(visitors.length);
  let activeNode = null;
  let activeMode = "";
  const starNodes = [];

  visitors.forEach((visitor, index) => {
    const point = points[index];
    const node = document.createElement("button");
    node.type = "button";
    node.className = `visitor-node${visitor.verified ? " is-verified" : ""}`;
    node.style.left = `${point.x}%`;
    node.style.top = `${point.y}%`;
    node.setAttribute("aria-label", `${visitor.name}. Visitor star.`);
    applyVisitorStarStyle(node, index, visitor.verified);

    const label = document.createElement("span");
    label.className = "visitor-node-label";
    label.textContent = visitor.name;
    node.appendChild(label);

    node.addEventListener("mouseenter", () => activateVisitor(node, visitor, point, false, "hover"));
    node.addEventListener("mouseleave", () => {
      if (activeNode === node && activeMode === "hover") {
        clearActiveVisitor();
      }
    });
    node.addEventListener("focus", () => activateVisitor(node, visitor, point, true, "focus"));
    node.addEventListener("blur", () => {
      if (activeNode === node && activeMode === "focus") {
        clearActiveVisitor();
      }
    });
    node.addEventListener("click", () => activateVisitor(node, visitor, point, true, "click"));

    nodeLayer.appendChild(node);
    starNodes.push({ node, point });
  });

  visitorElement.addEventListener("pointermove", (event) => {
    const bounds = visitorElement.getBoundingClientRect();
    const mouseX = event.clientX - bounds.left;
    const mouseY = event.clientY - bounds.top;
    visitorElement.style.setProperty("--visitor-glow-x", `${mouseX}px`);
    visitorElement.style.setProperty("--visitor-glow-y", `${mouseY}px`);
    visitorElement.style.setProperty("--visitor-glow-opacity", "1");
    displaceVisitorStars(starNodes, mouseX, mouseY, bounds.width, bounds.height);
  });

  visitorElement.addEventListener("pointerleave", () => {
    tooltip.classList.remove("is-visible");
    visitorElement.style.setProperty("--visitor-glow-opacity", "0");
    displaceVisitorStars(starNodes, null, null, 1, 1);

    if (activeMode === "hover") {
      clearActiveVisitor();
    }
  });

  function clearActiveVisitor() {
    if (activeNode) {
      activeNode.classList.remove("is-active");
    }

    activeNode = null;
    activeMode = "";
    tooltip.classList.remove("is-visible");
  }

  function activateVisitor(node, visitor, point, showTooltip = true, mode = "click") {
    if (activeNode && activeNode !== node) {
      activeNode.classList.remove("is-active");
    }

    activeNode = node;
    activeMode = mode;
    activeNode.classList.add("is-active");

    tooltipName.textContent = visitor.name;
    tooltip.style.left = `${clamp(point.x, 14, 86)}%`;
    tooltip.style.top = `${clamp(point.y - 4, 18, 84)}%`;

    if (showTooltip) {
      tooltip.classList.add("is-visible");
    } else {
      tooltip.classList.remove("is-visible");
    }
  }
}

function showGraphError(message, detail, inspectorMessage, inspectorAuthor, inspectorTime, inspectorSha) {
  inspectorMessage.textContent = message;
  inspectorAuthor.textContent = "Unavailable";
  inspectorTime.textContent = detail;
  inspectorSha.textContent = "-";
}

function buildPath(points) {
  if (points.length === 0) {
    return "";
  }

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const delta = current.x - previous.x;
    const controlOneX = previous.x + delta * 0.42;
    const controlTwoX = previous.x + delta * 0.58;

    d += ` C ${controlOneX} ${previous.y}, ${controlTwoX} ${current.y}, ${current.x} ${current.y}`;
  }

  return d;
}

function formatLongDate(value) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createVisitorLayout(count) {
  const points = [];
  const centerX = 50;
  const centerY = 58;
  const maxRadius = 33;
  const goldenAngle = 2.399963229728653;

  for (let index = 0; index < count; index += 1) {
    const ratio = count === 1 ? 0.25 : (index + 1) / (count + 1);
    const radius = 8 + maxRadius * Math.sqrt(ratio);
    const angle = index * goldenAngle - Math.PI / 2;

    points.push({
      x: clamp(centerX + Math.cos(angle) * radius, 10, 90),
      y: clamp(centerY + Math.sin(angle) * radius * 0.88, 18, 88)
    });
  }

  return points;
}

function applyVisitorStarStyle(node, index, verified) {
  const brightPalette = [
    { core: "#ffffff", edge: "#fdf9ef", glow: "rgba(255, 250, 234, 0.96)" },
    { core: "#ffffff", edge: "#f4f9ff", glow: "rgba(235, 246, 255, 0.9)" },
    { core: "#ffffff", edge: "#fff7f1", glow: "rgba(255, 244, 233, 0.92)" }
  ];
  const quietPalette = [
    { core: "#edf2fb", edge: "#bbc7d8", glow: "rgba(187, 199, 216, 0.13)" },
    { core: "#eef4ff", edge: "#b8c4d8", glow: "rgba(184, 196, 216, 0.12)" },
    { core: "#f1eef4", edge: "#c8c0cc", glow: "rgba(200, 192, 204, 0.11)" }
  ];

  const palette = (verified ? brightPalette : quietPalette)[index % 3];
  const size = verified ? 0.98 + (index % 3) * 0.12 : 0.34 + (index % 3) * 0.06;
  const duration = verified ? 4.6 + (index % 4) * 0.9 : 6.8 + (index % 4) * 1.05;
  const haloDuration = duration * (verified ? 1.18 : 1.32);
  const flickerDuration = duration * (verified ? 0.76 : 0.92);
  const delay = (index % 5) * -0.83;
  const opacityLow = verified ? 0.84 : 0.44;
  const opacityMid = verified ? 0.93 : 0.58;
  const opacityHigh = verified ? 1 : 0.72;
  const haloMin = verified ? 0.28 : 0.08;
  const haloMax = verified ? 0.92 : 0.22;
  const pushMax = verified ? 7.5 : 4.5;
  const hoverScale = verified ? 1.18 : 1.12;

  node.style.setProperty("--star-size", `${size}rem`);
  node.style.setProperty("--star-core", palette.core);
  node.style.setProperty("--star-edge", palette.edge);
  node.style.setProperty("--star-glow", palette.glow);
  node.style.setProperty("--star-duration", `${duration}s`);
  node.style.setProperty("--star-halo-duration", `${haloDuration}s`);
  node.style.setProperty("--star-flicker-duration", `${flickerDuration}s`);
  node.style.setProperty("--star-delay", `${delay}s`);
  node.style.setProperty("--star-opacity-low", String(opacityLow));
  node.style.setProperty("--star-opacity-mid", String(opacityMid));
  node.style.setProperty("--star-opacity-high", String(opacityHigh));
  node.style.setProperty("--star-halo-min", String(haloMin));
  node.style.setProperty("--star-halo-max", String(haloMax));
  node.style.setProperty("--star-hover-scale", String(hoverScale));
  node.dataset.pushMax = String(pushMax);
}

function displaceVisitorStars(stars, mouseX, mouseY, width, height) {
  if (mouseX === null || mouseY === null) {
    stars.forEach(({ node }) => {
      node.style.setProperty("--star-offset-x", "0px");
      node.style.setProperty("--star-offset-y", "0px");
    });
    return;
  }

  stars.forEach(({ node, point }) => {
    if (node.classList.contains("is-active")) {
      node.style.setProperty("--star-offset-x", "0px");
      node.style.setProperty("--star-offset-y", "0px");
      return;
    }

    const starX = (point.x / 100) * width;
    const starY = (point.y / 100) * height;
    const dx = starX - mouseX;
    const dy = starY - mouseY;
    const distance = Math.hypot(dx, dy);
    const influence = Math.max(0, 1 - distance / 130);
    const push = influence * influence * Number.parseFloat(node.dataset.pushMax || "5");
    const angle = Math.atan2(dy, dx);

    node.style.setProperty("--star-offset-x", `${Math.cos(angle) * push}px`);
    node.style.setProperty("--star-offset-y", `${Math.sin(angle) * push}px`);
  });
}
