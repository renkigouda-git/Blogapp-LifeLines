import React, {useRef, useEffect} from 'react'

export default function RichEditor({ value='', onChange, placeholder='Write here…' }){
  const ref = useRef(null)

  useEffect(()=>{
    if(ref.current && value !== ref.current.innerText){
      ref.current.innerText = value || ''
    }
  }, [value])

  const exec = (cmd, val=null)=> document.execCommand(cmd, false, val)

  const handleInput = ()=>{
    const text = ref.current?.innerText || ''
    onChange && onChange(text)
  }

  return (
    <div className="card" style={{padding:'0.6rem'}}>
      <div className="flex gap" style={{flexWrap:'wrap', marginBottom:'.4rem'}}>
        <button className="btn btn-ghost" type="button" onClick={()=>exec('bold')}>Bold</button>
        <button className="btn btn-ghost" type="button" onClick={()=>exec('italic')}>Italic</button>
        <button className="btn btn-ghost" type="button" onClick={()=>exec('insertUnorderedList')}>• List</button>
        <button className="btn btn-ghost" type="button" onClick={()=>exec('insertOrderedList')}>1. List</button>
        <button className="btn btn-ghost" type="button" onClick={()=>{
          const url = prompt('Link URL:')
          if(url) exec('createLink', url)
        }}>Link</button>
        <button className="btn btn-ghost" type="button" onClick={()=>exec('removeFormat')}>Clear</button>
      </div>
      <div
        ref={ref}
        contentEditable
        className="input"
        style={{minHeight:180, whiteSpace:'pre-wrap'}}
        data-placeholder={placeholder}
        onInput={handleInput}
        suppressContentEditableWarning
      />
    </div>
  )
}
