// ------------------1. takes a hexadecimal color code as input and returns an object with the red, green, and blue ------------------
function hexToRgb(hex) {
  // Remove the '#' character if present
  hex = hex.replace("#", "");
  console.log(hex);

  // Handle shorthand hex code (e.g., "FFF")
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
    console.log(hex);
  }

  // Parse the red, green, and blue components
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Return the result as an object
  return { r, g, b };
}

// Example usage
console.log(hexToRgb("#FF9933")); // { r: 255, g: 153, b: 51 }
console.log(hexToRgb("#ff9933")); // { r: 255, g: 153, b: 51 }
console.log(hexToRgb("#FFF")); // { r: 255, g: 255, b: 255 }
console.log(hexToRgb("#000")); // { r: 0, g: 0, b: 0 }

//------------------2.  takes an array of strings and returns a sorted array based on the specified criteria------------------------
function customSort(arr) {
  return arr.sort((a, b) => {
    // Regular expression to match non-digit characters (\D+) and digit characters (\d+)
    const regex = /(\D+)(\d+)/;

    // Extract letters and numbers from string 'a'
    const [, aLetters, aNumbers] = a.match(regex) || [];

    // Extract letters and numbers from string 'b'
    const [, bLetters, bNumbers] = b.match(regex) || [];

    // Compare letters first
    if (aLetters !== bLetters) {
      return aLetters.localeCompare(bLetters);
    } else {
      // If letters are the same, compare numbers
      return parseInt(aNumbers) - parseInt(bNumbers);
    }
  });
}

// Example usage
console.log(customSort(["TH19", "SG20", "TH2"])); // ["SG20", "TH2", "TH19"]
console.log(customSort(["TH10", "TH3Netflix", "TH1", "TH7"])); // ["TH1", "TH3Netflix", "TH7", "TH10"]

//------------------------------------ 3.class ReverseEncoder with the encode and decode methods ------------------------------------
class ReverseEncoder {
  constructor() {
    // Create a map for encoding
    this.charMap = this.createCharMap();
  }

  // Helper function to create the character map
  createCharMap() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const reversedAlphabet = alphabet.split("").reverse().join("");
    let charMap = {};

    for (let i = 0; i < alphabet.length; i++) {
      charMap[alphabet[i]] = reversedAlphabet[i];
      charMap[alphabet[i].toUpperCase()] = reversedAlphabet[i].toUpperCase();
    }

    return charMap;
  }

  // Method to encode the input string
  encode(str) {
    let reversedChars = str
      .split("")
      .map((char) => {
        return this.charMap[char] || char;
      })
      .reverse()
      .join("");

    return reversedChars;
  }

  // Method to decode the encoded string
  decode(str) {
    // Decoding is the same as encoding since it's a symmetric operation
    return this.encode(str);
  }
}

// Example usage
let reverseEncoder = new ReverseEncoder();
console.log(reverseEncoder.encode("Hello world")); // "dliow svool"
console.log(reverseEncoder.decode("dliow svool")); // "Hello world"

//------------------------------------ 4.autocomplete ------------------------------------

function autocomplete(search, items, maxResult) {
  // Convert search string to lowercase for case-insensitive comparison
  const lowerSearch = search.toLowerCase();

  // Filter items that contain the search string
  const matchedItems = items.filter((item) =>
    item.toLowerCase().includes(lowerSearch)
  );

  // Sort matched items based on the position of the search string
  matchedItems.sort((a, b) => {
    const indexA = a.toLowerCase().indexOf(lowerSearch);
    const indexB = b.toLowerCase().indexOf(lowerSearch);

    // If search string is at the same position, sort lexicographically
    if (indexA === indexB) {
      return a.localeCompare(b);
    }
    // Otherwise, prioritize items where the search string appears earlier
    return indexA - indexB;
  });

  // Limit the result to maxResult items
  return matchedItems.slice(0, maxResult);
}

// Example usage
console.log(
  autocomplete("th", ["Mother", "Think", "Worthy", "Apple", "Android"], 2)
);
// Expected output: ["Think", "Mother"]


//------------------------------------ 5. ------------------------------------

SELECT products.product_name, SUM(order_details.quantity) AS total_quantity_sold
FROM order_details
JOIN orders ON order_details.order_id = orders.order_id
JOIN products ON order_details.product_id = products.product_id
WHERE YEAR(orders.order_date) = 2016
GROUP BY products.product_name
ORDER BY total_quantity_sold DESC
LIMIT 5;



//------------------------------------ 6. ------------------------------------

// Subquery to get top 5 products in 2016
WITH top_2016 AS (
    SELECT products.product_id, products.product_name
    FROM order_details
    JOIN orders ON order_details.order_id = orders.order_id
    JOIN products ON order_details.product_id = products.product_id
    WHERE YEAR(orders.order_date) = 2016
    GROUP BY products.product_id, products.product_name
    ORDER BY SUM(order_details.quantity) DESC
    LIMIT 5
),
// Subquery to get top 5 products in 2017
top_2017 AS (
    SELECT products.product_id, products.product_name
    FROM order_details
    JOIN orders ON order_details.order_id = orders.order_id
    JOIN products ON order_details.product_id = products.product_id
    WHERE YEAR(orders.order_date) = 2017
    GROUP BY products.product_id, products.product_name
    ORDER BY SUM(order_details.quantity) DESC
    LIMIT 5
)
// Final query to find common products in top 5 for both years
SELECT top_2016.product_name
FROM top_2016
INNER JOIN top_2017 ON top_2016.product_id = top_2017.product_id;

//------------------------------------ 7. ------------------------------------

SELECT YEAR(orders.order_date) AS year, 
       SUM(order_details.quantity * products.unit_price * (1 - order_details.discount)) AS total_sales
FROM orders
JOIN order_details ON orders.order_id = order_details.order_id
JOIN products ON order_details.product_id = products.product_id
WHERE orders.ship_region = 'Western Europe'
GROUP BY YEAR(orders.order_date)
ORDER BY year;
