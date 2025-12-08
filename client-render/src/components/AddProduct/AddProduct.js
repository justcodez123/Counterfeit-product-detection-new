import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";

import { QRCodeCanvas } from "qrcode.react";
import central_contract from "./Contractdata.json"; // Import ABI & Address
import './Product.css';

const AddProduct = () => {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [companyContractAddress, setCompanyContractAddress] = useState('');
    const [productId, setProductId] = useState('');
    const [manufactureId, setManufactureId] = useState('');
    const [productName, setProductName] = useState('');
    const [productBrand, setProductBrand] = useState('');
    const [loading, setLoading] = useState(false);
    const [updateStatus, setUpdateStatus] = useState('');
    const [qrValue, setQrValue] = useState('');

    const qrRef = useRef();

    useEffect(() => {
        // Connect to MetaMask and load contract
        async function loadBlockchainData() {
            if (window.ethereum) {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum); const signer = await provider.getSigner();
                    const accounts = await window.ethereum.request({ method: "eth_accounts" });

                    if (accounts.length > 0) {
                        setAccount(accounts[0]);

                        // Load contract
                        const deployedContract = new ethers.Contract(central_contract.address, central_contract.abi, signer);
                        setContract(deployedContract);
                    }
                } catch (error) {
                    console.error("Error loading blockchain data:", error);
                }
            }
        }

        loadBlockchainData();

        // Listen for account changes
        window.ethereum?.on("accountsChanged", (accounts) => {
            setAccount(accounts.length > 0 ? accounts[0] : null);
        });

    }, []);

    useEffect(() => {
        // Update QR value when form data changes
        setQrValue(JSON.stringify({ companyContractAddress, productId, manufactureId, productName, productBrand }));
    }, [companyContractAddress, productId, manufactureId, productName, productBrand]);

    const handleInputChange = (setter) => (e) => setter(e.target.value);

    const downloadQRCode = (e) => {
        e.preventDefault();
        let canvas = qrRef.current.querySelector("canvas");
        let image = canvas.toDataURL("image/png");
        let anchor = document.createElement("a");
        anchor.href = image;
        anchor.download = "qr-code.png";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    };

    const addProducts = async () => {
        if (!contract) {
            alert("Contract not loaded. Please check your wallet connection.");
            return;
        }

        try {
            const list = JSON.parse("[" + productId + "]");
            if (account && companyContractAddress && list) {
                setUpdateStatus("Validate the transaction through your wallet");
                setLoading(true);

                let transaction = await contract.addproduct(account, companyContractAddress, list);
                await transaction.wait();

                setUpdateStatus("\t ✅ Products Added Successfully!");
            } else {
                throw new Error("Please check that you are connected to a wallet and have provided all the fields.");
            }
        } catch (error) {
            console.error(error);
            alert(`\t Error: ${error.message}`);
            setUpdateStatus("\t ❌ Failed to add products.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='AddProduct'>
            <h3 className='Component__title'>Add Products</h3>
            <div className='Component__form'>
                <div className='form__content'>
                    <label className='form__label'>Contract Address</label>
                    <input type="text" className='form__input' value={companyContractAddress} onChange={handleInputChange(setCompanyContractAddress)} />
                </div>
                <div className='form__content'>
                    <label className='form__label'>Enter Product ID</label>
                    <input type="text" className='form__input' value={productId} onChange={handleInputChange(setProductId)} />
                </div>
                <div className='form__content'>
                    <label className='form__label'>Enter Manufacturer ID</label>
                    <input type="text" className='form__input' value={manufactureId} onChange={handleInputChange(setManufactureId)} />
                </div>
                <div className='form__content'>
                    <label className='form__label'>Enter Product Name</label>
                    <input type="text" className='form__input' value={productName} onChange={handleInputChange(setProductName)} />
                </div>
                <div className='form__content'>
                    <label className='form__label'>Enter Product Brand</label>
                    <input type="text" className='form__input' value={productBrand} onChange={handleInputChange(setProductBrand)} />
                </div>
                <button className='button__toggleAP form__button' onClick={addProducts} disabled={loading}>
                    {loading ? "Adding..." : "Add Product"}
                </button>
                <p style={{ whiteSpace: "pre-line", textAlign: "center" }}>{updateStatus}</p>
            </div>

            <div className="qrcode__container">
                <div ref={qrRef} className="qr_itself">
                    <QRCodeCanvas value={qrValue} size={300} bgColor={"#ffffff"} level={"H"} />
                </div>
                <button onClick={downloadQRCode} disabled={!qrValue} className="button__toggleQR">
                    Download QR code
                </button>
            </div>
        </div>
    );
};

export default AddProduct;