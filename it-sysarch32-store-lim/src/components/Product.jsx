import React, { useState, useEffect } from 'react';
import { db, storage } from '../configs/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../App'; // Import CSS file

async function fetchDataFromFirestore() {
  const querySnapshot = await getDocs(collection(db, 'product'));
  const data = [];
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
}

function Product() {
  const [product, setProduct] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchDataFromFirestore();
      setProduct(data);
    }
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async (productId) => {
    if (!image) return;

    try {
      const storageRef = storage.ref();
      const imageRef = storageRef.child(image.name);
      await imageRef.put(image);
      const imageUrl = await imageRef.getDownloadURL();

      // Update the product in Firestore with the image URL
      await db.collection('product').doc(productId).update({
        product_img: imageUrl,
      });

      // Fetch updated data from Firestore
      const data = await fetchDataFromFirestore();
      setProduct(data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      {/* Header */}
      <header>
          <h1><Link to="/" className="header-link">Shane Anime Store</Link></h1>
       <hr />
      </header>
      
      <div className="image-above-products-div">
        <img src="https://firebasestorage.googleapis.com/v0/b/it-sysarch32-store-lim.appspot.com/o/naruto1.jpg?alt=media&token=38f9f41c-f2ca-433b-b0ec-223dfeb6606c" alt="Image Above Products" />
      </div>

      <div className='products-div'>
        <h1>Featured Products</h1>
        <div className="product-container">
          {product.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="card-link">
              <div className="card">
                {product.product_img ? (
                  <img
                    src={product.product_img}
                    alt="Product Image"
                    style={{ maxWidth: '200px' }}
                  />
                ) : (
                  <div>
                    <input type="file" onChange={handleImageChange} />
                    <button onClick={() => handleUpload(product.id)}>Upload Image</button>
                  </div>
                )}
                <p>{product.product_name}</p>
                <p>Price: ${product.product_price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer>
        <hr></hr>
        <p>&copy; 2024 Shane Anime Store. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Product;
