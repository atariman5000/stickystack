import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
package_json = json.loads((ROOT / "package.json").read_text())
angular_json = json.loads((ROOT / "angular.json").read_text())
index_html = (ROOT / "index.html").read_text()
main_ts = (ROOT / "src" / "main.ts").read_text()
component_ts = (ROOT / "src" / "app" / "app.component.ts").read_text()
component_html = (ROOT / "src" / "app" / "app.component.html").read_text()
css = (ROOT / "src" / "styles.css").read_text()

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
    "notesForLane",
    "updateNoteStatus",
    "project.notes = project.notes.filter",
]
required_component_html = [
    "*ngFor=\"let project of state.projects",
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
    assert token in component_ts, f"Missing Angular component behavior: {token}"
for token in required_component_html:
    assert token in component_html, f"Missing Angular template hook: {token}"
for token in required_css:
    assert token in css, f"Missing CSS behavior: {token}"

assert not (ROOT / "app.js").exists(), "Legacy DOM app.js should be removed after Angular conversion"

print("Smoke checks passed: Angular configuration, component hooks, and sticky board behaviors are present.")
