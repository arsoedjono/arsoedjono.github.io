#!/bin/bash

set -euo pipefail

if [ -z "${1:-}" ]; then
    echo "Usage: $0 <urls.txt> [target_folder]"
    exit 1
fi

input="$1"
target_dir="${2:-.}"

mkdir -p "$target_dir"

success=0
failed=0

while IFS= read -r url || [ -n "$url" ]; do
    [[ -z "$url" ]] && continue

    # Remove query string
    clean_url="${url%%\?*}"

    # Extract filename only
    filename=$(basename "$clean_url")

    filepath="$target_dir/$filename"
    tmpfile="${filepath}.tmp"

    echo "Downloading: $filename"

    if curl \
        --fail \
        --location \
        --silent \
        --show-error \
        --retry 3 \
        --retry-delay 1 \
        --connect-timeout 10 \
        --max-time 60 \
        -o "$tmpfile" \
        "$url"
    then

        # Validate PNG signature
        signature=$(xxd -p -l 8 "$tmpfile")

        if [[ "$signature" == "89504e470d0a1a0a" ]]; then
            mv "$tmpfile" "$filepath"
            echo "✓ OK: $filename"
            ((success++))
        else
            echo "✗ Invalid PNG: $filename"
            rm -f "$tmpfile"
            ((failed++))
        fi
    else
        echo "✗ Download failed: $filename"
        rm -f "$tmpfile"
        ((failed++))
    fi

    sleep 1

done < "$input"

echo ""
echo "Done."
echo "Success: $success"
echo "Failed : $failed"
