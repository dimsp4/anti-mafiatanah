;; NFT Sertifikat Tanah/Hak Milik (SIP-009 Implementation)

;; --- SIP-009 trait import ---
(impl-trait 'ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT.nft-trait.nft-trait)

;; --- Konstanta ---
;; Principal dummy BPN (ganti dengan principal wallet deployer/BPN asli jika perlu)
(define-constant BPN-principal 'ST1365YJEASHAXXBB6FPX826NFKYS8MHB1MTQVYJZ)

(define-constant err-bpn-only (err u100))        ;; Hanya BPN bisa mint
(define-constant err-not-owner (err u101))       ;; Hanya pemilik bisa transfer
(define-constant err-token-not-found (err u404)) ;; Token tidak ditemukan

;; --- NFT Definition ---
(define-non-fungible-token tanah-nft uint)

;; --- Data Variables ---
(define-data-var last-token-id uint u0)

;; --- Metadata Map (sertifikat tanah) ---
(define-map tanah-certificate uint
  {
    nama-pemilik: (string-ascii 64),
    alamat-tanah: (string-ascii 128),
    luas-tanah: uint,
    nomor-sertifikat: (string-ascii 32),
    diterbitkan-oleh: principal
  }
)

;; --- Fungsi SIP-009 Standar ---
(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

(define-read-only (get-token-uri (token-id uint))
  ;; Untuk demo, URI hanya base dan token-id
  (ok (some (concat "https://tanah-nft.example.com/cert/" (int-to-ascii token-id))))
)

(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? tanah-nft token-id))
)

;; --- Fungsi transfer SIP-009 (wajib 3 argumen: token-id, sender, recipient)
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-owner)
    (try! (nft-transfer? tanah-nft token-id sender recipient))
    (ok true)
  )
)

;; --- Fungsi mint untuk BPN
(define-public (mint (pemilik principal)
                     (nama-pemilik (string-ascii 64))
                     (alamat-tanah (string-ascii 128))
                     (luas-tanah uint)
                     (nomor-sertifikat (string-ascii 32)))
  (begin
    (asserts! (is-eq tx-sender BPN-principal) err-bpn-only)
    (let ((new-id (+ (var-get last-token-id) u1)))
      (try! (nft-mint? tanah-nft new-id pemilik))
      (map-set tanah-certificate new-id {
        nama-pemilik: nama-pemilik,
        alamat-tanah: alamat-tanah,
        luas-tanah: luas-tanah,
        nomor-sertifikat: nomor-sertifikat,
        diterbitkan-oleh: tx-sender
      })
      (var-set last-token-id new-id)
      (ok new-id)
    )
  )
)

;; --- Fungsi tambahan: get-certificate-info (Notaris/bank cek keaslian)
(define-read-only (get-certificate-info (token-id uint))
  (let ((meta (map-get? tanah-certificate token-id)))
    (if (is-some meta)
      (ok (unwrap! meta err-token-not-found))
      err-token-not-found
    )
  )
)