const banks = [
  { name: "ABBANK", bin: "970425" },
  { name: "ACB", bin: "970416" },
  { name: "Agribank", bin: "970405" },
  { name: "Bac A Bank", bin: "970409" },
  { name: "BAOVIET Bank", bin: "970438" },
  { name: "BIDV", bin: "970418" },
  { name: "CAKE", bin: "546034" },
  { name: "CBB", bin: "970444" },
  { name: "CIMB", bin: "422589" },
  { name: "CITIBANK", bin: "533948" },
  { name: "COOPBANK", bin: "970446" },
  { name: "DBS", bin: "796500" },
  { name: "DongA Bank", bin: "970406" },
  { name: "Eximbank", bin: "970431" },
  { name: "GPBank", bin: "970408" },
  { name: "HDBank", bin: "970437" },
  { name: "Hong Leong Bank", bin: "970442" },
  { name: "HSBC", bin: "458761" },
  { name: "IBK - HCM", bin: "970456" },
  { name: "IBK - HN", bin: "970455" },
  { name: "Indovina Bank", bin: "970434" },
  { name: "KBHCM", bin: "970463" },
  { name: "KBHN", bin: "970462" },
  { name: "KienlongBank", bin: "970452" },
  { name: "LienVietPostBank", bin: "970449" },
  { name: "MSB", bin: "970426" },
  { name: "MB Bank", bin: "970422" },
  { name: "Nam A Bank", bin: "970428" },
  { name: "NCB – Quốc Dân", bin: "970419" },
  { name: "OCB", bin: "970448" },
  { name: "OceanBank", bin: "970414" },
  { name: "PGBank", bin: "970430" },
  { name: "Public Bank", bin: "970439" },
  { name: "PVcomBank", bin: "970412" },
  { name: "Saigonbank", bin: "970400" },
  { name: "Sacombank", bin: "970403" },
  { name: "SCB", bin: "970429" },
  { name: "SeABank", bin: "970440" },
  { name: "SHB", bin: "970443" },
  { name: "Shinhan Bank", bin: "970424" },
  { name: "Standard Chartered", bin: "970410" },
  { name: "Techcombank", bin: "970407" },
  { name: "Timo", bin: "963388" },
  { name: "TPBank", bin: "970423" },
  { name: "Ubank", bin: "546035" },
  { name: "United Overseas Bank (UOB)", bin: "970458" },
  { name: "VBSP", bin: "999888" },
  { name: "Viet CapitalBank (VCCB)", bin: "970454" },
  { name: "VIB", bin: "970441" },
  { name: "VietABank", bin: "970427" },
  { name: "VietBank", bin: "970433" },
  { name: "Vietcombank", bin: "970436" },
  { name: "VietinBank", bin: "970415" },
  { name: "VPBank", bin: "970432" },
  { name: "VRB – Liên doanh Việt Nga", bin: "970421" },
  { name: "Woori Bank", bin: "970457" }
    ].sort((a, b) => a.name.localeCompare(b.name));

const nameInput = document.getElementById("name");
const accountInput = document.getElementById("account");
const bankBtn = document.getElementById("bankBtn");
const bankListWrapper = document.getElementById("bankListWrapper");
const bankList = document.getElementById("bankList");
const bankSearch = document.getElementById("bankSearch");
const amountInput = document.getElementById("amount");
const descInput = document.getElementById("desc");
const generateBtn = document.getElementById("generate");
const resetBtn = document.getElementById("reset");
const downloadBtn = document.getElementById("download");
const loader = document.getElementById("loader");
const qrCode = document.getElementById("qrCode");

let selectedBank = null;
let isLocked = false;
let qrImageUrl = null;

function renderBankList(filter = "") {
  bankList.innerHTML = "";
  banks
    .filter(b => b.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(bank => {
      const div = document.createElement("div");
      div.textContent = bank.name;
      div.addEventListener("click", () => {
        selectedBank = bank;
        bankBtn.textContent = bank.name;
        bankListWrapper.style.display = "none";
      });
      bankList.appendChild(div);
    });
}

renderBankList();

bankBtn.addEventListener("click", () => {
  if (isLocked) return;
  bankListWrapper.style.display =
    bankListWrapper.style.display === "block" ? "none" : "block";
});

bankSearch.addEventListener("input", () => {
  renderBankList(bankSearch.value);
});

nameInput.addEventListener("input", () => {
  nameInput.value = nameInput.value.toUpperCase();
});

amountInput.addEventListener("input", () => {
  let val = amountInput.value.replace(/\D/g, "");
  if (val) {
    val = parseInt(val).toLocaleString("vi-VN");
  }
  amountInput.value = val;
});

generateBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const account = accountInput.value.trim();
  const bank = selectedBank;
  const amount = amountInput.value.replace(/\D/g, "");
  const desc = descInput.value.trim();

  if (!isLocked) {
    if (!name || !account || !bank) {
      alert("Vui lòng nhập đầy đủ thông tin tài khoản.");
      return;
    }
    localStorage.setItem("accountInfo", JSON.stringify({ name, account, bank }));
    isLocked = true;
    nameInput.disabled = true;
    accountInput.disabled = true;
    bankBtn.style.pointerEvents = "none";
    resetBtn.style.display = "inline-block";
  }

  if (!amount) {
    alert("Vui lòng nhập số tiền.");
    return;
  }

  loader.style.display = "block";
  qrCode.innerHTML = "";

  fetch("https://api.vietqr.io/v2/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": "a6fa0bab-4791-4a8c-af43-f737bf5ed857",
      "x-api-key": "71557e83-7fcb-439c-befc-6c35994fe952"
    },
    body: JSON.stringify({
      accountNo: account,
      accountName: name,
      acqId: bank.bin,
      amount: parseInt(amount),
      addInfo: desc,
      format: "text",
      template: "compact2"
    })
  })
    .then(res => res.json())
    .then(data => {
      loader.style.display = "none";
      if (data.data && data.data.qrDataURL) {
        qrImageUrl = data.data.qrDataURL;
        qrCode.innerHTML = `<img id="qrImg" src="${qrImageUrl}" style="max-width: 100%"/>`;
        downloadBtn.style.display = "inline-block";
      } else {
        qrCode.innerText = "Không tạo được mã QR.";
      }
    });
});

downloadBtn.addEventListener("click", () => {
  if (qrImageUrl) {
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = "qr-code.png";
    link.click();
  }
});

resetBtn.addEventListener("click", () => {
  isLocked = false;
  nameInput.disabled = false;
  accountInput.disabled = false;
  bankBtn.style.pointerEvents = "auto";
  resetBtn.style.display = "none";
  downloadBtn.style.display = "none";
});
