import { ImageResponse } from 'next/og'
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// This function literally draws your favicon!
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: 'linear-gradient(to bottom right, #3b82f6, #1d4ed8)', // Beautiful blue gradient
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '8px', // Slightly rounded corners
          fontWeight: 'bold',
        }}
      >
        💬
      </div>
    ),
    {
      ...size,
    }
  )
}