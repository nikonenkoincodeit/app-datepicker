import "https://cdn.jsdelivr.net/npm/flatpickr";
import "https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/pl.js";
import Datepicker from "./app-datepicker.js";

const handler = (payload) => {
  console.log("payload ", payload);
};

const datepicker = new Datepicker({ flatpickr, callback: handler });
datepicker.start("en");
