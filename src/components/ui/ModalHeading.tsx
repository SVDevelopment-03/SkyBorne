import React from 'react'

const ModalHeading = ({title}:{title:string}) => {
  return (
      <h1 className="sticky top-0 z-10 bg-white text-[24px] font-bold font-satoshi-500 text-[#494949]">{title}</h1>
  )
}

export default ModalHeading