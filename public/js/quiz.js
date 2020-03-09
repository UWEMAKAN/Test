let m = 35;
let s = 0;
let myclock = document.getElementById("clockDisplay");
myclock.innerHTML = "35:00";

function renderTime() {
  if (s > 0) {
    s--;
  }
  let clockId = setTimeout("renderTime()", 1000);

  if (m === 0 && s === 0) {
    clearTimeout(clockId);
    myclock.innerHTML = "00:00";
  }
  if (m >= 0 && s >= 0) {
    myclock.innerHTML = ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
  }
  if (s === 0) {
    m--;
    if (m >= 0) {
      s = 60;
    }
  }  
}
renderTime();
