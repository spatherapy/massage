const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const bookingForm = document.querySelector("[data-booking-form]");
const formStatus = document.querySelector("[data-form-status]");
const coinOptions = document.querySelectorAll("[data-coin]");
const paymentMethodButtons = document.querySelectorAll("[data-payment-method]");
const paymentSections = document.querySelectorAll("[data-payment-section]");
const cryptoSelection = document.querySelector("[data-crypto-selection]");
const walletAddress = document.querySelector("[data-wallet-address]");
const copyWalletButton = document.querySelector("[data-copy-wallet]");
const qrImage = document.querySelector("[data-qr-image]");
const qrCaption = document.querySelector("[data-qr-caption]");
const networkWarning = document.querySelector("[data-network-warning]");
const giftCardForm = document.querySelector("[data-gift-card-form]");
const giftCardStatus = document.querySelector("[data-gift-card-status]");
const giftCardDepositInput = document.querySelector("[data-gift-card-deposit]");
const giftCardSessionInput = document.querySelector("[data-gift-card-session]");
const giftCardTimeInput = document.querySelector("[data-gift-card-time]");
const giftCardAmountInput = document.querySelector("[data-gift-card-amount]");
const serviceCards = document.querySelectorAll("[data-service-card]");
const serviceChoices = document.querySelectorAll("[data-booking-service]");
const durationSelects = document.querySelectorAll("[data-duration-select]");
const daySelect = document.querySelector("[data-day-select]");
const timeSelect = document.querySelector("[data-time-select]");
const selectedServiceInput = document.querySelector("[data-selected-service]");
const selectedTimeInput = document.querySelector("[data-selected-time]");
const selectedDepositInput = document.querySelector("[data-selected-deposit]");
const bookingConfirmation = document.querySelector("[data-booking-confirmation]");
const confirmationDetail = document.querySelector("[data-confirmation-detail]");
const depositNotice = document.querySelector("[data-deposit-notice]");
const depositLink = document.querySelector("[data-deposit-link]");
const depositAmountLabels = document.querySelectorAll("[data-deposit-amount]");
let selectedCoin = "BTC";
let selectedService = "Deep Tissue - 90 mins - $300";
let selectedTime = "Monday at 12:00 AM";
let selectedDeposit = 150;

const durationPrices = {
  60: 200,
  90: 300,
  120: 400,
};

const durationDeposits = {
  60: 100,
  90: 150,
  120: 200,
};

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

const formatDuration = (duration) =>
  `${duration} mins - $${durationPrices[duration] || durationPrices[60]}`;

const formatDeposit = (deposit) => `$${deposit}`;

const getActiveServiceCard = () =>
  document.querySelector("[data-service-card].is-selected") || serviceCards[0];

const updateSelectedService = () => {
  const activeCard = getActiveServiceCard();
  const activeChoice = activeCard?.querySelector("[data-booking-service]");
  const activeDuration = activeCard?.querySelector("[data-duration-select]");
  const serviceName = activeChoice?.dataset.bookingService || "Deep Tissue";
  const duration = activeDuration?.value || "90";
  selectedDeposit = durationDeposits[duration] || durationDeposits[90];
  selectedService = `${serviceName} - ${formatDuration(duration)}`;
  if (selectedServiceInput) {
    selectedServiceInput.value = selectedService;
  }
  if (selectedDepositInput) {
    selectedDepositInput.value = formatDeposit(selectedDeposit);
  }
  if (depositNotice) {
    depositNotice.textContent = `Reservation is pending until the ${formatDeposit(selectedDeposit)} deposit is received.`;
  }
  if (depositLink) {
    const params = new URLSearchParams({
      deposit: String(selectedDeposit),
      session: selectedService,
      time: selectedTime,
    });
    depositLink.href = `deposit.html?${params.toString()}`;
  }
};

const updateSelectedTime = () => {
  const day = daySelect?.value || "Monday";
  const time = timeSelect?.value || "12:00 AM";
  selectedTime = `${day} at ${time}`;
  if (selectedTimeInput) {
    selectedTimeInput.value = selectedTime;
  }
  updateSelectedService();
};

