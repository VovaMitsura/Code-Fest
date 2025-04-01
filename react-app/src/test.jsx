import React, { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";

const TokenTest = () => {
  const { getAccessToken } = useAuth();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Fetch token on component mount
  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = await getAccessToken();
      setToken(accessToken);
      console.log("Access token retrieved:", accessToken);
    } catch (err) {
      console.error("Error fetching token:", err);
      setError(err.message);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!token) return;

    navigator.clipboard
      .writeText(token)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error("Failed to copy token:", err);
      });
  };

  // Example of making an authenticated request
  const makeAuthenticatedRequest = async () => {
    if (!token) {
      setError("No token available. Please fetch token first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/text-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: "This is a test task created from TokenTest component",
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);
      alert(response.ok ? "Request successful!" : `Request failed: ${data.error}`);
    } catch (err) {
      console.error("API request failed:", err);
      setError(`Request failed: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Token Test Component</h1>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={fetchToken} disabled={loading} style={{ marginRight: "10px", padding: "8px 16px" }}>
          {loading ? "Fetching..." : "Get Token"}
        </button>

        <button onClick={makeAuthenticatedRequest} disabled={!token || loading} style={{ padding: "8px 16px" }}>
          Test API Request
        </button>
      </div>

      {error && <div style={{ color: "red", marginBottom: "15px" }}>Error: {error}</div>}

      {token && (
        <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "4px" }}>
          <h3>Your Access Token:</h3>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type='text'
              readOnly
              value={token}
              style={{
                flexGrow: 1,
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginRight: "10px",
                fontFamily: "monospace",
                fontSize: "14px",
              }}
            />
            <button onClick={copyToClipboard} style={{ padding: "8px 16px" }}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div style={{ marginTop: "10px" }}>
            <strong>Token length:</strong> {token.length} characters
          </div>
        </div>
      )}

      <div style={{ marginTop: "30px" }}>
        <h3>Usage Instructions:</h3>
        <ul>
          <li>Click "Get Token" to retrieve your authentication token</li>
          <li>Copy the token to use in API requests</li>
          <li>Click "Test API Request" to verify the token works with the API</li>
        </ul>

        <h4>Example curl command:</h4>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "15px",
            borderRadius: "4px",
            overflowX: "auto",
          }}
        >
          {`curl -X POST http://localhost:5000/api/text-tasks \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token || "YOUR_TOKEN_HERE"}" \\
  -d '{"text": "Remember to feed the cat tomorrow at 8am"}'`}
        </pre>
      </div>
    </div>
  );
};

export default TokenTest;
