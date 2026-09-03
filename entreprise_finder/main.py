"""
Point d'entrée du programme.

Usage :
  python main.py 552100554                     # un seul SIREN, affichage terminal + rapport HTML
  python main.py 552100554 --debug              # affiche le JSON brut de l'API SIREN (pour debug)
  python main.py --csv entreprises.csv          # mode batch, colonne "siren" attendue
  python main.py --csv entreprises.csv --out resultats.csv --html rapport.html
"""
import argparse
import csv
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

from rich.console import Console
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TimeElapsedColumn

import config
from core.pipeline import enqueter
from report import generer_html

console = Console()

COULEURS_RICH = {"vert": "green", "orange": "yellow", "rouge": "red"}


def afficher_resultat_terminal(r):
    table = Table(show_header=False, box=None, padding=(0, 1))
    table.add_row("[bold]Entreprise[/bold]", r.entreprise or "—")
    table.add_row("[bold]SIREN[/bold]", r.siren)

    if r.erreur:
        console.print(table)
        console.print(f"[red]⚠ {r.erreur}[/red]\n")
        return

    table.add_row("[bold]Dirigeant[/bold]", f"{r.prenom} {r.nom} ({r.qualite})")

    couleur_email = COULEURS_RICH.get(r.email_score.get("niveau"), "white")
    email_txt = r.email or "non trouvé"
    table.add_row(
        "[bold]Email[/bold]",
        f"[{couleur_email}]● {email_txt}[/{couleur_email}]  [dim]{r.email_score.get('label', '')}[/dim]",
    )

    couleur_li = COULEURS_RICH.get(r.linkedin_score.get("niveau"), "white")
    li_txt = r.linkedin or "non trouvé"
    table.add_row(
        "[bold]LinkedIn[/bold]",
        f"[{couleur_li}]● {li_txt}[/{couleur_li}]  [dim]{r.linkedin_score.get('label', '')}[/dim]",
    )

    console.print(table)
    console.print()


def traiter_un_siren(siren: str, debug: bool = False, verbose: bool = False):
    def cb(msg):
        if verbose:
            console.print(f"  [dim]... {msg}[/dim]")

    return enqueter(siren.strip(), debug=debug, verbose_callback=cb if verbose else None)


def mode_unitaire(args):
    console.rule(f"[bold]Enquête sur SIREN {args.siren}[/bold]")
    resultat = traiter_un_siren(args.siren, debug=args.debug, verbose=True)
    console.print()
    afficher_resultat_terminal(resultat)

    if args.html:
        chemin = generer_html([resultat], args.html)
        console.print(f"[dim]Rapport HTML généré : {chemin}[/dim]")


def mode_batch(args):
    lignes = []
    with open(args.csv, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        colonne_siren = None
        for col in reader.fieldnames:
            if col.strip().lower() in ("siren", "numero_siren", "num_siren"):
                colonne_siren = col
                break
        if not colonne_siren:
            console.print("[red]Aucune colonne 'siren' trouvée dans le CSV.[/red]")
            sys.exit(1)
        for row in reader:
            siren = row.get(colonne_siren, "").strip()
            if siren:
                lignes.append(siren)

    console.rule(f"[bold]Traitement batch — {len(lignes)} entreprise(s)[/bold]")
    resultats = []

    with Progress(
        SpinnerColumn(), TextColumn("[progress.description]{task.description}"),
        BarColumn(), TimeElapsedColumn(), console=console,
    ) as progress:
        task = progress.add_task("Enquête en cours...", total=len(lignes))
        with ThreadPoolExecutor(max_workers=config.MAX_WORKERS) as executor:
            futures = {executor.submit(traiter_un_siren, s, args.debug, False): s for s in lignes}
            for future in as_completed(futures):
                try:
                    resultats.append(future.result())
                except Exception as e:
                    console.print(f"[red]Erreur sur {futures[future]} : {e}[/red]")
                progress.advance(task)

    console.print()
    for r in resultats:
        afficher_resultat_terminal(r)

    if args.out:
        with open(args.out, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["siren", "entreprise", "prenom", "nom", "qualite",
                              "email", "email_fiabilite", "linkedin", "linkedin_fiabilite", "erreur"])
            for r in resultats:
                writer.writerow([
                    r.siren, r.entreprise, r.prenom, r.nom, r.qualite,
                    r.email or "", r.email_score.get("niveau", ""),
                    r.linkedin or "", r.linkedin_score.get("niveau", ""),
                    r.erreur or "",
                ])
        console.print(f"[dim]Résultats CSV exportés : {args.out}[/dim]")

    if args.html:
        chemin = generer_html(resultats, args.html)
        console.print(f"[dim]Rapport HTML généré : {chemin}[/dim]")


def main():
    parser = argparse.ArgumentParser(description="Enrichissement automatique de contacts dirigeants à partir d'un SIREN.")
    parser.add_argument("siren", nargs="?", help="Numéro SIREN à traiter (mode unitaire)")
    parser.add_argument("--csv", help="Fichier CSV avec une colonne 'siren' (mode batch)")
    parser.add_argument("--out", default="resultats.csv", help="Fichier CSV de sortie (mode batch, défaut: resultats.csv)")
    parser.add_argument("--html", default="rapport.html", help="Fichier HTML de sortie (défaut: rapport.html)")
    parser.add_argument("--debug", action="store_true", help="Affiche le JSON brut de l'API SIREN")
    args = parser.parse_args()

    if not config.USE_AI:
        console.print("[dim]Note : ANTHROPIC_API_KEY absente de .env — le programme fonctionne en mode règles simples (sans IA).[/dim]\n")

    if args.csv:
        mode_batch(args)
    elif args.siren:
        mode_unitaire(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
