import React from 'react'

export default function Modal({children, onClose}:{children:React.ReactNode, onClose?:()=>void}){
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center'}} onClick={onClose}>
      <div style={{background:'#fff',padding:16,borderRadius:8,minWidth:320}} onClick={e=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
