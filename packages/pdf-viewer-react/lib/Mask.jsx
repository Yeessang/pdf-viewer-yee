

export default function Mask({
  progress,
  children
}) {
  return (
    <div
      className="pdf-mask-wrapper"
    >
      <div className="pdf-small-menu">
        <div className="pdf-mask-content">
          <div className="pdf-mask-progress" style={{ transform: `translateX(${progress - 100}%)` }}></div>
        </div>
        { children }
      </div>
    </div>
  )
}