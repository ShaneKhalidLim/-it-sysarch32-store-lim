import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../configs/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51PF6IqRohvw4qWHydkjDdnECjvUSyD15ecUHkEw7DlC0zS0UPydwgJ3Lej0LlEFnhkRh7QuqZoeoi0zghFIEekl100rOvVcCJs');

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleClick = async (productName, price ) => {
    const stripe = await stripePromise;

    // Send a request to the backend to create a checkout session
    const response = await fetch('http://localhost:4000/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productName, price }), // Send product name and price to the backend
    });

    if (response.ok) {
      // If the request is successful, retrieve the session ID from the response
      const session = await response.json();

      // Redirect the user to the Stripe Checkout page using the session ID
      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        // If there is an error during the redirect, display the error message
        setError(result.error.message);
      }
    } else {
      // If there is an error creating the checkout session, display an error message
      setError('Error creating checkout session');
    }

    
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'product', id);
        const productSnapshot = await getDoc(productRef);
        if (productSnapshot.exists()) {
          setProduct({ id: productSnapshot.id, ...productSnapshot.data() });
        } else {
          setError('Product not found');
        }
      } catch (error) {
        setError('Error fetching product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div>
      <header>
        <h1><Link to="/" className="header-link">Shane Anime Store</Link></h1>
         <hr />
      </header>
      <div className="container">
        <div className="product-detail">
          {product.product_img && (
            <img src={product.product_img} alt="Product Image" style={{ maxWidth: '200px' }} />
          )}
          <div className="product-detail-details">
            <h1 className="black-text">Product Detail</h1>
            <p className="black-text">{product.product_name}</p>
            <p className="black-text">Description: {product.product_description}</p>
            <p className="black-text">Price: ${product.product_price}</p>
            <p className="black-text">Quantity: {product.product_quantity}</p>
            <button onClick={()=>handleClick(product.product_name, product.product_price*100)}>Checkout</button>
            <Link to="/" className="back-button">Back to Product</Link> {/* Back button to product page */}
          </div>
        </div>
      </div>
      <footer>
        <hr />
        <p>&copy; 2024 Shane Anime Store. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ProductDetail;