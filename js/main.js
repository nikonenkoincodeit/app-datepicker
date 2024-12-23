import "https://cdn.jsdelivr.net/npm/flatpickr";
import "https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/pl.js";
import Datepicker from "./app-datepicker.js";
import { languages } from "./languages.js";

const datepicker = new Datepicker({ languages, flatpickr });
datepicker.start();
