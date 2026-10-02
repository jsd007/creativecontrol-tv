# Intent-aware playback

## Behavior

- A fresh page load stays quiet and shows a poster. No previous visit is treated as permission to play.
- Explicit Play or a channel/program selection requests playback with sound, unless the visitor has explicitly muted.
- The site Sound control and YouTube's native mute/unmute share a preference within this visit, including client-side navigation between clip details and TV.
- Tuner clicks, keyboard channel selection, guide titles, previous/next programs, journeys, and work/process switches request playback. Selecting the current title or channel resumes it rather than reloading it.
- Search, filters, pagination, and sound changes do not resume paused playback.
- The TV player remains mounted between programs. Video and native volume are not reset through iframe remounts.
- Videos do not automatically advance at the end. That is a separate playlist decision, not part of this change.

## Browser limits and fallback

YouTube's documented IFrame API handles playback, mute, and actual player-state events. The API script and iframe load only after intent. A browser can still reject unmuted scripted playback; a compact 44px retry control leaves the native center/bottom controls reachable. API failure leaves the native player usable, and unavailable embeds link to the original upload.

Native mute is observed every 250ms after an acknowledged command settles. Bootstrap mute or rejected unmute must not silently overwrite the visitor's sound preference. Native volume is not forced upward, including a deliberate volume of zero.

Reference: [YouTube IFrame API, including autoplay-blocked events](https://developers.google.com/youtube/iframe_api_reference#onAutoplayBlocked).

## Verification

- 65 automated tests pass, including 22 new playback-session, native-sound-observer, and embed-parameter tests.
- TypeScript, ESLint, and the production build pass (706 generated pages).
- In-app browser: audible first Play; audible channel change; native mute carried to the next channel; native unmute synchronized with site Sound; sound/search changes preserved a pause; same-channel resume; journey and next-program playback; rapid channel changes; quiet reload.
- Phone-width layout and visible tuner interaction checked at 390 × 844. This is not a physical iPhone/Safari or Android-device certification. A restrictive browser's blocked-autoplay event was not manually reproduced in this browser.
- [Mobile layout audit](./MOBILE_AUDIT_2026-10-02.md) records the remaining responsive issues separately. No broad mobile redesign is included here.

![Next-channel playback with sound after returning from clip details](/Users/jamesdombro/Documents/Cursor/CreativeControl.tv/docs/mobile-audit/2026-10-02/07-tv-playback.jpg)

## Release

Implemented on `codex/intent-aware-playback`. Review and merge are required before treating this as the production feature. The existing production deployment is unchanged by local verification.
