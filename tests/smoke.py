import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(path):
    return path.read_text(encoding="utf-8")


package_json = json.loads(read(ROOT / "package.json"))
angular_json = json.loads(read(ROOT / "angular.json"))
index_html = read(ROOT / "index.html")
main_ts = read(ROOT / "src" / "main.ts")
component_ts = read(ROOT / "src" / "app" / "app.component.ts")
component_html = read(ROOT / "src" / "app" / "app.component.html")
app_ts = "\n".join(read(path) for path in (ROOT / "src" / "app").rglob("*.ts"))
app_html = "\n".join(read(path) for path in (ROOT / "src" / "app").rglob("*.html"))
css = read(ROOT / "src" / "styles.css")

required_package = [
    "@angular/core",
    "@angular/forms",
    "@angular/platform-browser",
    "@angular/cli",
]
required_angular_options = [
    ("browser", "src/main.ts"),
    ("index", "index.html"),
    ("styles", ["src/styles.css"]),
    ("polyfills", ["zone.js"]),
]
required_index = ["<app-root></app-root>", "<base href=\"/\" />"]
required_main = ["bootstrapApplication", "AppComponent"]
required_component_ts = [
    "standalone: true",
    "FormsModule",
    "localStorage",
    "projectTemplates",
    "templateType",
    "migrateState",
    "notesForLane",
    "updateNoteStatus",
    "project.notes = project.notes.filter",
]
required_component_html = [
    "*ngFor=\"let project of projects",
    "name=\"projectTemplate\"",
    "template-badge",
    "id=\"project-modal\"",
    "id=\"lane-modal\"",
    "id=\"note-modal\"",
    "id=\"project-grid\"",
    "id=\"lane-board\"",
    "[(ngModel)]",
]
required_css = [
    "transform: rotateY(180deg)",
    ".lane-board",
    ".project-note",
]
required_templates = [
    "Simple Kanban",
    "User Story Map",
    "Product Roadmap",
    "Opportunity Canvas",
    "Sailboat Retro",
    "2x2 Prioritization Matrix",
]

for dependency in required_package:
    assert dependency in {**package_json["dependencies"], **package_json["devDependencies"]}, f"Missing Angular dependency: {dependency}"

build_options = angular_json["projects"]["stickystack"]["architect"]["build"]["options"]
for key, value in required_angular_options:
    assert build_options[key] == value, f"Angular build option {key} should be {value!r}"

for token in required_index:
    assert token in index_html, f"Missing Angular index hook: {token}"
for token in required_main:
    assert token in main_ts, f"Missing Angular bootstrap token: {token}"
for token in required_component_ts:
    assert token in app_ts, f"Missing Angular component behavior: {token}"
for token in required_component_html:
    assert token in app_html, f"Missing Angular template hook: {token}"
for token in required_css:
    assert token in css, f"Missing CSS behavior: {token}"
for template in required_templates:
    assert template in app_ts, f"Missing project template: {template}"

for selector in [
    "<app-header",
    "<app-project-home",
    "<app-project-board",
    "<app-project-dialog",
    "<app-lane-dialog",
    "<app-note-dialog",
]:
    assert selector in component_html, f"Root component should compose {selector}"

assert not (ROOT / "app.js").exists(), "Legacy DOM app.js should be removed after Angular conversion"

print("Smoke checks passed: Angular configuration, component hooks, and sticky board behaviors are present.")
