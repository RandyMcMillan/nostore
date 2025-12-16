#!/bin/bash

# Define the project and scheme
PROJECT="Nostore.xcodeproj"
SCHEME="Nostore (macOS)" # This scheme builds the macOS app, which should include the Safari Extension as an embedded target.
CONFIGURATION="Debug"   # Use Debug for development, or Release for a final build.
DESTINATION="platform=macOS"

echo "Building Xcode project: $PROJECT, Scheme: $SCHEME, Configuration: $CONFIGURATION"

xcodebuild -project "$PROJECT" \
           -scheme "$SCHEME" \
           -configuration "$CONFIGURATION" \
           -destination "$DESTINATION" \
           build

if [ $? -eq 0 ]; then
    echo "Build successful."
    echo "The Safari Extension for macOS has been built. Now, you need to enable it in Safari."
else
    echo "Build failed."
    exit 1
fi
