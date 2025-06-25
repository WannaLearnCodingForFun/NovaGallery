const connectWalletBtn = document.getElementById("connectWallet");
const mintBtn = document.getElementById("mintBtn");
const tokenURIInput = document.getElementById("tokenURI");
const tokenList = document.getElementById("tokenList");
const darkModeToggle = document.getElementById("darkModeToggle");

const CONTRACT_ADDRESS = "0x4434eaa80acec7a70dd9fdae39fc72d65f2f6f96";
const CONTRACT_ABI = [...] // Replace this with the ABI content you pasted

let signer;
let contract;

async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    alert("Wallet connected!");
    loadTokens();
  } else {
    alert("Install MetaMask first.");
  }
}

async function mintNFT() {
  const tokenURI = tokenURIInput.value;
  if (!tokenURI) return alert("Please enter a token URI.");
  try {
    const tx = await contract.mintArt(tokenURI);
    await tx.wait();
    alert("NFT minted!");
    loadTokens();
  } catch (e) {
    console.error(e);
    alert("Minting failed.");
  }
}

async function loadTokens() {
  tokenList.innerHTML = "";
  try {
    const tokenIds = await contract.getMyTokens();
    tokenIds.forEach(id => {
      const li = document.createElement("li");
      li.textContent = "Token ID: " + id;
      tokenList.appendChild(li);
    });
  } catch (e) {
    console.error("Failed to load tokens:", e);
  }
}

darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

connectWalletBtn.addEventListener("click", connectWallet);
mintBtn.addEventListener("click", mintNFT);
