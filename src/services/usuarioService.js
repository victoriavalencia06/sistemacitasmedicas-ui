import api from '../api/axios';
import Swal from 'sweetalert2';

// Extrae mensajes de validación de la API
function extractValidationMessages(apiData) {
    const msgs = [];
    const errors = apiData?.errors;

    if (!errors) {
        if (apiData?.message) msgs.push(apiData.message);
        return msgs;
    }

    for (const key of Object.keys(errors)) {
        const arr = errors[key];
        if (Array.isArray(arr)) arr.forEach(m => msgs.push(`${key}: ${m}`));
        else msgs.push(`${key}: ${String(arr)}`);
    }
    return msgs;
}

const usuarioService = {
    // Obtener todos los usuarios
    getAll: async () => {
        try {
            const response = await api.get('/usuario/getAll');
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener usuarios');
        }
    },

    // Obtener un usuario por ID
    getById: async (id) => {
        try {
            const response = await api.get(`/usuario/get/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Error al obtener el usuario');
        }
    },

    // Crear nuevo usuario - datos: { IdRol: number, Nombre: string, Correo: string, Password: string, Estado: number }
create: async (usuarioData) => {
    console.log('🎯 Service CREATE llamado con:', usuarioData);
    try {
        const dataToSend = {
            IdRol: usuarioData.IdRol,
            Nombre: usuarioData.Nombre,
            Correo: usuarioData.Correo,
            Estado: usuarioData.Estado ?? 1,
            PasswordHash: usuarioData.Password
        };

        console.log('📤 Enviando a API:', JSON.stringify(dataToSend, null, 2));
        
        const response = await api.post('/usuario/create', dataToSend, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        console.log('✅ Respuesta de API:', response.data);
        console.log('✅ Status:', response.status);

        await Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Usuario creado correctamente',
            timer: 1400,
            showConfirmButton: false
        });

        return response.data;
    } catch (error) {
        console.error('❌ Error completo:', error);
        console.error('❌ Response data:', error.response?.data);
        console.error('❌ Response status:', error.response?.status);
        console.error('❌ Response headers:', error.response?.headers);
        
        const apiData = error.response?.data;
        console.error('❌ API Data completo:', apiData);
        
        const msgs = extractValidationMessages(apiData);
        console.error('❌ Mensajes extraídos:', msgs);
        
        const display = msgs.length
            ? msgs.join('\n')
            : (apiData?.message || 'Error al crear el usuario');

        console.error('❌ Mensaje final para mostrar:', display);

        await Swal.fire({
            icon: 'error',
            title: 'Error al crear usuario',
            text: display
        });

        throw apiData || new Error(display);
    }
},

    // Actualizar usuario - datos: { IdRol: number, Nombre: string, Correo: string, Estado: number }
update: async (id, usuarioData) => {
    console.log('🎯 Service UPDATE llamado con ID:', id, 'Data:', usuarioData);
    try {
        const payload = {
            IdUsuario: Number(id),
            IdRol: usuarioData.IdRol,
            Nombre: usuarioData.Nombre,
            Correo: usuarioData.Correo,
            Estado: usuarioData.Estado,
            PasswordHash: usuarioData.Password || 'temp_password_123' // ← VALOR POR DEFECTO
        };

        console.log('📤 Payload COMPLETO para UPDATE:', JSON.stringify(payload, null, 2));

        const response = await api.put(`/usuario/update/${id}`, payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        console.log('✅ Respuesta de UPDATE:', response.data);

        await Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'Usuario actualizado correctamente',
            timer: 1200,
            showConfirmButton: false
        });

        return response.data;
    } catch (error) {
        console.error('❌ Error completo en UPDATE:', error);
        console.error('❌ Response data:', error.response?.data);
        console.error('❌ Response status:', error.response?.status);
        
        if (error.response?.data) {
            console.error('❌ Error details:', JSON.stringify(error.response.data, null, 2));
        }
        
        const apiData = error.response?.data;
        const msgs = extractValidationMessages(apiData);
        const display = msgs.length ? msgs.join('\n') : (apiData?.message || 'Error al actualizar el usuario');

        await Swal.fire({
            icon: 'error',
            title: 'Error al actualizar usuario',
            text: display
        });

        throw apiData || new Error(display);
    }
},
    // Eliminar usuario
    delete: async (id) => {
        try {
            const response = await api.delete(`/usuario/delete/${id}`);

            await Swal.fire({
                icon: 'success',
                title: 'Desactivado',
                text: 'El usuario fue desactivado',
                timer: 1200,
                showConfirmButton: false
            });

            return response.data;
        } catch (error) {
            const apiData = error.response?.data;

            await Swal.fire({
                icon: 'error',
                title: 'Error al desactivar usuario',
                text: apiData?.message || 'No se pudo desactivar el usuario'
            });

            throw apiData || new Error('Error al desactivar usuario');
        }
    }
};

export default usuarioService;