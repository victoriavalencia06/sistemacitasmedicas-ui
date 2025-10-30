import { useForm } from "react-hook-form";
import { FaStethoscope, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import "../../assets/styles/Auth.css"
import { Link } from "react-router-dom";

export default function Login() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const password = watch("password", "");

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

                        {/* Contraseña */}
                        <div className="mb-3 position-relative">
                            <label className="form-label">Contraseña</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
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
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-danger small mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirmar contraseña */}
                        <div className="mb-3 position-relative">
                            <label className="form-label">Confirmar contraseña</label>
                            <div className="password-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder="Confirma tu contraseña"
                                    {...register("confirmPassword", {
                                        required: "Debes confirmar la contraseña",
                                        validate: (value) =>
                                            value === password ||
                                            "Las contraseñas no coinciden",
                                    })}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                >
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>
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
                                <Link to="/register" className="register-link">
                                    Regístrate aquí
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
