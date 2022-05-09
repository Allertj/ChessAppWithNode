import React from 'react'
import { useDrag } from 'react-dnd'

function Piece({piece, typeletter, clickfunc, id}: any) {
  const [{isDragging}, drag] = useDrag(() => (
    {
    type: "Piece",
    item : { id, piece }, 
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
      
    }),
  }))
  React.useEffect(() => {
      if (isDragging) {
        clickfunc(id)
      } 
  }, [isDragging])

  return (
    <div ref={drag}
        style={{
        transform: 'translate(0, 0)',   
        fontSize: 55,
        cursor: 'move',
      }}>{piece}</div>)
}

export { Piece }