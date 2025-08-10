import { STACKS_TESTNET } from "@stacks/network";
import {
  fetchCallReadOnlyFunction,
  uintCV,
  principalCV,
  stringAsciiCV,
  cvToValue,
  PostConditionMode,
  ClarityType,
  UIntCV,
  TupleCV,
  tupleCV,
} from "@stacks/transactions";

const CONTRACT_ADDRESS = "ST1365YJEASHAXXBB6FPX826NFKYS8MHB1MTQVYJZ";
const CONTRACT_NAME = "sertifikat-tanah-nft";

export type Certificate = {
  id: number;
  namaPemilik: string;
  alamatTanah: string;
  luasTanah: number;
  nomorSertifikat: string;
  diterbitkanOleh: string;
};

export async function getLastTokenId() {
  const result = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "get-last-token-id",
    functionArgs: [],
    senderAddress: CONTRACT_ADDRESS,
    network: STACKS_TESTNET,
  }) as any;

  return Number(result.value.value as bigint);
}

export async function getCertificate(tokenId: number): Promise<Certificate | null> {
  const result = await fetchCallReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "get-certificate-info",
    functionArgs: [uintCV(tokenId)],
    senderAddress: CONTRACT_ADDRESS,
    network: STACKS_TESTNET,
  }) as TupleCV;

  if (!result.value) return null;
  const cert: any = result.value.value
  
  return {
    id: tokenId,
    namaPemilik: cert["nama-pemilik"].value,
    alamatTanah: cert["alamat-tanah"].value,
    luasTanah: parseInt(cert["luas-tanah"].value),
    nomorSertifikat: cert["nomor-sertifikat"].value,
    diterbitkanOleh: cert["diterbitkan-oleh"].value,
  };
}

export async function mintCertificateTx(
  pemilik: string,
  namaPemilik: string,
  alamatTanah: string,
  luasTanah: number,
  nomorSertifikat: string
) {
  return {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "mint",
    functionArgs: [
      principalCV(pemilik),
      stringAsciiCV(namaPemilik),
      stringAsciiCV(alamatTanah),
      uintCV(luasTanah),
      stringAsciiCV(nomorSertifikat),
    ],
    network: STACKS_TESTNET,
    postConditionMode: PostConditionMode.Allow,
  };
}

export async function transferCertificateTx(
  tokenId: number,
  sender: string,
  recipient: string
) {
  return {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "transfer",
    functionArgs: [
      uintCV(tokenId),
      principalCV(sender),
      principalCV(recipient),
    ],
    network: STACKS_TESTNET,
    postConditionMode: PostConditionMode.Allow,
  };
}