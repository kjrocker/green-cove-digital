#!/usr/bin/env bash
# drive.sh — drive a RUNNING Green Cove Digital site: smoke the /api/contact
# Cloudflare Pages Function and screenshot the HTML pages with headless chromium.
# This does NOT launch the server — see SKILL.md for the launch command first.
#
# Usage:
#   .claude/skills/run-green-cove-digital/drive.sh [api|shots|all|stop] [OUTDIR]
#     api    — POST /api/contact for the honeypot / invalid / oversize cases,
#              assert each server-side redirect. Needs a Pages-Functions host
#              (wrangler pages dev), NOT `astro dev` — see Gotchas.
#              These three cases NEVER send email. The live SES send is opt-in
#              via LIVE_SEND=1 (see below).
#     shots  — screenshot every page to OUTDIR (needs chromium/firefox)
#     all    — api + shots (default)
#     stop   — kill the wrangler server and its orphaned workerd child
#   OUTDIR defaults to ./tmp/green-cove-shots (created if missing).
#
# Env:
#   BASE   default http://127.0.0.1:8788 (wrangler pages dev — full app incl.
#          the contact Function). Point at http://127.0.0.1:4321 for `astro dev`,
#          but `api` will fail there because the Function isn't served.
#
#   LIVE_SEND=1  Also run the *valid* submission, which makes a real Amazon SES
#          API call. If .dev.vars holds working AWS creds this DELIVERS A REAL
#          EMAIL to CONTACT_TO_EMAIL (the site owner's inbox). Off by default so
#          a routine smoke run can't spam the owner. To exercise the full SES
#          path without delivering anything, point CONTACT_TO_EMAIL at the AWS
#          mailbox simulator first — see SKILL.md ("Exercising SES safely").
set -euo pipefail

PORT_OF() { # extract port from BASE, default 8788
  case "$BASE" in *:[0-9]*) echo "${BASE##*:}" ;; *) echo 8788 ;; esac
}

BASE="${BASE:-http://127.0.0.1:8788}"
MODE="${1:-all}"
OUTDIR="${2:-./tmp/green-cove-shots}"

red()   { printf '\033[31m%s\033[0m\n' "$*"; }
green() { printf '\033[32m%s\033[0m\n' "$*"; }

require_up() {
  curl -fsS -o /dev/null "$BASE/" \
    || { red "server not responding at $BASE — start it first (see SKILL.md)"; exit 1; }
}

# POST the form and print the resulting redirect target (Location header).
post_contact() { # extra curl --data-urlencode args follow
  curl -s -o /dev/null -w '%{redirect_url}' -X POST "$BASE/api/contact" "$@"
}

smoke_api() {
  echo "== contact Function smoke ($BASE/api/contact) =="
  local loc

  # Honeypot filled (the hidden `company` field) -> silently redirected to
  # /thanks, and NO email is attempted. Real bots hit this path.
  loc=$(post_contact \
    --data-urlencode "name=Bot" --data-urlencode "email=bot@x.com" \
    --data-urlencode "message=spam" --data-urlencode "company=iamabot")
  echo "honeypot:  -> $loc"
  case "$loc" in */thanks) ;; *) red "expected redirect to /thanks"; exit 1 ;; esac

  # Missing/invalid fields -> bounced back to /contact?error=1, no email.
  loc=$(post_contact \
    --data-urlencode "name=" --data-urlencode "email=bad" --data-urlencode "message=")
  echo "invalid:   -> $loc"
  case "$loc" in *"/contact?error=1") ;; *) red "expected redirect to /contact?error=1"; exit 1 ;; esac

  # Message over MAX_MESSAGE_LEN (5000) -> bounced to /contact?error=1 before
  # any SES call. Exercises the length guard; returns in ~2ms (no network).
  loc=$(post_contact \
    --data-urlencode "name=Jane" --data-urlencode "email=jane@example.com" \
    --data-urlencode "message=$(printf 'x%.0s' $(seq 1 5001))")
  echo "oversize:  -> $loc"
  case "$loc" in *"/contact?error=1") ;; *) red "expected redirect to /contact?error=1"; exit 1 ;; esac

  # Valid fields -> the Function actually calls Amazon SES. This is the ONLY
  # case that can deliver mail, so it is opt-in.
  if [ "${LIVE_SEND:-0}" = "1" ]; then
    red "LIVE_SEND=1 — this makes a real SES call and may email CONTACT_TO_EMAIL"
    loc=$(post_contact \
      --data-urlencode "name=Jane" --data-urlencode "email=jane@example.com" \
      --data-urlencode "message=Hello there")
    echo "valid:     -> $loc"
    case "$loc" in
      */thanks)            echo "  (SES accepted the owner send — mail was delivered)" ;;
      *"/contact?error=1") echo "  (SES rejected the owner send — placeholder/expired creds)" ;;
      *) red "unexpected redirect: $loc"; exit 1 ;;
    esac
  else
    echo "valid:     -> SKIPPED (set LIVE_SEND=1 to run; it can email the owner)"
  fi
  green "contact Function OK"
}

stop_server() {
  local port; port=$(PORT_OF)
  # NOTE: do NOT use `pkill -f 'wrangler pages dev'` — the pattern matches this
  # very shell's own command line and kills it mid-script. Kill by port, then
  # clean the orphaned workerd by exact process NAME (-x never matches a shell).
  fuser -k "${port}/tcp" 2>/dev/null || true
  sleep 1
  pkill -x workerd 2>/dev/null || true
  green "stopped (port $port + workerd)"
}

pick_browser() {
  command -v chromium-browser >/dev/null && { echo chromium; return; }
  command -v chromium         >/dev/null && { echo chromium; return; }
  command -v firefox          >/dev/null && { echo firefox;  return; }
  red "no chromium-browser/chromium/firefox found"; exit 1
}

shot() { # $1 = url path, $2 = output png
  local url="$BASE/$1" out="$OUTDIR/$2" prof
  prof="$(mktemp -d)"
  case "$BROWSER" in
    chromium)
      local bin; bin=$(command -v chromium-browser || command -v chromium)
      timeout 60 "$bin" --headless --no-sandbox --disable-gpu --hide-scrollbars \
        --user-data-dir="$prof" --window-size=1280,1600 \
        --screenshot="$out" "$url" >/dev/null 2>&1 ;;
    firefox)
      timeout 90 firefox --headless --profile "$prof" \
        --window-size=1280,1600 --screenshot "$out" "$url" >/dev/null 2>&1 ;;
  esac
  [ -s "$out" ] && echo "  $out" || { red "  failed: $out"; return 1; }
}

take_shots() {
  BROWSER=$(pick_browser)
  mkdir -p "$OUTDIR"
  echo "== screenshots via $BROWSER -> $OUTDIR =="
  shot ""                        home.png
  shot "about"                   about.png
  shot "contact"                 contact.png
  shot "thanks"                  thanks.png
  shot "services/small-business" small-business.png
  shot "services/consulting"     consulting.png
  green "screenshots OK — open the PNGs; the home hero should show the cove waves"
}

case "$MODE" in
  api)   require_up; smoke_api ;;
  shots) require_up; take_shots ;;
  all)   require_up; smoke_api; take_shots ;;
  stop)  stop_server ;;
  *)     red "unknown mode: $MODE (use api|shots|all|stop)"; exit 1 ;;
esac
