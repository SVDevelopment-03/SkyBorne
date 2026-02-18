import OrderDetailPage from '@/components/Ecompages/OrderDetail'
import React from 'react'

const Page = ({ params }: { params: { id: string } }) => {
  return <OrderDetailPage params={params} />
}

export default Page
