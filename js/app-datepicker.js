export default class Datepicker {
  constructor({ showMonthsMob = 12, showMonthsDes = 2, locale = "pl", appendTo = "#datepicker", flatpickr = null, screenWidth = 991, mainSelector = ".my-datepicker", languages = null } = {}) {
    this.mainSelector = document.querySelector(mainSelector);
    this.showMonths = null;
    this.showMonthsMob = showMonthsMob;
    this.showMonthsDes = showMonthsDes;
    this.screenWidth = screenWidth;
    this.languages = languages;
    this.flatpickr = flatpickr;
    this.appendTo = appendTo;
    this.flatpickrRef = null;
    this.locale = locale;
    this.instance = null;
    this.flagM = false;
    this.flagD = false;
    this._airport = "";
    this._date = [];
  }
  get airport() {
    return this._airport;
  }
  set airport(value) {
    this._airport = value;
    this.mainSelector.querySelector(".js-airport").textContent = value;
  }
  get isMob() {
    return window.innerWidth < this.screenWidth;
  }
  get date() {
    return this._date;
  }
  set date(value) {
    this._date = value;
    this.mainSelector.querySelector(".js-btn-done").disabled = this._date.length !== 2;
    this.addDate();
  }
  formatDates(dates, language) {
    if (!Array.isArray(dates) || !["pl", "en"].includes(language)) {
      throw new Error("Invalid input: provide an array of dates and a valid language code (pl or en).");
    }

    const localeMap = {
      en: "en-US",
      pl: "pl-PL",
    };

    const formatter = new Intl.DateTimeFormat(localeMap[language], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return dates.map((date) => {
      if (!(date instanceof Date)) {
        throw new Error("All elements in the array must be Date objects.");
      }

      const formattedDate = formatter.format(date);
      let [day, month, year] = formattedDate.split(" ");
      month = month[0].toUpperCase() + month.slice(1);
      return `${day} ${month.replace(".", "")} / ${year}`;
    });
  }
  addMarkup() {
    const data = this.languages[this.locale];
    this.mainSelector.innerHTML = ` <div class="app-datepicker">
        <div class="app-datepicker-col">
          <p class="app-datepicker-label">${data.labelAirport}</p>
          <p class="app-datepicker-text js-airport">${data.placeholderAirport}</p>
          <div class="app-datepicker-wrapper js-app-datepicker-menu">
            <div class="app-datepicker-menu app-datepicker-menu-list">
              <div class="app-datepicker-header">
                <button type="button" class="close js-close">&#10006;</button>
              </div>
              <ul class="app-datepicker-list">
              ${data?.listOfAirports
                .map((item) => {
                  return `<li class="app-datepicker-item" data-value="[${item.code}] ${item.title}"><b>[${item.code}]</b> ${item.title}</li>`;
                })
                .join("")}
              </ul>
            </div>
          </div>
        </div>
        <div class="app-datepicker-col">
          <div class="app-datepicker-value">
            <p class="app-datepicker-label">${data.labelFirstDate}</p>
            <div class="app-datepicker-date">
              <img src="https://cdn-icons-png.flaticon.com/128/2370/2370264.png" alt="calendar" width="25" height="25" />
              <p class="app-datepicker-text js-first-date">${data.placeholderDate}</p>
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32" class="down-arrow">
                <path d="M28.226 8l1.774 1.576-14 14.424-14-14.424 1.774-1.576 12.226 12.596z"></path>
              </svg>
            </div>
          </div>
          <div class="app-datepicker-value">
            <p class="app-datepicker-label">${data.labelSecondDate}</p>
            <div class="app-datepicker-date">
              <img src="https://cdn-icons-png.flaticon.com/128/2370/2370264.png" alt="calendar" width="25" height="25" />
              <p class="app-datepicker-text js-second-date">${data.placeholderDate}</p>
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32" class="down-arrow">
                <path d="M28.226 8l1.774 1.576-14 14.424-14-14.424 1.774-1.576 12.226 12.596z"></path>
              </svg>
            </div>
          </div>
          <div class="app-datepicker-wrapper js-app-datepicker-menu">
            <div class="app-datepicker-menu app-datepicker-content">
              <div class="app-datepicker-header js-app-datepicker-header">
                <button type="button" class="close js-close">&#10006;</button>
              </div>
              <div class="app-datepicker-body">
                <p id="datepicker"></p>
              </div>
              <div class="app-datepicker-footer">
                <button class="app-datepicker-btn js-btn-done" type="button" disabled>${data.doneBtn}</button>
              </div>
            </div>
          </div>
        </div>
        <div class="app-datepicker-col">
          <button type="button" class="app-datepicker-btn">
            <img src="https://cdn-icons-png.flaticon.com/128/3031/3031293.png" alt="Search" width="20" height="20" />
            ${data.sendBtn}
          </button>
        </div>
      </div>`;
  }
  createFlatpickr() {
    let _this = this;
    this.instance = this.flatpickr("#datepicker", {
      appendTo: "#datepicker",
      inline: true,
      clickOpens: false,
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
    this.createFlatpickr();
  }
  start() {
    this.addMarkup();
    this.showMonths = this.isMob ? this.showMonthsMob : this.showMonthsDes;
    this.init();
    window.addEventListener("resize", this.resize.bind(this));

    this.mainSelector.addEventListener("click", this.onClick.bind(this));
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
  onClick(e) {
    e.stopPropagation();
    const _this = this;
    function closeMenus(e) {
      if (e.target.closest(".js-app-datepicker-menu")) return;
      close();
    }

    function close() {
      _this.closeMenu(e);
      window.removeEventListener("click", closeMenus);
    }

    if (e.target.classList.contains("js-btn-done") || e.target.classList.contains("app-datepicker-wrapper")) {
      return close();
    }

    if (e.target.classList.contains("app-datepicker-item")) {
      this.airport = e.target.dataset.value;
      return close();
    }

    if (e.target.classList.contains("js-close")) {
      return close();
    }

    if (e.target.closest(".app-datepicker-col")) {
      this.closeMenu(e);
      this.showMenu(e);
      window.addEventListener("click", closeMenus);
      return;
    }
  }
  addDate() {
    const placeholder = this.languages[this.locale]?.placeholderDate;
    const [firstDate, SecondDate] = this.formatDates(this.date, this.locale);
    this.mainSelector.querySelector(".js-first-date").textContent = firstDate ? firstDate : placeholder;
    this.mainSelector.querySelector(".js-second-date").textContent = SecondDate ? SecondDate : placeholder;
  }
  showMenu(e) {
    const parentRef = e.target.closest(".app-datepicker-col");
    parentRef.querySelector(".js-app-datepicker-menu").classList.add("show");
  }
  closeMenu() {
    const btnRef = this.mainSelector.querySelectorAll(".js-close");
    if (!btnRef.length) return;
    btnRef.forEach((el) => el?.closest(".js-app-datepicker-menu").classList.remove("show"));
  }
}
