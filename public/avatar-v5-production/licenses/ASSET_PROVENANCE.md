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
- `base/Superhero_Male_FullBody.gltf`
- `base/Superhero_Male_FullBody.bin`
- the eye, eyebrow/hair, skin normal, skin base-colour, and skin roughness
  textures referenced by that glTF

Retained rigged hairstyles:

- `hair/Hair_Long.gltf` and `Hair_Long.bin`
- `hair/Hair_Buns.gltf` and `Hair_Buns.bin`
- `hair/Hair_Buzzed.gltf` and `Hair_Buzzed.bin`
- `hair/Hair_BuzzedFemale.gltf` and `Hair_BuzzedFemale.bin`
- `hair/Hair_SimpleParted.gltf` and `Hair_SimpleParted.bin`

All five hairstyles come from the pack's `Rigged to Head Bone` glTF export.
They use the approved Universal rig and were reviewed from front, side, and
rear views before production integration.

Retained compatible facial hair:

- `hair/Hair_Beard.gltf` and `Hair_Beard.bin`

The beard uses the same Universal head rig and follows the existing idle
animation. The matching Hair 1 colour and normal textures are retained in the
shared production texture directory.

## Eye colour variants

The free Standard archive provides the artist-authored brown eye texture.
Production also includes blue, green, hazel, and grey variants generated from
that source texture with a strict iris mask. The process preserves the pupil,
highlights, eye whites, surrounding face pixels, UV layout, and original eye
normal map. No replacement eye geometry or floating overlay is used.

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
- `Male_Peasant_Body`
- `Male_Peasant_Arms`
- `Male_Peasant_Legs`
- `Male_Peasant_Feet`
- `Male_Ranger_Body`
- `Male_Ranger_Arms`
- `Male_Ranger_Legs`
- `Male_Ranger_Feet_Boots`

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
  Four additional curated palettes (navy, forest, burgundy, and charcoal) are
  generated from the artist-authored base-colour maps. UV detail, normal maps,
  ORM maps, seams, material depth, and shadows remain intact; palettes do not
  replace textured materials with flat colours.
- Avatar V6 adds six more restrained derived fabric palettes: ocean, sage,
  wine, sand, graphite, and cloud. These are generated from the same CC0
  base-colour maps while retaining the source UV layout, normal maps, ORM maps,
  painted seams, and material response.
- Modern collars, plackets, ribbing, lapels, fasteners, soles, laces, glasses,
  ears, a watch, and a necklace are original repository code geometry. They do
  not introduce external artwork or additional licence obligations.
- `scripts/avatar-v5/build-avatar-v6-assets.mjs` reproducibly adds the second
  compatible base frame, its matching fitted modular garments, redirects shared
  textures, and generates the V6 fabric palettes.
- `scripts/avatar-v5/promote-approved-v5-expansion.mjs` reproducibly copies the
  approved compatible assets and generates the derived eye and outfit textures.

## Payload

- Approved proof asset directory before production optimization:
  60,092,962 bytes (57.31 MiB)
- Production runtime asset library after the approved customization expansion
  (licence documents excluded): 28,246,506 bytes (26.94 MiB)
- Default initially selected visible avatar:
  8,746,446 bytes (8.34 MiB)

The default initial payload is unchanged. Alternative hair, eye, and garment
palette assets load only when selected. Browser and Three asset caches reuse
textures and geometry within the session.
