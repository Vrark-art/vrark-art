"""Rebuild the Vrark Art Drive-backed catalogue.

Setup once:
  1. Place a Google Drive OAuth desktop-client file beside this script as credentials.json.
  2. Install dependencies: py -m pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib
  3. Run refresh_drive_catalogue.bat. The first run opens a browser for authorization.
"""
from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

ROOT = Path(__file__).resolve().parent
SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]
ROOT_ID = "1Ul1f-0Q7wg9_R19sMJXd4LPbbtc5Fwo2"
WOW_EXPORT_ID = "1bd1EjfHBvbawVvwzMkYFwZIh3E4NxRfx"
STATIC_ART_ID = "1bjh2n_k0BG-dkIqCAr8m_rJTR-VPxiwc"
GUMPS_ID = "1S1N2u18SzLNG4mVgDjsquFVL7x5u95np"
PRAPILK_GUMP_ID = "10l39L46tqVuKpjjHamg6SACH1Xa0u5EI"
CONTRIBUTORS = {
    "Dramoor": "1hT_wAPI-IBsYqkK7Y7E_ntFqyYX9RXlq",
    "Lassa": "1ApEvnlp74ts0aB6tSaC34VeADR9pttAO",
    "Prapilk": "1o-F_IiKbULZZRAem8n7eXy8UnXpwNUwQ",
}


def auth():
    token = ROOT / "token.json"
    creds = Credentials.from_authorized_user_file(token, SCOPES) if token.exists() else None
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            creds = InstalledAppFlow.from_client_secrets_file(ROOT / "credentials.json", SCOPES).run_local_server(port=0)
        token.write_text(creds.to_json(), encoding="utf-8")
    return build("drive", "v3", credentials=creds)


def children(service, parent_id):
    result, token = [], None
    while True:
        response = service.files().list(
            q=f"'{parent_id}' in parents and trashed = false",
            fields="nextPageToken, files(id,name,mimeType,createdTime,modifiedTime)",
            pageSize=1000, pageToken=token,
        ).execute()
        result.extend(response.get("files", []))
        token = response.get("nextPageToken")
        if not token:
            return result


def stem(name):
    return re.sub(r"(?:[_ -]+)(?:Preview|Miniature)$", "", Path(name).stem, flags=re.I).strip()


def make_entries(service, parent_id, contributor=None):
    files = children(service, parent_id)
    vds = [f for f in files if f["name"].lower().endswith(".vd")]
    folders = {f["name"].lower(): f["id"] for f in files if f["mimeType"] == "application/vnd.google-apps.folder"}
    previews = {stem(f["name"]): f for f in children(service, folders["previews"])} if "previews" in folders else {}
    miniatures = {stem(f["name"]): f for f in children(service, folders["miniatures"])} if "miniatures" in folders else {}
    entries = []
    dates = {}
    for vd in vds:
        name = Path(vd["name"]).stem
        entries.append({"name": name, "vdId": vd["id"], "previewId": previews.get(name, {}).get("id"), "miniatureId": miniatures.get(name, {}).get("id"), **({"contributor": contributor} if contributor else {})})
        dates[vd["id"]] = vd.get("createdTime") or vd.get("modifiedTime")
    return entries, dates


def make_wow_entries(service):
    """Import the large WoW-exporter collection using its generated suffixes."""
    files = children(service, WOW_EXPORT_ID)
    folders = {f["name"].lower(): f["id"] for f in files if f["mimeType"] == "application/vnd.google-apps.folder"}
    vds = []
    for kind in ("animal", "monster"):
        vds.extend(children(service, folders[kind]))
    previews = {Path(f["name"]).stem.removesuffix("_walk_direction-1"): f for f in children(service, folders["gif previews"])}
    miniatures = {Path(f["name"]).stem.removesuffix("_idle_action-1_direction-1_frame-0"): f for f in children(service, folders["shrink miniatures"])}
    entries, dates = [], {}
    for vd in (f for f in vds if f["name"].lower().endswith(".vd")):
        name = Path(vd["name"]).stem
        entries.append({"name": name, "vdId": vd["id"], "previewId": previews.get(name, {}).get("id"), "miniatureId": miniatures.get(name, {}).get("id"), "contributor": "Vrark"})
        dates[vd["id"]] = vd.get("createdTime") or vd.get("modifiedTime")
    return entries, dates


def make_static_entries(service):
    """Collect static-art files recursively, excluding the sliced-art branch."""
    entries = []

    def walk(folder_id, category):
        for item in children(service, folder_id):
            if item["mimeType"] == "application/vnd.google-apps.folder":
                if item["name"].strip().lower() != "sliced art":
                    walk(item["id"], category or item["name"])
                continue
            name = item["name"]
            lower = name.lower()
            is_image = item["mimeType"].startswith("image/")
            is_archive = lower.endswith((".zip", ".rar", ".7z")) or "zip" in item["mimeType"] or "rar" in item["mimeType"]
            if is_image or is_archive:
                entries.append({"name": Path(name).stem, "id": item["id"], "previewId": item["id"] if is_image else None, "category": category or "Static art", "contributor": "Vrark", "mimeType": item["mimeType"], "createdTime": item.get("createdTime"), "modifiedTime": item.get("modifiedTime")})

    walk(STATIC_ART_ID, "")
    return entries


def make_gump_entries(service):
    entries = []
    for folder_id, contributor in ((GUMPS_ID, "Vrark"), (PRAPILK_GUMP_ID, "Prapilk")):
        for item in children(service, folder_id):
            if item["mimeType"].startswith("image/"):
                entries.append({"name": Path(item["name"]).stem, "id": item["id"], "previewId": item["id"], "contributor": contributor, "createdTime": item.get("createdTime"), "modifiedTime": item.get("modifiedTime")})
    return entries


def write_js(filename, variable, value, header):
    (ROOT / filename).write_text(f"/* {header} */\nwindow.{variable}={json.dumps(value, ensure_ascii=False, separators=(',', ':'))};\n", encoding="utf-8")


def main():
    service = auth()
    base, dates = make_entries(service, ROOT_ID)
    extras = []
    for contributor, folder_id in CONTRIBUTORS.items():
        entries, contributor_dates = make_entries(service, folder_id, contributor)
        extras.extend(entries)
        dates.update(contributor_dates)
    wow, wow_dates = make_wow_entries(service)
    dates.update(wow_dates)
    base.extend(wow)
    static = make_static_entries(service)
    gumps = make_gump_entries(service)
    write_js("drive-catalogue.js", "VRARK_DRIVE_CATALOGUE", base, "Generated from the current Vrark Art root Drive folder.")
    write_js("drive-contributors.js", "VRARK_CONTRIBUTOR_CATALOGUE", extras, "Generated from the Dramoor, Lassa and Prapilk Drive folders.")
    write_js("drive-dates.js", "VRARK_DRIVE_DATES", dates, "Drive upload timestamps for chronological catalogue ordering.")
    write_js("static-catalogue.js", "VRARK_STATIC_CATALOGUE", static, "Generated from the static-art Drive folders; sliced art is excluded.")
    write_js("gump-catalogue.js", "VRARK_GUMP_CATALOGUE", gumps, "Generated from the root Gumps folder and Prapilk's Gump art folder.")
    print(f"Updated {len(base) + len(extras)} animations ({len(base)} Vrark, {len(extras)} contributor uploads), {len(static)} static-art files and {len(gumps)} gumps.")


if __name__ == "__main__":
    main()
