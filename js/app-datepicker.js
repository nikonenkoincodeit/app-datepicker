const fla = flatpickr("#datepicker", {
  appendTo: "#datepicker",
  inline: true,
  locale: "pl",
  minDate: "today",
  conjunction: "multiple",
  disableMobile: true,
  showMonths: 2,
  dateFormat: "Y-m-d",
  mode: "range",
  onReady: function (selectedDates, dateStr, instance) {
    updateFlatpickr();
  },
  onChange: function (selectedDates) {
    console.log("selectedDates ", selectedDates);
    updateFlatpickr();
  },
});

console.log("fla ", fla);

window.addEventListener("load", () => {
  const screenWidth = window.innerWidth;
  if (screenWidth > 991) {
  } else {
  }
});

window.addEventListener("resize", () => {
  const screenWidth = window.innerWidth;
  if (screenWidth > 991) {
    fla.destroy();
  }
});

function updateFlatpickr() {
  const screenWidth = window.innerWidth;
  if (screenWidth > 991) return;
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
