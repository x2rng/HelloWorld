# Avatar V5 wardrobe audit tools

`build-wardrobe-lab-assets.mjs` is an offline development pipeline for the
isolated `/dev/avatar-v5-wardrobe` laboratory.

It:

- reads the official free Quaternius CC0 source distributions;
- inventories skeletons, mesh sections, bounds, materials, and animations;
- compares candidate skeletons with the protected Avatar V5 Universal rig;
- retains only one idle clip for complete legacy-family previews;
- removes weapon nodes from workplace previews;
- deduplicates and prunes glTF data;
- generates masked, lab-only iris colour variants;
- creates a machine-readable compatibility report;
- writes only to `public/avatar-v5-wardrobe-lab` and the lab report directory.

Run from the repository root:

```powershell
node scripts/avatar-v5/build-wardrobe-lab-assets.mjs `
  --universal "C:\path\to\Universal Base Characters[Standard]" `
  --women "C:\path\to\women\Individual Characters\glTF" `
  --men "C:\path\to\men\Individual Characters\glTF" `
  --manifest "C:\path\to\drive-manifest.json"
```

The script deliberately does not alter `public/avatar-v5-production` or any
employee route.
