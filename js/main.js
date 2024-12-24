import "https://cdn.jsdelivr.net/npm/flatpickr";
import "https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/pl.js";
import Datepicker from "./app-datepicker.js";
import { languages } from "./languages.js";

const handler = (payload) => {
  console.log("payload ", payload);
};

const datepicker = new Datepicker({ languages, flatpickr, callback: handler });
datepicker.start();

document.querySelector(".mySelect").addEventListener("change", (e) => {
  datepicker.start(e.target.value);
});
