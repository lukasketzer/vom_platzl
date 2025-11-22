/**
 * Checks the DOM for elements highly specific to Google Shopping results.
 * This can confirm transactional intent even if the URL doesn't contain tbm=shop.
 * NOTE: Selectors must be found by inspecting the actual Google SERP HTML.
 * * @returns {boolean} True if the page contains visible shopping-specific elements.
 */
export function isLikelyShoppingPage() {
    // 1. Check for the "Sponsored" label above the product ads block.
    const sponsoredLabel = findElementContainingText("gesponserte produkte") || findElementContainingText("sponsored products");

    if (sponsoredLabel) {
        return true;
    }
    return false;
}

/**
 * Utility function to find the first element on the page containing the specified text.
 * @param {string} text The text string to search for.
 * @param {HTMLElement} root The root element to search within (defaults to document.body).
 * @returns {HTMLElement | null} The matching element or null if not found.
 */
function findElementContainingText(text, root = document.body) {
    // 1. Create a TreeWalker to traverse the DOM efficiently
    const walker = document.createTreeWalker(
        root, 
        NodeFilter.SHOW_TEXT,
        null, 
        false
    );

    let node;
    const lowerCaseText = text.toLowerCase();

    while (node = walker.nextNode()) {
        if (node.textContent && node.textContent.toLowerCase().includes(lowerCaseText)) {
            console.log(node)
            return node;
        }
    }

    return null;
}


