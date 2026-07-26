# EXP Avatar V5 visual proof — asset provenance

This directory documents the third-party assets used only by the isolated
`/dev/avatar-v5` visual proof. These assets are not connected to the employee
avatar configuration or production avatar routes.

## Creator and licence

- Creator: Quaternius (`@Quaternius`)
- Licence: CC0 1.0 Universal — Public Domain Dedication
- Licence text: https://creativecommons.org/publicdomain/zero/1.0/
- Commercial use: permitted
- Modification: permitted
- Redistribution: permitted

The unmodified licence notices shipped in both downloaded archives are retained
next to this document:

- `Universal_Base_Characters_License_Standard.txt`
- `Modular_Character_Outfits_Fantasy_License_Standard.txt`

## Pack 1: Universal Base Characters

- Pack page: https://quaternius.com/packs/universalbasecharacters.html
- Original download page:
  https://quaternius.itch.io/universal-base-characters
- Downloaded archive: `Universal Base Characters[Standard].zip`
- Archive release shown by itch.io at download: 16 December 2025

Exact files retained:

- `quaternius/base/Superhero_Female_FullBody.gltf`
- `quaternius/base/Superhero_Female_FullBody.bin`
- `quaternius/base/T_Eye_Brown.png`
- `quaternius/base/T_Eye_Normal.png`
- `quaternius/base/T_Eye_Normal_png.png`
- `quaternius/base/T_Hair_2_BaseColor.png`
- `quaternius/base/T_Hair_2_Normal.png`
- `quaternius/base/T_Superhero_Female_Dark_BaseColor.png`
- `quaternius/base/T_Superhero_Female_Normal.png`
- `quaternius/base/T_Superhero_Female_Roughness.png`
- `quaternius/hair/Hair_Long.gltf`
- `quaternius/hair/Hair_Long.bin`
- `quaternius/hair/T_Hair_2_BaseColor.png`
- `quaternius/hair/T_Hair_2_Normal.png`

The retained hairstyle is the pack's `Rigged to Head Bone` glTF export so it
can follow the same compatible idle animation as the head and outfit.

The upstream `Superhero_Female_FullBody.gltf` references
`T_Eye_Normal_png.png`, while the Standard archive contains the same eye normal
texture as `T_Eye_Normal.png`. An identical alias copy was added under the
referenced filename so the original glTF can remain unchanged.

## Pack 2: Modular Character Outfits — Fantasy

- Pack page:
  https://quaternius.com/packs/modularcharacteroutfitsfantasy.html
- Original download page:
  https://quaternius.itch.io/modular-character-outfits-fantasy
- Downloaded archive:
  `Modular Character Outfits - Fantasy[Standard].zip`

Exact files retained:

- `quaternius/outfit/Female_Peasant.gltf`
- `quaternius/outfit/Female_Peasant.bin`
- `quaternius/outfit/T_Peasant_BaseColor.png`
- `quaternius/outfit/T_Peasant_Normal.png`
- `quaternius/outfit/T_Peasant_ORM.png`

The outfit pack is explicitly documented by its creator as compatible with the
Universal Base Characters. Its plain peasant outfit was selected because the
free Universal Base Characters pack contains base underwear but no top,
trousers, or shoes. This wardrobe is a technical compatibility candidate, not a
recommended production art direction for EXP.

## Pack 3: Universal Animation Library

- Pack page: https://quaternius.com/packs/universalanimationlibrary.html
- Original download page:
  https://quaternius.itch.io/universal-animation-library
- Downloaded archive: `Universal Animation Library[Standard].zip`

Exact files retained:

- `quaternius/animation/UAL1_Standard.glb`
- `Universal_Animation_Library_License.txt`

The Standard GLB is CC0 and contains the `Idle_Loop` animation used by the
proof. The library is explicitly documented by Quaternius as compatible with
the Universal Base Characters. Other clips in the source GLB are not played.

## Processing and runtime assembly

- The archives were downloaded from the official itch.io pages.
- Only the exact files listed above were copied into the repository.
- No geometry was generated, retopologised, sculpted, or replaced.
- The glTF, binary mesh data, and texture files remain otherwise unmodified.
- At runtime, the base character is clipped below the neck because the outfit
  pack is designed to use only the compatible base head. The imported outfit
  supplies the fitted body, arms/top, legs/bottoms, and feet/shoes.
- The three imported source files contain approximately 31,534 triangles in
  total before runtime clipping.
- The compatible `Idle_Loop` clip is applied independently to the base head,
  rigged hairstyle, and outfit skeletons. Reduced-motion and low-quality modes
  hold a neutral frame rather than continuously updating the animation.
