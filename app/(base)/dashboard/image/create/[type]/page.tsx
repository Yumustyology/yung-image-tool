import Header from '@/components/organisms/Header'
import { imageToolTypes } from '@/constants'
import React from 'react'

const Create = ({params: {type}}:SearchParamProps) => {
  const imageToolInfo = imageToolTypes[type]
  return (
    <div>
      <Header title={imageToolInfo.title} subtitle={imageToolInfo.subTitle} />
      Create
    </div>
  )
}

export default Create