#!/bin/bash
MSG="${1:-update}"
cd /home/runner/workspace
git add -A
git commit -m "$MSG" 2>/dev/null || echo "Nothing to commit"
git push origin main --force
