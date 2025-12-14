import { Link } from "react-router-dom";

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer style={{ marginTop: 'auto' }}>
            {/* Back to Top */}
            <div
                onClick={scrollToTop}
                style={{
                    backgroundColor: '#37475a',
                    color: 'white',
                    textAlign: 'center',
                    padding: '15px 0',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: '500'
                }}
            >
                Back to top
            </div>

            {/* Main Footer Links */}
            <div style={{ backgroundColor: '#232f3e', color: 'white', padding: '20px 0' }}>
                {/* Links removed as per user request */}

                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#ddd' }}>
                        &copy; 1996-{new Date().getFullYear()}, Raj-Sweets. All rights reserved with Kunal Raj
                    </div>
                </div>
            </div>
        </footer>
    );
}
