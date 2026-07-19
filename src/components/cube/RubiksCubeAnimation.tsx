import { CSSProperties } from 'react';

const SIZE = 160;
const HALF = SIZE / 2;

const COLORS: Record<string, string> = {
  W: '#f0f0f0',
  Y: '#ffd500',
  G: '#009b48',
  B: '#0046ad',
  O: '#ff5800',
  R: '#b71234',
};

const FACES: Record<string, string[]> = {
  front:  ['G', 'O', 'W', 'B', 'G', 'G', 'G', 'R', 'Y'],
  back:   ['B', 'Y', 'B', 'B', 'B', 'O', 'G', 'B', 'R'],
  left:   ['O', 'R', 'O', 'W', 'O', 'B', 'O', 'O', 'G'],
  right:  ['R', 'B', 'R', 'R', 'R', 'Y', 'W', 'R', 'O'],
  top:    ['W', 'G', 'W', 'W', 'W', 'R', 'B', 'W', 'W'],
  bottom: ['Y', 'Y', 'O', 'Y', 'Y', 'G', 'Y', 'R', 'Y'],
};

const FACE_TRANSFORMS: Record<string, string> = {
  front:  `translateZ(${HALF}px)`,
  back:   `rotateY(180deg) translateZ(${HALF}px)`,
  left:   `rotateY(-90deg) translateZ(${HALF}px)`,
  right:  `rotateY(90deg)  translateZ(${HALF}px)`,
  top:    `rotateX(90deg)  translateZ(${HALF}px)`,
  bottom: `rotateX(-90deg) translateZ(${HALF}px)`,
};

function CubeFace({ stickers }: { stickers: string[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '3px',
        padding: '4px',
        width: SIZE,
        height: SIZE,
        backgroundColor: '#111',
        borderRadius: '4px',
      }}
    >
      {stickers.map((code, i) => (
        <div
          key={i}
          style={{
            backgroundColor: COLORS[code],
            borderRadius: '3px',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.3)',
          }}
        />
      ))}
    </div>
  );
}

export default function RubiksCubeAnimation({ className }: { className?: string }) {
  const sceneStyle: CSSProperties = {
    width: SIZE,
    height: SIZE,
    perspective: 600,
  };

  const bodyStyle: CSSProperties = {
    width: SIZE,
    height: SIZE,
    position: 'relative',
    transformStyle: 'preserve-3d',
    animation: 'cube-spin 10s linear infinite',
  };

  return (
    <div className={className} style={sceneStyle}>
      <div style={bodyStyle}>
        {(Object.keys(FACES) as Array<keyof typeof FACES>).map((face) => (
          <div
            key={face}
            style={{
              position: 'absolute',
              width: SIZE,
              height: SIZE,
              transform: FACE_TRANSFORMS[face],
            }}
          >
            <CubeFace stickers={FACES[face]} />
          </div>
        ))}
      </div>
    </div>
  );
}
