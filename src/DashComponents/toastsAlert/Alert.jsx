// components/AlertComponent.js
import Swal from 'sweetalert2';

// Success and Failure Toasts
export const showSuccessToast = (message) => {
  Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: message,
    timer: 5000,
    toast: true,
    position: 'top-end',
    showConfirmButton: false
  });
};

export const showFailureToast = (message) => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
    timer: 5000,
    toast: true,
    position: 'top-end',
    showConfirmButton: false
  });
};

// Delete Confirmation Popup
export const deleteConfirmation = async (handleDelete) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    timer: 5000,
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Close',
    reverseButtons: true
  });

  if (result.isConfirmed) {
    handleDelete(); // Execute the delete handler
    Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
  }
};
