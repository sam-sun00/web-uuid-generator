document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const uuidOutput = document.getElementById('uuid-output');
    const copyMessage = document.getElementById('copy-message');
    const copyIcon = document.getElementById('copy-icon');
    const checkIcon = document.getElementById('check-icon');

    let copyTimeout = null;
    let buttonRevertTimeout = null;

    /**
     * Generates a v4 UUID using the browser's crypto API.
     */
    function generateUUIDv4() {
        // crypto.randomUUID() is the modern, secure standard
        return crypto.randomUUID();
    }

    /**
     * Clears the "Copied!" feedback message.
     */
    function clearCopyMessage() {
        if (copyTimeout) {
            clearTimeout(copyTimeout);
            copyTimeout = null;
        }
        copyMessage.textContent = '';
    }

    /**
     * Resets the copy button to its original state.
     */
    function resetButtonState() {
        if (buttonRevertTimeout) {
            clearTimeout(buttonRevertTimeout);
            buttonRevertTimeout = null;
        }
        copyBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
        copyBtn.classList.add('bg-blue-500', 'hover:bg-blue-600');
        copyIcon.classList.remove('hidden');
        checkIcon.classList.add('hidden');
    }

    /**
     * Handles the Generate button click.
     */
    function handleGenerate() {
        const newUUID = generateUUIDv4();
        uuidOutput.value = newUUID;
        clearCopyMessage();
        resetButtonState(); // Reset copy button state in case it was green
    }

    /**
     * Handles the Copy button click.
     */
    function handleCopy() {
        const uuidToCopy = uuidOutput.value;

        if (!uuidToCopy) {
            copyMessage.textContent = 'Nothing to copy!';
            copyMessage.classList.remove('text-green-600', 'dark:text-green-500');
            copyMessage.classList.add('text-red-600', 'dark:text-red-500'); // Add dark mode for error
            return;
        }

        uuidOutput.select();
        uuidOutput.setSelectionRange(0, 99999);

        try {
            document.execCommand('copy');

            copyMessage.textContent = 'Copied to clipboard!';
            copyMessage.classList.remove('text-red-600', 'dark:text-red-500');
            copyMessage.classList.add('text-green-600', 'dark:text-green-500');

            // Change button to green with checkmark
            copyBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
            copyBtn.classList.add('bg-green-500', 'hover:bg-green-600');
            copyIcon.classList.add('hidden');
            checkIcon.classList.remove('hidden');

            // Clear copy message and reset button state after 2 seconds
            if (copyTimeout) clearTimeout(copyTimeout);
            copyTimeout = setTimeout(clearCopyMessage, 2000);

            if (buttonRevertTimeout) clearTimeout(buttonRevertTimeout);
            buttonRevertTimeout = setTimeout(resetButtonState, 2000);

        } catch (err) {
            console.error('Failed to copy text: ', err);
            copyMessage.textContent = 'Copy failed!';
            copyMessage.classList.remove('text-green-600', 'dark:text-green-500');
            copyMessage.classList.add('text-red-600', 'dark:text-red-500'); // Add dark mode for error
            resetButtonState(); // Ensure button reverts if copy fails
        }

        window.getSelection().removeAllRanges();
    }

    // --- Event Listeners ---
    generateBtn.addEventListener('click', handleGenerate);
    copyBtn.addEventListener('click', handleCopy);

    // Generate one UUID on initial page load
    handleGenerate();
});
