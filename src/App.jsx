import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    setCaptchaCode(code);
  };

  const handleCaptchaSubmit = () => {
    if (captchaInput === captchaCode) {
      setCaptchaVerified(true);
    } else {
      alert("Incorrect CAPTCHA. Please try again.");
      generateCaptcha();
      setCaptchaInput("");
    }
  };

  useEffect(() => {
    if (captchaVerified) {
      const fetchProducts = async () => {
        try {
          const response = await fetch("https://fakestoreapi.com/products");
          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }
          const data = await response.json();
          setProducts(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [captchaVerified]);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDragStart = (index) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedItemIndex !== null) {
      const updatedProducts = [...filteredProducts];
      const [removed] = updatedProducts.splice(indexOfFirstItem + draggedItemIndex, 1);
      updatedProducts.splice(indexOfFirstItem + index, 0, removed);
      setProducts(updatedProducts);
      setDraggedItemIndex(null);
    }
  };

  if (!captchaVerified) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h1>Verify CAPTCHA</h1>
        <div style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold", color: "teal" }}>
          {captchaCode}
        </div>
        <input
          type="text"
          value={captchaInput}
          onChange={(e) => setCaptchaInput(e.target.value)}
          placeholder="Enter the CAPTCHA"
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid black",
            marginBottom: "20px",
            width: "100%",
            maxWidth: "300px",
          }}
        />
        <br />
        <button
          onClick={handleCaptchaSubmit}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: "pointer",
            maxWidth: "300px",
          }}
        >
          Submit
        </button>
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Product Gallery</h1>
      <input
        type="text"
        placeholder="Search by product title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: "31%",
          padding: "10px",
          marginBottom: "20px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          maxWidth: "webkit-fill-available",
          margin: "0 auto",
        }}
      />
      <div className="product-grid" style={styles.productGrid}>
        {currentItems.map((product, index) => (
          <div
            key={product.id}
            className="product-card"
            style={styles.productCard}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
          >
            <img
              src={product.image}
              alt={product.title}
              className="product-image"
              style={styles.productImage}
            />
            <h3 className="product-title" style={styles.productTitle}>
              {product.title}
            </h3>
            <p className="product-price" style={styles.productPrice}>
              ${product.price}
            </p>
          </div>
        ))}
      </div>
      <div style={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            style={{
              ...styles.pageButton,
              backgroundColor: currentPage === index + 1 ? "#007bff" : "#f8f9fa",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "20px",
    marginTop: "70px",
  },
  productCard: {
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "15px",
    textAlign: "center",
    backgroundColor: "#fff",
    boxShadow:" rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px"
   
  },
  productImage: {
    width: "100%",
    height: "auto",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  productTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  productPrice: {
    fontSize: "16px",
    color: "#007bff",
  },
  pagination: {
    marginTop: "20px",
    textAlign: "center",
  },
  pageButton: {
    margin: "5px",
    padding: "10px 15px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    color: "#000",
    cursor: "pointer",
  },
  "@media (max-width: 768px)": {
    productGrid: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    productCard: {
      padding: "10px",
    },
    productTitle: {
      fontSize: "16px",
    },
    productPrice: {
      fontSize: "14px",
    },
    pagination: {
      marginTop: "15px",
    },
    pageButton: {
      padding: "8px 12px",
      fontSize: "14px",
    },
  },
  "@media (max-width: 480px)": {
    productGrid: {
      gridTemplateColumns: "1fr",
    },
    productTitle: {
      fontSize: "14px",
    },
    productPrice: {
      fontSize: "12px",
    },
    pageButton: {
      padding: "8px 10px",
      fontSize: "12px",
    },
    input: {
      width: "100%",
      padding: "8px",
      fontSize: "14px",
    },
    button: {
      width: "100%",
      padding: "10px",
      fontSize: "16px",
    },
  },
};

export default App;
