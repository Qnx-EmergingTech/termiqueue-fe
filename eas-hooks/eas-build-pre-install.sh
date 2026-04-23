#!/usr/bin/env bash

set -euo pipefail

echo "🔧 Configuring Podfile for Firebase compatibility..."

PODFILE_PATH="$EAS_BUILD_WORKINGDIR/ios/Podfile"

if [ -f "$PODFILE_PATH" ]; then
  # Check if use_modular_headers! is already present
  if ! grep -q "use_modular_headers!" "$PODFILE_PATH"; then
    # Add use_modular_headers! after the platform line
    sed -i.bak "/^platform :ios/a\\
use_modular_headers!\\
" "$PODFILE_PATH"
    
    echo "✅ Added use_modular_headers! to Podfile"
    
    # Show the relevant part of the Podfile for verification
    echo "📄 Podfile configuration:"
    head -n 20 "$PODFILE_PATH"
  else
    echo "✅ use_modular_headers! already present in Podfile"
  fi
else
  echo "⚠️  Podfile not found at $PODFILE_PATH"
  exit 1
fi

echo "✅ Podfile configuration complete"
