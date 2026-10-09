import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const platform = process.argv[2];
const root = fileURLToPath(new URL("../", import.meta.url));

if (platform === "android") {
  const path = join(root, "android", "app", "src", "main", "AndroidManifest.xml");
  let manifest = await readFile(path, "utf8");
  if (!manifest.includes("android.permission.RECORD_AUDIO")) {
    manifest = manifest.replace(
      /(<manifest\b[^>]*>)/,
      '$1\n    <uses-permission android:name="android.permission.RECORD_AUDIO" />',
    );
  }
  if (!manifest.includes("android.permission.RECORD_AUDIO")) {
    throw new Error("Could not add the Android microphone permission to AndroidManifest.xml.");
  }
  await writeFile(path, manifest);
} else if (platform === "ios") {
  const path = join(root, "ios", "App", "App", "Info.plist");
  let plist = await readFile(path, "utf8");
  if (!plist.includes("<key>NSMicrophoneUsageDescription</key>")) {
    plist = plist.replace(
      "</dict>",
      "    <key>NSMicrophoneUsageDescription</key>\n    <string>Elsewhere uses the microphone to create voice notes, which are transcribed on this device.</string>\n</dict>",
    );
  }
  if (!plist.includes("<key>NSMicrophoneUsageDescription</key>")) {
    throw new Error("Could not add the iOS microphone usage description to Info.plist.");
  }
  await writeFile(path, plist);
} else {
  throw new Error("Choose a native platform: android or ios.");
}
