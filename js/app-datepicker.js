export default class Datepicker {
  constructor({ showMonthsMob = 12, showMonthsDes = 2, locale = "en", flatpickr = null, screenWidth = 991, mainSelector = ".my-datepicker", callback = null, dates = [] } = {}) {
    this.closeClasses = ["js-btn-done", "app-datepicker-wrapper", "js-close", "js-app-datepicker-send", "js-btn-send"];
    this.mainSelector = document.querySelector(mainSelector);
    this.showMonthsMob = showMonthsMob;
    this.showMonthsDes = showMonthsDes;
    this.appendTo = mainSelector + " .datepicker";
    this.screenWidth = screenWidth;
    this._languages = null;
    this.flatpickr = flatpickr;
    this.callback = callback;
    this.locale = locale;

    this.showMonths = 2;
    this._airport = "";
    this.code = "";
    this._dates = null;
    this.flags = { isMobile: false, isDesktop: false };
    if (dates?.length) this.dates = dates;
    this.instance = null;
  }

  // Getters and setters
  get languages() {
    return this._languages;
  }

  set languages(value) {
    this._languages = value;
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

  get dates() {
    return this._dates;
  }

  set dates(value) {
    this._dates = value;
    this.updateButtonState(".js-btn-done", this._dates.length !== 2);
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

  async receiveATransfer() {
    try {
      const jsonData = await fetch(`https://nikonenkoincodeit.github.io/app-datepicker/locales/${this.locale}.json`);
      const response = await jsonData.json();
      return response;
    } catch ({ message }) {
      console.log(message);
    }
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
        const selectedDatesLength = selectedDates.length;
        const datesLength = this.dates?.length;

        const update = () => {
          const { currentYear, currentMonth } = this.instance;
          this.instance.setDate([...this.dates], false);
          this.instance.jumpToDate(new Date(currentYear, currentMonth, 1));
        };

        if (selectedDatesLength === 1) {
          if (datesLength === 2) {
            if (selectedDates[0] > this.dates[0]) {
              this.dates = [this.dates[0], selectedDates[0]];
              update();
            } else {
              this.dates = [selectedDates[0]];
            }
          } else {
            this.dates = [selectedDates[0]];
          }
        } else if (selectedDatesLength === 2) {
          const [firstDate, secondDate] = selectedDates;
          if (firstDate < this.dates[0]) {
            this.dates = [firstDate];
          } else {
            this.dates = [firstDate, secondDate];
          }
          update();
        }
        if (this.dates?.length === 2 && !this.isMobile) {
          this.closeMenus();
        }
        this.updateFlatpickr();
      },
    };

    if (this.dates?.length) {
      obj.defaultDate = [...this.dates];
    }
    this.instance = this.flatpickr(this.appendTo, obj);
  }

  getAirport(airport) {
    if (!this.code) return airport;

    const { code, title } = this.languages.listOfAirports.find((item) => item.code === this.code);

    return `[${code}] ${title}`;
  }

  // Initialization
  async start() {
    // alert(1);
    this.languages = await this.receiveATransfer();
    this.showMonths = this.isMobile ? this.showMonthsMob : this.showMonthsDes;
    this.createFlatpickr();
    this.addEventListeners();
    this.updateFlatpickr();
    if (this.dates?.length) this.addDate();
  }

  addEventListeners() {
    this.mainSelector.addEventListener("click", this.handleClick.bind(this));
  }

  setCorrectHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  // Event Handling
  handleClick(e) {
    e.stopPropagation();
    if (e.target.closest(".js-btn-send")) this.send();
    const result = this.closeClasses.some((cls) => e.target.classList.contains(cls));
    if (result) return this.closeMenus();

    if (e.target.classList.contains("app-datepicker-item")) return this.selectAirport(e.target);
    if (e.target.closest(".app-datepicker-col")) this.toggleMenu(e.target.closest(".app-datepicker-col"));
  }

  addDate() {
    const placeholder = this.languages?.placeholderDate;
    const [from, to] = this.formatDates(this.dates, this.locale);

    this.updateContent(".js-first-date", from ? from : placeholder);
    this.updateContent(".js-second-date", to ? to : placeholder);
  }

  toggleMenu(parent) {
    this.closeMenus();
    if (this.isMobile) {
      this.setCorrectHeight();
      document.body.classList.add("scroll-no");
    }
    parent.querySelector(".js-app-datepicker-menu")?.classList.add("show");
    window.addEventListener("click", this.closeMenus.bind(this));
  }

  closeMenus() {
    if (this.isMobile) document.body.classList.remove("scroll-no");
    this.mainSelector.querySelectorAll(".js-app-datepicker-menu").forEach((menu) => menu.classList.remove("show"));
  }

  selectAirport(target) {
    this.airport = target.dataset.value;
    this.code = target.dataset.code;
    this.closeMenus();
  }

  send() {
    const [from, to] = this.formatDates(this.dates, this.locale);
    this.callback({ fromDate: from || "", toDate: to || "", code: this.code });
  }

  updateFlatpickr() {
    if (!this.isMobile) return;

    const dayContainer = this.mainSelector.querySelectorAll(".dayContainer");
    const flatpickrMonth = this.mainSelector.querySelectorAll(".flatpickr-month");

    dayContainer.forEach((target, index) => {
      const el = flatpickrMonth[index];
      const text = el.textContent;
      const year = el.querySelector("input").value;
      target.insertAdjacentHTML("afterbegin", `<p class="date-title"><b>${text}</b> ${year}</p>`);
    });
  }
}
