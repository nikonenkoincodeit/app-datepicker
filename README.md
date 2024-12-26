# README: Datepicker Implementation and Customization

## Overview

The provided code implements a custom date picker component using the `flatpickr` library. This README explains how to use the date picker, outlines its configuration options, and provides guidance for customization.

---

## Getting Started

### Installation

1. Include the `flatpickr` library in your project:

   ```html
   <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
   <script src="https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/pl.js"></script>
   ```

2. Import the `Datepicker` class from the `app-datepicker.js` file:

   ```javascript
   import Datepicker from "./app-datepicker.js";
   ```

3. Create a new instance of `Datepicker`:

   ```javascript
   const datepicker = new Datepicker({
       flatpickr,
       callback: (payload) => console.log(payload),
       mainSelector: ".my-datepicker"
   });

   datepicker.start();
   ```

### HTML Structure

The date picker requires specific HTML structure. Ensure your container has a class matching the `mainSelector` parameter. For example:

```html
<div class="my-datepicker">
    ...
</div>
```

---

## Configuration Options

The `Datepicker` class accepts the following parameters:

| Parameter       | Type       | Default          | Description                                      |
| --------------- | ---------- | ---------------- | ------------------------------------------------ |
| `showMonthsMob` | `number`   | `12`             | Number of months displayed on mobile.            |
| `showMonthsDes` | `number`   | `2`              | Number of months displayed on desktop.           |
| `locale`        | `string`   | `"en"`           | Language locale (e.g., `"pl"` for Polish).       |
| `flatpickr`     | `object`   | `null`           | Reference to the `flatpickr` library.            |
| `screenWidth`   | `number`   | `991`            | Screen width breakpoint for mobile/desktop view. |
| `mainSelector`  | `string`   | `.my-datepicker` | CSS selector for the main date picker container. |
| `callback`      | `function` | `null`           | Callback function triggered on date selection.   |

---

## Usage

### Initializing Multiple Date Pickers

You can create multiple instances of the date picker with different configurations:

```javascript
const datepicker1 = new Datepicker({
    flatpickr,
    callback: (payload) => console.log("Instance 1: ", payload),
    mainSelector: ".datepicker-instance-1"
});

const datepicker2 = new Datepicker({
    flatpickr,
    callback: (payload) => console.log("Instance 2: ", payload),
    mainSelector: ".datepicker-instance-2",
    locale: "pl"
});

datepicker1.start();
datepicker2.start();
```

### Handling Callback

The `callback` parameter receives an object containing the selected date range and airport code:

```javascript
const callback = ({ fromDate, toDate, code }) => {
    console.log("From:", fromDate, "To:", toDate, "Airport Code:", code);
};
```

---

## Customization

### Custom HTML Classes

You can customize the HTML structure by adjusting class selectors in your implementation. Ensure any custom class names are updated in the `Datepicker` class methods such as `updateContent`, `updateButtonState`, and `addEventListeners`.

### Language Localization

Date formatting and localization can be customized via the `locale` parameter. Ensure you import the appropriate locale file from `flatpickr`:

```javascript
import "flatpickr/dist/l10n/pl.js"; // For Polish locale
```

### Event Handling

The `handleClick` method processes click events within the date picker. You can extend this method to add custom behaviors.

### Adjusting Mobile/Desktop Views

The number of months displayed can be adjusted via the `showMonthsMob` and `showMonthsDes` parameters. The `resize` method dynamically updates the display based on screen width.

---

## Error Handling

The following errors may occur during use:

1. **Invalid Date Format**: Ensure that all dates passed to `formatDates` are `Date` objects.
2. **Missing Locale Files**: Ensure the required locale JSON file is hosted at the specified URL.

---

## Example Project

Here is a complete example of using the `Datepicker` class:

### HTML

```html
<div class="my-datepicker">
    <div class="datepicker"></div>
    <button class="js-btn-done">Done</button>
    <div class="js-first-date"></div>
    <div class="js-second-date"></div>
</div>
```

### JavaScript

```javascript
import "https://cdn.jsdelivr.net/npm/flatpickr";
import Datepicker from "./app-datepicker.js";

const datepicker = new Datepicker({
    flatpickr,
    callback: ({ fromDate, toDate }) => console.log(`Selected: ${fromDate} - ${toDate}`),
    mainSelector: ".my-datepicker"
});

datepicker.start();
```

---

## License

This project is licensed under the MIT License. For more details, see the LICENSE file.

переведи на русский 

