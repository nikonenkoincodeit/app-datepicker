import "https://cdn.jsdelivr.net/npm/flatpickr";
import "https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/pl.js";
import Datepicker from "./app-datepicker.js";

const handler = (payload) => {
  console.log("payload ", payload);
};

const handler2 = (payload) => {
  console.log("payload2 ", payload);
};

const today = new Date();

const dates = [today];

const threeDaysLater = new Date();
threeDaysLater.setDate(today.getDate() + 3);
dates.push(threeDaysLater);

const datepicker = new Datepicker({ flatpickr, callback: handler, mainSelector: ".my-datepicker", dates: [...dates] });

const datepicker2 = new Datepicker({ flatpickr, callback: handler2, mainSelector: ".my-datepicker-2", locale: "pl" });

datepicker.start();
datepicker2.start();
