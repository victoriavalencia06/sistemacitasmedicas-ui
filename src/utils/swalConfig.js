import Swal from 'sweetalert2';

export const showSuccess = (title, text = '') => {
    return Swal.fire({
        icon: 'success',
        title,
        text,
        timer: 1000,
        showConfirmButton: false,
        timerProgressBar: true,
    });
};

export const showError = (title, text = '') => {
    return Swal.fire({
        icon: 'error',
        title,
        text,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#3085d6',
    });
};

export const showConfirm = (title, text = '') => {
    return Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
    });
};

export const showLoading = (title = 'Cargando...') => {
    return Swal.fire({
        title,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
};

export const closeLoading = () => {
    Swal.close();
};