
import React from 'react'
import ProductsPage from './productClient';
export const metadata = {
  title: "Products",
  description: "Products Page",
};

function page() {
  return (
    <>
    <ProductsPage />
    </>
  )
}

export default page