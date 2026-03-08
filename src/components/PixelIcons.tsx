/**
 * Pixel-art style icons for programming languages.
 * Rendered as simple SVG pixel grids using currentColor.
 */

const px = (x: number, y: number, s = 1) => (
  <rect key={`${x}-${y}`} x={x * 3} y={y * 3} width={3 * s} height={3} fill="currentColor" />
);

export const PixelReact = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 30 30" className={className} fill="none">
    {/* Atom-like: center dot + 3 orbits simplified as pixel cross */}
    {px(4, 4)}{px(5, 4)}{px(4, 5)}{px(5, 5)}
    {px(1, 3)}{px(2, 3)}{px(7, 3)}{px(8, 3)}
    {px(1, 6)}{px(2, 6)}{px(7, 6)}{px(8, 6)}
    {px(3, 1)}{px(3, 2)}{px(6, 1)}{px(6, 2)}
    {px(3, 7)}{px(3, 8)}{px(6, 7)}{px(6, 8)}
    {px(0, 4)}{px(0, 5)}{px(9, 4)}{px(9, 5)}
    {px(4, 0)}{px(5, 0)}{px(4, 9)}{px(5, 9)}
  </svg>
);

export const PixelTypeScript = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 30 30" className={className} fill="none">
    {/* T + S simplified */}
    {/* T */}
    {px(1, 1)}{px(2, 1)}{px(3, 1)}
    {px(2, 2)}{px(2, 3)}{px(2, 4)}{px(2, 5)}
    {/* S */}
    {px(5, 1)}{px(6, 1)}{px(7, 1)}
    {px(5, 2)}
    {px(5, 3)}{px(6, 3)}{px(7, 3)}
    {px(7, 4)}
    {px(5, 5)}{px(6, 5)}{px(7, 5)}
  </svg>
);

export const PixelRust = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 30 30" className={className} fill="none">
    {/* Gear/cog shape simplified */}
    {px(3, 0)}{px(4, 0)}{px(5, 0)}{px(6, 0)}
    {px(2, 1)}{px(7, 1)}
    {px(1, 2)}{px(8, 2)}
    {px(0, 3)}{px(9, 3)}
    {px(0, 4)}{px(4, 4)}{px(5, 4)}{px(9, 4)}
    {px(0, 5)}{px(4, 5)}{px(9, 5)}
    {px(0, 6)}{px(9, 6)}
    {px(1, 7)}{px(8, 7)}
    {px(2, 8)}{px(7, 8)}
    {px(3, 9)}{px(4, 9)}{px(5, 9)}{px(6, 9)}
  </svg>
);

export const PixelGo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 30 30" className={className} fill="none">
    {/* G letter */}
    {px(2, 1)}{px(3, 1)}{px(4, 1)}{px(5, 1)}{px(6, 1)}
    {px(1, 2)}{px(2, 2)}
    {px(1, 3)}
    {px(1, 4)}{px(5, 4)}{px(6, 4)}{px(7, 4)}
    {px(1, 5)}{px(7, 5)}
    {px(1, 6)}{px(2, 6)}{px(7, 6)}
    {px(2, 7)}{px(3, 7)}{px(4, 7)}{px(5, 7)}{px(6, 7)}
  </svg>
);

export const PixelPython = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 30 30" className={className} fill="none">
    {/* Two intertwined snakes simplified as pixel blocks */}
    {px(3, 0)}{px(4, 0)}{px(5, 0)}{px(6, 0)}
    {px(3, 1)}{px(4, 1)}
    {px(2, 2)}{px(3, 2)}{px(4, 2)}{px(5, 2)}{px(6, 2)}
    {px(2, 3)}{px(3, 3)}
    {px(2, 4)}{px(3, 4)}
    {px(6, 5)}{px(7, 5)}
    {px(6, 6)}{px(7, 6)}
    {px(3, 7)}{px(4, 7)}{px(5, 7)}{px(6, 7)}{px(7, 7)}
    {px(5, 8)}{px(6, 8)}
    {px(3, 9)}{px(4, 9)}{px(5, 9)}{px(6, 9)}
  </svg>
);

export const PixelNode = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 30 30" className={className} fill="none">
    {/* N shape */}
    {px(1, 1)}{px(1, 2)}{px(1, 3)}{px(1, 4)}{px(1, 5)}{px(1, 6)}{px(1, 7)}
    {px(2, 2)}{px(3, 3)}{px(4, 4)}{px(5, 5)}{px(6, 6)}
    {px(7, 1)}{px(7, 2)}{px(7, 3)}{px(7, 4)}{px(7, 5)}{px(7, 6)}{px(7, 7)}
  </svg>
);

const pixelIcons: Record<string, React.FC<{ className?: string }>> = {
  React: PixelReact,
  TypeScript: PixelTypeScript,
  Rust: PixelRust,
  Go: PixelGo,
  Python: PixelPython,
  "Node.js": PixelNode,
};

export default pixelIcons;