const updateDepositPageAmount = () => {
  const params = new URLSearchParams(window.location.search);
  const deposit = Number(params.get("deposit")) || 100;
  const safeDeposit = [100, 150, 200].includes(deposit) ? deposit : 100;
  depositAmountLabels.forEach((label) => {
    label.textContent = formatDeposit(safeDeposit);
  });
  if (giftCardDepositInput) {
    giftCardDepositInput.value = formatDeposit(safeDeposit);
  }
  if (giftCardAmountInput) {
    giftCardAmountInput.min = String(safeDeposit);
    giftCardAmountInput.placeholder = String(safeDeposit);
  }
  if (giftCardSessionInput) {
    giftCardSessionInput.value = params.get("session") || "";
  }
  if (giftCardTimeInput) {
    giftCardTimeInput.value = params.get("time") || "";
  }
};

const formatTime = (hour, minute) => {
  const period = hour < 12 ? "AM" : "PM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
};

const populateTimeSelect = () => {
  if (!timeSelect || timeSelect.options.length > 0) {
    return;
  }
  for (let hour = 0; hour < 24; hour += 1) {
    [0, 30].forEach((minute) => {
      const option = document.createElement("option");
      option.value = formatTime(hour, minute);
      option.textContent = option.value;
      timeSelect.append(option);
    });
  }
};

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
  updateSelectedService();
  updateSelectedTime();
  if (formStatus) {
    formStatus.textContent = "Appointment request created. Continue to deposit to reserve your time.";
  }
  if (confirmationDetail) {
    confirmationDetail.textContent = `${selectedService} - ${selectedTime} - Deposit ${formatDeposit(selectedDeposit)}`;
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

paymentMethodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const method = button.dataset.paymentMethod || "crypto";
    paymentMethodButtons.forEach((item) => item.classList.remove("is-selected"));
    paymentSections.forEach((section) => {
      section.classList.toggle("is-visible", section.dataset.paymentSection === method);
    });
    button.classList.add("is-selected");
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

giftCardForm?.addEventListener("submit", (event) => {
  const endpoint = giftCardForm.dataset.giftCardEndpoint?.trim() || "";
  if (!endpoint) {
    event.preventDefault();
    if (giftCardStatus) {
      giftCardStatus.textContent =
        "Gift card dashboard is being connected. For now, please send the card details to Gianna on WhatsApp after booking.";
    }
    return;
  }
  giftCardForm.action = endpoint;
  if (giftCardStatus) {
    giftCardStatus.textContent = "Submitting gift card deposit...";
  }
});

document.addEventListener("basinjsFormSuccess", (event) => {
  if (event.detail?.form !== giftCardForm) {
    return;
  }
  if (giftCardStatus) {
    giftCardStatus.textContent = "Gift card deposit submitted. Gianna will confirm your appointment.";
  }
});

document.addEventListener("basinjsFormError", (event) => {
  if (event.detail?.form !== giftCardForm) {
    return;
  }
  if (giftCardStatus) {
    giftCardStatus.textContent =
      "Gift card submission could not be completed. Please try again or contact Gianna on WhatsApp.";
  }
});

serviceChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    serviceCards.forEach((card) => {
      card.classList.remove("is-selected");
      card.querySelector("[data-booking-service]")?.classList.remove("is-selected");
      card.querySelector(".duration-panel")?.classList.remove("is-visible");
    });
    const card = choice.closest("[data-service-card]");
    card?.classList.add("is-selected");
    choice.classList.add("is-selected");
    card?.querySelector(".duration-panel")?.classList.add("is-visible");
    updateSelectedService();
  });
});

durationSelects.forEach((select) => {
  select.addEventListener("change", () => {
    const card = select.closest("[data-service-card]");
    const summary = card?.querySelector("[data-choice-summary]");
    if (summary) {
      summary.textContent = formatDuration(select.value);
    }
    if (card?.classList.contains("is-selected")) {
      updateSelectedService();
    }
  });
});

daySelect?.addEventListener("change", updateSelectedTime);
timeSelect?.addEventListener("change", updateSelectedTime);

populateTimeSelect();
updateSelectedService();
updateSelectedTime();
updateDepositPageAmount();
updateCoinPayment();
