# Elsewhere

Elsewhere is an offline-first note app for collecting and arranging thoughts. Notes are stored on the current device; there is no account or cloud sync.

Public web app: <https://voorg-svg.github.io/elsewhere/>. Search for **Elsewhere Notes** to distinguish the app from other products named Elsewhere. Search engines control when and how new pages appear in results.

## Web app

Install Node.js, then run:

```sh
npm install
npm run dev
```

Vite prints a local URL. For a production build, run `npm run build`; the static app is written to `dist/`.

## Offline voice transcription

Voice capture records audio locally and transcribes it with the multilingual Whisper Base ONNX model through Transformers.js. Arabic is supported, and the interface includes Arabic translation and right-to-left layout. Choose a language from the voice-language menu; the model supports 99 languages but does not automatically detect which one you are speaking. When the interface is Arabic and no voice-language preference has been saved, Arabic is selected for transcription. The model is larger than Whisper Tiny, so its first download takes more time and storage; it is kept in the browser model cache for later offline use. Recording audio is not sent to a transcription service. Allow time and storage for the model download before relying on transcription offline.

The first-use model download requires an internet connection. Browser/device storage may be cleared by the user or operating system, in which case the model must be downloaded again. Notes remain in local browser storage and are not synced across devices.

## iOS and Android app shells

The app is configured for Capacitor. Build the web app, then add platform projects on a machine with the relevant native tools:

```sh
npm run build
npx cap add android
npx cap add ios
npx cap sync
```

Android builds require Android Studio and the Android SDK. iOS builds and App Store submissions require macOS, Xcode, an Apple Developer account, app signing, and App Store Connect access. Google Play submissions require a Play Console developer account, signed Android App Bundle, store listing, and testing. On Windows, the GitHub Actions workflow can build unsigned Android and iOS simulator test apps; those are for device testing, not store submission. The Capacitor shell and store submissions still need to be generated, configured, tested on physical devices, and submitted; this repository is not yet published in either app store.

## GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` builds the web app and publishes `dist/` when changes are pushed to `main`. The Pages source must be set to **GitHub Actions** in repository settings.

## Privacy and voice

- Microphone access is requested only when voice capture is started. Voice audio is processed on-device by the speech model.
- The speech model is downloaded from Hugging Face on first use. Only the model files are fetched; recorded audio is not uploaded for transcription.
- Browser and device capabilities vary. Verify microphone capture, model download, offline transcription, and note persistence on real iOS and Android devices before release.
