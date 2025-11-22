import { useEffect, useState } from 'react'

export default function QRCode({ size = 200, data = '' }) {
  const [qrPattern, setQrPattern] = useState([])

  useEffect(() => {
    generateQRPattern()
  }, [data, size])

  const generateQRPattern = () => {
    const gridSize = 25 // QR code grid size
    const pattern = []
    
    // Create random pattern based on data
    const seed = data ? data.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : Math.random() * 1000
    
    for (let i = 0; i < gridSize; i++) {
      const row = []
      for (let j = 0; j < gridSize; j++) {
        // Create more realistic QR pattern with corners and alignment
        const isCorner = (i < 7 && j < 7) || (i < 7 && j >= gridSize - 7) || (i >= gridSize - 7 && j < 7)
        const isAlignment = (i >= 16 && i <= 20 && j >= 16 && j <= 20)
        
        if (isCorner || isAlignment) {
          // Fixed patterns for corners and alignment
          row.push((i + j) % 2 === 0 ? 1 : 0)
        } else {
          // Random pattern for data area
          const random = Math.sin(seed + i * 7 + j * 13) * 10000
          row.push(random - Math.floor(random) > 0.5 ? 1 : 0)
        }
      }
      pattern.push(row)
    }
    
    setQrPattern(pattern)
  }

  const cellSize = size / qrPattern.length

  return (
    <div 
      className="bg-white p-2 rounded border-2 border-gray-300 inline-block"
      style={{ width: size + 16, height: size + 16 }}
    >
      <div className="grid gap-0" style={{ 
        gridTemplateColumns: `repeat(${qrPattern.length}, ${cellSize}px)`,
        width: size,
        height: size
      }}>
        {qrPattern.map((row, i) => 
          row.map((cell, j) => (
            <div 
              key={`${i}-${j}`}
              className={cell ? 'bg-black' : 'bg-white'}
              style={{ width: cellSize, height: cellSize }}
            />
          ))
        )}
      </div>
    </div>
  )
}