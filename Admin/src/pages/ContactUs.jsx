import { useState } from "react";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Contact Form Data:", form);

    alert("Message sent successfully!");
    setForm({ name: "", email: "", phone: "", title: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Contact Us</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
              placeholder="example@gmail.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-semibold mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
              placeholder="+91 12345 67890"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
              placeholder="Enter the subject"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block font-semibold mb-1">Message</label>
            <textarea
              name="message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
              placeholder="Write your message..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
