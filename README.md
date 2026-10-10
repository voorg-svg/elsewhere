# Elsewhere

Elsewhere is a simple, offline-first note app for collecting and arranging thoughts. Create idea maps to grow connected ideas, move branches, and zoom around a visual workspace. Notes and maps are stored on the current device; there is no account or cloud sync.

Public web app: <https://voorg-svg.github.io/elsewhere/>. Search for **Elsewhere Notes** to distinguish the app from other products named Elsewhere. Search engines control when and how new pages appear in results.

## Web app

Install Node.js, then run:

```sh
npm install
npm run dev
```

Vite prints a local URL. For a production build, run `npm run build`; the static app is written to `dist/`.

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

## Privacy

- Notes are saved in local browser storage and are not uploaded or synced.
- Browser/device storage may be cleared by the user or operating system.
