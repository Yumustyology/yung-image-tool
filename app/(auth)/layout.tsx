import React, { ReactNode } from 'react'

export const layout = ({children}:{children:ReactNode}) => {
  return (
    <div className='auth'>{children}</div>
  )
}

export default layout