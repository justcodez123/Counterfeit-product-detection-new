import React, { useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './ProductAuthenticator.css';
import { ethers } from 'ethers';

function ProductAuthenticator() {
  const fileInputRef = useRef(null);
  const [decodedText, setDecodedText] = useState('');
  const [authResult, setAuthResult] = useState('');
  const [error, setError] = useState('');

  const companyAbi = [
    "function verifyProduct(uint256 _hashcode) view returns (string memory)"
  ];

  let productDetails = null;

  try {
    // Decode base64 only if it's encoded; skip if already JSON
    const decoded = decodedText.startsWith('{') ? decodedText : atob(decodedText);
    productDetails = JSON.parse(decoded);
  } catch (err) {
    console.error("Invalid QR JSON", err);
  }

  const verifyProductOnChain = async (contractAddress, productId) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://eth-sepolia.g.alchemy.com/v2/l0XrDQf1VjA1u8EN6_14S5I3tHo8FaB-"
      );

      const code = await provider.getCode(contractAddress);
      if (code === "0x") {
        setAuthResult("❌ Contract not found — product is likely counterfeit.");
        return;
      }

      const companyContract = new ethers.Contract(contractAddress, companyAbi, provider);
      const result = await companyContract.verifyProduct(productId);
      setAuthResult(`✅ Product verification result: ${result}`);
    } catch (err) {
      console.error("Blockchain verification failed:", err);
      setAuthResult("❌ Blockchain verification failed.");
    }
  
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const html5QrCode = new Html5Qrcode("reader");

    try {
      const result = await html5QrCode.scanFile(file, true);
      console.log("Decoded QR code:", result);
      setDecodedText(result);

      // Parse and extract data
      // console.log(parsedData)
      const parsedData = JSON.parse(result);
      const { companyContractAddress, productId } = parsedData;

      console.log("extracted data:", { companyContractAddress, productId });

      if (!companyContractAddress || !productId) {
        setAuthResult("❌ QR code is missing required fields.");
        return;
      }

      await verifyProductOnChain(companyContractAddress, productId);
    } catch (err) {
      console.error("Failed to decode file:", err);
    }

    
  };

  return (
    <div>
      <h1 className="heading">Upload QR Code</h1>
      <div className="App">
        <input
          className="auth-container"
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ marginBottom: '1rem' }}
        />

        <div id="reader" style={{ display: 'none' }}></div>

        {/* {decodedText && (
          <div className="product-info-box">
            <p><strong>Product Information:</strong> {decodedText}</p>
          </div>
        )} */}

        {authResult && (
          <div className="product-info-box">
            <p>{authResult}</p>
          </div>
        )}

        {productDetails && (
          <div className="product-info-box">
            <p><strong>Company Contract Address:</strong> {productDetails.companyContractAddress}</p>
            <p><strong>Product ID:</strong> {productDetails.productId}</p>
            <p><strong>Product Name:</strong> {productDetails.productName}</p>
            <p><strong>Product Brand:</strong> {productDetails.productBrand}</p>
          </div>
        )}

        {error && (
          <div style={{ color: 'red' }}>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductAuthenticator;