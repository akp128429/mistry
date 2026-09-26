# Mistry

Mistry is a browser-first experimental app for:

- Face-to-face visual similarity scoring
- Palm image statistics + clearly labelled traditional palmistry interpretation
- DOB-based numerology-style symbolic profiles

## Important boundary

The measurable image metrics are algorithmic. Palmistry and numerology are cultural/entertainment interpretations and are **not scientifically validated methods for predicting a person's future, health, character, or life outcomes**.

The face module is an MVP visual comparator, not production-grade biometric authentication.

## Local run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Production build

```bash
npm run build
```

The app is configured as a static export for GitHub Pages.

## Privacy

In this MVP, selected images are processed in the browser and are not uploaded to an application server.
