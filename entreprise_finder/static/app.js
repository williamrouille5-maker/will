// ---------- Gestion des onglets ----------
document.querySelectorAll(".onglet").forEach((bouton) => {
  bouton.addEventListener("click", () => {
    document.querySelectorAll(".onglet").forEach((b) => b.classList.remove("actif"));
    document.querySelectorAll(".panneau").forEach((p) => (p.hidden = true));
    bouton.classList.add("actif");
    document.getElementById(bouton.dataset.cible).hidden = false;
  });
});

// ---------- Rendu d'une fiche résultat (réutilisé pour unitaire + batch) ----------
function badgeHTML(score) {
  if (!score || !score.niveau) return "";
  const classe = "badge-" + score.niveau;
  return `<span class="badge ${classe}">${score.niveau}</span>`;
}

function ficheHTML(r) {
  if (r.erreur) {
    return `
      <div class="fiche-resultat">
        <h2>${r.entreprise || "Entreprise inconnue"}</h2>
        <div class="fiche-siren">SIREN : ${r.siren}</div>
        <p class="fiche-erreur">⚠ ${r.erreur}</p>
      </div>`;
  }

  const emailHTML = r.email
    ? `<a href="mailto:${r.email}">${r.email}</a>`
    : "non trouvé";
  const linkedinHTML = r.linkedin
    ? `<a href="${r.linkedin}" target="_blank" rel="noopener">${r.linkedin}</a>`
    : "non trouvé";

  return `
    <div class="fiche-resultat">
      <h2>${r.entreprise || "Entreprise inconnue"}</h2>
      <div class="fiche-siren">SIREN : ${r.siren}</div>

      <div class="fiche-champ">
        <div class="label">Dirigeant</div>
        <div>${r.prenom} ${r.nom} <span class="fiche-detail">${r.qualite || ""}</span></div>
      </div>

      <div class="fiche-champ">
        <div class="label">Email</div>
        <div>
          ${emailHTML} ${badgeHTML(r.email_score)}
          <span class="fiche-detail">${(r.email_score && r.email_score.label) || ""}</span>
        </div>
      </div>

      <div class="fiche-champ">
        <div class="label">LinkedIn</div>
        <div>
          ${linkedinHTML} ${badgeHTML(r.linkedin_score)}
          <span class="fiche-detail">${(r.linkedin_score && r.linkedin_score.label) || ""}</span>
        </div>
      </div>
    </div>`;
}

// ---------- Recherche unitaire ----------
const formUnitaire = document.getElementById("form-unitaire");
const boutonLancer = document.getElementById("bouton-lancer");
const consoleLog = document.getElementById("console-log");
const consoleLignes = document.getElementById("console-lignes");
const resultatUnitaire = document.getElementById("resultat-unitaire");

formUnitaire.addEventListener("submit", (e) => {
  e.preventDefault();
  const siren = document.getElementById("input-siren").value.trim();
  if (!siren) return;

  boutonLancer.disabled = true;
  boutonLancer.textContent = "Enquête en cours...";
  resultatUnitaire.innerHTML = "";
  consoleLignes.innerHTML = "";
  consoleLog.hidden = false;

  const source = new EventSource(`/api/stream?siren=${encodeURIComponent(siren)}`);

  source.addEventListener("log", (event) => {
    const data = JSON.parse(event.data);
    const ligne = document.createElement("div");
    ligne.textContent = "› " + data.message;
    consoleLignes.appendChild(ligne);
    consoleLignes.scrollTop = consoleLignes.scrollHeight;
  });

  source.addEventListener("resultat", (event) => {
    const data = JSON.parse(event.data);
    const dernieres = consoleLignes.lastElementChild;
    if (dernieres) dernieres.classList.add("ok");
    resultatUnitaire.innerHTML = ficheHTML(data);
    terminer();
  });

  source.addEventListener("erreur", (event) => {
    const data = JSON.parse(event.data);
    resultatUnitaire.innerHTML = `<p class="fiche-erreur">⚠ ${data.message}</p>`;
    terminer();
  });

  source.onerror = () => {
    terminer();
    source.close();
  };

  function terminer() {
    boutonLancer.disabled = false;
    boutonLancer.textContent = "Lancer l'enquête";
    source.close();
  }
});

// ---------- Traitement en lot ----------
const boutonBatch = document.getElementById("bouton-batch");
const inputFichier = document.getElementById("input-fichier");
const progressionBatch = document.getElementById("progression-batch");
const barreProgression = document.getElementById("barre-progression");
const progressionTexte = document.getElementById("progression-texte");
const resultatsBatch = document.getElementById("resultats-batch");

boutonBatch.addEventListener("click", async () => {
  const fichier = inputFichier.files[0];
  if (!fichier) {
    alert("Sélectionne d'abord un fichier CSV.");
    return;
  }

  boutonBatch.disabled = true;
  resultatsBatch.innerHTML = "";
  progressionBatch.hidden = false;
  barreProgression.style.width = "0%";
  progressionTexte.textContent = "Envoi du fichier...";

  const formData = new FormData();
  formData.append("fichier", fichier);

  let reponse;
  try {
    reponse = await fetch("/api/batch/upload", { method: "POST", body: formData });
  } catch (err) {
    progressionTexte.textContent = "Erreur d'envoi du fichier.";
    boutonBatch.disabled = false;
    return;
  }

  const data = await reponse.json();
  if (data.erreur) {
    progressionTexte.textContent = "Erreur : " + data.erreur;
    boutonBatch.disabled = false;
    return;
  }

  const total = data.total;
  let traites = 0;
  progressionTexte.textContent = `0 / ${total} entreprise(s) traitée(s)`;

  const source = new EventSource(`/api/batch/stream/${data.job_id}`);

  source.addEventListener("resultat", (event) => {
    const r = JSON.parse(event.data);
    resultatsBatch.insertAdjacentHTML("beforeend", ficheHTML(r));
    traites++;
    majProgression(traites, total);
  });

  source.addEventListener("erreur_ligne", (event) => {
    const d = JSON.parse(event.data);
    resultatsBatch.insertAdjacentHTML(
      "beforeend",
      `<div class="fiche-resultat"><h2>SIREN ${d.siren}</h2><p class="fiche-erreur">⚠ ${d.message}</p></div>`
    );
    traites++;
    majProgression(traites, total);
  });

  source.addEventListener("termine", () => {
    progressionTexte.textContent = `Terminé — ${total} entreprise(s) traitée(s)`;
    boutonBatch.disabled = false;
    source.close();
  });

  source.onerror = () => {
    boutonBatch.disabled = false;
    source.close();
  };

  function majProgression(traites, total) {
    const pourcentage = Math.round((traites / total) * 100);
    barreProgression.style.width = pourcentage + "%";
    progressionTexte.textContent = `${traites} / ${total} entreprise(s) traitée(s)`;
  }
});
