import { useForm } from "react-hook-form";
import { FaUserPlus } from "react-icons/fa";
import "../../assets/styles/Auth.css";

export default function Register() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log("Datos registrados:", data);
        // Aquí luego se conectará la API de registro
    };

    // Validar que las contraseñas coincidan
    const password = watch("password", "");

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="logo-container">
                        <div className="medical-icon">
                            <FaUserPlus />
                        </div>
                        <h1 className="auth-title">Crear Cuenta</h1>
                        <p className="auth-subtitle">
                            Regístrate para comenzar a gestionar tus citas
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Nombre */}
                        <div className="mb-3">
                            <label className="form-label">Nombre completo</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ej. Juan Pérez"
                                {...register("nombre", {
                                    required: "El nombre es obligatorio",
                                    minLength: {
                                        value: 3,
                                        message: "Debe tener al menos 3 caracteres",
                                    },
                                })}
                            />
                            {errors.nombre && (
                                <p className="text-danger small mt-1">
                                    {errors.nombre.message}
                                </p>
                            )}
                        </div>

                        {/* Correo */}
                        <div className="mb-3">
                            <label className="form-label">Correo electrónico</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="nombre@ejemplo.com"
                                {...register("email", {
                                    required: "El correo es obligatorio",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Formato de correo no válido",
                                    },
                                })}
                            />
                            {errors.email && (
                                <p className="text-danger small mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Crea una contraseña"
                                {...register("password", {
                                    required: "La contraseña es obligatoria",
                                    minLength: {
                                        value: 6,
                                        message: "Debe tener al menos 6 caracteres",
                                    },
                                })}
                            />
                            {errors.password && (
                                <p className="text-danger small mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirmar contraseña */}
                        <div className="mb-3">
                            <label className="form-label">Confirmar contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Confirma tu contraseña"
                                {...register("confirmPassword", {
                                    required: "Debes confirmar la contraseña",
                                    validate: (value) =>
                                        value === password || "Las contraseñas no coinciden",
                                })}
                            />
                            {errors.confirmPassword && (
                                <p className="text-danger small mt-1">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary btn-login">
                            Registrarse
                        </button>

                        <div className="links-container column-links">
                            <p className="register-text">
                                ¿Ya tienes cuenta?{" "}
                                <a href="/login" className="register-link">
                                    Inicia sesión
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
