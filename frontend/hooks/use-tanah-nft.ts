import { useEffect, useState } from "react";
import { AppConfig, UserSession, showConnect, openContractCall, type UserData } from "@stacks/connect";
import { getStxBalance } from "@/lib/stx-utils";
import {
  getLastTokenId,
  getCertificate,
  mintCertificateTx,
  transferCertificateTx,
} from "@/lib/tanah-contract";

const appDetails = {
  name: "Tanah NFT",
  icon: "https://cryptologos.cc/logos/stacks-stx-logo.png",
};

const appConfig = new AppConfig(["store_write"]);
const userSession = new UserSession({ appConfig });

export function useTanahNft() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stxBalance, setStxBalance] = useState<number>(0);
  const [lastTokenId, setLastTokenId] = useState<number>(0);

  function connectWallet() {
    showConnect({
      appDetails,
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  }

  function disconnectWallet() {
    userSession.signUserOut();
    setUserData(null);
  }

  async function handleMintCertificate(
    pemilik: string,
    namaPemilik: string,
    alamatTanah: string,
    luasTanah: number,
    nomorSertifikat: string
  ) {
    if (!userData) throw new Error("User not connected");
    const txOptions = await mintCertificateTx(
      pemilik,
      namaPemilik,
      alamatTanah,
      luasTanah,
      nomorSertifikat
    );
    await openContractCall({
      ...txOptions,
      appDetails,
      onFinish: (data) => {
        window.alert("Mint sertifikat transaksi terkirim.");
      },
    });
  }

  async function handleTransferCertificate(
    tokenId: number,
    sender: string,
    recipient: string
  ) {
    if (!userData) throw new Error("User not connected");
    const txOptions = await transferCertificateTx(tokenId, sender, recipient);
    await openContractCall({
      ...txOptions,
      appDetails,
      onFinish: (data) => {
        window.alert("Transfer sertifikat transaksi terkirim.");
      },
    });
  }

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => setUserData(userData));
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  useEffect(() => {
    if (userData) {
      const address = userData.profile.stxAddress.testnet;
      getStxBalance(address).then(setStxBalance);
      getLastTokenId().then(setLastTokenId);
    }
  }, [userData]);

  return {
    userData,
    stxBalance,
    lastTokenId,
    connectWallet,
    disconnectWallet,
    handleMintCertificate,
    handleTransferCertificate,
    getCertificate,
  };
}