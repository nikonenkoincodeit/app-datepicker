class Datepicker {
  constructor({ showMonthsMob = 12, showMonthsDes = 2, locale = "pl", appendTo = "#datepicker", flatpickr = null, screenWidth = 991 } = {}) {
    this.showMonths = 2;
    this.showMonthsMob = showMonthsMob;
    this.showMonthsDes = showMonthsDes;
    this.screenWidth = screenWidth;
    this.flatpickr = flatpickr;
    this.appendTo = appendTo;
    this.locale = locale;
    this.instance = null;
    this.flagM = false;
    this.flagD = false;
  }
  get isMob() {
    return window.innerWidth < this.screenWidth;
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
        console.log(this);
        _this.updateFlatpickr();
      },
      onChange: function (selectedDates) {
        console.log("selectedDates ", selectedDates);
        // callback();
        _this.updateFlatpickr();
      },
    });
  }
  init() {
    this.createFlatpickr(this.updateFlatpickr.bind(this));
  }
  start() {
    this.init();
    window.addEventListener("resize", this.resize.bind(this));
  }
  destroy() {
    if (!this.instance) return;
    this.instance?.destroy();
    this.instance = null;
    // window.removeEventListener("resize", this.resize.bind(this));
  }
  resize() {
    // if (this.isMob) {
    //   this.showMonths = this.showMonthsMob;
    // } else this.showMonths = this.showMonthsDes;
    console.log(this);
    if (this.isMob && !this.flagM) {
      this.showMonths = this.isMob ? this.showMonthsMob : this.showMonthsDes;
      this.destroy();
      this.init();
      this.flagM = true;
      this.flagD = false;
    }

    if (!this.isMob && !this.flagD) {
      this.showMonths = this.isMob ? this.showMonthsMob : this.showMonthsDes;
      this.destroy();
      this.init();
      this.flagD = true;
      this.flagM = false;
    }
  }

  updateFlatpickr() {
    if (!this.isMob) return;
    const flatpickr = document.querySelector(".flatpickr-calendar");
    const dayContainer = flatpickr.querySelectorAll(".dayContainer");
    const flatpickrMonth = flatpickr.querySelectorAll(".flatpickr-month");
    const datepickerHeader = document.querySelector(".js-app-datepicker-header");

    const weekdaycontainer = flatpickr.querySelector(".flatpickr-weekdaycontainer").cloneNode(true);

    if (datepickerHeader.querySelector(".flatpickr-weekdaycontainer")) {
      datepickerHeader.querySelector(".flatpickr-weekdaycontainer").remove();
    }
    datepickerHeader.insertAdjacentElement("beforeend", weekdaycontainer);

    dayContainer.forEach((target, index) => {
      target.insertAdjacentElement("beforebegin", flatpickrMonth[index].cloneNode(true));
    });
  }
}

const datepicker = new Datepicker({ flatpickr });
datepicker.start();
