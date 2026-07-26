# EXP Avatar V5 production assets

This directory documents the imported assets used by the production Avatar V5
customizer. The approved `/dev/avatar-v5` reference assets remain separately
stored and unchanged under `public/avatar-v5`.

## Licence and redistribution

- Creator: Quaternius (`@Quaternius`)
- Licence: CC0 1.0 Universal - Public Domain Dedication
- Licence text: https://creativecommons.org/publicdomain/zero/1.0/
- Commercial use: permitted
- Modification: permitted
- Repository redistribution: permitted

The original licence notices shipped with each downloaded archive are retained
next to this file:

- `Universal_Base_Characters_License_Standard.txt`
- `Modular_Character_Outfits_Fantasy_License_Standard.txt`
- `Universal_Animation_Library_License.txt`

## Universal Base Characters

- Official pack page:
  https://quaternius.com/packs/universalbasecharacters.html
- Official download page:
  https://quaternius.itch.io/universal-base-characters
- Source archive: `Universal Base Characters[Standard].zip`

Retained base:

- `base/Superhero_Female_FullBody.gltf`
- `base/Superhero_Female_FullBody.bin`
- the eye, eyebrow/hair, skin normal, skin base-colour, and skin roughness
  textures referenced by that glTF

Retained rigged hairstyles:

- `hair/Hair_Long.gltf` and `Hair_Long.bin`
- `hair/Hair_Buns.gltf` and `Hair_Buns.bin`

Both hairstyles come from the pack's `Rigged to Head Bone` glTF export. Two
additional source-pack candidates were tested and rejected because their
silhouettes did not read correctly on the approved head. They are not included
in the production repository.

## Modular Character Outfits - Fantasy

- Official pack page:
  https://quaternius.com/packs/modularcharacteroutfitsfantasy.html
- Official download page:
  https://quaternius.itch.io/modular-character-outfits-fantasy
- Source archive:
  `Modular Character Outfits - Fantasy[Standard].zip`

The creator explicitly documents this pack as compatible with Universal Base
Character heads and the Universal Animation Library.

Retained modular fitted parts:

- `Female_Peasant_Body`
- `Female_Peasant_Arms`
- `Female_Peasant_Legs`
- `Female_Peasant_Feet`
- `Female_Ranger_Body`
- `Female_Ranger_Arms`
- `Female_Ranger_Legs`
- `Female_Ranger_Feet`

Each name above retains its matching `.gltf` and `.bin` file. The original and
alternate artist-authored base-colour textures are retained for the Peasant and
Ranger families, together with their normal and ORM textures. The Ranger arms
also retain the compatible Regular Female skin textures required for exposed
hands.

The wardrobe is a high-quality compatible customization foundation, but its
fantasy direction is still a limitation for an employee product. No
incompatible modern garment was substituted merely to increase option count.

## Universal Animation Library

- Official pack page:
  https://quaternius.com/packs/universalanimationlibrary.html
- Official download page:
  https://quaternius.itch.io/universal-animation-library
- Source archive: `Universal Animation Library[Standard].zip`

Only the compatible `Idle_Loop` clip is retained in
`animation/Idle_Loop.glb`. No other animation clips or animation-library scene
meshes are loaded by the production avatar.

## Repository processing

The source assets are CC0 and permit these modifications:

- Runtime textures were resized to a maximum of 1024 by 1024 pixels and
  recompressed as PNG with `sharp-cli` 5.2.0.
- The animation library was reduced to `Idle_Loop`, resampled, pruned, and
  quantized with `@gltf-transform/cli` 4.2.1.
- Hair glTF texture references were redirected to shared optimized textures to
  avoid duplicate payload.
- Geometry, rig weights, UVs, normal maps, ORM maps, and the approved character
  proportions were not redesigned or procedurally replaced.
- Clothing colour options switch between artist-authored texture variants.
  They do not replace textured materials with flat colours.

## Payload

- Approved proof asset directory before production optimization:
  60,092,962 bytes (57.31 MiB)
- Production runtime asset library (licence documents excluded):
  16,907,519 bytes (16.12 MiB)
- Default initially selected visible avatar:
  8,746,446 bytes (8.34 MiB)

Alternative hair and garment assets load only when selected. Browser and Three
asset caches reuse textures and geometry within the session.
