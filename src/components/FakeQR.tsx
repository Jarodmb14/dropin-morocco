interface FakeQRProps {
  value: string;
  size?: number; // px
}

// Very small pseudo-QR: deterministic grid based on hash of value (not scannable, placeholder)
function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return h >>> 0;
}

const FakeQR = ({ value, size = 160 }: FakeQRProps) => {
  const dim = 21; // grid
  const cell = Math.floor(size / dim);
  const pad = Math.floor((size - dim * cell) / 2);
  const seed = hashString(value);
  const bits: boolean[] = [];
  let n = seed;
  for (let i = 0; i < dim * dim; i++) {
    // xorshift-ish
    n ^= n << 13;
    n ^= n >>> 17;
    n ^= n << 5;
    bits.push(((n >>> 0) & 1) === 1);
  }
  // Ensure finder-like corners
  const index = (r: number, c: number) => r * dim + c;
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) {
      const edge = r === 0 || r === 6 || c === 0 || c === 6;
      const fill = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      bits[index(r, c)] = edge || fill;
      bits[index(r, dim - 1 - c)] = edge || fill;
      bits[index(dim - 1 - r, c)] = edge || fill;
    }
  }

  return (
    <div style={{ width: size, height: size, background: '#fff', padding: pad, boxSizing: 'content-box', borderRadius: 12, boxShadow: '0 8px 20px rgba(0,0,0,0.12)', border: '2px solid #F59E0B' }}>
      <div style={{ width: dim * cell, height: dim * cell, display: 'grid', gridTemplateColumns: `repeat(${dim}, ${cell}px)` }}>
        {bits.map((b, i) => (
          <div key={i} style={{ width: cell, height: cell, background: b ? '#111827' : '#ffffff' }} />
        ))}
      </div>
    </div>
  );
};

export default FakeQR;
