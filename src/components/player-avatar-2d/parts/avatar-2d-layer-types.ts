import type {
  PlayerAvatar2DPalette,
  PlayerAvatar2DPose,
  PlayerAvatar2DState,
} from "../config/player-avatar-2d-types";

export type Avatar2DLayerProps = {
  palette: PlayerAvatar2DPalette;
  pose: PlayerAvatar2DPose;
  state: PlayerAvatar2DState;
  ids: {
    skin: string;
    skinShade: string;
    hair: string;
    jacket: string;
    trousers: string;
    shoe: string;
    blush: string;
  };
};
