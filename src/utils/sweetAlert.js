// FileName: src/utils/sweetAlert.js
import swal from 'sweetalert';
import "../styles/SweetAlertCustom.css"

/**
 * Displays a success SweetAlert.
 * @param {string} title - The title of the alert.
 * @param {string} text - The text content of the alert.
 */
export const showSuccessAlert = (title, text) => {
  swal({
    title: title,
    text: text,
    icon: "success",
    buttons: false,
    timer: 3000, // Auto-close after 3 seconds
  });
};

/**
 * Displays an error SweetAlert.
 * @param {string} title - The title of the alert.
 * @param {string} text - The text content of the alert.
 */
export const showErrorAlert = (title, text) => {
  swal({
    title: title,
    text: text,
    icon: "error",
    buttons: true,
  });
};

/**
 * Displays a locked SweetAlert that prevents scrolling.
 * @param {object} options - Options for the SweetAlert.
 */
export const showLockedSweetAlert = (options) => {
  // Lock scroll
  document.body.style.overflow = 'hidden';

  swal(options).then(() => {
    // Unlock scroll when dismissed
    document.body.style.overflow = '';
  });
};

/**
 * Displays a warning SweetAlert with confirmation options.
 * @param {string} title - The title of the alert.
 * @param {string} text - The text content of the alert.
 * @param {string} confirmButtonText - Text for the confirm button.
 * @param {string} cancelButtonText - Text for the cancel button.
 * @returns {Promise<boolean>} - A promise that resolves to true if confirmed, false otherwise.
 */
export const showConfirmAlert = (title, text, confirmButtonText, cancelButtonText) => {
  return swal({
    title: title,
    text: text,
    icon: "warning",
    buttons: {
      cancel: {
        text: cancelButtonText,
        value: null,
        visible: true,
        className: "cancel",
        closeModal: true,
      },
      confirm: {
        text: confirmButtonText,
        value: true,
        visible: true,
        className: "confirm",
        closeModal: true
      }
    },
    dangerMode: true, // Highlights the confirm button in red
  }).then((willConfirm) => {
    return willConfirm; // Resolve the promise with the confirmation result
  });
};
