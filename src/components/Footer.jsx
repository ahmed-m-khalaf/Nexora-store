import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook, FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

                    {/* Brand Section */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4">🛍️ Nexora Store</h3>
                        <p className="text-gray-400 mb-4 leading-relaxed">
                            Your one-stop destination for premium products. We bring quality and style right to your doorstep.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:text-primary-400 transition">Home</Link></li>
                            <li><Link to="/products" className="hover:text-primary-400 transition">Shop Products</Link></li>
                            <li><Link to="/cart" className="hover:text-primary-400 transition">My Cart</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                                <FaEnvelope className="text-primary-500" />
                                <a href="mailto:support@nexorastore.com" className="hover:text-white transition">support@nexorastore.com</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaPhone className="text-primary-500" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaMapMarkerAlt className="text-primary-500" />
                                <span>New York, USA</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
                        <div className="flex gap-4">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-300">
                                <FaGithub size={20} />
                            </a>
                            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300">
                                <FaLinkedin size={20} />
                            </a>
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300">
                                <FaInstagram size={20} />
                            </a>
                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all duration-300">
                                <FaFacebook size={20} />
                            </a>
                        </div>
                        <a
                            href="mailto:support@nexorastore.com"
                            className="inline-block mt-6 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Nexora Store. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
