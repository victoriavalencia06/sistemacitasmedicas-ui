import { useForm } from "react-hook-form";
import { FaStethoscope, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { useState, useContext } from "react";
import "../../assets/styles/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para el spinner
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true); // Activar spinner

    try {
      const body = {
        correo: data.email,
        password: data.password,
      };
      await login(body);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false); // Desactivar spinner siempre
    }
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
            <div className="mb-3 position-relative">
              <label className="form-label">Contraseña</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Tu contraseña"
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 4,
                      message: "Debe tener al menos 4 caracteres",
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
                <p className="text-danger small mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-login"
              disabled={loading} // Deshabilitar botón durante carga
            >
              {loading ? (
                <>
                  <FaSpinner className="spinning me-2" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
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