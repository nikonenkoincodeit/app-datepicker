export default class Datepicker {
  constructor({ showMonthsMob = 12, showMonthsDes = 2, locale = "pl", flatpickr = null, screenWidth = 991, mainSelector = ".my-datepicker", languages = null, callback = null } = {}) {
    this.closeClasses = ["js-btn-done", "app-datepicker-wrapper", "js-close", "js-app-datepicker-send"];
    this.mainSelector = document.querySelector(mainSelector);
    this.showMonthsMob = showMonthsMob;
    this.showMonthsDes = showMonthsDes;
    this.appendTo = "#datepicker";
    this.screenWidth = screenWidth;
    this._languages = languages;
    this.flatpickr = flatpickr;
    this.callback = callback;
    this.locale = locale;

    this.showMonths = 2;
    this._airport = "";
    this.code = "";
    this._date = [];
    this.flags = { isMobile: false, isDesktop: false };

    this.instance = null;
  }

  // Getters and setters
  get languages() {
    return this._languages[this.locale];
  }

  get airport() {
    return this._airport;
  }

  set airport(value) {
    this._airport = value;
    this.updateContent(".js-airport", value);
  }

  get isMobile() {
    return window.innerWidth < this.screenWidth;
  }

  get date() {
    return this._date;
  }

  set date(value) {
    this._date = value;
    this.updateButtonState(".js-btn-done", this._date.length !== 2);
    this.addDate();
  }

  // Utilities
  updateContent(selector, content) {
    this.mainSelector.querySelector(selector).textContent = content;
  }

  updateButtonState(selector, isDisabled) {
    this.mainSelector.querySelector(selector).disabled = isDisabled;
  }

  formatDates(dates, language) {
    if (!Array.isArray(dates) || !["pl", "en"].includes(language)) {
      throw new Error("Invalid input: provide an array of dates and a valid language code (pl or en).");
    }

    const formatter = new Intl.DateTimeFormat(language === "pl" ? "pl-PL" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return dates.map((date) => {
      if (!(date instanceof Date)) {
        throw new Error("All elements in the array must be Date objects.");
      }
      let [day, month, year] = formatter.format(date).split(" ");
      return `${day} ${month[0].toUpperCase() + month.slice(1).replace(".", "")} / ${year}`;
    });
  }

  // Adding HTML Markup
  addMarkup() {
    const { labelAirport, placeholderAirport, labelFirstDate, labelSecondDate, placeholderDate, doneBtn, sendBtn, listOfAirports } = this.languages;

    const airportListMarkup = listOfAirports.map(({ code, title }) => `<li class="app-datepicker-item" data-value="[${code}] ${title}" data-code="${code}"><b>[${code}]</b> ${title}</li>`).join("");

    this.mainSelector.innerHTML = `
      <div class="app-datepicker">
        <div class="app-datepicker-col">
          <p class="app-datepicker-label">${labelAirport}</p>
          <p class="app-datepicker-text js-airport">${this.getAirport(placeholderAirport)}</p>
          <div class="app-datepicker-wrapper js-app-datepicker-menu">
            <div class="app-datepicker-menu app-datepicker-menu-list">
              <div class="app-datepicker-header">
                <button type="button" class="close js-close">&#10006;</button>
              </div>
              <ul class="app-datepicker-list">${airportListMarkup}</ul>
            </div>
          </div>
        </div>
        <!-- Dates and Footer -->
        <div class="app-datepicker-col">
          ${this.getDateMarkup(labelFirstDate, placeholderDate, "js-first-date")}
          ${this.getDateMarkup(labelSecondDate, placeholderDate, "js-second-date")}
          <div class="app-datepicker-wrapper js-app-datepicker-menu">
            <div class="app-datepicker-menu app-datepicker-content">
              <div class="app-datepicker-header js-app-datepicker-header">
                <button type="button" class="close js-close">&#10006;</button>
              </div>
              <div class="app-datepicker-body">
                <p id="datepicker"></p>
              </div>
              <div class="app-datepicker-footer">
                <button class="app-datepicker-btn js-btn-done" type="button" disabled>${doneBtn}</button>
              </div>
            </div>
          </div>
        </div>
        <div class="app-datepicker-col js-app-datepicker-send">
          <button type="button" class="app-datepicker-btn js-send-btn">
            <img src="https://cdn-icons-png.flaticon.com/128/3031/3031293.png" alt="Search" width="20" height="20" />
            ${sendBtn}
          </button>
        </div>
      </div>`;
  }

  getDateMarkup(label, placeholder, className) {
    return `
      <div class="app-datepicker-value">
        <p class="app-datepicker-label">${label}</p>
        <div class="app-datepicker-date">
          <img src="https://cdn-icons-png.flaticon.com/128/2370/2370264.png" alt="calendar" width="25" height="25" />
          <p class="app-datepicker-text ${className}">${placeholder}</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32" class="down-arrow">
            <path d="M28.226 8l1.774 1.576-14 14.424-14-14.424 1.774-1.576 12.226 12.596z"></path>
          </svg>
        </div>
      </div>`;
  }

  // Flatpickr
  createFlatpickr() {
    const obj = {
      appendTo: this.appendTo,
      inline: true,
      clickOpens: false,
      locale: this.locale,
      minDate: "today",
      conjunction: "multiple",
      disableMobile: true,
      showMonths: this.showMonths,

      dateFormat: "Y-m-d",
      mode: "range",
      onReady: () => {
        this.updateFlatpickr();
      },
      onChange: (selectedDates) => {
        this.date = selectedDates;
        this.updateFlatpickr();
      },
    };

    if (this.date.length) obj.defaultDate = this.date;
    this.instance = this.flatpickr(this.appendTo, obj);
  }

  getAirport(airport) {
    if (!this.code) return airport;

    const { code, title } = this.languages.listOfAirports.find((item) => item.code === this.code);

    return `[${code}] ${title}`;
  }

  // Initialization
  start(locale = null) {
    if (locale) this.locale = locale;

    this.addMarkup();
    this.showMonths = this.isMobile ? this.showMonthsMob : this.showMonthsDes;
    this.createFlatpickr();
    this.addEventListeners();
    this.addDate();
  }

  addEventListeners() {
    window.addEventListener("resize", this.resize.bind(this));
    this.mainSelector.addEventListener("click", this.handleClick.bind(this));
  }

  // Event Handling
  handleClick(e) {
    e.stopPropagation();
    if (this.closeClasses.some((cls) => e.target.classList.contains(cls))) return this.closeMenus();
    if (e.target.closest(".js-send-btn")) return this.send();
    if (e.target.classList.contains("app-datepicker-item")) return this.selectAirport(e.target);
    if (e.target.closest(".app-datepicker-col")) this.toggleMenu(e.target.closest(".app-datepicker-col"));
  }

  addDate() {
    const placeholder = this.languages?.placeholderDate;
    const [from, to] = this.formatDates(this.date, this.locale);

    this.updateContent(".js-first-date", from ? from : placeholder);
    this.updateContent(".js-second-date", to ? to : placeholder);
  }

  toggleMenu(parent) {
    this.closeMenus();
    parent.querySelector(".js-app-datepicker-menu")?.classList.add("show");
    window.addEventListener("click", this.closeMenus.bind(this));
  }

  closeMenus() {
    this.mainSelector.querySelectorAll(".js-app-datepicker-menu").forEach((menu) => menu.classList.remove("show"));
  }

  selectAirport(target) {
    this.airport = target.dataset.value;
    this.code = target.dataset.code;
    this.closeMenus();
  }

  send() {
    const [from, to] = this.formatDates(this.date, this.locale);
    this.callback({ fromDate: from || "", toDate: to || "", code: this.code });
  }

  // Handling window resizing
  resize() {
    const isMobile = this.isMobile;
    if (isMobile && !this.flags.isMobile) {
      this.showMonths = this.showMonthsMob;
      this.flags.isMobile = true;
      this.flags.isDesktop = false;
      this.update();
    } else if (!isMobile && !this.flags.isDesktop) {
      this.showMonths = this.showMonthsDes;
      this.flags.isMobile = false;
      this.flags.isDesktop = true;
      this.update();
    }
  }

  update() {
    this.destroy();
    this.createFlatpickr();
  }

  destroy() {
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }
  }
  updateFlatpickr() {
    if (!this.isMobile) return;

    const dayContainer = this.mainSelector.querySelectorAll(".dayContainer");
    const flatpickrMonth = this.mainSelector.querySelectorAll(".flatpickr-month");
    const datepickerHeader = this.mainSelector.querySelector(".js-app-datepicker-header");

    const weekdaycontainer = this.mainSelector.querySelector(".flatpickr-weekdaycontainer").cloneNode(true);

    const weekdayRef = datepickerHeader.querySelector(".flatpickr-weekdaycontainer");

    if (weekdayRef) {
      weekdayRef.remove();
    }
    datepickerHeader.insertAdjacentElement("beforeend", weekdaycontainer);

    dayContainer.forEach((target, index) => {
      const el = flatpickrMonth[index];
      const text = el.textContent;
      const year = el.querySelector("input").value;
      target.insertAdjacentHTML("afterbegin", `<p class="date-title"><b>${text}</b> ${year}</p>`);
    });
  }
}
