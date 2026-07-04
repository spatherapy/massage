const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const bookingForm = document.querySelector("[data-booking-form]");
const formStatus = document.querySelector("[data-form-status]");
const coinOptions = document.querySelectorAll("[data-coin]");
const cryptoSelection = document.querySelector("[data-crypto-selection]");
const walletAddress = document.querySelector("[data-wallet-address]");
const copyWalletButton = document.querySelector("[data-copy-wallet]");
const qrImage = document.querySelector("[data-qr-image]");
const qrCaption = document.querySelector("[data-qr-caption]");
const networkWarning = document.querySelector("[data-network-warning]");
const serviceChoices = document.querySelectorAll("[data-booking-service]");
const timeChoices = document.querySelectorAll("[data-booking-time]");
const selectedServiceInput = document.querySelector("[data-selected-service]");
const selectedTimeInput = document.querySelector("[data-selected-time]");
const bookingConfirmation = document.querySelector("[data-booking-confirmation]");
const confirmationDetail = document.querySelector("[data-confirmation-detail]");
let selectedCoin = "BTC";
let selectedService = "90 minute deep tissue massage";
let selectedTime = "Tuesday at 11:00 AM";

const coinPayments = {
  BTC: {
    address: "3Efo29we8TZXGrGRXtoFcyBCHtoHc2gqFQ",
    qrData: "bitcoin:3Efo29we8TZXGrGRXtoFcyBCHtoHc2gqFQ",
    caption: "Scan to send BTC deposit",
    warning: "Send only BTC to this Bitcoin address.",
  },
  ETH: {
    address: "0x3A6C8688cacCf4bE05722cf43A68e45adF011A5A",
    qrData: "ethereum:0x3A6C8688cacCf4bE05722cf43A68e45adF011A5A",
    caption: "Scan to send ETH deposit",
    warning: "Send only ETH on the Ethereum network to this address.",
  },
  USDT: {
    address: "TAeNsaRvzf6nwK8917bbBmepTnL9d922hQ",
    qrData: "tron:TAeNsaRvzf6nwK8917bbBmepTnL9d922hQ",
    caption: "Scan to send USDT TRC-20 deposit",
    warning: "Send only USDT on TRC-20 to this address.",
  },
};

const qrUrl = (value) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=12&data=${encodeURIComponent(value)}`;

const updateCoinPayment = () => {
  const payment = coinPayments[selectedCoin] || coinPayments.BTC;
  if (cryptoSelection) {
    cryptoSelection.textContent = `${selectedCoin} deposit selected`;
  }
  if (walletAddress) {
    walletAddress.textContent = payment.address;
  }
  if (qrImage) {
    qrImage.src = qrUrl(payment.qrData);
    qrImage.alt = `${selectedCoin} wallet QR code`;
  }
  if (qrCaption) {
    qrCaption.textContent = payment.caption;
  }
  if (networkWarning) {
    networkWarning.textContent = payment.warning;
  }
  if (copyWalletButton) {
    copyWalletButton.textContent = "Copy Wallet Address";
  }
};

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open") ?? false;
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open menu");
  }
});

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const name = String(data.get("name") || "").trim();
  const service = String(data.get("session") || selectedService);
  const time = String(data.get("time") || selectedTime);
  formStatus.textContent = name
    ? `Thanks, ${name}. Your request is ready for deposit.`
    : "Your request is ready for deposit.";
  if (confirmationDetail) {
    confirmationDetail.textContent = `${service} · ${time}`;
  }
  bookingConfirmation?.classList.add("is-visible");
});

coinOptions.forEach((option) => {
  option.addEventListener("click", () => {
    coinOptions.forEach((item) => item.classList.remove("is-selected"));
    option.classList.add("is-selected");
    selectedCoin = option.dataset.coin || "BTC";
    updateCoinPayment();
  });
});

copyWalletButton?.addEventListener("click", async () => {
  const address = coinPayments[selectedCoin]?.address || "";
  try {
    await navigator.clipboard.writeText(address);
    copyWalletButton.textContent = "Wallet Address Copied";
  } catch {
    copyWalletButton.textContent = "Copy unavailable";
  }
});

serviceChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    serviceChoices.forEach((item) => item.classList.remove("is-selected"));
    choice.classList.add("is-selected");
    selectedService = choice.dataset.bookingService || selectedService;
    if (selectedServiceInput) {
      selectedServiceInput.value = selectedService;
    }
  });
});

timeChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    timeChoices.forEach((item) => item.classList.remove("is-selected"));
    choice.classList.add("is-selected");
    selectedTime = choice.dataset.bookingTime || selectedTime;
    if (selectedTimeInput) {
      selectedTimeInput.value = selectedTime;
    }
  });
});

updateCoinPayment();
