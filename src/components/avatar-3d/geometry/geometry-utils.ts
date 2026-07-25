import {
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  Float32BufferAttribute,
  SphereGeometry,
  Vector3,
} from "three";

export type LoftRing = {
  y: number;
  radiusX: number;
  radiusZ: number;
  offsetX?: number;
  offsetZ?: number;
};

export function createEllipticalLoftGeometry(
  rings: LoftRing[],
  segments = 40,
) {
  const positions: number[] = [];
  const indices: number[] = [];

  for (const ring of rings) {
    for (let index = 0; index < segments; index += 1) {
      const angle = (index / segments) * Math.PI * 2;
      positions.push(
        (ring.offsetX ?? 0) + Math.cos(angle) * ring.radiusX,
        ring.y,
        (ring.offsetZ ?? 0) + Math.sin(angle) * ring.radiusZ,
      );
    }
  }

  for (let row = 0; row < rings.length - 1; row += 1) {
    for (let column = 0; column < segments; column += 1) {
      const next = (column + 1) % segments;
      const currentRow = row * segments;
      const nextRow = (row + 1) * segments;
      indices.push(
        currentRow + column,
        nextRow + column,
        nextRow + next,
        currentRow + column,
        nextRow + next,
        currentRow + next,
      );
    }
  }

  const bottomCenter = positions.length / 3;
  positions.push(0, rings[0].y, 0);
  const topCenter = positions.length / 3;
  positions.push(0, rings[rings.length - 1].y, 0);

  for (let column = 0; column < segments; column += 1) {
    const next = (column + 1) % segments;
    indices.push(bottomCenter, next, column);
    const topRow = (rings.length - 1) * segments;
    indices.push(topCenter, topRow + column, topRow + next);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function createDeformedSphereGeometry(
  scale: [number, number, number],
  deform?: (position: Vector3) => void,
  widthSegments = 40,
  heightSegments = 28,
) {
  const geometry = new SphereGeometry(1, widthSegments, heightSegments);
  const positions = geometry.getAttribute("position");
  const point = new Vector3();

  for (let index = 0; index < positions.count; index += 1) {
    point
      .fromBufferAttribute(positions, index)
      .multiply(new Vector3(...scale));
    deform?.(point);
    positions.setXYZ(index, point.x, point.y, point.z);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

export function createTaperedCurveGeometry(
  points: Vector3[],
  radiusStart: number,
  radiusEnd: number,
  tubularSegments = 18,
  radialSegments = 10,
) {
  const curve = new CatmullRomCurve3(points);
  const frames = curve.computeFrenetFrames(tubularSegments, false);
  const positions: number[] = [];
  const indices: number[] = [];

  for (let row = 0; row <= tubularSegments; row += 1) {
    const t = row / tubularSegments;
    const centre = curve.getPointAt(t);
    const radius =
      radiusStart +
      (radiusEnd - radiusStart) * t -
      Math.sin(t * Math.PI) * radiusStart * 0.06;
    const normal = frames.normals[row];
    const binormal = frames.binormals[row];

    for (let column = 0; column < radialSegments; column += 1) {
      const angle = (column / radialSegments) * Math.PI * 2;
      const offset = normal
        .clone()
        .multiplyScalar(Math.cos(angle) * radius)
        .add(binormal.clone().multiplyScalar(Math.sin(angle) * radius));
      positions.push(
        centre.x + offset.x,
        centre.y + offset.y,
        centre.z + offset.z,
      );
    }
  }

  for (let row = 0; row < tubularSegments; row += 1) {
    for (let column = 0; column < radialSegments; column += 1) {
      const next = (column + 1) % radialSegments;
      const currentRow = row * radialSegments;
      const nextRow = (row + 1) * radialSegments;
      indices.push(
        currentRow + column,
        nextRow + column,
        nextRow + next,
        currentRow + column,
        nextRow + next,
        currentRow + next,
      );
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function createRoundedShoeBaseGeometry(
  width: number,
  height: number,
  depth: number,
  toeLift: number,
) {
  const geometry = new BoxGeometry(width, height, depth, 8, 5, 12).toNonIndexed();
  const positions = geometry.getAttribute("position");
  const point = new Vector3();

  for (let index = 0; index < positions.count; index += 1) {
    point.fromBufferAttribute(positions, index);
    const front = Math.max(0, (point.z / depth + 0.5) * 1.35);
    const side = Math.abs(point.x) / (width * 0.5);
    point.x *= 0.94 - Math.max(0, front - 0.62) * 0.12;
    point.y += front ** 2 * toeLift;
    point.y += (1 - Math.min(1, side)) * 0.025;
    point.z += Math.sin(front * Math.PI) * 0.025;
    positions.setXYZ(index, point.x, point.y, point.z);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}
