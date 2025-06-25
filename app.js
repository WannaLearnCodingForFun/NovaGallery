let signer, contract;

window.addEventListener("DOMContentLoaded", () => {
  const walletBtn = document.getElementById("connectWallet");
  const mintBtn = document.getElementById("mintBtn");
  const tokenURIInput = document.getElementById("tokenURI");
  const galleryList = document.getElementById("galleryList");
  const darkToggle = document.getElementById("darkToggle");

  darkToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark");
  });

  walletBtn.addEventListener("click", async () => {
    if (!window.ethereum) return alert("Install MetaMask.");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    alert("Wallet connected!");
    loadNFTs();
  });

  mintBtn.addEventListener("click", async () => {
    const uri = tokenURIInput.value.trim();
    if (!uri) return alert("Enter a valid token URI.");
    try {
      const tx = await contract.mintArt(uri);
      await tx.wait();
      alert("Minted!");
      tokenURIInput.value = "";
      loadNFTs();
    } catch (err) {
      console.error(err);
      alert("Mint failed.");
    }
  });

  async function loadNFTs() {
    if (!contract) return;
    try {
      const tokens = await contract.getMyTokens();
      galleryList.innerHTML = "";
      tokens.forEach(tokenId => {
        const li = document.createElement("li");
        li.textContent = `Token #${tokenId}`;
        galleryList.appendChild(li);
      });
    } catch (err) {
      console.error("Failed to load NFTs", err);
    }
  }
});
