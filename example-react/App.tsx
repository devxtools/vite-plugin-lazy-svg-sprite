import { useState } from 'react'
import Svgs from 'virtual:svgs/react'
import SvgIcon from 'virtual:svg-icon/react'

const previewIcons = ['add', 'menu', 'score', 'download']

export default function App() {
  const [activeIcon, setActiveIcon] = useState('add')

  return (
    <div className="page">
      <h1>React</h1>
      <section>
        <h2>即时预览</h2>
        <div className="grid">
          {previewIcons.map((name) => (
            <div key={name} className="item">
              <SvgIcon name={name} lazy={false} className="icon" />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2>动态切换</h2>
        <SvgIcon name={activeIcon} color="#dc2626" className="icon" lazy={false} />
        <div className="controls">
          {previewIcons.map((name) => (
            <button key={name} type="button" onClick={() => setActiveIcon(name)}>
              {name}
            </button>
          ))}
        </div>
      </section>
      <Svgs />
    </div>
  )
}
