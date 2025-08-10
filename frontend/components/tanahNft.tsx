import { useState } from "react";
import { useTanahNft } from "@/hooks/use-tanah-nft";
import { abbreviateAddress, formatStx } from "@/lib/stx-utils";

export default function TanahNftUI() {
  const {
    userData,
    stxBalance,
    lastTokenId,
    connectWallet,
    disconnectWallet,
    handleMintCertificate,
    handleTransferCertificate,
    getCertificate,
  } = useTanahNft();

  const [mintForm, setMintForm] = useState({
    pemilik: "",
    namaPemilik: "",
    alamatTanah: "",
    luasTanah: "",
    nomorSertifikat: "",
  });
  const [transferForm, setTransferForm] = useState({
    tokenId: "",
    sender: "",
    recipient: "",
  });
  const [certificate, setCertificate] = useState<any>(null);
  const [certTokenId, setCertTokenId] = useState("");

  async function onMintSubmit(e: any) {
    e.preventDefault();
    await handleMintCertificate(
      mintForm.pemilik,
      mintForm.namaPemilik,
      mintForm.alamatTanah,
      Number(mintForm.luasTanah),
      mintForm.nomorSertifikat
    );
  }

  async function onTransferSubmit(e: any) {
    e.preventDefault();
    await handleTransferCertificate(
      Number(transferForm.tokenId),
      transferForm.sender,
      transferForm.recipient
    );
  }

  async function onCheckCert(e: any) {
    e.preventDefault();
    const cert = await getCertificate(Number(certTokenId));
    setCertificate(cert);
  }

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem" }}>
      <h1>Tanah NFT Demo</h1>
      {userData ? (
        <div style={{ marginBottom: "1rem" }}>
          <div>
            <strong>Wallet:</strong> {abbreviateAddress(userData.profile.stxAddress.testnet)}
          </div>
          <div>
            <strong>Balance:</strong> {formatStx(stxBalance)} STX
          </div>
          <button onClick={disconnectWallet} style={{ marginTop: "8px" }}>
            Disconnect
          </button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Stacks Wallet</button>
      )}

      <hr />

      <h2>Mint Sertifikat Tanah</h2>
      <form onSubmit={onMintSubmit} style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Principal Pemilik"
          value={mintForm.pemilik}
          onChange={(e) => setMintForm({ ...mintForm, pemilik: e.target.value })}
          required
          style={{ marginRight: "8px", marginBottom: "4px", width: "80%" }}
        />
        <input
          placeholder="Nama Pemilik"
          value={mintForm.namaPemilik}
          onChange={(e) => setMintForm({ ...mintForm, namaPemilik: e.target.value })}
          required
          style={{ marginRight: "8px", marginBottom: "4px", width: "80%" }}
        />
        <input
          placeholder="Alamat Tanah"
          value={mintForm.alamatTanah}
          onChange={(e) => setMintForm({ ...mintForm, alamatTanah: e.target.value })}
          required
          style={{ marginRight: "8px", marginBottom: "4px", width: "80%" }}
        />
        <input
          placeholder="Luas Tanah"
          type="number"
          value={mintForm.luasTanah}
          onChange={(e) => setMintForm({ ...mintForm, luasTanah: e.target.value })}
          required
          style={{ marginRight: "8px", marginBottom: "4px", width: "80%" }}
        />
        <input
          placeholder="Nomor Sertifikat"
          value={mintForm.nomorSertifikat}
          onChange={(e) => setMintForm({ ...mintForm, nomorSertifikat: e.target.value })}
          required
          style={{ marginRight: "8px", marginBottom: "4px", width: "80%" }}
        />
        <button type="submit">Mint</button>
      </form>

      <hr />

      <h2>Transfer Sertifikat</h2>
      <form onSubmit={onTransferSubmit} style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Token ID"
          type="number"
          value={transferForm.tokenId}
          onChange={(e) => setTransferForm({ ...transferForm, tokenId: e.target.value })}
          required
          style={{ marginRight: "8px", marginBottom: "4px" }}
        />
        <input
          placeholder="Sender Principal"
          value={transferForm.sender}
          onChange={(e) => setTransferForm({ ...transferForm, sender: e.target.value })}
          required
          style={{ marginRight: "8px", marginBottom: "4px" }}
        />
        <input
          placeholder="Recipient Principal"
          value={transferForm.recipient}
          onChange={(e) => setTransferForm({ ...transferForm, recipient: e.target.value })}
          required
          style={{ marginRight: "8px", marginBottom: "4px" }}
        />
        <button type="submit">Transfer</button>
      </form>

      <hr />

      <h2>Cek Sertifikat Tanah</h2>
      <form onSubmit={onCheckCert} style={{ marginBottom: "1rem" }}>
        <input
          type="number"
          placeholder="Token ID"
          value={certTokenId}
          onChange={(e) => setCertTokenId(e.target.value)}
          style={{ marginRight: "8px", marginBottom: "4px" }}
          required
        />
        <button type="submit">Cek Sertifikat</button>
      </form>
      {certificate && (
        <table border={1} cellPadding={7} style={{ marginTop: "1rem", width: "100%" }}>
          <tbody>
            <tr>
              <td><strong>Nama Pemilik</strong></td>
              <td>{certificate.namaPemilik}</td>
            </tr>
            <tr>
              <td><strong>Alamat Tanah</strong></td>
              <td>{certificate.alamatTanah}</td>
            </tr>
            <tr>
              <td><strong>Luas Tanah</strong></td>
              <td>{certificate.luasTanah}</td>
            </tr>
            <tr>
              <td><strong>Nomor Sertifikat</strong></td>
              <td>{certificate.nomorSertifikat}</td>
            </tr>
            <tr>
              <td><strong>Diterbitkan Oleh</strong></td>
              <td>{certificate.diterbitkanOleh}</td>
            </tr>
          </tbody>
        </table>
      )}

      <hr />
      <div>
        <strong>Last Token ID:</strong> {lastTokenId}
      </div>
    </div>
  );
}