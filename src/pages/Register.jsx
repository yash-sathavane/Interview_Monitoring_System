import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving user");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-center">
          <FaUserPlus className="text-5xl text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-blue-100">Join the interview monitoring system</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                className="input-field pl-10"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                className="input-field pl-10"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                className="input-field pl-10"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
            <div className="relative">
              <FaUserTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field pl-10 appearance-none"
              >
                <option value="candidate">Candidate</option>
                <option value="interviewer">Interviewer</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
          >
            <span>Register Now</span>
          </button>
        </form>

        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
