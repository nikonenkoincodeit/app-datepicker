class Datepicker {
  constructor({ showMonthsMob = 12, showMonthsDes = 2, locale = "pl", appendTo = "#datepicker", flatpickr = null, screenWidth = 991 } = {}) {
    this.showMonths = null;
    this.showMonthsMob = showMonthsMob;
    this.showMonthsDes = showMonthsDes;
    this.screenWidth = screenWidth;
    this.flatpickrRef = null;
    this.flatpickr = flatpickr;
    this.appendTo = appendTo;
    this.locale = locale;
    this.instance = null;
    this.flagM = false;
    this.flagD = false;
    this._date = [];
  }
  get isMob() {
    return window.innerWidth < this.screenWidth;
  }
  get date() {
    return this._date;
  }
  set date(value) {
    this._date = value;
    document.querySelector(".js-btn-done").disabled = this._date.length !== 2;
  }
  createFlatpickr() {
    let _this = this;
    this.instance = this.flatpickr("#datepicker", {
      appendTo: "#datepicker",
      inline: true,
      locale: this.locale,
      minDate: "today",
      conjunction: "multiple",
      disableMobile: true,
      showMonths: this.showMonths,
      dateFormat: "Y-m-d",
      mode: "range",
      onReady: function (selectedDates, dateStr, instance) {
        _this.date = selectedDates;
        _this.updateFlatpickr();
      },
      onChange: function (selectedDates) {
        _this.date = selectedDates;
        _this.updateFlatpickr();
      },
    });
  }
  init() {
    this.createFlatpickr(this.updateFlatpickr.bind(this));
  }
  start() {
    this.showMonths = this.isMob ? this.showMonthsMob : this.showMonthsDes;
    this.init();
    window.addEventListener("resize", this.resize.bind(this));
    document.querySelector(".close").addEventListener("click", this.closeCalendar.bind(this));
    document.querySelectorAll(".app-datepicker-col").forEach((el) => {
      el.addEventListener("click", this.showMenu);
    });
    //app-datepicker-col
  }
  destroy() {
    if (!this.instance) return;
    this.instance?.destroy();
    this.instance = null;
  }
  update() {
    this.showMonths = this.isMob ? this.showMonthsMob : this.showMonthsDes;
    this.destroy();
    this.init();
  }
  resize() {
    if (this.isMob && !this.flagM) {
      this.update();
      this.flagM = true;
      this.flagD = false;
    }

    if (!this.isMob && !this.flagD) {
      this.update();
      this.flagD = true;
      this.flagM = false;
    }
  }

  updateFlatpickr() {
    if (!this.isMob) return;
    this.flatpickrRef = document.querySelector(".flatpickr-calendar");
    const dayContainer = this.flatpickrRef.querySelectorAll(".dayContainer");
    const flatpickrMonth = this.flatpickrRef.querySelectorAll(".flatpickr-month");
    const datepickerHeader = document.querySelector(".js-app-datepicker-header");

    const weekdaycontainer = this.flatpickrRef.querySelector(".flatpickr-weekdaycontainer").cloneNode(true);

    if (datepickerHeader.querySelector(".flatpickr-weekdaycontainer")) {
      datepickerHeader.querySelector(".flatpickr-weekdaycontainer").remove();
    }
    datepickerHeader.insertAdjacentElement("beforeend", weekdaycontainer);

    dayContainer.forEach((target, index) => {
      const el = flatpickrMonth[index];
      const text = el.textContent;
      const year = el.querySelector("input").value;
      target.insertAdjacentHTML("afterbegin", `<p class="date-title"><b>${text}</b> ${year}</p>`);
    });
  }
  closeCalendar(e) {
    e.stopPropagation();
    document.querySelector(".js-app-datepicker-content").classList.remove("show");
  }
  showMenu() {
    document.querySelector(".js-app-datepicker-content").classList.add("show");
  }
}

const datepicker = new Datepicker({ flatpickr });
datepicker.start();
