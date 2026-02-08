import type { MarketAppScreenshot } from '../app-market.types'

interface AppScreenshotsProps {
  screenshots: MarketAppScreenshot[]
}

const AppScreenshots = ({ screenshots }: AppScreenshotsProps) => {
  if (screenshots.length === 0) return null

  return (
    <div className="px-5 py-4">
      <h3 className="text-[13px] font-semibold text-white/70 mb-3">Screenshots</h3>
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
        {screenshots.map((ss) => (
          <div
            key={ss.id}
            style={{
              flexShrink: 0,
              width: '200px',
              height: '130px',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              background: ss.url,
            }}
          >
            {ss.caption && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                {ss.caption}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AppScreenshots
