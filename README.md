# README: Implementacja i konfiguracja Datepicker

## Przegląd
Załączony kod implementuje niestandardowy komponent wyboru daty przy użyciu biblioteki `flatpickr`. W tym pliku README opisano, jak korzystać z komponentu wyboru dat, jego parametry konfiguracyjne oraz sposoby dostosowania.

---

## Rozpoczęcie pracy

### Instalacja
1. Podłącz bibliotekę `flatpickr` do swojego projektu:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
   <script src="https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/pl.js"></script>
   ```

2. Zaimportuj klasę `Datepicker` z pliku `app-datepicker.js`:
   ```javascript
   import Datepicker from "./app-datepicker.js";
   ```

3. Utwórz nową instancję `Datepicker`:
   ```javascript
   const datepicker = new Datepicker({
       flatpickr, 
       callback: (payload) => console.log(payload),
       mainSelector: ".my-datepicker"
   });
   
   datepicker.start();
   ```

### Struktura HTML
Aby komponent wyboru dat działał poprawnie, wymagana jest określona struktura HTML. Upewnij się, że kontener posiada klasę zgodną z parametrem `mainSelector`. Na przykład:
```html
<div class="my-datepicker">
    ...
</div>
```

---

## Parametry konfiguracyjne
Klasa `Datepicker` przyjmuje następujące parametry:

| Parametr          | Typ       | Domyślnie    | Opis                                                                  |
|--------------------|-----------|--------------|----------------------------------------------------------------------|
| `showMonthsMob`    | `number`  | `12`         | Liczba miesięcy wyświetlanych na urządzeniach mobilnych.             |
| `showMonthsDes`    | `number`  | `2`          | Liczba miesięcy wyświetlanych na urządzeniach stacjonarnych.         |
| `locale`           | `string`  | `"en"`       | Lokalizacja (np. `"pl"` dla języka polskiego).                       |
| `flatpickr`        | `object`  | `null`       | Odwołanie do biblioteki `flatpickr`.                                 |
| `screenWidth`      | `number`  | `991`        | Szerokość ekranu do przełączania widoków między urządzeniami.        |
| `mainSelector`     | `string`  | `.my-datepicker` | Selektor CSS głównego kontenera wyboru daty.                          |
| `callback`         | `function`| `null`       | Funkcja wywoływana po wyborze daty.                                  |

---

## Użycie

### Inicjalizacja wielu komponentów wyboru daty
Możesz utworzyć kilka instancji wyboru dat z różnymi konfiguracjami:
```javascript
const datepicker1 = new Datepicker({
    flatpickr, 
    callback: (payload) => console.log("Instancja 1: ", payload),
    mainSelector: ".datepicker-instance-1"
});

const datepicker2 = new Datepicker({
    flatpickr, 
    callback: (payload) => console.log("Instancja 2: ", payload),
    mainSelector: ".datepicker-instance-2",
    locale: "pl"
});

datepicker1.start();
datepicker2.start();
```

### Obsługa funkcji zwrotnej (callback)
Parametr `callback` otrzymuje obiekt zawierający wybrany zakres dat oraz kod lotniska:
```javascript
const callback = ({ fromDate, toDate, code }) => {
    console.log("Od:", fromDate, "Do:", toDate, "Kod lotniska:", code);
};
```

---

## Dostosowanie

### Niestandardowe klasy HTML
Możesz zmienić strukturę HTML, dostosowując klasy w swojej implementacji. Upewnij się, że wszelkie zmiany klas są uwzględnione w metodach klasy `Datepicker`, takich jak `updateContent`, `updateButtonState` i `addEventListeners`.

### Lokalizacja
Formatowanie daty i lokalizacja mogą być dostosowane za pomocą parametru `locale`. Upewnij się, że zaimportowałeś odpowiedni plik lokalizacyjny z `flatpickr`:
```javascript
import "flatpickr/dist/l10n/pl.js"; // Dla języka polskiego
```

> **Uwaga**: W funkcji `fetch` w metodzie `receiveATransfer` należy podać własny link do pliku JSON z tłumaczeniami. Przykład:
> ```javascript
> const jsonData = await fetch(`https://your-domain.com/locales/${this.locale}.json`);
> ```

### Obsługa zdarzeń
Metoda `handleClick` obsługuje kliknięcia wewnątrz komponentu wyboru daty. Możesz rozszerzyć tę metodę, aby dodać własne zachowanie.

### Dostosowanie widoku mobilnego i stacjonarnego
Liczba wyświetlanych miesięcy może być dostosowana za pomocą parametrów `showMonthsMob` i `showMonthsDes`. Metoda `resize` dynamicznie aktualizuje wyświetlanie w zależności od szerokości ekranu.

---

## Obsługa błędów
Podczas korzystania z komponentu mogą wystąpić następujące błędy:
1. **Nieprawidłowy format daty**: Upewnij się, że wszystkie daty przekazywane do `formatDates` są obiektami `Date`.
2. **Brak plików lokalizacyjnych**: Upewnij się, że odpowiednie pliki JSON z lokalizacjami są dostępne pod podanym adresem URL.

---

## Przykład projektu
Poniżej znajduje się pełny przykład użycia klasy `Datepicker`:

### HTML
```html
<div class="my-datepicker">
    ...
</div>
```

### JavaScript
```javascript
import "https://cdn.jsdelivr.net/npm/flatpickr";
import Datepicker from "./app-datepicker.js";

const datepicker = new Datepicker({
    flatpickr,
    callback: ({ fromDate, toDate }) => console.log(`Wybrano: ${fromDate} - ${toDate}`),
    mainSelector: ".my-datepicker"
});

datepicker.start();
```

---

## Licencja
Ten projekt jest licencjonowany na podstawie licencji MIT. Więcej informacji znajduje się w pliku LICENSE.

