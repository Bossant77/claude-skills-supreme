#!/usr/bin/env bash
# Install claude-skills-supreme into ~/.claude/skills/
# Usage: ./install.sh [skill-name|--all]
#   ./install.sh --all              # install everything
#   ./install.sh code-review-supreme # install one skill
#   ./install.sh --fusions          # install only the 4 validated fusions

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="$HOME/.claude/skills"

mkdir -p "$TARGET"

FUSIONS=(
  code-review-supreme
  planning-supreme
  debugging-supreme
  simplify-supreme
)

META=(
  coach
  skill-fusion
  plugin-fusion
  skill-review
  skill-creation-supreme
)

ALL=("${FUSIONS[@]}" "${META[@]}")

install_skill() {
  local name=$1
  local src="$SCRIPT_DIR/skills/$name"
  local dest="$TARGET/$name"

  if [ ! -d "$src" ]; then
    echo "❌ skill not found: $name"
    return 1
  fi

  if [ -d "$dest" ]; then
    echo "⏭  $name (already installed — skipping; remove $dest to reinstall)"
    return 0
  fi

  cp -r "$src" "$dest"
  echo "✅ installed: $name"
}

case "${1:-}" in
  --all|"")
    echo "Installing all 9 skills..."
    for s in "${ALL[@]}"; do install_skill "$s"; done
    ;;
  --fusions)
    echo "Installing 4 validated fusions..."
    for s in "${FUSIONS[@]}"; do install_skill "$s"; done
    ;;
  --meta)
    echo "Installing 5 meta skills..."
    for s in "${META[@]}"; do install_skill "$s"; done
    ;;
  --help|-h)
    cat <<EOF
Usage: $0 [option]

Options:
  (no arg)            Install all 9 skills
  --all               Same as no arg
  --fusions           Install only validated fusions (4)
  --meta              Install only meta skills (5)
  <skill-name>        Install a specific skill
  --help              Show this help

After install, restart Claude Code to load new skills.
EOF
    ;;
  *)
    install_skill "$1"
    ;;
esac

echo ""
echo "Done. Restart Claude Code to load new skills."
echo "Test with: /skill-review (validate any skill empirically)"
