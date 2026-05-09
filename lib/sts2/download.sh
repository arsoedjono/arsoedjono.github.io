#!/bin/bash

set -u

# Usage:
# ./download.sh urls.txt [target_folder]

if [ -z "${1:-}" ]; then
    echo "Usage: $0 <urls.txt> [target_folder]"
    exit 1
fi

input="$1"
target_dir="${2:-.}"

mkdir -p "$target_dir"

success=0
failed=0
last_success=""

while IFS= read -r url || [ -n "$url" ]; do
    [[ -z "$url" ]] && continue

    clean_url="${url%%\?*}"
    filename=$(basename "$clean_url")

    filepath="$target_dir/$filename"
    tmpfile="${filepath}.tmp"

    echo ""
    echo "Downloading: $filename"

    consecutive_failures=0

    while true; do
        # Download and capture HTTP code
        http_code=$(
            curl \
                --location \
                --silent \
                --show-error \
                --connect-timeout 10 \
                --max-time 60 \
                --retry 0 \
                -w "%{http_code}" \
                -o "$tmpfile" \
                "$url"
        )

        curl_exit=$?

        # Success HTTP response
        if [[ "$curl_exit" -eq 0 && "$http_code" == "200" ]]; then

            # Validate PNG signature
            signature=$(xxd -p -l 8 "$tmpfile" 2>/dev/null || true)

            if [[ "$signature" == "89504e470d0a1a0a" ]]; then
                mv "$tmpfile" "$filepath"

                echo "✓ OK: $filename"

                last_success="$url"
                ((success++))

                break
            else
                echo "✗ Invalid PNG signature"

                rm -f "$tmpfile"

                ((consecutive_failures++))
            fi

        # Rate limited
        elif [[ "$http_code" == "429" ]]; then
            echo "⚠ Received HTTP 429 (rate limit)"
            echo "Pausing 60 seconds before retry..."

            rm -f "$tmpfile"

            sleep 60

            continue

        else
            echo "✗ Download failed (HTTP $http_code)"

            rm -f "$tmpfile"

            ((consecutive_failures++))
        fi

        # Stop after 3 consecutive failures for same image
        if [[ "$consecutive_failures" -ge 3 ]]; then
            echo ""
            echo "======================================"
            echo "FATAL: Same image failed 3 times"
            echo "Failed URL:"
            echo "$url"
            echo ""
            echo "Last successful URL:"
            echo "${last_success:-<none>}"
            echo "======================================"

            exit 1
        fi

        echo "Retrying in 5 seconds..."
        sleep 5

    done

    # Normal delay between downloads
    sleep 1

done < "$input"

echo ""
echo "======================================"
echo "Download completed"
echo "Success: $success"
echo "Failed : $failed"
echo "======================================"
