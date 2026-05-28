from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / "index.html").read_text()
css = (ROOT / "styles.css").read_text()
js = (ROOT / "app.js").read_text()

required_html = [
    "project-modal",
    "lane-modal",
    "note-modal",
    "project-grid",
    "lane-board",
]
required_js = [
    "localStorage",
    "renderBoard",
    "createNoteCard",
    "project.notes = project.notes.filter",
    "note.status = event.target.value",
]
required_css = [
    "transform: rotateY(180deg)",
    ".lane-board",
    ".project-note",
]

for token in required_html:
    assert token in html, f"Missing HTML hook: {token}"
for token in required_js:
    assert token in js, f"Missing JS behavior: {token}"
for token in required_css:
    assert token in css, f"Missing CSS behavior: {token}"

print("Smoke checks passed: core prototype hooks and behaviors are present.")
