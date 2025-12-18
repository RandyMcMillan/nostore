#!/bin/bash

# Define the project and scheme
PROJECT="gnostore.xcodeproj"
SCHEME="gnostore (iOS)" # This scheme builds the iOS app, which should include the Safari Extension as an embedded target.
CONFIGURATION="Debug"   # Use Debug for development, or Release for a final build.
DESTINATION="platform=iOS Simulator,name=iPhone 16,OS=18.3.1"

echo "Building Xcode project: $PROJECT, Scheme: $SCHEME, Configuration: $CONFIGURATION"

xcodebuild -project "$PROJECT" \
           -scheme "$SCHEME" \
           -configuration "$CONFIGURATION" \
           -destination "$DESTINATION" \
           build

if [ $? -eq 0 ]; then
    echo "Build successful."
    echo "The Safari Extension for iOS has been built. Now, you need to enable it in Safari in the iOS Simulator."
else
    echo "Build failed."
    exit 1
fi
