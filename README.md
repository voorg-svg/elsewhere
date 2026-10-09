# Elsewhere

Elsewhere is a small, installable web app for capturing thoughts in a space you can arrange. It works on phones and computers, and saves notes in the browser on the current device.

## Try it locally

Open `index.html` in a browser to explore the interface. For install prompts, offline support, or microphone access, serve the folder over `localhost` or HTTPS instead:

```powershell
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Publish with GitHub Pages

1. Create a **public** repository on GitHub. Do not add a README or other files during creation.
2. In VS Code, open the `python` folder that contains this README and the app files.
3. Use Source Control to initialize a repository, commit the files to a branch named `main`, and publish that branch to the new GitHub repository. Never put passwords or access tokens in the repository.
4. In the GitHub repository, open **Settings → Pages** and set the build and deployment source to **GitHub Actions**.
5. Open the **Actions** tab and wait for **Deploy Elsewhere to GitHub Pages** to finish. Its deployment details include the public app address.

The workflow in `.github/workflows/deploy-pages.yml` deploys the repository root whenever a commit is pushed to `main`, and can also be started manually from Actions.

## Notes about voice and privacy

- Speech recognition and read-aloud support depend on the browser and device. When browser speech recognition is used, the browser may send audio to its speech service. Elsewhere does not run its own transcription server.
- Notes and spaces are stored in browser local storage on this device. There is no account, cloud backup, or cross-device sync.
- Since notes are device-local, publishing the app does not publish users' notes.
