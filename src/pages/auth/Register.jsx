import { useForm } from "react-hook-form";
import { FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import "../../assets/styles/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload = {
        idRol: 3, // Paciente
        nombre: data.nombre,
        correo: data.correo,
        password: data.password,
        passwordHash: data.password, // requerido por backend
      };

      const res = await api.post("/auth/register", payload);

      // si el backend responde con estructura conocida
      if (res.data?.ok === false) {
        throw new Error(res.data.msg || "Error en el registro");
      }

      setSuccessMsg("Cuenta creada correctamente. Redirigiendo...");
      reset();
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Error al registrar:", err);
      const backendMsg =
        err.response?.data?.msg ||
        err.response?.data?.errors?.PasswordHash?.[0] ||
        err.response?.data?.errors?.Correo?.[0] ||
        "No se pudo registrar el usuario";
      setErrorMsg(backendMsg);
    } finally {
      setLoading(false);
    }
  };

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
                {...register("correo", {
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Formato de correo no válido",
                  },
                })}
              />
              {errors.correo && (
                <p className="text-danger small mt-1">
                  {errors.correo.message}
                </p>
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
                <p className="text-danger small mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div className="mb-3 position-relative">
              <label className="form-label">Confirmar contraseña</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Repite tu contraseña"
                  {...register("confirmPassword", {
                    required: "Debes confirmar la contraseña",
                    validate: (value) =>
                      value === password || "Las contraseñas no coinciden",
                  })}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-danger small mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {errorMsg && <p className="text-danger small">{errorMsg}</p>}
            {successMsg && <p className="text-success small">{successMsg}</p>}

            <button
              type="submit"
              className="btn btn-primary btn-login"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>

            <div className="links-container column-links">
              <p className="register-text">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="register-link">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
