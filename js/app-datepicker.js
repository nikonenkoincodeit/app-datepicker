flatpickr("#datepicker", {
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

function updateFlatpickr() {
  const flatpickr = document.querySelector(".flatpickr-calendar");
  const dayContainer = flatpickr.querySelectorAll(".dayContainer");
  const flatpickrMonth = flatpickr.querySelectorAll(".flatpickr-month");
  dayContainer.forEach((target, index) => {
    target.insertAdjacentElement("beforebegin", flatpickrMonth[index].cloneNode(true));
  });
}
