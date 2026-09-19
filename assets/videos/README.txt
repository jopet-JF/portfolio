This folder is empty on purpose.

The site references three optional video files by name. If a file isn't
here, that video container just falls back to its background gradient —
nothing breaks, nothing shows a broken-video icon.

Drop in files with these exact names to activate each container:

1. hero-loop.mp4 — no longer used.
   The hero now scrubs through the 300 individual JPEG frames in
   assets/videos/hero-frames/ instead, tied to scroll position (scroll
   down = play forward, scroll up = reverse). hero-loop.mp4 is still
   in this folder if you want it for something else, but the page
   doesn't reference it anymore. hero-poster.jpg is still used as the
   fallback image for browsers with JS disabled or reduced-motion on.

2. friday-loop.mp4 — still needed.
   Used in: the large FRIDAY case-study header.
   Suggested content: something more literal than the hero loop — a
   subtle system/interface motion, a waveform, or an abstract
   routing/network visual that echoes the "AgentManager routes a
   command" idea.
   Recommended: 1920x1080 or larger, 10–20s, muted-safe (no audio
   needed), H.264 MP4, under ~8MB if possible.

3. friday-system-loop.mp4 — still needed.
   Used in: the video frame inside the FRIDAY section, captioned
   "FRIDAY IN OPERATION."
   Suggested content: this is a good place for an actual screen
   recording of FRIDAY running — real footage will read as more
   credible here than another abstract loop.

All three videos are set to autoplay, muted, loop, playsinline — so
they work on mobile without a user tap, and never depend on audio.
