import React, { useState, useEffect, useCallback } from "react";
import { getCentralContract } from "./centralContract"; // Import contract helper
import "./CreateContract.css";

const DeployContract = ({ account: parentAccount }) => {
    const [account, setAccount] = useState(parentAccount || null); // Local state for account
    const [contractAddress, setContractAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updateStatus, setUpdateStatus] = useState("");

    // Fetch active account if not passed as prop
    const fetchActiveAccount = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            if (accounts.length > 0) {
                setAccount(accounts[0]);
            }
        }
    };

    // Fetch contract address
    const fetchContractAddress = useCallback(async () => {
        try {
            if (!account) {
                setUpdateStatus("Please connect your wallet first.");
                return;
            }

            const central = await getCentralContract();
            if (!central) throw new Error("Central contract not found.");

            const address = await central.getCompanySmartContractAddress(account);
            if (!address || address === "0x0000000000000000000000000000000000000000") {
                setUpdateStatus("No contract found. Click 'Create Contract'.");
                setContractAddress(null);
            } else {
                setContractAddress(address);
                setUpdateStatus("Contract found at :");
            }
        } catch (error) {
            showErrorMessage(error);
        }
    }, [account]);

    // Fetch account on mount if not already set
    useEffect(() => {
        if (!account) {
            fetchActiveAccount();
        }
    }, [account]);

    // Fetch contract when account changes
    useEffect(() => {
        if (account) {
            fetchContractAddress();
        }
    }, [account, fetchContractAddress]);

    // Show error message in alert
    const showErrorMessage = (error) => {
        setLoading(false);
        console.error("Error:", error);
        alert(`An error occurred: ${error.message}`);
    };

    // Deploy a new contract
    const createContract = async () => {
        try {
            if (!account) throw new Error("Please connect to MetaMask before creating a contract.");

            setUpdateStatus("Validate the transaction through your wallet...");
            setLoading(true);

            const central = await getCentralContract();
            if (!central) throw new Error("Central contract not found.");

            const transaction = await central.createSmartContract();
            await transaction.wait(); // Wait for transaction confirmation

            await fetchContractAddress(); // Fetch updated contract address
            setUpdateStatus("Contract created at :");
            setLoading(false);
        } catch (error) {
            showErrorMessage(error);
        }
    };

    return (
        <div className="DeployContract">
            <h3 className="Component__title">Create My Contract</h3>
            <button className="button__toggleCC" onClick={createContract}>
                Create Contract
            </button>
            <div className="Component__info">
                <p className="Component__account">Connected Account : {account || "Not Connected"}</p>
                {loading ? (
                    <div>Transaction in progress... It can take a few minutes</div>
                ) : (
                    <p className="Component__address">{updateStatus} {contractAddress}</p>
                )}
            </div>
        </div>
    );
};

export default DeployContract;
