# Deployment — Internal Distribution

How to build and distribute **Mulvane EMS Protocols** to your crew's phones without
publishing to the public App Store / Play Store. Builds are produced in the cloud with
**EAS Build** — no Mac required for iOS.

> ⚠️ Get **medical-direction sign-off** on the content before distributing to anyone
> who may use it on a call.

## One-time setup

1. **Create a free Expo account:** https://expo.dev/signup
2. **Install the EAS CLI** and log in (on your dev machine):
   ```bash
   npm install -g eas-cli
   eas login
   ```
3. **Link the project** (creates an EAS project id and writes it into the config):
   ```bash
   eas init
   ```
4. Accounts you'll need for real device installs:
   - **Android:** none required to *build*; you just need to allow "install unknown
     apps" on the phones, or use a Google Play Developer account ($25 one-time) for
     the Play **internal testing** track.
   - **iOS:** an **Apple Developer account** ($99/yr). EAS manages signing for you.

App identity is already set in `app.json`:
- iOS `bundleIdentifier` / Android `package`: `com.mulvaneems.protocols`
- `version` 1.0.0, iOS `buildNumber` 1, Android `versionCode` 1

(Change the bundle id/package if your organization uses a specific reverse-domain.)

## Build for internal use

The `preview` profile in `eas.json` is configured for **internal distribution**.

### Android (simplest — direct install)
```bash
eas build --platform android --profile preview
```
Produces an **APK**. EAS returns a link/QR; open it on each phone, download, and
install (you may need to enable "install from unknown sources"). Done.

### iOS (registered devices)
iOS internal builds install only on **registered devices**:
```bash
eas device:create        # register each crew device (one-time, via QR/link)
eas build --platform ios --profile preview
```
EAS returns a link/QR; open it on a registered iPhone to install.
Alternatively, distribute via **TestFlight** (up to 10,000 testers, light Apple
review) using the `production` profile + `eas submit`.

## Updating the app later

**Content or code changes (no new install) — EAS Update (recommended):**
Because the protocols are bundled JS/assets, you can push updates over-the-air without
a new build, as long as the native parts didn't change:
```bash
eas update --branch preview --message "Updated protocols"
```
Phones pick up the new bundle on next launch. Great for protocol revisions.

**Changes that need a new build** (new native library, icon, app version): bump
`version` + `buildNumber`/`versionCode` in `app.json`, then re-run the build command.

## Regenerating icons / splash

Icons and the splash image are generated from `source/mulvane_EMS_logo.jpg`:
- `assets/icon.png` — 1024×1024, white background, no transparency (iOS requirement)
- `assets/adaptive-icon.png` — Android adaptive-icon foreground (transparent)
- `assets/splash-icon.png` — splash image (shown on `#ffffff`)

If the logo changes, regenerate them with Pillow (`pip install pillow`) using the same
fit/flood-fill approach, keeping the icon at 1024×1024 with no alpha.

## Notes

- This is an **internal reference** reproducing the department's approved protocols;
  it is not a public/medical-claims app and is not submitted for public review.
- No data is collected and nothing leaves the device (fully offline).
