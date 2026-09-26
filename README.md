# Mistry — Astrology + Palmistry Lab

Mistry is a privacy-first experimental web app that separates **calculation**, **image measurement**, **traditional interpretation**, and **uncertainty**.

## Current modules

- Full name + DOB + birth-place profile
- Optional birth time and explicit unknown-time mode
- Numerology calculations: Life Path, Birth Number, Expression, Soul Urge, Personality, Personal Year
- Astrology calculation-readiness desk that refuses to invent Lagna, houses, Moon degree or Nakshatra without an ephemeris-grade calculation
- Birth Time Rectification workspace for capturing dated milestones
- Dual-palm browser-side image analysis: edge density, contrast, brightness and orientation statistics
- Mistry Fusion Engine for cross-layer symbolic agreement
- Symbolic age-cycle explorer
- Explainability and output-type labels throughout

## Scientific boundary

Astronomical positions can be mathematically calculated when the required data and ephemeris are available. Astrology, palmistry and numerology interpretations are **not scientifically validated methods for predicting a person's future, personality, job, marriage, lifespan, health or wealth**.

Mistry therefore does not fabricate exact spouse names, death ages, employers, salaries or guaranteed future dates. A fusion/agreement score describes agreement between Mistry's symbolic layers, not real-world prediction probability.

## Privacy

Palm images in this static prototype are processed locally in the browser and are not uploaded to an application server.

## Run

```bash
npm install
npm run dev
```

The production build uses Next.js static export and is configured for GitHub Pages.
