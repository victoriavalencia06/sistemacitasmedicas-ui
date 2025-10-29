import { useForm } from "react-hook-form";
import { FaStethoscope } from "react-icons/fa";
import "../../assets/styles/Auth.css"

export default function Login() {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log("Datos enviados:", data);
        // lógica para la API...
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="logo-container">
                        <div className="medical-icon">
                            <FaStethoscope />
                        </div>
                        <h1 className="auth-title">Iniciar Sesión</h1>
                        <p className="auth-subtitle">Accede a tu cuenta médica</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
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

                        <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Ingresa tu contraseña"
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

                        {/* Campo nuevo: confirmar contraseña */}
                        <div className="mb-3">
                            <label className="form-label">Confirmar contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Confirma tu contraseña"
                                {...register("confirmPassword", {
                                    required: "Confirma la contraseña",
                                    validate: (value) =>
                                        value === getValues("password") || "Las contraseñas no coinciden",
                                })}
                            />
                            {errors.confirmPassword && (
                                <p className="text-danger small mt-1">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary btn-login">
                            Iniciar Sesión
                        </button>

                        <div className="links-container column-links">
                            <a href="#" className="forgot-link">
                                ¿Olvidaste tu contraseña?
                            </a>

                            <p className="register-text">
                                ¿No tienes cuenta?{" "}
                                <a href="/register" className="register-link">
                                    Regístrate aquí
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
