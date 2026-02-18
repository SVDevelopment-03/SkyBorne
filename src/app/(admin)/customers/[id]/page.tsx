import CustomerProfilePage from '@/components/Ecompages/CustomerProfile'
import React from 'react'

const page = ({ params }: { params: { id: string } }) => {
  return (
    <CustomerProfilePage  params={params} />
  )
}

export default page